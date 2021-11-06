// We should import firebase from this module instead of the default package.
import * as firebase from 'firebase/app'  // Should not be used elsewhere in the project
import firebaseConfig from './firebase.config.js';
firebase.initializeApp(firebaseConfig);

export default firebase;