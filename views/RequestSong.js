import { StatusBar } from "expo-status-bar";
import React, {useState, useEffect} from "react";
import { View, StyleSheet, KeyboardAvoidingView, Text, Alert, TextInput, FlatList} from "react-native";
import { Avatar, ListItem, Button} from "react-native-elements";
import api from "../api";
import {getUserInfo} from "../spotify";
import { spotifySearch } from "../spotify";
import { Ionicons } from '@expo/vector-icons';

export default function RequestSong({ navigation, route}) {
  const [searchInput, setSearchInput] = useState('');
  const [songs, setSongs] = useState([]);
  const [username, setUsername] = useState('');
  const [requestedSongs, setRequestedSongs] = useState([]);
  const partyId = route.params.id;
  // Alert.alert(route.params.id);
  useEffect(async () => {
    let reqs = await api.getRequestedSongs(partyId);
    setRequestedSongs(reqs);
    if (searchInput.length === 0) {
      setSongs(reqs);
    }
    setUsername((await getUserInfo()).data["display_name"]);
  },[]);
  const search = async function (text) {
    setSearchInput(text);

    if (text.length > 0) {
      let songs = await spotifySearch(text);
      // Alert.alert(songs);
      if (songs.error) {
        Alert.alert(songs.error);
      }
      // Alert.alert(JSON.stringify(songs["tracks"]["items"][0]));
      const tempSongs = songs.data["tracks"]["items"];
      const formattedSongs = [];
      for (let i = 0; i < tempSongs.length; ++i){
        var form = {};
        form['uri'] = tempSongs[i]["album"]["images"][2]["url"];
        form['artist'] = tempSongs[i]["artists"][0]["name"];
        form['name'] = tempSongs[i]["name"];
        form['id'] = tempSongs[i]["id"];
        for (let j = 0; j < requestedSongs.length; ++j){
          if (tempSongs[i]["id"] == requestedSongs[j]["id"]) {
            form["requestedBy"] = requestedSongs[j]["requestedBy"];
            form["upvotes"] = requestedSongs[j]["upvotes"];
          }
        }
        formattedSongs.push(form);
      }
      setSongs(formattedSongs);
    } else {
      setSongs(requestedSongs);
    }

  }
  const requestSong = async (song) => {
    
    let success = await api.requestSong(partyId, song);
    // if (success) {
    //   Alert.alert(success);
    // } else {
    //   Alert.alert(success);
    // }
  }
  const songItem = ({ item }) => {
    let button;
    let counter;
    if (item["upvotes"] > 0) {
      let color = "black";
      let type = "md-arrow-up-circle-outline";
      if (item["requestedBy"].findIndex((name) => name === username) >= 0) {
        color = "orange";
        type = "md-arrow-up-circle";
      }
      button = <Ionicons name={type} size={32} color={color} onPress={async () => {
        await requestSong(item);
      }}/>;
      counter = <Text>{item["upvotes"]}</Text>;
    } else {
      button = <Button title="Request" type="outline" onPress={async () => {
        await requestSong(item);
      }}></Button>;
    }
    return (
      <ListItem bottomDivider>
        <Avatar source={{ uri: item["uri"] }} />
        <ListItem.Content>
          <ListItem.Title>{item["name"]}</ListItem.Title>
          <ListItem.Subtitle>{item["artist"]}</ListItem.Subtitle>
        </ListItem.Content>
        {counter}
        {button}
      </ListItem>
    )
  };
  return (
    <View >
      <TextInput style={{ 
    	height: 40, 
    	borderColor: 'gray', 
        borderWidth: 1,
        padding: 10,
        margin: 10,
        borderRadius: 10,
      }}
      onChangeText={text => search(text)}
      value={searchInput}
        placeholder="Search for your favorite track..." clearButtonMode='always'/>
      <FlatList
      keyExtractor={(item, index) => index.toString()}
      data={songs}
      renderItem={songItem}
    />
    </View>
  );
}