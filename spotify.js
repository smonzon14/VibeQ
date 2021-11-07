import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

import { Alert } from 'react-native';
const BASE_URL = "https://api.spotify.com/v1/";

async function getConfig() {
  const token = await SecureStore.getItemAsync('spotify_token');
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token
    }
  }
  return config;
}

async function createPlaylistForNewEvent(title) {
  try {
    let username = (await getUserInfo()).data["display_name"];
    const url = BASE_URL + 'users/' + username + '/playlists';
    let config = await getConfig();
    
    return await axios.post(url,
      {
        "name": title,
        "description": username + '\'s event playlist for \"'+title+'\"',
        "public": true
      }, config);
  } catch (err) {
    Alert.alert(err);
    return {error: err};
  }
}

async function getUserInfo() {
  try {
    
    const url = BASE_URL + 'me';

    return await axios.get(url, await getConfig());;
  } catch (err) {
    return {};
  }
}

async function spotifySearch(text) {

  try {
    const query = "?q=" + text + "&type=track&market=US&offset=0&limit=20";
    const url = BASE_URL + 'search' + query;

    return await axios.get(url, await getConfig());;
  } catch (err) {
    return [];
  }
}

async function getPlaybackState() {
  try {
    // const query = "?q=" + text + "&type=track&market=US&offset=0&limit=20";
    const url = BASE_URL + 'me/player';

    return await axios.get(url, await getConfig());;
  } catch (err) {
    return false;
  }
}

async function addToPlaylist(playlistId, songId) {
  try {
    const trackUri = "spotify:track:" + songId;
    const url = BASE_URL + 'playlists/' + playlistId + '/tracks?uris='+trackUri;
    
    return await axios.post(url, {}, await getConfig());
  } catch (err) {
    return err;
  }

}

export {
  spotifySearch,
  getUserInfo,
  createPlaylistForNewEvent,
  getPlaybackState,
  addToPlaylist
};