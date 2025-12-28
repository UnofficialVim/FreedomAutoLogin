import { View, Button, PermissionsAndroid } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';

export default function EntryScreen() {
  const navigation = useNavigation();
  
    useEffect(async () => {
    //check if we have permissions on startup
    const granted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_SMS);
    if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
      requestReadSMSPermission();
      console.log("SMS permission not granted");
    }
    else {
      console.log("SMS permission granted");
    }
}, []);

  const requestReadSMSPermission = async () => {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_SMS,
          {
            title: "SMS Permission",
            message: "This app needs access to your SMS messages in order to auto verify your otp",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK"
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log("SMS permission granted");
        } else {
          console.log("SMS permission denied");
        }
      } catch (err) {
        console.warn(err);
      }
    };

const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: "Camera Permission",
            message: "This app needs access to your camera",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK"
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("Camera permission granted");
      } else {
        console.log("Camera permission denied");
      }
    } catch (err) {
      console.warn(err);
    }
  };

  return (
    <View>
      <Button title="Go to Home" onPress={() => navigation.replace('Home')} />
      <Button title="set permissions" onPress={requestReadSMSPermission} />
      <Button title="set camera permissions" onPress={requestCameraPermission} />
    </View>
  );
}