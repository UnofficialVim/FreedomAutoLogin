
import { PermissionsAndroid } from 'react-native';

export const ensureAndroidPermissionGranted = async (...permissions) => {
  console.log("Checking Android permissions:", permissions);
  try {
    for (const permission of permissions) {
      let granted = await PermissionsAndroid.check(permission);

      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        granted = await PermissionsAndroid.request(permission);
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          console.log(`${permission} permission denied`);
          return false;
        }
      }
      console.log(`${permission} permission granted`);
      return true;
    }
  } catch (error) {
    console.error("Error checking permissions:", error);
  }
};

