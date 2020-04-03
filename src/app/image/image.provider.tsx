import React, { useEffect, memo, useState } from 'react';

import { ImageContext } from './image.context';
import { useNotif } from '../notification/notification.context';
import { Image } from './image.model';
import { formatError } from '../utils/format-error.util';
import { firestore, storage } from '../firebase/firebase.service';
import { COLLECTION_NAME } from './image.util';
import { RcFile } from 'antd/lib/upload/interface';

const ImageProvider: React.FC = memo(({ children }) => {
  const [images, setImages] = useState<Image[]>([]);
  const [removeImageLoading, setRemoveImageLoading] = useState<boolean>(false);
  const [imagesLoading, setImagesLoading] = useState<boolean>(false);
  const [addImageLoading, setAddImageLoading] = useState<boolean>(false);
  const { openNotification, openMessage } = useNotif();

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

  const uploadImage = async (file: RcFile, fileType: string, fileSize: number): Promise<void> => {
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
    <ImageContext.Provider
      value={{
        images,
        imagesLoading,
        addImageLoading,
        removeImageLoading,
        uploadImage,
        removeImage
      }}
    >
      {children}
    </ImageContext.Provider>
  );
});

export default ImageProvider;
