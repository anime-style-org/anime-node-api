import {
  getFirestore,
  setDoc,
  doc,
  getDoc,
  runTransaction
} from 'firebase/firestore';
import { createUserFolder } from '../bucket.ts';
import { FIREBASE_APP } from '../../config.ts';

import { UserType } from '../../types.ts';

const db = getFirestore(FIREBASE_APP);

interface createUserDocumentParams {
  userId: UserType['id'];
  email: UserType['email'];
  name: UserType['name'];
  dob: UserType['dob'];
  initialBalance: UserType['balance'];
}

interface getUserDocumentParams {
  userId: UserType['id'];
}

interface updateUserCreditsBalanceParams {
  userId: UserType['id'];
  balanceToAdd: Number;
}

export const createUserDocument = async ({
  userId,
  email,
  name,
  dob,
  initialBalance
}: createUserDocumentParams): Promise<{ err: any; response: any }> => {
  const docData = {
    email,
    name,
    dob,
    initialBalance
  };

  try {
    const userDoc = doc(db, `users/${userId}`);
    await setDoc(userDoc, docData);
  } catch (err) {
    console.log(err);
    return { err: 'Error creating user', response: null };
  }

  let bucketRes = await createUserFolder(userId);
  if (bucketRes.err) {
    return { err: bucketRes.err, response: null };
  } else {
    return { err: null, response: docData };
  }
};

export const getUserDocument = async ({
  userId
}: getUserDocumentParams): Promise<{ err: any; response: any }> => {
  const userDoc = doc(db, `users/${userId}`);
  const userSnapshot = await getDoc(userDoc);
  if (userSnapshot.exists()) {
    const docData = userSnapshot.data();
    return { err: null, response: docData };
  } else {
    return { err: null, response: null };
  }
};

export const updateUserCreditsBalance = async ({
  userId,
  balanceToAdd
}: updateUserCreditsBalanceParams): Promise<{ err: any; response: any }> => {
  let newBalance;

  try {
    await runTransaction(db, async (transaction) => {
      const userDocRef = doc(db, `users/${userId}`);
      const userDoc = await transaction.get(userDocRef);
      if (userDoc.exists()) {
        newBalance = userDoc.data().balance + balanceToAdd;
        transaction.update(userDocRef, { balance: newBalance });
      }
    });

    return { err: null, response: { balance: newBalance } };
  } catch (err) {
    console.log(err);
    return { err: 'Error updating balance', response: null };
  }
};
