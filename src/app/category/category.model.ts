export class Category {
  id: string;
  name: string;

  constructor(json: firebase.firestore.DocumentSnapshot) {
    const jsonData = json.data();
    this.id = json.id;
    this.name = jsonData?.name;
  }
}
