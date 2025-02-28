import {Alert, NativeModules} from 'react-native';
const {TextToSpeechRecognitionModule} = NativeModules;

export const initTTS = () => {
    TextToSpeechRecognitionModule.initTTS(
      (successMessage) => {
        console.log('Success:', successMessage);
        Alert.alert('Success', successMessage);
      },
      (errorMessage) => {
        console.error('Error:', errorMessage);
        Alert.alert('Error', errorMessage);
      }
    );
  };

export const speak = (text) => {
    TextToSpeechRecognitionModule.speak(text,
      (successMessage) => {
        console.log('Success:', successMessage);
        Alert.alert('Success', successMessage);
      },
      (errorMessage) => {
        console.error('Error:', errorMessage);
        Alert.alert('Error', errorMessage);
      }
    );
  };
