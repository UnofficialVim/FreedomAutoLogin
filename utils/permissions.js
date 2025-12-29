
  import { PermissionsAndroid } from 'react-native';

  export const checkReadSMSPermission = async () => {
      const granted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_SMS);
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          requestReadSMSPermission();
      }
      else {
          console.log("Read SMS permission granted");
      }
  };

  export const checkReceiveSMSPermission = async () => {
      const granted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.RECEIVE_SMS);
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          requestReceiveSMSPermission();
      }
      else {
          console.log("Receive SMS permission granted");
      }
  };

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
          console.log("Read SMS permission granted");
        } else {
          console.log("Read SMS permission denied");
        }
      } catch (err) {
        console.warn(err);
      }
    };
 const requestReceiveSMSPermission = async () => {
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
          console.log("Receive SMS permission granted");
        } else {
          console.log("Receive SMS permission denied");
        }
      } catch (err) {
        console.warn(err);
      }
    };
