import { createContext, useContext } from 'react';
import { Image } from './image.model';
import { RcFile } from 'antd/lib/upload/interface';

interface IImageContext {
  images: Image[];
  removeImageLoading: boolean;
  imagesLoading: boolean;
  addImageLoading: boolean;
  uploadImage: (file: RcFile, fileType: string, fileSize: number) => Promise<void>;
  removeImage: (image: Image) => Promise<void>;
}

export const ImageContext = createContext<IImageContext>({
  images: [],
  removeImageLoading: false,
  imagesLoading: false,
  addImageLoading: false,
  uploadImage: async () => {},
  removeImage: async () => {}
});

export const useImage = () => useContext(ImageContext);
