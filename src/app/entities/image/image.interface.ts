import { Image } from './image.model';

export interface ImageMapping {
  [imageId: string]: Image;
}
