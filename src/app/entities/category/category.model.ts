import { formatDistanceToNow } from 'date-fns';

export class Category {
  id?: string;
  key?: string;
  name: string;
  createdAt?: number | string;
  updatedAt?: number | string;

  constructor(json: firebase.firestore.DocumentSnapshot) {
    const jsonData = json.data();
    this.id = json.id;
    this.key = json.id;
    this.name = jsonData?.name;
    this.createdAt = formatDistanceToNow(jsonData?.createdAt);
    this.updatedAt = formatDistanceToNow(jsonData?.updatedAt);
  }
}
