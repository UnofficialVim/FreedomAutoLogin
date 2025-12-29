import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TouchableOpacity, Text, } from 'react-native';
import { styles } from './StyleSheet';
import HomeScreen from './screens/HomeScreen';
import SettingsScreen from './screens/SettingsScreen';
import EntryScreen from './screens/EntryScreen';

const Stack = createNativeStackNavigator();

function Stackmanager() {

  const navigation = useNavigation();
  return (
    <Stack.Navigator 
    screenOptions={
      {
        headerStyle: styles.headerStyle,
        animation: 'fade'
      }
    }
    >
      <Stack.Screen
        name="Entry"
        component={EntryScreen}
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

