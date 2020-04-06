import { createContext, useContext } from 'react';
import { Image } from './image.model';
import { RcFile } from 'antd/lib/upload/interface';

interface IImageContext {
  images: Image[];
  removeImageLoading: boolean;
  imagesLoading: boolean;
  addImageLoading: boolean;
  uploadImage: (file: RcFile) => Promise<Image | undefined>;
  removeImage: (image: Image) => Promise<void>;
}

export const ImageContext = createContext<IImageContext>({
  images: [],
  removeImageLoading: false,
  imagesLoading: false,
  addImageLoading: false,
  uploadImage: async () => undefined,
  removeImage: async () => {},
});

export const useImage = () => useContext(ImageContext);
