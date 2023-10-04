import {  Text, TextInput, TouchableOpacity, View } from 'react-native';
import React from 'react'
import * as LocalAuthentication from 'expo-local-authentication'
import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
const index = () => {
    const [start, setstart] = useState(true)
  const [biometricType, setBiometricType] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [username1, setUsername1] = useState('');
  const [password1, setPassword1] = useState('');
  const handleSaveCredentials = async () => {
    try {
      // Save the username and password in AsyncStorage
      await AsyncStorage.setItem('username', username);
      await AsyncStorage.setItem('password', password);
      alert('Credentials saved successfully!');
      setstart(false)
    } catch (error) {
      console.error('Error saving credentials:', error);
    }
  };
  const checkBiometric = async () => {
    const isAvailable = await LocalAuthentication.hasHardwareAsync();
    if (!isAvailable) {
      alert('Biometric authentication is not available on this device.');
      return;
    }

    const bio = await LocalAuthentication.supportedAuthenticationTypesAsync();
    console.log(bio, "bio");
    setBiometricType(bio[0]);
    console.log(biometricType, "type");
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Authenticate to continue',
    });
    console.log(result, "pp");
    if (result.success) {
      // alert('Authentication successful!');
      const storedUsername = await AsyncStorage.getItem('username');
      const storedPassword = await AsyncStorage.getItem('password');

      setUsername1(storedUsername)
      setPassword1(storedPassword)
    } else {
      alert('Authentication failed.');
    }
  };
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {start == true ? (
        <View style={{alignItems:'center',justifyContent:'center'}}>
          <Text style={{fontSize:50}}>Sign Up</Text>
          <Text style={styles.label}>Username:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your username"
            value={username}
            onChangeText={(text) => setUsername(text)}
          />
          <Text style={styles.label}>Password:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            secureTextEntry={true}
            value={password}
            onChangeText={(text) => setPassword(text)}
          />
            <TouchableOpacity style={{ marginTop: 20 }} onPress={handleSaveCredentials}>
              <Text>save data</Text>
            </TouchableOpacity>
          
          
        </View>
      ) : (
        <View>
          <Text style={{fontSize:50}}>Login</Text>
          <Text style={styles.label}>Username:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your username"
            value={username1}
            onChangeText={(text) => setUsername1(text)}
          />
          <Text style={styles.label}>Password:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            secureTextEntry={true}
            value={password1}
            onChangeText={(text) => setPassword1(text)}
          />
          {username1 == '' ? (
            <TouchableOpacity style={{ marginTop: 20 }} onPress={checkBiometric}>
              <Text>Autofill data</Text>
            </TouchableOpacity>
          ) : (
            <Text style={{ marginTop: 20 }} >Done</Text>
          )

          }
        </View>
      )


      }

    </View>
  )
}

export default index