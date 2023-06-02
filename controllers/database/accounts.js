import {
  getFirestore,
  setDoc,
  doc,
  getDoc,
  runTransaction
} from 'firebase/firestore';
import { createUserFolder } from '../bucket.js';
import { FIREBASE_APP } from '../../config.js';

const db = getFirestore(FIREBASE_APP);

export const createUserDocument = async ({ authId, email, name, dob }) => {
  try {
    const userDoc = doc(db, `users/${authId}`);
    const docData = {
      email,
      name,
      dob,
      balance: 0
    };
    await setDoc(userDoc, docData);
  } catch (err) {
    console.log(err);
    return { error: 'Error creating user', response: null };
  }

  let bucketRes = await createUserFolder(authId);
  if (bucketRes.err) {
    return { err: bucketRes.err, response: null };
  } else {
    return { error: null, response: docData };
  }
};

export const getUserDocument = async ({ authId }) => {
  const userDoc = doc(db, `users/${authId}`);
  const userSnapshot = await getDoc(userDoc);
  if (userSnapshot.exists()) {
    const docData = userSnapshot.data();
    return { err: null, response: docData };
  } else {
    return { err: null, response: null };
  }
};

export const updateUserCreditsBalance = async ({ authId, balanceToAdd }) => {
  try {
    await runTransaction(db, async (transaction) => {
      const userDocRef = doc(db, `users/${authId}`);
      const userDoc = await transaction.get(userDocRef);
      if (userDoc.exists()) {
        const newBalance = userDoc.data().balance + balanceToAdd;
        transaction.update(userDocRef, { balance: newBalance });
      }
    });

    return { error: null, response: { balance: newBalance } };
  } catch (err) {
    console.log(err);
    return { error: 'Error updating balance', response: null };
  }
};
