
import { getFirestore, collection, getDocs} from 'firebase/firestore/lite';
import { initializeApp } from 'firebase/app';  // Should not be used elsewhere in the project
import firebaseConfig from './firebase.config.js';
import { Alert } from 'react-native';
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function getParties() {
  let data = [];
  getDocs(collection(db, "Parties")).then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      const data = doc.data();
      Alert.alert(doc.id, " => ", data);
      data.push({ id: doc.id, name: data.name, location: data.location });
    });
  }).catch((err) => {
    Alert.alert(err.message);
  });
  
  return data;
  
}


export default { getParties : getParties};
