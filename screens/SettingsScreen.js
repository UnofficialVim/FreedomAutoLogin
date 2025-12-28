import { Text, View, TextInput, Pressable, Alert } from 'react-native';
import { useEffect, useState } from 'react';
import { getSecure, setSecure } from '../utils/overrides';
import { styles } from '../StyleSheet';
import { isSMSPermissionGranted, requestReadSMSPermission } from '../utils/permissions';


export default function SettingsScreen() {
  const [numberValue, setNumberValue] = useState('');
  const [pinValue, setPinValue] = useState('');
  const [skipEntry, setSkipEntry] = useState(false);

    useEffect(() => {
        // Fetch the stored values from SecureStore when the component mounts
        loadStoredData();
    }, []);

    const handleNumberChange = (text) => {
        setNumberValue(text);
    };

    const handlePinChange = (text) => {
        setPinValue(text);
    };

    const loadStoredData = async () => {
        try {
            const storedNumber = await getSecure('phoneNumber');
            const storedPin = await getSecure('pin');
            const skipEntry = await getSecure('skipEntryPage');

            if (storedNumber) setNumberValue(storedNumber);
            if (storedPin) setPinValue(storedPin);
            if (skipEntry) setSkipEntry(skipEntry);
        } catch (error) {
            console.error('Error loading data:', error);
            Alert.alert('Error', 'Failed to load saved data. Recommended to reinstall the app.');
        }
    };

    function handleSavePress() {
        // Handle save button press
        saveData();
    }

    const saveData = async () => {
        try {
            // Save the numberValue and pinValue to SecureStore
            await setSecure('phoneNumber', numberValue);
            await setSecure('pin', pinValue);
            await setSecure('skipEntryPage', skipEntry);

            Alert.alert('Success', 'Data saved successfully!');
            return true;
        } catch (error) {
            console.error('Error saving data:', error);
            Alert.alert('Error', 'Failed to save data.');
            return false;
        }
    };

  return (
    <View style={styles.SettingsScreen.container}>
      <Text style={styles.SettingsScreen.title}>Phone#</Text>
        <TextInput 
        style={styles.SettingsScreen.input} 
        keyboardType='number-pad'
        maxLength={10}
        onChangeText={handleNumberChange}
        value={numberValue} 
        />

      <Text style={styles.SettingsScreen.title}>Pin</Text>
        <TextInput 
        style={styles.SettingsScreen.input} 
        keyboardType='number-pad'
        maxLength={6}
        onChangeText={handlePinChange}
        value={pinValue} 
        />

        <Pressable
          onPress={() => setSkipEntry(!skipEntry)}
          style={skipEntry ? styles.SettingsScreen.toggleSwitch.true : styles.SettingsScreen.toggleSwitch.false}>
            <Text style={styles.SettingsScreen.toggleSwitch.text}>Skip Entry Page</Text>
          </Pressable>

        <Pressable 
        style={({ pressed }) => [
          styles.SettingsScreen.saveButton,
          pressed && styles.SettingsScreen.saveButtonPressed
        ]}
        onPress={handleSavePress}>
          <Text style={styles.SettingsScreen.saveButtonText}>Save</Text>
        </Pressable>

        <Pressable 
        style={({ pressed }) => [
          styles.SettingsScreen.saveButton,
          pressed && styles.SettingsScreen.saveButtonPressed
        ]}
        onPress={requestReadSMSPermission}>
          <Text style={styles.SettingsScreen.saveButtonText}>Change SMS Permission</Text>
        </Pressable>

          <Text style={styles.SettingsScreen.permissionStatus}>Current SMS Permission Status: {isSMSPermissionGranted().then((granted) => granted ? "Granted" : "Denied")}</Text>
    </View>
  );
}
