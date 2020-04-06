import React from 'react';
import { useNotif } from '../../notification/notification.context';
import { Upload, List, Typography } from 'antd';
import { RcFile } from 'antd/lib/upload';
import { RocketOutlined, LoadingOutlined } from '@ant-design/icons';
import { Image } from '../image.model';
import LayoutComponent from '../../components/layout/layout.component';
import { useImage } from '../image.context';

import './images.styles.less';
import CardImage from '../components/card-image.component';

const ImagesPage = () => {
  const { openMessage } = useNotif();
  const { Dragger } = Upload;
  const { images, imagesLoading, uploadImage, removeImageLoading, addImageLoading } = useImage();
  const { Title } = Typography;

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
