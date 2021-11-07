import * as React from 'react';
import { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert} from 'react-native';
import { Button } from 'react-native-elements';
import api from '../api';
import { createPlaylistForNewEvent } from '../spotify';
// import { AppRegistry } from 'react-native';
import { startListening } from '../BackgroundRequestHandler';

function NewEvent({navigation}) {
  const [title, setTitle] = useState("");
  // const [theme, setTitle] = useState("");
  // const [location, setTitle] = useState("");
  const tryCreateEvent = async () => {
    let newPlaylist = (await createPlaylistForNewEvent(title)).data;
    if (newPlaylist.error) {
      Alert.alert("There was a problem creating your playlist", "please try again");
      return;
    }
    let partyId = await api.createEvent(title, newPlaylist["id"])
    if (partyId) {
      // AppRegistry.registerHeadlessTask('SendTopRequestToPlaylist', () =>
      //   require('SendTopRequestToPlaylist')
      // );
      startListening(partyId, newPlaylist["id"]);
      navigation.goBack();
      Alert.alert("Your event is live!");
    } else {
      Alert.alert("There was a problem creating your event", "please try again")
    }

  }
  return (
    <View>
      <TextInput style={styles.field} maxLength={40} multiline={true}  placeholder="Event Name" onChangeText={(text)=>setTitle(text) }/>
      <Button onPress={tryCreateEvent} title="Create Event" style={styles.createButton} />
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    height: 130,
    borderBottomColor: 'gray',
    borderBottomWidth: 1,
    padding: 10,
    margin: 10,
    marginTop: 20,
    borderRadius: 10,
    fontSize: 40,
  },
  createButton: {
    height: 100,

  }
});

export default NewEvent;