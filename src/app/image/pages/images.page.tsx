import React from 'react';
import { useNotif } from '../../notification/notification.context';
import { Upload, Card, List, Tooltip } from 'antd';
import { RcFile } from 'antd/lib/upload';
import { RocketOutlined, LoadingOutlined, EyeTwoTone, DeleteTwoTone } from '@ant-design/icons';
import { Image } from '../image.model';
import LayoutComponent from '../../components/layout/layout.component';
import { useImage } from '../image.context';

import './images.styles.less';

const ImagesPage = () => {
  const { openMessage } = useNotif();
  const { Dragger } = Upload;
  const {
    images,
    imagesLoading,
    removeImage,
    uploadImage,
    removeImageLoading,
    addImageLoading
  } = useImage();

  return (
    <LayoutComponent pageClassName="images page">
      <Dragger
        name="file"
        multiple
        showUploadList={false}
        beforeUpload={(file: RcFile) => {
          const fileSize: number = file.size / 1024 / 1024;
          const fileType: string = file.type.replace('image/', '');
          const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
          if (!isJpgOrPng) {
            openMessage('You can only upload JPG/PNG file!', 'error');
            return false;
          }
          const isLt2M = fileSize < 2;
          if (!isLt2M) {
            openMessage('Image must smaller than 2MB!', 'error');
            return false;
          }
          uploadImage(file, fileType, fileSize);
          return false;
        }}
      >
        {addImageLoading ? <LoadingOutlined /> : <RocketOutlined />}
        <div className="upload-text">Select or drag and drop your files here</div>
      </Dragger>

      <List
        loading={imagesLoading || removeImageLoading}
        grid={{
          gutter: 16,
          xs: 1,
          sm: 2,
          md: 2,
          lg: 3,
          xl: 3,
          xxl: 3
        }}
        dataSource={images}
        renderItem={(image: Image) => (
          <List.Item>
            <Tooltip title={image.name}>
              <Card
                style={{ cursor: 'initial' }}
                hoverable
                title={image.name}
                actions={[
                  <a target="_blank" rel="noopener noreferrer" href={image.url}>
                    <EyeTwoTone />
                  </a>,
                  <DeleteTwoTone onClick={() => removeImage(image)} twoToneColor="#ff7875" />
                ]}
              >
                <p>Type: {image.fileType}</p>
                <p>Size: {image.fileSize.toFixed(3)} Mo</p>
              </Card>
            </Tooltip>
          </List.Item>
        )}
      />
    </LayoutComponent>
  );
};

export default ImagesPage;
