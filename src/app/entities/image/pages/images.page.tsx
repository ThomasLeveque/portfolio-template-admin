import React from 'react';
import { Upload, List, Typography } from 'antd';
import { RocketOutlined, LoadingOutlined } from '@ant-design/icons';
import { RcFile } from 'antd/lib/upload';

import { Image } from '../image.model';
import { useImage } from '../image.context';
import CardImage from '../components/card-image.component';

import './images.styles.less';

const ImagesPage = () => {
  const { Dragger } = Upload;
  const { images, imagesLoading, uploadImage, removeImageLoading, addImageLoading } = useImage();
  const { Title } = Typography;

  return (
    <div className="images page">
      <Dragger
        name="images"
        multiple
        showUploadList={false}
        beforeUpload={(file: RcFile) => {
          uploadImage(file);
          return false;
        }}
      >
        {addImageLoading ? <LoadingOutlined /> : <RocketOutlined />}
        <div className="upload-text">Select or drag and drop your files here</div>
      </Dragger>
      <Title level={1}>My Images</Title>
      <List
        loading={imagesLoading || removeImageLoading}
        grid={{
          gutter: 16,
          xs: 1,
          sm: 2,
          md: 3,
          lg: 4,
          xl: 4,
          xxl: 4,
        }}
        dataSource={Object.keys(images).map((imageId: string) => images[imageId])}
        renderItem={(image: Image) => <CardImage image={image} />}
      />
    </div>
  );
};

export default ImagesPage;
