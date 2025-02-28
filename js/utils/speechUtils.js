import { Alert, NativeModules } from 'react-native';
const {SpeechToTextRecognitionModule} = NativeModules;

export const initializeSpeechRecognizer = () => {
  SpeechToTextRecognitionModule.initTTS(
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

export const startSpeechRecognition = () => {
  SpeechToTextRecognitionModule.speak(
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






