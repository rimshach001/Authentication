import {  StyleSheet,  View } from 'react-native';

import ContactList from './src/ContactList/contactList';
import Camera from './src/Images';
import Qrcode from './src/QRCode';
export default function App() {
  return (
    <View style={styles.container}>
      <Qrcode/>
    </View>
  
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 25
  },
  input: {
    borderWidth: 0.5,
    fontSize: 15,
    width: 150,
    paddingLeft: 4
  }
});
