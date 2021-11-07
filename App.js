import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
// Import the functions you need from the SDKs you need
// import firebase from "./firebase";
import { NavigationContainer , DarkTheme} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './views/Home.js';


import RequestSong from './views/RequestSong';
import Login from "./views/Login";
import NewEvent from "./views/NewEvent";
import HostPlayer from "./views/HostPlayer";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const Stack = createNativeStackNavigator();

export default function App() {
  
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="RequestSong" component={RequestSong} />
        <Stack.Screen name="New Event" component={NewEvent} />
        <Stack.Screen name="Host Player" component={HostPlayer} />
      </Stack.Navigator>
    </NavigationContainer>
  );
  
  
}

