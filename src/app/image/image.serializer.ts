import { Image } from './image.model';

const ImageSerializer = {
  fromJson: (json: firebase.firestore.DocumentSnapshot): Image => new Image(json),
  toJson: (image: Image): Image => Object.assign({}, image),
};

export default ImageSerializer;
