export class Project {
  id: string;
  key: string;
  name: string;
  desc: string;

  constructor(json: firebase.firestore.DocumentSnapshot) {
    const jsonData = json.data();
    this.id = json.id;
    this.key = json.id;
    this.name = jsonData?.name;
    this.desc = jsonData?.desc;
  }
}
