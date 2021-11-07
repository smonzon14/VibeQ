
import {
  getFirestore,
  collection,
  getDocs,
  getDoc,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
  increment,
  GeoPoint,
  orderBy,
  query
} from 'firebase/firestore';
import { initializeApp } from 'firebase/app';  // Should not be used elsewhere in the project
import firebaseConfig from './firebase.config.js';
import { Alert } from 'react-native';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

import { getUserInfo } from './spotify';

function listenToParties(setParties, getParties) {
  const unsub = onSnapshot(collection(db, 'Parties'), (snapshot) => {
    const parties = getParties();
    snapshot.docChanges().forEach((change) => {
      const data = change.doc.data();
      const doc = change.doc;
      if (change.type === 'added') {
        var party = {};
        party['id'] = doc.id;
        party['name'] = data.name;
        party['location'] = data.location;
        parties.push(party);
      } else if (change.type === 'modified') {
        let index = parties.findIndex(party => party.id === doc.id);
        if (index >= 0 && index < parties.length) {
          parties[index]['name'] = data.name;
          parties[index]['location'] = data.location;
        }
      } else if (change.type === 'removed') {
        let index = parties.findIndex(party => party.id === doc.id);
        if (index >= 0 && index < parties.length) {
          array.splice(index, 1);
        }
      }
    });
    setParties(parties);
  });
  return unsub;
}


async function getParties() {
  const parties = [];
  await getDocs(collection(db, "Parties")).then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      const data = doc.data();
      // Alert.alert(doc.id, " => ", data);
      var party = {};
      party['id'] = doc.id;
      party['name'] = data.name;
      party['location'] = data.location;
      party['host'] = data.host;
      party['playlistId'] = data.playlistId;
      parties.push(party);
    });
  }).catch((err) => {
    Alert.alert(err.message);
  });
  
  return parties;
  
}

async function removeRequest(partyId, reqId) {
  try {
    const req = doc(db, "Parties", partyId, "Requests", reqId);
    await deleteDoc(req);
  } catch (err) {
    return false;
  }
  return true;
}

async function getRequestedSongs(partyId) {
  const requests = [];
  try {
    const reqSongsCollection = collection(db, "Parties", partyId, "Requests");
    await getDocs(query(reqSongsCollection, orderBy("upvotes"))).then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        var request = {};
        request['id'] = doc.id;
        request['uri'] = data.uri;
        request['artist'] = data.artist;
        request['name'] = data.name;
        request['upvotes'] = data.upvotes;
        request['requestedBy'] = data.requestedBy;
        requests.push(request);
      });
    });
  } catch (err) {
    return [];
    // Alert.alert(err);
  }
  return requests.reverse();
}

async function requestSong(partyId, song) {
  try {
    const reqDoc = doc(db, "Parties", partyId, "Requests", song['id']);
    const docSnap = await getDoc(reqDoc);
    const username = (await getUserInfo()).data["display_name"];
    if (docSnap.exists()) {
      // if user has not already requested add an upvote
      if (docSnap.data().requestedBy.findIndex((e)=>e===username) < 0) {
        await updateDoc(reqDoc, {
          upvotes: increment(1),
          requestedBy: arrayUnion(username)
        });
      } else {
        Alert.alert("You already requested this song!");
        return false;
      }
      
      // increment upvotes by one
    } else {
      await setDoc(doc(db, "Parties", partyId, "Requests", song['id']), {
        uri: song["uri"],
        artist: song["artist"],
        name: song["name"],
        upvotes: 1,
        requestedBy: [username],

      });
      
    }
  } catch (err) {
    Alert.alert(err.message);
    return false;
  }
  Alert.alert("Requested!");
  return true;
  
}

async function createEvent(name, playlistId) {
  try {
    let col = collection(db, "Parties");
    const username = (await getUserInfo()).data["display_name"];
    
    let docRef = await addDoc(col, {
      name: name,
      host: username,
      location: new GeoPoint(42, -70),
      playlistId: playlistId,
    });
    return docRef.id;
  } catch (err) {
    Alert.alert(err.message);
    return false;
  }
  
  
}


export default {
  removeRequest: removeRequest,
  getParties: getParties,
  listenToParties: listenToParties,
  requestSong: requestSong,
  getRequestedSongs: getRequestedSongs,
  createEvent: createEvent,
};
