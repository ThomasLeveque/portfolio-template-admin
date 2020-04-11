import { Category } from './category.model';

const CategorySerializer = {
  fromJson: (json: firebase.firestore.DocumentSnapshot): Category => new Category(json),
  toJson: (category: Category): Category => Object.assign({}, category),
};

export default CategorySerializer;
