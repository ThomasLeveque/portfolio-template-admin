export class Project {
  id?: string;
  name: string;
  desc: string;
  projectUrl: string;
  projectSrc: string;
  date: string;
  skills: string[];
  categories: string[]; // Array of ids
  images: string[]; // Array of ids
  createdAt: number;
  updatedAt: number;

  constructor(json: firebase.firestore.DocumentSnapshot) {
    const jsonData = json.data();
    this.id = json.id;
    this.name = jsonData?.name;
    this.desc = jsonData?.desc;
    this.projectUrl = jsonData?.projectUrl;
    this.projectSrc = jsonData?.projectSrc;
    this.date = jsonData?.date;
    this.skills = jsonData?.skills || [];
    this.categories = jsonData?.categories || [];
    this.images = jsonData?.images || [];
    this.createdAt = jsonData?.createdAt;
    this.updatedAt = jsonData?.updatedAt;
  }
}
