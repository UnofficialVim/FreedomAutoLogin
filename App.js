import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TouchableOpacity, Text, PermissionsAndroid } from 'react-native';
import React, { useEffect } from 'react';
import { styles } from './StyleSheet';
import HomeScreen from './screens/HomeScreen';
import SettingsScreen from './screens/SettingsScreen';

const Stack = createNativeStackNavigator();

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

function Stackmanager() {

  useEffect(() => {
    requestReadSMSPermission();
}, []);

  const navigation = useNavigation();
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerTitleAlign: 'left',
          headerTitle: "\uD83C\uDF10 Freedom Auto Login",
          headerRight: () => (
            <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
              <Text style={styles.settingHeaderButton}>
                Settings
              </Text>
            </TouchableOpacity>
          ),
        }}
      />

      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          headerTitleAlign: 'center',
        }}
      />
    </Stack.Navigator>
  )
}

export default function App() {
  return (
    <NavigationContainer>
      <Stackmanager />
      <StatusBar style="auto" />
    </NavigationContainer>

  );
}

