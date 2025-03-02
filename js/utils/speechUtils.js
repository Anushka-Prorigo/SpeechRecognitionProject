import { Alert, NativeModules } from 'react-native';
const {SpeechToTextRecognitionModule} = NativeModules;

export const initializeSpeechRecognizer = () => {
    SpeechToTextRecognitionModule.initializeSpeechRecognizer(
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

export const startSpeechRecognition = (onSuccess, onError) => {
    SpeechToTextRecognitionModule.startSpeechRecognition(
        (recognizedText) => {
            console.log('✅ Received Recognized Text:', recognizedText);

            if (recognizedText && typeof recognizedText === 'string') {
                if (onSuccess) onSuccess(recognizedText);
            } else {
                console.warn('⚠️ Received empty recognition result.');
                if (onError) onError('Speech recognition returned empty result.');
            }
        },
        (errorMessage) => {
            console.error('❌ Speech Recognition Error:', errorMessage);
            if (onError) onError(errorMessage);
        }
    );
};


