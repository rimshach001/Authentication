import { StatusBar } from 'expo-status-bar';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication'
import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ContactList from './src/ContactList/contactList';
export default function App() {
  return (
    <View style={styles.container}>
      <ContactList/>
    </View>
  
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    // alignItems: 'center',
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
