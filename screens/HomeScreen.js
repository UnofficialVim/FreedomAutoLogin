import React, { useRef } from 'react';
import { Text, View } from 'react-native';
import { WebView } from 'react-native-webview';
import * as SecureStore from 'expo-secure-store';
import { styles } from '../StyleSheet';

export default function HomeScreen() {
  const webViewRef = useRef(null);

  const handleWebPage = async () => {
    try {
      // get phone number and pin from SecureStore and inject into webview
      const phoneNumber = await SecureStore.getItemAsync('phoneNumber');
      const pin = await SecureStore.getItemAsync('pin');

      if (phoneNumber && pin && webViewRef.current) {
        // Wait a bit for the DOM to be fully loaded
        setTimeout(() => {
          const script = `
            (function() {
              try {
                // Wait for elements to be available
                let attempts = 0;
                const maxAttempts = 50;
                
                function fillInputs() {
                  const phoneInput = document.getElementById('msisdnInput');
                  const pinInput = document.getElementById('pinInput');
                  
                  if (phoneInput && pinInput) {
                    const phoneNumber = '${phoneNumber}';
                    const pin = '${pin}';
                    
                      }
          `;
          
          webViewRef.current.injectJavaScript(script);
        }, 1000); // Wait 1 second for page to load
      }
    } catch (error) {
      console.error('Error in handleWebPage:', error);
    }
  };

  return (
    <View style={styles.container}>
      <WebView 
        ref={webViewRef}
        source={{ uri: 'https://login.freedommobile.ca' }} 
        style={styles.webView} 
        onLoadEnd={() => {
          handleWebPage();
          console.log('Webpage loaded');
        }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
      />
    </View>
  );
}
