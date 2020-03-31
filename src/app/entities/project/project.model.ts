import { formatDistanceToNow, format } from 'date-fns';

export class Project {
  id?: string;
  key?: string;
  name: string;
  desc: string;
  date: string;
  formatedDate?: string;
  skills: string[];
  categories: string[];
  createdAt?: number | string;
  updatedAt?: number | string;

  constructor(json: firebase.firestore.DocumentSnapshot) {
    const jsonData = json.data();
    this.id = json.id;
    this.key = json.id;
    this.name = jsonData?.name;
    this.desc = jsonData?.desc;
    this.date = jsonData?.date;
    this.formatedDate = format(new Date(jsonData?.date), 'MMMM yyyy');
    this.skills = jsonData?.skills || [];
    this.categories = jsonData?.categories || [];
    this.createdAt = formatDistanceToNow(jsonData?.createdAt);
    this.updatedAt = formatDistanceToNow(jsonData?.updatedAt);
  }
}
