import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Linking } from 'react-native';
function QRCodeScannerScreen() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [data, setData] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ data }) => {
    setScanned(true);
    setData(data);
    if (Linking.canOpenURL(data)) {
        Linking.openURL(data).catch((error) => {
          console.error('Error in URL:', error);
        });
      } else {
        console.warn('valid URL:', data);
      }
  };
  if (hasPermission === null) {
    return <Text>Requesting camera permission...</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />

      <View style={styles.scanResult}>
        {scanned ? (
          <>
            <Text>Scanned QR Code:</Text>
            <Text>{data}</Text>
            <Button title="Scan Again" onPress={() => setScanned(false)} />
          </>
        ) : (
          <Text>Scan a QR Code</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    marginVertical:200,
    width:250,
    height:250
  },
  scanResult: {
    backgroundColor: 'white',
    padding: 16,
    alignItems: 'center',
  },
});

export default QRCodeScannerScreen;
