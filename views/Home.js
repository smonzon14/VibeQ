
import React, {useState, useEffect} from 'react';
import { View, Text, StyleSheet, FlatList, Alert, TouchableOpacity, RefreshControl } from 'react-native';
import {ListItem, Button} from 'react-native-elements';
import api from '../api';
import { AntDesign, Ionicons } from '@expo/vector-icons';

function Home({ navigation }) {
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await updateParties();
    setRefreshing(false);
  }, []);

  const [parties, setParties] = useState([]);
  const getParties = () => parties;
  const updateParties = async () => {
    setParties(await api.getParties());
    
  }
  useEffect(async () => {
    // setParties();
    await updateParties();
  }, []);
  const partyItem = ({ item }) => (
    <ListItem bottomDivider onPress={() => {
          navigation.push("RequestSong", {id:item.id});
        }}>
      {/* <Avatar source={{uri: item["album"]["images"][2]["url"]}}/> */}
      <ListItem.Content>
        <ListItem.Title>{item.name}</ListItem.Title>
        <ListItem.Subtitle style={{color:"gray"}}>{item.host + " (host)"}</ListItem.Subtitle>
      </ListItem.Content>
      <ListItem.Chevron />
      {/* <Button
        title="Request Screen"
        style={styles.button}
        
      /> */}
    </ListItem>
  );
  return (
    <View style={{display: 'flex', flexDirection: 'column', flex:1}} >
      
      <FlatList
      keyExtractor={(item, index) => index.toString()}
      data={parties}
        renderItem={partyItem}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      />
      <AntDesign name="pluscircle" size={64} color="black" style={styles.newButton} onPress={ () => {
        navigation.push("New Event");
      }} />
      <Button title="Host" onPress={ () => {
        navigation.push("Host Player");
      }}/>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "black",
  },
  button: {
    width: 200,
    marginTop: 50,
  },
  newButton: {
    width: 100,
    height: 100,
    right: 0,
    bottom: 0,
    position: "absolute",
    alignItems:'center',
    justifyContent:'center',
  },
});
export default Home;