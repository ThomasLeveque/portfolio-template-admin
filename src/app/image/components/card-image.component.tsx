import React, { ReactElement } from 'react';
import { Tooltip, Card, Typography, List } from 'antd';
import { formatDistanceToNow } from 'date-fns';
import {
  DeleteTwoTone,
  EyeTwoTone,
  PlusSquareTwoTone,
  MinusSquareTwoTone,
} from '@ant-design/icons';
import { CardSize } from 'antd/lib/card';

import { Image } from '../image.model';
import { useImage } from '../image.context';

import './card-image.styles.less';

interface IProps {
  image: Image;
  selectedImages?: Image[];
  isClickableImage?: boolean;
  imageClicked?: (image: Image, isAddImage: boolean) => void;
  size?: CardSize;
}

const CardImage: React.FC<IProps> = ({
  image,
  isClickableImage = false,
  selectedImages = [],
  imageClicked = () => {},
  size = 'default',
}) => {
  const { removeImage } = useImage();
  const { Text } = Typography;

  const isSelectedImage: boolean = !!selectedImages.find(
    (selectedImage: Image) => selectedImage.id === image.id
  );

  let actions: ReactElement[] = [];
  if (!isClickableImage) {
    actions = [<DeleteTwoTone onClick={() => removeImage(image)} twoToneColor="#ff7875" />];
  } else {
    if (isSelectedImage) {
      actions = [
        <MinusSquareTwoTone
          onClick={() => imageClicked(image, !isSelectedImage)}
          twoToneColor="#ff7875"
        />,
      ];
    } else {
      actions = [<PlusSquareTwoTone onClick={() => imageClicked(image, !isSelectedImage)} />];
    }
  }

  return (
    <List.Item className="card-image">
      <Tooltip title={image.name}>
        <Card
          extra={
            <a target="_blank" rel="noopener noreferrer" href={image.url}>
              <EyeTwoTone />
            </a>
          }
          size={size}
          className={isClickableImage && isSelectedImage ? 'card-image-active' : ''}
          style={{ cursor: 'initial' }}
          hoverable
          title={image.name}
          actions={actions}
        >
          <div>
            <Text strong>Type: </Text>
            <Text>{image.fileType}</Text>
          </div>
          <div>
            <Text strong>Size: </Text>
            <Text>{image.fileSize.toFixed(3)} Mo</Text>
          </div>
          {!isClickableImage && (
            <div>
              <Text strong>Created about: </Text>
              <Text>{formatDistanceToNow(image.createdAt)} ago</Text>
            </div>
          )}
        </Card>
      </Tooltip>
    </List.Item>
  );
};
export default CardImage;
