export class Project {
  id?: string;
  key?: string;
  name: string;
  desc: string;
  projectUrl: string;
  projectSrc: string;
  date: string;
  formatedDate?: string;
  skills: string[];
  categories: string[];
  images: any[];
  createdAt: number;
  updatedAt: number;

  constructor(json: firebase.firestore.DocumentSnapshot) {
    const jsonData = json.data();
    this.id = json.id;
    this.key = json.id;
    this.name = jsonData?.name;
    this.desc = jsonData?.desc;
    this.projectUrl = jsonData?.projectUrl || '';
    this.projectSrc = jsonData?.projectSrc || '';
    this.date = jsonData?.date;
    this.formatedDate = jsonData?.date;
    this.skills = jsonData?.skills || [];
    this.categories = jsonData?.categories || [];
    this.images = jsonData?.images || [];
    this.createdAt = jsonData?.createdAt;
    this.updatedAt = jsonData?.updatedAt;
  }
}
