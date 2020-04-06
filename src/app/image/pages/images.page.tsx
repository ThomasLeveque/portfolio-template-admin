import React from 'react';
import { Upload, List, Typography } from 'antd';
import { RcFile } from 'antd/lib/upload';
import { RocketOutlined, LoadingOutlined } from '@ant-design/icons';
import { Image } from '../image.model';
import LayoutComponent from '../../components/layout/layout.component';
import { useImage } from '../image.context';

import './images.styles.less';
import CardImage from '../components/card-image.component';

const ImagesPage = () => {
  const { Dragger } = Upload;
  const { images, imagesLoading, uploadImage, removeImageLoading, addImageLoading } = useImage();
  const { Title } = Typography;

  return (
    <LayoutComponent pageClassName="images page">
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
        dataSource={images}
        renderItem={(image: Image) => <CardImage image={image} />}
      />
    </LayoutComponent>
  );
};

export default ImagesPage;
