import { NativeModules } from 'react-native';
const {TextToSpeechRecognitionModule} = NativeModules;

export const initTTS = () => {
    return new Promise((resolve, reject) => {
        if (TextToSpeechRecognitionModule && TextToSpeechRecognitionModule.initTTS) {
            TextToSpeechRecognitionModule.initTTS((error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            });
        } else {
            reject(new Error('MyTTSModule.initTTS is undefined'));
        }
    });
};


export const speak = (text) => {
    return new Promise((resolve, reject) => {
        if (TextToSpeechRecognitionModule && TextToSpeechRecognitionModule.speak) {
            TextToSpeechRecognitionModule.speak(text,(error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            });
        } else {
            reject(new Error('TextToSpeechRecognitionModule is undefined'));
        }
    });
};

