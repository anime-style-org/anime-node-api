import { getFirestore, query, collection, getDocs } from 'firebase/firestore';
import { FIREBASE_APP } from '../../config.ts';

import { StylesInterface } from '../../types.ts';

const db = getFirestore(FIREBASE_APP);

export const getAllStyles = async (): Promise<{ err: any; response: any }> => {
  try {
    let styles: StylesInterface[] = [];

    const stylesQuery = query(collection(db, 'users'));

    const stylesQuerySnapshot = await getDocs(stylesQuery);
    stylesQuerySnapshot.forEach((doc) => {
      styles.push(doc.data() as StylesInterface);
    });
    return { err: null, response: { styles: styles } };
  } catch (err) {
    return { err: 'Error getting styles', response: null };
  }
};
