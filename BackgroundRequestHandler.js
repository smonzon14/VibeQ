// import BackgroundTimer from 'react-native-background-timer';
// let BackgroundTimer = require('react-native-background-timer').default
import { getPlaybackState, addToPlaylist } from './spotify';
import api from './api';

let STOPPED = false;

async function sendNextRequestToPlaylist(playlistId, partyId) {
  let songs = await api.getRequestedSongs(partyId);
  if (songs.length === 0) {
    // stopListening();
    console.log("--- NO SONGS");
    return false;
  }
  let top = songs[0];

  let res = await addToPlaylist(playlistId, top["id"]);
  console.log(playlistId);
  if (!res) {
    

    return false;
  }

  return await api.removeRequest(partyId, top["id"]);
}

async function startListening(partyId, playlistId) {
  
  let player;
  let prevPlayer;
  let cooldown = 0;
  async function iter() {
    console.log("...");
    player = (await getPlaybackState());
    // if (!player.data) {
    //   console.log(player);
    // }
    player = player.data;
    cooldown -= 3000;
    if (!prevPlayer) {
      prevPlayer = player;
      console.log("INIT");
      setTimeout(iter, 3000);
      return;
    }
    if (!player["is_playing"]) {
      console.log("MEDIA NOT PLAYING");
      setTimeout(iter, 3000);
      return;
    }
    if (prevPlayer["item"]["id"] !== player["item"]["id"] && cooldown <= 0) {
      console.log("SONG CHANGED, QUEUE NEXT");
      
      await sendNextRequestToPlaylist(playlistId, partyId);
    } else if(cooldown <= 0) {
      let timeLeft = (player["item"]["duration_ms"] - player["progress_ms"]) / 1000;
      if (timeLeft < 10) {
        console.log("SONG ABOUT TO CHANGE, QUEUE NEXT");
        cooldown = 10000;
        await sendNextRequestToPlaylist(playlistId, partyId);
      }
    }
    prevPlayer = player;
    if (STOPPED) {
      console.log("STOPPED");
      STOPPED = false;
      return;
    }
    setTimeout(iter, 3000);
  }
  await iter();
  // BackgroundTimer.runBackgroundTimer(async () => {
    

  // }, 
  // 5000);
}

function stopListening() {
  STOPPED = true;
}

// function stopListening() {
//   BackgroundTimer.stopBackgroundTimer(); //after this call all code on background stop run.
// }

export {startListening, stopListening}