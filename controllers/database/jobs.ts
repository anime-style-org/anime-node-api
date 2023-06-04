import {
  getFirestore,
  doc,
  addDoc,
  collection,
  runTransaction,
  updateDoc,
  getDoc,
  query,
  where,
  getDocs
} from 'firebase/firestore';
import { FIREBASE_APP } from '../../config.ts';
import { uploadImage } from '../bucket.ts';

import { JobType } from '../../types.ts';

const db = getFirestore(FIREBASE_APP);

const PER_JOB_CREDIT = 1;

interface createJobDocumentParams {
  userId: JobType['userId'];
  metadata: JobType['metadata'];
  modelType: JobType['modelType'];
  createdAt: JobType['createdAt'];
  status: JobType['status'];
}

interface getUserJobParams {
  userId: JobType['userId'];
}

interface updateJobStatusParams {
  jobId: JobType['id'];
  status: JobType['status'];
}

interface uploadImageForJobParams {
  jobId: JobType['id'];
  userId: JobType['userId'];
  file: any;
}

export const createJobDocument = async ({
  userId,
  metadata,
  modelType,
  createdAt,
  status
}: createJobDocumentParams): Promise<{ err: any; response: any }> => {
  try {
    const userDoc = doc(db, `users/${userId}`);
    const userSnapshot = await getDoc(userDoc);
    if (userSnapshot.exists()) {
      const docData = userSnapshot.data();
      if (docData.balance < PER_JOB_CREDIT) {
        return { err: null, response: 'Not sufficent credits' };
      }
    }

    await runTransaction(db, async (transaction) => {
      const userDocRef = doc(db, `users/${userId}`);
      const userDoc = await transaction.get(userDocRef);
      if (userDoc.exists()) {
        const newBalance = userDoc.data().balance - PER_JOB_CREDIT;
        transaction.update(userDocRef, { balance: newBalance });
      }
    });

    const jobDocRef = await addDoc(collection(db, 'jobs'), {
      metadata: metadata,
      userId: userId,
      modelType: modelType,
      createdAt: createdAt,
      status: status
    });

    return { err: null, response: { jobId: jobDocRef.id } };
  } catch (err) {
    return { err: 'Error creating job', response: null };
  }
};

export const getUserJobs = async ({
  userId
}: getUserJobParams): Promise<{ err: any; response: any }> => {
  try {
    let jobs: any = [];

    const jobsQuery = query(
      collection(db, 'jobs'),
      where('userId', '==', userId)
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

export const updateJobStatus = async ({
  jobId,
  status
}: updateJobStatusParams): Promise<{ err: any; response: any }> => {
  try {
    const jobDocRef = doc(db, `jobs/${jobId}`);

    await updateDoc(jobDocRef, {
      status: status
    });

    return { err: null, response: { status: status } };
  } catch (err) {
    console.log(err);
    return { err: 'Error updating balance', response: null };
  }
};

export const uploadImageForJob = async ({
  jobId,
  userId,
  file
}: uploadImageForJobParams) => {
  const jobDocRef = doc(db, `jobs/${jobId}`);

  let bucketResponse = await uploadImage(userId, jobId, file.name, file);

  if (bucketResponse.err) {
    return bucketResponse;
  } else {
    await runTransaction(db, async (transaction) => {
      const jobDoc = await transaction.get(jobDocRef);
      if (jobDoc.exists()) {
        const imagesCount = jobDoc.data().imagesUploaded + 1;
        transaction.update(jobDocRef, { imagesUploaded: imagesCount });
      }
    });

    return { error: null, response: { uploadStatus: 'SUCCESS' } };
  }
};
