import { Project } from './project.model';

const ProjectSerializer = {
  fromJson: (json: firebase.firestore.DocumentSnapshot): Project => new Project(json),
  toJson: (project: Project): Project => Object.assign({}, project),
};

export default ProjectSerializer;
