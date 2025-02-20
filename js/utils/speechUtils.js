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
    return new Promise((resolve, reject) => {
        if (SpeechToTextRecognitionModule && SpeechToTextRecognitionModule.startSpeechRecognition) {
          SpeechToTextRecognitionModule.startSpeechRecognition((error, result) => {
                if (error) {
                    reject(error);
                } else {
                    console.log('recognized text is:',result);
                    resolve(result);
                }
            });
        } else {
            reject(new Error('TextToSpeechRecognitionModule is undefined'));
        }
    });
};






