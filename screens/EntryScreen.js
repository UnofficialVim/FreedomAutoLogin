import { View, PermissionsAndroid, Pressable, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';
import { requestReadSMSPermission, requestReceiveSMSPermission}from '../utils/permissions';
import { getSecure } from '../utils/overrides';
import { styles } from '../StyleSheet';

export default function EntryScreen() {
  const navigation = useNavigation();
  

  useEffect(() => {
    checkSMSPermission();
  }, []);

  useEffect(() => {
    const checkStoredData = async () => {
      const phoneNumber = await getSecure('phoneNumber');
      const pin = await getSecure('pin');
      const skipEntry = await getSecure('skipEntryPage');

      if (skipEntry) {
        navigation.replace('Home');
      }
      else if (phoneNumber === '' && pin === '') {
        alert('Please enter your phone number and PIN in the Settings page');
      }
    };

    checkStoredData();
  }, []);

  const checkSMSPermission = async () => {
    const granted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_SMS);
    if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
      requestReadSMSPermission();
      console.log("SMS permission not granted");
    } else {
      console.log("SMS permission granted");
    }
    const receiveGranted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.RECEIVE_SMS);
    if (receiveGranted !== PermissionsAndroid.RESULTS.GRANTED) {
      requestReceiveSMSPermission();
      console.log("Receive SMS permission not granted");
    } else {
      console.log("Receive SMS permission granted");
    }
  }; 

  return (
    <View style={styles.container}>
      <View style={styles.EntryScreen.LoginButtonContainer}>
        <Pressable
          onPress={() => navigation.replace('Home')}
          style={({ pressed }) => [
          styles.EntryScreen.loginButton,
          pressed && styles.EntryScreen.loginButton.pressed
        ]}>
          <Text style={styles.EntryScreen.loginButtonText}>Login</Text>
        </Pressable>
      </View>
    </View>
  );
}