import { View, Pressable, Text, Image} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';
import { checkReadSMSPermission, checkReceiveSMSPermission } from '../utils/permissions';
import { getSecure } from '../utils/overrides';
import { styles } from '../StyleSheet';
import { LinearGradient } from 'expo-linear-gradient';

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
    checkReadSMSPermission();
    checkReceiveSMSPermission();
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#EC7F23', '#673AB7']}
        start={{ x: 0.15, y: 0.0 }}   // near top-left
        end={{ x: 0.85, y: 1.0 }}     // bottom-right
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
