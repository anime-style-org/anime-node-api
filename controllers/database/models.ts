import {
  getFirestore,
  addDoc,
  collection,
  where,
  query,
  getDocs
} from 'firebase/firestore';
import { FIREBASE_APP } from '../../config.ts';

const db = getFirestore(FIREBASE_APP);

import { ModelType } from '../../types.ts';

interface createModelDocumentParams {
  userId: ModelType['userId'];
  jobId: ModelType['jobId'];
  bucketUrl: ModelType['buckerUrl'];
}

interface getUserModelsParams {
  userId: ModelType['userId'];
}

export const createModelDocument = async ({
  userId,
  jobId,
  bucketUrl
}: createModelDocumentParams): Promise<{ err: any; response: any }> => {
  try {
    const modelDocRef = await addDoc(collection(db, 'models'), {
      userId: userId,
      jobId: jobId,
      bucketUrl: bucketUrl,
      createdAt: Date.now()
    });

    return { err: null, response: { modelId: modelDocRef.id } };
  } catch (err) {
    return { err: 'Error creating model', response: null };
  }
};

export const getUserModels = async ({
  userId
}: getUserModelsParams): Promise<{ err: any; response: any }> => {
  try {
    let models: any = [];

    const modelsQuery = query(
      collection(db, 'models'),
      where('userId', '==', userId)
    );

    const modelsQuerySnapshot = await getDocs(modelsQuery);
    modelsQuerySnapshot.forEach((doc) => {
      models.push(doc.data());
    });
    return { err: null, response: { models: models } };
  } catch (err) {
    return { err: 'Error getting models', response: null };
  }
};
