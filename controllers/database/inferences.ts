import {
  getFirestore,
  addDoc,
  collection,
  query,
  where,
  getDocs
} from 'firebase/firestore';
import { FIREBASE_APP } from '../../config.ts';

import { InferenceType } from '../../types.ts';

const db = getFirestore(FIREBASE_APP);

interface createInferenceDocumentParams {
  userId: InferenceType['userId'];
  jobId: InferenceType['jobId'];
  modelId: InferenceType['modelId'];
  bucketUrl: InferenceType['bucketUrl'];
}

interface getUserInferencesParams {
  userId: InferenceType['userId'];
}

export const createInferenceDocument = async ({
  userId,
  jobId,
  modelId,
  bucketUrl
}: createInferenceDocumentParams): Promise<{ err: any; response: any }> => {
  try {
    const inferenceDocRef = await addDoc(collection(db, 'inferences'), {
      userId: userId,
      jobId: jobId,
      modelId: modelId,
      bucketUrl: bucketUrl,
      createdAt: Date.now()
    });

    return { err: null, response: { inferenceId: inferenceDocRef.id } };
  } catch (err) {
    return { err: 'Error creating inference', response: null };
  }
};

export const getUserInferences = async ({
  userId
}: getUserInferencesParams): Promise<{ err: any; response: any }> => {
  try {
    let inferences: any = [];

    const inferencesQuery = query(
      collection(db, 'inferences'),
      where('userId', '==', userId)
    );

    const inferencesQuerySnapshot = await getDocs(inferencesQuery);
    inferencesQuerySnapshot.forEach((doc) => {
      inferences.push(doc.data());
    });
    return { err: null, response: { inferences: inferences } };
  } catch (err) {
    return { err: 'Error getting inferences', response: null };
  }
};
