import React, { useEffect, memo, useState } from 'react';

import { ImageContext } from './image.context';
import { useNotif } from '../notification/notification.context';
import { Image } from './image.model';
import { formatError } from '../utils/format-error.util';
import { firestore, storage } from '../firebase/firebase.service';
import { COLLECTION_NAME } from './image.util';
import { RcFile } from 'antd/lib/upload/interface';
import { Project } from '../entities/project/project.model';

const ImageProvider: React.FC = memo(({ children }) => {
  const [images, setImages] = useState<Image[]>([]);
  const [removeImageLoading, setRemoveImageLoading] = useState<boolean>(false);
  const [imagesLoading, setImagesLoading] = useState<boolean>(false);
  const [addImageLoading, setAddImageLoading] = useState<boolean>(false);
  const { openNotification, openMessage } = useNotif();

  const addImage = async (newImage: Image): Promise<string | undefined> => {
    try {
      const { id }: firebase.firestore.DocumentReference = await firestore
        .collection(COLLECTION_NAME)
        .add(newImage);
      openMessage('Image added successfully', 'success');
      return id;
    } catch (err) {
      openNotification(err?.message, err?.code, 'error');
      console.error(err);
      setAddImageLoading(false);
    }
  };

  const removeImage = async (image: Image): Promise<void> => {
    try {
      const { id, path } = image;
      setRemoveImageLoading(true);
      const batch = firestore.batch();

      const projectsRef: firebase.firestore.CollectionReference = firestore.collection('projects');
      const imageRef: firebase.firestore.DocumentReference = firestore
        .collection(COLLECTION_NAME)
        .doc(id);

      const snapshot: firebase.firestore.QuerySnapshot = await projectsRef
        .where(COLLECTION_NAME, 'array-contains', Object.assign({}, image))
        .get();
      // It means the category deleted is not used
      if (!snapshot.empty) {
        for (const doc of snapshot.docs) {
          const projectRef = projectsRef.doc(doc.id);
          const project = new Project(doc);
          const newImages = project.images.filter((image: Image) => image.id !== id);
          batch.update(projectRef, COLLECTION_NAME, newImages);
        }
      }

      batch.delete(imageRef);
      await storage.ref().child(path).delete();
      await batch.commit();
      openMessage('Image removed successfully', 'success');
      setRemoveImageLoading(false);
    } catch (err) {
      openNotification(err?.message, err?.code, 'error');
      console.error(err);
      setRemoveImageLoading(false);
    }
  };

  const uploadImage = async (file: RcFile): Promise<Image | undefined> => {
    try {
      const fileSize: number = file.size / 1024 / 1024;
      const fileType: string = file.type.replace('image/', '');
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        throw new Error('You can only upload JPG/PNG file!');
      }
      const isLt2M = fileSize < 2;
      if (!isLt2M) {
        throw new Error('Image must smaller than 2MB!');
      }

      const fileName = file.name.toLowerCase();

      setAddImageLoading(true);
      const { empty }: firebase.firestore.QuerySnapshot = await firestore
        .collection(COLLECTION_NAME)
        .where('name', '==', fileName)
        .get();
      if (!empty) {
        throw new Error(`Image ${file.name} already exist !`);
      }

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
        createdAt: Date.now(),
      };
      const projectId = await addImage(newImage);
      setAddImageLoading(false);
      return {
        id: projectId,
        ...newImage,
      };
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
        removeImage,
      }}
    >
      {children}
    </ImageContext.Provider>
  );
});

export default ImageProvider;
