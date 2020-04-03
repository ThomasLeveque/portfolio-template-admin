import React, { useState, useEffect } from 'react';
import { useNotif } from '../../../notification/notification.context';
import { Upload, Card, List, Tooltip } from 'antd';
import { RcFile } from 'antd/lib/upload';
import { storage, firestore } from '../../../firebase/firebase.service';
import { RocketOutlined, LoadingOutlined, EyeTwoTone, DeleteTwoTone } from '@ant-design/icons';
import { COLLECTION_NAME } from '../image.util';
import { Image } from '../image.model';
import { formatError } from '../../../utils/format-error.util';

import './images.styles.less';

const ImagesPage = () => {
  const [images, setImages] = useState<Image[]>([]);
  const [imagesLoading, setImagesLoading] = useState<boolean>(false);
  const [addImageLoading, setAddImageLoading] = useState<boolean>(false);
  const [removeImageLoading, setRemoveImageLoading] = useState<boolean>(false);
  const { openNotification, openMessage } = useNotif();
  const { Dragger } = Upload;

  const addImage = async (newImage: Image): Promise<void> => {
    try {
      const { empty, docs }: firebase.firestore.QuerySnapshot = await firestore
        .collection(COLLECTION_NAME)
        .where('name', '==', newImage.name)
        .get();
      if (!empty) {
        for (const { id } of docs) {
          await firestore
            .collection(COLLECTION_NAME)
            .doc(id)
            .delete();
        }
      }
      await firestore.collection(COLLECTION_NAME).add(newImage);
      openMessage('Image added successfully', 'success');
    } catch (err) {
      openNotification(err?.message, err?.code, 'error');
      console.error(err);
      setAddImageLoading(false);
    }
  };

  const removeImage = async ({ id, name }: Image): Promise<void> => {
    try {
      setRemoveImageLoading(true);
      await firestore
        .collection(COLLECTION_NAME)
        .doc(id)
        .delete();
      await storage
        .ref()
        .child(`images/${name}`)
        .delete();
      openMessage('Image removed successfully', 'success');
      setRemoveImageLoading(false);
    } catch (err) {
      openNotification(err?.message, err?.code, 'error');
      console.error(err);
      setRemoveImageLoading(false);
    }
  };

  const uploadFiles = async (file: RcFile, fileType: string, fileSize: number): Promise<void> => {
    try {
      const fileName = file.name.toLowerCase();

      setAddImageLoading(true);
      const imagePath: string = `images/${fileName}`;

      const imageProjectRef: firebase.storage.Reference = storage.ref().child(imagePath);

      await imageProjectRef.put(file);
      const imageUrl: string = await imageProjectRef.getDownloadURL();
      openMessage(`image ${fileName} has been uploaded`, 'success');
      const newImage: Image = {
        name: fileName,
        path: imagePath,
        url: imageUrl,
        fileType,
        fileSize,
        createdAt: Date.now()
      };
      await addImage(newImage);
      setAddImageLoading(false);
    } catch (err) {
      openNotification(err?.message, err?.code, 'error');
      console.error(err);
      setAddImageLoading(false);
    }
  };

  const handleSnapshot = (snapshot: firebase.firestore.QuerySnapshot) => {
    const firestoreCategories = snapshot.docs.map((doc: firebase.firestore.DocumentSnapshot) => {
      return new Image(doc);
    });
    setImagesLoading(false);
    setImages(firestoreCategories);
  };

  const handleError = (err: any) => {
    setImagesLoading(false);
    openNotification('Cannot load your images', formatError(err), 'error');
    console.error(err);
  };

  useEffect(() => {
    setImagesLoading(true);
    const unsubscribe = firestore
      .collection(COLLECTION_NAME)
      .orderBy('createdAt', 'desc')
      .onSnapshot(handleSnapshot, handleError);
    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="images page">
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
          uploadFiles(file, fileType, fileSize);
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
    </div>
  );
};

export default ImagesPage;
