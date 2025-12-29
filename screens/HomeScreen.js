import { useRef, useEffect } from 'react';
import { View } from 'react-native';
import { WebView } from 'react-native-webview';
import { getSecure } from '../utils/overrides';
import SmsListener from 'react-native-android-sms-listener'
import { styles } from '../StyleSheet';

export default function HomeScreen() {
  const webViewRef = useRef(null);
  const htmlElements = {
    loginForm: 'phoneNumberPinLoginForm',
    uName: "msisdnInput",
    pin: "pinInput",
    verificationForm: 'verifyAccountForm',
    dropDownContainer: 'maskedChannelList',
    dropDownConfirm: 'deliveryMethodInput',
    securityCode: 'securityCodeInput'
  };

  const handleLoginPage = async () => {
    try {
      // Get phone number and pin from SecureStore and inject into webview
      const phoneNumber = await getSecure('phoneNumber');
      const pin = await getSecure('pin');

      if (phoneNumber && pin && webViewRef.current) {
        setTimeout(() => {
          const script = `
          function reactSetValue(input, value) {
            const setter = Object.getOwnPropertyDescriptor(
              HTMLInputElement.prototype,
              "value"
            ).set;
            setter.call(input, value);
            input.dispatchEvent(new Event("input", { bubbles: true }));
          }
          reactSetValue(document.getElementById("${htmlElements.uName}"), "${phoneNumber}");
          reactSetValue(document.getElementById("${htmlElements.pin}"), "${pin}");

          const form = document.querySelector(
            'form[data-testid="${htmlElements.loginForm}"]'
          );

          form.requestSubmit();

          `;

          webViewRef.current.injectJavaScript(script);
        }, 1000); // Wait 1 second for page to load
      }
      else {
        console.log('Phone number or PIN not found in SecureStore');
      }
    } catch (error) {
      console.error('Error in handleWebPage:', error);
    }
  };

  const handleVerificationPage = async () => {
    try {

      const phoneNumber = await getSecure('phoneNumber');
      if (phoneNumber && webViewRef.current) {
        setTimeout(() => {
          const script = `
   try {
    function reactSetSelectValue(select, value) {
      const setter = Object.getOwnPropertyDescriptor(
        HTMLSelectElement.prototype,
        "value"
      ).set;
      setter.call(select, value);
      
      // Dispatch both input and change for safety
      select.dispatchEvent(new Event("input", { bubbles: true }));
      select.dispatchEvent(new Event("change", { bubbles: true }));
      
      // Sometimes React requires focus/blur
      select.focus();
      select.blur();
    }

    const select = document.getElementById("${htmlElements.dropDownContainer}");
    if(!select) throw new Error("Select element not found");

    // List options for debug
    const options = [...select.options].map(o => ({
      value: o.value,
      label: o.text,
      disabled: o.disabled
    }));
    console.table(options);

    // Match last 2 digits
    const lastTwo = "${phoneNumber.slice(-2)}"; // replace dynamically as needed
    const match = options.find(o => o.value.endsWith(lastTwo) && !o.disabled);
    if(!match) throw new Error("No matching option for last 2 digits");

    // React-safe selection
    reactSetSelectValue(select, match.value);

    reactSetValue(document.getElementById("${htmlElements.dropDownConfirm}"), "${phoneNumber}");

    // Enable and submit form
    const form = select.closest("form");
    if(form) form.requestSubmit();
  } catch(e) {
    console.error(e);
  }
`;


          webViewRef.current.injectJavaScript(script);
        }, 1000); // Wait 1 second for page to load
      }
    } catch (error) {
      console.error('Error in handleVerificationPage:', error);
    }
  };

  const injectSecurityCode = (securityCode) => {
    if (webViewRef.current) {
      setTimeout(() => {
        const script = `
          function reactSetValue(input, value) {
            const setter = Object.getOwnPropertyDescriptor(
              HTMLInputElement.prototype,
              "value"
            ).set;
            setter.call(input, value);
            input.dispatchEvent(new Event("input", { bubbles: true }));
          }
          reactSetValue(document.getElementById("${htmlElements.securityCode}"), "${securityCode}");

          const form = document
            .getElementById("${htmlElements.securityCode}")
            .closest("form");

          form.requestSubmit();
        `;
        webViewRef.current.injectJavaScript(script);
      }, 500);
    }
  };

  const handleSecurityCodePage = async () => {
    try {
      console.log('Starting SMS listener for verification codes...');
      
      // Remove any existing listeners first
      try {
        SmsListener.removeListener();
      } catch (e) {
        console.log('No existing listener to remove');
      }
      
      // Set up new SMS listener
      const subscription = SmsListener.addListener(message => {
        console.log('RAW SMS RECEIVED:');
        console.log('From:', message.originatingAddress);
        console.log('Body:', message.body);
        console.log('Timestamp:', message.timestamp);
        
        // Check if message contains Freedom Mobile indicators
        const messageBody = message.body.toLowerCase();
        const sender = message.originatingAddress.toLowerCase();
        
        const isFreedomSms = 
          sender.includes('freedom') || 
          messageBody.includes('freedom') || 
          messageBody.includes('verification') ||
          messageBody.includes('enter') ||
          messageBody.includes('code');
        
        console.log('Is Freedom SMS:', isFreedomSms);
        
        if (isFreedomSms) {
          // Try multiple patterns to extract the code
          const patterns = [
            /enter (\d{6})/i,
            /code[:\s]*(\d{6})/i,
            /verification[:\s]*(\d{6})/i,
            /(\d{6})/g  // Any 6 digits as fallback
          ];
          
          let verificationCode = null;
          
          for (let i = 0; i < patterns.length; i++) {
            const match = message.body.match(patterns[i]);
            if (match) {
              verificationCode = match[1];
              console.log(`Code found with pattern ${i + 1}:`, verificationCode);
              break;
            }
          }
          
          if (verificationCode && verificationCode.length === 6) {
            console.log('Extracted verification code:', verificationCode);
            
            // Inject the code into the webpage
            injectSecurityCode(verificationCode);
            
            // Remove the listener after successful extraction
            subscription.remove();
            console.log('SMS listener removed after successful code extraction');
          } else {
            console.log('Could not extract 6-digit code from SMS:', message.body);
          }
        } else {
          console.log('SMS not from Freedom Mobile, ignoring');
        }
      });
      
      console.log('SMS listener is now active and waiting for messages...');
      
    } catch (error) {
      console.error('Error setting up SMS listener:', error);
    }
  };

  useEffect(() => {
    return () => {
      // Clean up SMS listener when component unmounts
      try {
        SmsListener.removeListener();
        console.log('SMS listener cleaned up on component unmount');
      } catch (error) {
        console.log('No SMS listener to clean up');
      }
    };
  }, []);

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        source={{ uri: 'https://login.freedommobile.ca' }}
        style={styles.webView}
        onLoadEnd={() => {
          handleLoginPage();
          console.log('Webpage loaded');
        }}
        onNavigationStateChange={(navState) => {
          console.log('URL changed to:', navState.url);
          console.log('Loading:', navState.loading);
          
          // You can add your logic here based on the URL
          if (navState.url.includes('account-verification') && !navState.loading) {
            console.log('Handling verification page...');
            handleVerificationPage();
          }
          if (navState.url.includes('authenticate-code') && !navState.loading) {
            console.log('Handling security code page...');
            handleSecurityCodePage();
          }
        }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        javaScriptCanOpenWindowsAutomatically={true}
      />
    </View>
  );
}
