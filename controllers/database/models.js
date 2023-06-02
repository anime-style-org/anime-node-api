import { getFirestore, addDoc, collection } from 'firebase/firestore';
import { FIREBASE_APP } from '../../config.js';

const db = getFirestore(FIREBASE_APP);

export const createModelDocument = async ({ authId, jobId, bucketUrl }) => {
  try {
    const modelDocRef = await addDoc(collection(db, 'models'), {
      userId: authId,
      jobId: jobId,
      bucketUrl: bucketUrl,
      timestamp: Date.now()
    });

    return { err: null, response: { modelId: modelDocRef.id } };
  } catch (err) {
    return { err: 'Error creating model', response: null };
  }
};

export const getUserModels = async ({ authId }) => {
  try {
    let models = [];

    const modelsQuery = query(
      collection(db, 'models'),
      where('userId', '==', authId)
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
