import { formatDistanceToNow } from 'date-fns';

export class Project {
  id?: string;
  key?: string;
  name: string;
  desc: string;
  createdAt?: number | string;
  updatedAt?: number | string;

  constructor(json: firebase.firestore.DocumentSnapshot) {
    const jsonData = json.data();
    this.id = json.id;
    this.key = json.id;
    this.name = jsonData?.name;
    this.desc = jsonData?.desc;
    this.createdAt = formatDistanceToNow(jsonData?.createdAt);
    this.updatedAt = formatDistanceToNow(jsonData?.updatedAt);
  }
}
