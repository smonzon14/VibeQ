
import * as React from 'react';
import { View, Text, Button, StyleSheet} from 'react-native';
import api from '../api';
function Home({navigation}) {
  // api.getParties();
  return (
    <View style={{ flex: 1, alignItems: 'center'}}>
      <Text>Details Screen</Text>
      <Button
        title="Request Screen"
        style={styles.button}
        onPress={() => {
          navigation.push("RequestSong");
        }}
      />
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
});
export default Home;