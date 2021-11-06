import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Alert } from 'react-native';
const BASE_URL = "http://api.spotify.com/v1/";

async function spotifySearch(text) {

  try {

    const token = await SecureStore.getItemAsync('spotify_token');
    

    const config = {
      params: {
        q: text,
        type: 'track',
        market: 'US'
      },
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      }
    }
    const query = "?q=" + text + "&type=track&market=US&offset=0&limit=20";
    const url = BASE_URL + 'search';

    return await axios.get(url, config);;
  } catch (err) {
    Alert.alert(err.message);

    return [];
  }
}


export {
  spotifySearch
};