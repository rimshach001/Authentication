import { View, Text, SafeAreaView, TouchableOpacity, Image, PermissionsAndroid, ScrollView, Alert, Button, Linking } from 'react-native'
import React, { useEffect, useState } from 'react'
import * as FileSystem from 'expo-file-system';
// import { launchCamera,launchImageLibrary } from 'react-native-image-picker'
import * as ImagePicker from 'expo-image-picker';
import * as Sharing from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';

const Camera = () => {
    const [selectImage, setSelectImage] = useState()
    const [takeImage, setTakeImage] = useState()
    const [imageUri, setImageUri] = useState(null);
    useEffect(() => {
        // console.log(imageUri, "uri");
    }, [imageUri])
    const OpenCamera = async () => {
        const { granted } = await ImagePicker.requestCameraPermissionsAsync();
        console.log(granted, "-------");
        if (granted === true) {
            console.log("click")
            const result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });
            if (!result.canceled) {
                console.log(result.assets[0].uri, "ooooo");
                setTakeImage(result.assets[0].uri);
            }
        }
    }
    const OpenGallery = async () => {
        const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        console.log(granted, "-------");
        if (granted === true) {
            console.log("Gallery click");
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });
            if (!result.canceled) {
                console.log(result.assets[0].uri, "gallery ooooo");
                setImageUri(result.assets[0].uri);
            }
        }
    };

    // const downloadImage = async () => {
    //     try {
    //         const response = await fetch(takeImage);
    //         const blob = await response.blob(); 
    //         const base64Data = await blobToBase64(blob); 
    //         const localUri = FileSystem.documentDirectory + `image-${Date.now()}.jpg`;
    
    //         // const picture=await FileSystem.writeAsStringAsync(localUri, base64Data, {
    //         //     encoding: FileSystem.EncodingType.Base64,
    //         // });
    //         try {
    //             await FileSystem.writeAsStringAsync(localUri, base64Data, {
    //               encoding: FileSystem.EncodingType.Base64,
    //             });
    //             console.log('File was successfully written.');
    //           } catch (error) {
    //             console.error('Error writing the file:', error);
    //           }
    // console.log(takeImage,"piccc");
    //         console.log(localUri, "path");
    //         console.log("Image downloaded successfully", picture);
    
    //         // setImageUri(localUri);
    //     } catch (e) {
    //         console.log(e, "error");
    //     }
    // };
    const downloadImage = async () => {
        try {
          const response = await fetch(takeImage);
          const blob = await response.blob();
          const localUri = FileSystem.documentDirectory + `image-${Date.now()}.jpg`;
      
          try {
            await FileSystem.writeAsStringAsync(localUri, await blobToBase64(blob), {
              encoding: FileSystem.EncodingType.Base64,
            });
      
            const asset = await MediaLibrary.createAssetAsync(localUri);
            const albumExists = await MediaLibrary.getAlbumAsync('MyAlbum');
      
            if (albumExists) {
              await MediaLibrary.addAssetsToAlbumAsync([asset], albumExists, false);
            } else {
              const newAlbum = await MediaLibrary.createAlbumAsync('MyAlbum', asset, false);
              console.log('Created a new album:', newAlbum);
            }
      
            console.log('Image saved to gallery:', localUri);
            Alert.alert("Saved in gallery")
          } catch (error) {
            console.error('Error writing or saving the file:', error);
          }
        } catch (e) {
          console.error('Error downloading image:', e);
        }
      };
      
    const blobToBase64 = async (blob) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onerror = reject;
            reader.onload = () => {
                resolve(reader.result.split(",")[1]); 
            };
            reader.readAsDataURL(blob);
        });
    };
    
    const shareImage = async () => {
        try {
          await Sharing.shareAsync(takeImage);
        } catch (error) {
          console.error('Error sharing image:', error);
        }
      };


    return (
        <View style={{ marginTop: 40 }}>
            <ScrollView>
                <TouchableOpacity onPress={OpenGallery} style={{ height: 30, marginBottom: 10, backgroundColor: 'grey', width: 100, alignItems: 'center', justifyContent: 'center', borderRadius: 30, marginLeft: 60 }} >
                    <Text>Gallery</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={OpenCamera} style={{ height: 30, backgroundColor: 'grey', width: 100, alignItems: 'center', justifyContent: 'center', borderRadius: 30, marginLeft: 60 }} >
                    <Text>cam</Text>
                </TouchableOpacity>

                {imageUri ? (
                    <View>
                        <Image style={{ marginTop: 100, width: 200, height: 200 }} source={{ uri: imageUri }} />
                        <Text>Image from gallery</Text>
                        <Button title='download' onPress={downloadImage} />
                    </View>
                ) :
                    null
                }
                {takeImage ? (
                    <View>
                        <Image style={{ marginTop: 60, width: 200, height: 200 }} source={{ uri: takeImage }} />
                        <Text>Image from camera</Text>
                        <Button title='download' onPress={downloadImage}/>
                        <Button marginTop='10' title='share' onPress={shareImage}/>
                    </View>
                ) :
                    null
                }

            </ScrollView>
        </View>
    )
}

export default Camera