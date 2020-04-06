export class Image {
  id?: string;
  name: string;
  url: string;
  path: string;
  fileSize: number;
  fileType: string;
  createdAt: number;

  constructor(json: firebase.firestore.DocumentSnapshot) {
    const jsonData = json.data();

    this.id = json.id;
    this.name = jsonData?.name;
    this.url = jsonData?.url;
    this.path = jsonData?.path;
    this.fileSize = jsonData?.fileSize;
    this.fileType = jsonData?.fileType;
    this.createdAt = jsonData?.createdAt;
  }
}
