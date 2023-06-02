import {
  getFirestore,
  doc,
  addDoc,
  collection,
  runTransaction,
  updateDoc
} from 'firebase/firestore';
import { FIREBASE_APP } from '../../config.js';

const db = getFirestore(FIREBASE_APP);

const PER_JOB_CREDIT = 1;

export const createJobDocument = async ({ metadata, authId, modelType }) => {
  try {
    const userDoc = doc(db, `users/${authId}`);
    const userSnapshot = await getDoc(userDoc);
    if (userSnapshot.exists()) {
      const docData = userSnapshot.data();
      if (docData.balance < PER_JOB_CREDIT) {
        return { err: null, response: 'Not sufficent credits' };
      }
    }

    await runTransaction(db, async (transaction) => {
      const userDocRef = doc(db, `users/${authId}`);
      const userDoc = await transaction.get(userDocRef);
      if (userDoc.exists()) {
        const newBalance = userDoc.data().balance - PER_JOB_CREDIT;
        transaction.update(userDocRef, { balance: newBalance });
      }
    });

    const jobDocRef = await addDoc(collection(db, 'jobs'), {
      metadata: metadata,
      userId: authId,
      modelType: modelType,
      timestamp: Date.now(),
      status: 'DRAFT'
    });

    return { err: null, response: { jobId: jobDocRef.id } };
  } catch (err) {
    return { err: 'Error creating job', response: null };
  }
};

export const getUserJobs = async ({ authId }) => {
  try {
    let jobs = [];

    const jobsQuery = query(
      collection(db, 'jobs'),
      where('userId', '==', authId)
    );

    const jobsQuerySnapshot = await getDocs(jobsQuery);
    jobsQuerySnapshot.forEach((doc) => {
      jobs.push(doc.data());
    });
    return { err: null, response: { jobs: jobs } };
  } catch (err) {
    return { err: 'Error getting jobs', response: null };
  }
};

export const updateJobStatus = async ({ jobId, status }) => {
  try {
    const jobDocRef = doc(db, `jobs/${jobId}`);

    await updateDoc(jobDocRef, {
      status: status
    });

    return { error: null, response: { status: status } };
  } catch (err) {
    console.log(err);
    return { error: 'Error updating balance', response: null };
  }
};
