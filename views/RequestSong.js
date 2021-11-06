import { StatusBar } from "expo-status-bar";
import React, {useState} from "react";
import { View, StyleSheet, KeyboardAvoidingView, Text, Alert, TextInput} from "react-native";
import { Avatar, ListItem } from "react-native-elements";

import { spotifySearch } from "../spotify";

export default function RequestSong({ navigation }) {
  const [searchInput, setSearchInput] = useState('');
  const [songs, setSongs] = useState([]);
  const search = function (text) {
    setSearchInput(text);
    if (text.length > 0) {
      spotifySearch(text).then((songs) => {
        Alert.alert("hello");
        songs = songs['tracks']['items'];
        setSongs(songs);
      });
    } else {
      setSongs([]);
    }
  }
  return (
    <View style={{ flex: 1, alignItems: 'center'}}>
      <Text>Request Song</Text>
      <TextInput style={{ 
    	height: 40, 
    	borderColor: 'gray', 
    	borderWidth: 1,
    	placeholderTextColor: 'gray',
      }}
      onChangeText={text => search(text)}
      value={searchInput}
        placeholder="Insert your text!" />
      <View>
        {songs.map((item, i)=>{
          <ListItem key={i} bottomDivider>
            <Avatar source={{uri: item.album.images[2].url}}/>
            <ListItem.Content>
              <ListItem.Title>{item.name}</ListItem.Title>
              <ListItem.Subtitle>{item.artists[0].name}</ListItem.Subtitle>
            </ListItem.Content>
          </ListItem>
        })
        }
      </View>
    </View>
  );
}