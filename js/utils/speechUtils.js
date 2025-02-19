import { NativeModules } from 'react-native';
const {SpeechToTextRecognitionModule} = NativeModules;

export const initializeSpeechRecognizer = () => {
    if (!SpeechToTextRecognitionModule) {
       console.error('SpeechRecognitionModule is not available');
      return;
    };

    SpeechToTextRecognitionModule.initializeSpeechRecognizer((error, result) => {
      if (error) {
        console.log('SpeechToTextRecognition Initialization failed:', error);
        return;
      }
     console.log(result);
      if (result === 'SpeechToTextRecognition Engine is ready') {
        console.log('TTS engine is ready in JavaScript');
        };
    });
  };

  export const startSpeechRecognition = () => {
  SpeechToTextRecognitionModule.startSpeechRecognition((error, result) => {
      if (error) {
        console.log('Not Recognized Text:', error);
        return;
      }
     console.log(result);
      if (result) {
        console.log('recognized text is:',result);
        };
    });
  };





