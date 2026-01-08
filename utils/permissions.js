
import { PermissionsAndroid } from 'react-native';

export const ensureAndroidPermissionGranted = async (...permissions) => {
  try {
    let deniedPermissions = [];
    let grantedPermissions = [];
    const checkResults = await Promise.all(permissions.map(permission => PermissionsAndroid.check(permission)));
    const permissionsToRequest = permissions.filter((_, i) => checkResults[i] !== true);
    if (permissionsToRequest.length > 0) {
      const requestResults = await PermissionsAndroid.requestMultiple(permissionsToRequest);
      for (const [permission, result] of Object.entries(requestResults)) {
        if (result === PermissionsAndroid.RESULTS.GRANTED) {
          grantedPermissions.push(permission);
        } else {
          deniedPermissions.push(permission);
        }
      }
      return { 
        granted: grantedPermissions.length > 0 ? grantedPermissions : null, 
        denied: deniedPermissions.length > 0 ? deniedPermissions : null 
      };
    }
    return { granted: permissions, denied: null };
  } catch (error) {
    console.error("Error checking permissions:", error);
    return {
      granted: grantedPermissions.length > 0 ? grantedPermissions : null,
      denied: deniedPermissions.length > 0 ? deniedPermissions : null,
      error: error
    };
  }
};

