import { View, Pressable, Text, Image} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';
import { ensureAndroidPermissionGranted } from '../utils/permissions';
import { styles } from '../StyleSheet';
import { LinearGradient } from 'expo-linear-gradient';
import { PermissionsAndroid } from 'react-native';

export default function EntryScreen() {
  const navigation = useNavigation();

  useEffect(() => {
    if(ensureAndroidPermissionGranted(
      PermissionsAndroid.PERMISSIONS.READ_SMS,
      PermissionsAndroid.PERMISSIONS.RECEIVE_SMS
    )) {
      console.log("SMS permissions granted");
    } else {
      console.error("SMS permissions not granted");
    }
  }, []);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#EC7F23', '#673AB7']}
        start={{ x: 0.15, y: 0.0 }}   
        end={{ x: 0.85, y: 1.0 }}     
        style={{ flex: 1 }}
      >
        <Image
        source={require('../assets/ic_launcher_foreground.png')}
        style={styles.EntryScreen.logo}
        resizeMode="contain"
      />
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
      </LinearGradient>
    </View>
  );
}
