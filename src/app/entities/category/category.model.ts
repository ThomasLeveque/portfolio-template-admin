export class Category {
  id?: string;
  key?: string;
  name: string;
  createdAt: number;
  updatedAt: number;

  constructor(json: firebase.firestore.DocumentSnapshot) {
    const jsonData = json.data();
    this.id = json.id;
    this.key = json.id;
    this.name = jsonData?.name;
    this.createdAt = jsonData?.createdAt;
    this.updatedAt = jsonData?.updatedAt;
  }
}
