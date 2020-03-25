import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
admin.initializeApp();

const firestore = admin.firestore();

export const getCategories = functions.https.onRequest(
  async (request, response) => {
    try {
      const snapshot: FirebaseFirestore.QuerySnapshot = await firestore
        .collection("categories")
        .get();
      const categories = snapshot.docs.map(
        (doc: FirebaseFirestore.QueryDocumentSnapshot) => {
          return {
            id: doc.id,
            ...doc.data()
          };
        }
      );
      response.send(categories);
    } catch (err) {
      console.log(err);
      response.send(err.message);
    }
  }
);

export const getCategory = functions.https.onRequest(
  async (request, response) => {
    try {
      const categoryId = request.query.categoryId;

      if (!categoryId) {
        console.log("ERROR: You must provide a categoryId");
        response.status(400).send("ERROR: You must provide a categoryId");
      }

      const doc: FirebaseFirestore.DocumentSnapshot = await firestore
        .collection("categories")
        .doc(categoryId)
        .get();
      const category = { id: doc.id, ...doc.data() };
      response.send(category);
    } catch (err) {
      console.log(err);
      response.send(err.message);
    }
  }
);

export const getProjects = functions.https.onRequest(
  async (request, response) => {
    try {
      const snapshot: FirebaseFirestore.QuerySnapshot = await firestore
        .collection("projects")
        .get();
      const projects = snapshot.docs.map(
        (doc: FirebaseFirestore.QueryDocumentSnapshot) => {
          return {
            id: doc.id,
            ...doc.data()
          };
        }
      );
      response.send(projects);
    } catch (err) {
      console.log(err);
      response.send(err.message);
    }
  }
);

export const getProject = functions.https.onRequest(
  async (request, response) => {
    try {
      const projectId = request.query.projectId;

      if (!projectId) {
        console.log("ERROR: You must provide a projectId");
        response.status(400).send("ERROR: You must provide a projectId");
      }

      const doc: FirebaseFirestore.DocumentSnapshot = await firestore
        .collection("projects")
        .doc(projectId)
        .get();
      const project = { id: doc.id, ...doc.data() };
      response.send(project);
    } catch (err) {
      console.log(err);
      response.send(err.message);
    }
  }
);
