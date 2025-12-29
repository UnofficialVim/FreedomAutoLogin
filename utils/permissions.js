
  import { PermissionsAndroid } from 'react-native';

  export const requestReadSMSPermission = async () => {
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


  export const requestReceiveSMSPermission = async () => {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECEIVE_SMS,
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

