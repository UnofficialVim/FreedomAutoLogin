import { useRef, useEffect } from 'react';
import { View } from 'react-native';
import { WebView } from 'react-native-webview';
import { getSecure } from '../utils/overrides';
import SmsListener from 'react-native-android-sms-listener'
import { styles } from '../StyleSheet';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppContext } from '../utils/appContext';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const webViewRef = useRef(null);
  const { doWebViewReload, setDoWebViewReload } = useAppContext();
  const navigation = useNavigation();
  const htmlElements = {
    loginForm: 'phoneNumberPinLoginForm',
    uName: "msisdnInput",
    pin: "pinInput",
    verificationForm: 'verifyAccountForm',
    dropDownContainer: 'maskedChannelList',
    dropDownConfirm: 'deliveryMethodInput',
    securityCode: 'securityCodeInput'
  };

  useEffect(() => {
    if (doWebViewReload && webViewRef.current) {
      console.log("Reloading WebView because of settings changed");
      webViewRef.current.reload();
      setDoWebViewReload(false);
    }
  }, [doWebViewReload]);

  const handleLoginPage = async () => {
    try {
      // Get phone number and pin from SecureStore and inject into webview
      const phoneNumber = await getSecure('phoneNumber');
      const pin = await getSecure('pin');

      if (phoneNumber && pin && webViewRef.current) {
        const script = `
          function waitForElements(callback, maxAttempts = 20) {
            let attempts = 0;

            function check() {
              attempts++;
              const usernameInput = document.getElementById("${htmlElements.uName}");
              const pinInput = document.getElementById("${htmlElements.pin}");
              const form = document.querySelector('form[data-testid="${htmlElements.loginForm}"]');

              if (usernameInput && pinInput && form) {
                callback(usernameInput, pinInput, form);
              } else if (attempts < maxAttempts) {
                setTimeout(check, 200);
              } else {
                console.error('Login elements not found after maximum attempts');
              }
            }

            check();
          }

        function reactSetValue(input, value) {
          const setter = Object.getOwnPropertyDescriptor(
            HTMLInputElement.prototype,
            "value"
          ).set;
          setter.call(input, value);
          input.dispatchEvent(new Event("input", { bubbles: true }));
        }

        waitForElements((usernameInput, pinInput, form) => {
          reactSetValue(usernameInput, "${phoneNumber}");
          reactSetValue(pinInput, "${pin}");
          form.requestSubmit();
        });
        `;
        webViewRef.current.injectJavaScript(script);
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
      // Get phone number from SecureStore and match last 2 digits to dropdown
      const phoneNumber = await getSecure('phoneNumber');
      if (phoneNumber && webViewRef.current) {
        const script = `
          function waitForElements(maxAttempts = 20) {
            let attempts = 0;

            function check() {
              attempts++;
              const dropdown = document.getElementById("${htmlElements.dropDownContainer}");

              if (dropdown) {
                inject();
              } else if (attempts < maxAttempts) {
                setTimeout(check, 200);
              } else {
                console.error('Login elements not found after maximum attempts');
              }
            }

            check();
          }

        function inject() {
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
            if (!select) throw new Error("Select element not found");

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
            if (!match) throw new Error("No matching option for last 2 digits");

            // React-safe selection
            reactSetSelectValue(select, match.value);

            reactSetValue(document.getElementById("${htmlElements.dropDownConfirm}"), "${phoneNumber}");

            // Enable and submit form
            const form = select.closest("form");
            if (form) form.requestSubmit();
          } catch (e) {
            console.error(e);
          }
        }

        waitForElements();
        `;
        webViewRef.current.injectJavaScript(script);
      }
    } catch (error) {
      console.error('Error in handleVerificationPage:', error);
    }
  };

  const handleSecurityCodePage = async () => {
    console.log('Creating SMS Listener');
    let subscription = SmsListener.addListener(message => {
      try {
        let otpRegex = /Enter\s+(\d{6})\s+to\s+login|(?=.*\bfreedom\b).*?\b(\d{6})\b/i;
        let otp = message.body.match(otpRegex);
        if (otp) {
          console.log('OTP received:', otp[0]);
          console.log(otp[1] || otp[2]);
          const securityCode = otp[1] || otp[2];
          injectSecurityCode(securityCode);
          subscription.remove();
        } else {
          console.log('No OTP found in the message body.');
        }
      } catch (error) {
        console.error('Error processing SMS message:', error);
        console.error('Removing SMS listener due to error.');
        subscription.remove();
      }
    });
  };

  const injectSecurityCode = (securityCode) => {
    if (webViewRef.current) {
      console.log('About to inject JavaScript...');

      const script = `
        window.ReactNativeWebView.postMessage('Script executing - checking for security input...');
        function reactSetValue(input, value) {
          const setter = Object.getOwnPropertyDescriptor(
            HTMLInputElement.prototype,
            "value"
          ).set;
          setter.call(input, value);
          input.dispatchEvent(new Event("input", { bubbles: true }));
        }

        const securityInput = document.getElementById("securityCodeInput");
        window.ReactNativeWebView.postMessage('Security input found: ' + !!securityInput);
        if (securityInput) {
          window.ReactNativeWebView.postMessage('Setting value to: ${securityCode}');
          reactSetValue(securityInput, "${securityCode}");
          window.ReactNativeWebView.postMessage('Value set, current value: ' + securityInput.value);

          const form = securityInput.closest("form");
          window.ReactNativeWebView.postMessage('Form found: ' + !!form);
          if (form) {
            form.requestSubmit();
            window.ReactNativeWebView.postMessage('Form submitted');
          }
        }
      `;
      webViewRef.current.injectJavaScript(script);
      console.log('JavaScript injection called');
    } else {
      console.log('WebView ref is null - cannot inject');
    }
  };

  const handleSignOut = () => {
    console.log('Sign out detected, reloading WebView to login page.');
    if (webViewRef.current) {
      webViewRef.current.reload();
    }
    navigation.navigate('Settings');
  };

  return (
    <LinearGradient
      colors={['#EC7F23', '#673AB7']}
      start={{ x: 0.15, y: 0.0 }}
      end={{ x: 0.85, y: 1.0 }}
      style={{ flex: 1 }}
    >
      <View style={styles.container}>
        <WebView
          ref={webViewRef}
          source={{ uri: 'https://login.freedommobile.ca' }}
          style={styles.webView}
          onLoadEnd={() => {
            console.log('Webpage loaded');
            handleLoginPage();
          }}
          onMessage={(event) => {
            const message = event.nativeEvent.data;
            console.log('WebView Message:', message);
          }}
          onNavigationStateChange={(navState) => {
            console.log('URL changed to:', navState.url);
            console.log('Loading:', navState.loading);

            if (navState.url.includes('signout') && !navState.loading) {
              console.log('Handling sign out...');
              handleSignOut();
            }
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
    </LinearGradient>
  );
}
