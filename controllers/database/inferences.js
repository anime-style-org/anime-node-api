import { getFirestore, addDoc, collection } from 'firebase/firestore';
import { FIREBASE_APP } from '../../config.js';

const db = getFirestore(FIREBASE_APP);

export const createInferenceDocument = async ({
  authId,
  jobId,
  modelId,
  bucketUrl
}) => {
  try {
    const inferenceDocRef = await addDoc(collection(db, 'inferences'), {
      userId: authId,
      jobId: jobId,
      modelId: modelId,
      bucketUrl: bucketUrl,
      timestamp: Date.now()
    });

    return { err: null, response: { inferenceId: inferenceDocRef.id } };
  } catch (err) {
    return { err: 'Error creating inference', response: null };
  }
};

export const getUserInferences = async ({ authId }) => {
  try {
    let inferences = [];

    const inferencesQuery = query(
      collection(db, 'inferences'),
      where('userId', '==', authId)
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
