import { Text, View, TextInput, Pressable, Alert } from 'react-native';
import { useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { styles } from '../StyleSheet';

export default function SettingsScreen() {
  const [numberValue, setNumberValue] = useState('');
  const [pinValue, setPinValue] = useState('');

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
            const storedNumber = await SecureStore.getItemAsync('phoneNumber');
            const storedPin = await SecureStore.getItemAsync('pin');
            
            if (storedNumber) setNumberValue(storedNumber);
            if (storedPin) setPinValue(storedPin);
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
            await SecureStore.setItemAsync('phoneNumber', numberValue);
            await SecureStore.setItemAsync('pin', pinValue);
            
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
        style={({ pressed }) => [
          styles.SettingsScreen.saveButton,
          pressed && styles.SettingsScreen.saveButtonPressed
        ]}
        onPress={handleSavePress}>
          <Text style={styles.SettingsScreen.saveButtonText}>Save</Text>
        </Pressable>
    </View>
  );
}
