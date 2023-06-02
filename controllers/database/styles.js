import { getFirestore, query, collection, getDocs } from 'firebase/firestore';
import { FIREBASE_APP } from '../../config.js';

const db = getFirestore(FIREBASE_APP);

export const getAllStyles = async () => {
  try {
    let styles = [];

    const stylesQuery = query(collection(db, 'users'));

    const stylesQuerySnapshot = await getDocs(stylesQuery);
    stylesQuerySnapshot.forEach((doc) => {
      styles.push(doc.data());
    });
    return { err: null, response: { styles: styles } };
  } catch (err) {
    return { err: 'Error getting styles', response: null };
  }
};
