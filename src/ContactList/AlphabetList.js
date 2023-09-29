import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

const AlphabetList = ({ letters, onLetterPress }) => {
  return (
    <View style={{  alignItems: 'center',marginTop:10 , marginLeft:10}}>
      {letters.map((letter) => (
        <TouchableOpacity key={letter} onPress={() => onLetterPress(letter)}>
          <Text style={{color:'white', marginVertical:4.5}}>{letter}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default AlphabetList;
