import React from "react";
import * as SecureStore from 'expo-secure-store';
import { useState, useEffect } from 'react';
import { View } from 'react-native';
export default function HostPlayer({ navigation }) {

  const [token, setToken] = useState("");
  useEffect(async () => {
    setToken(await SecureStore.getItemAsync('spotify_token'));
  }, []);

  return (
    <View>
      
    </View>
    
  );
}