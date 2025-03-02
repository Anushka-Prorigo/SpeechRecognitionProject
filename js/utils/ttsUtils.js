import { NativeModules } from 'react-native';
const { TextToSpeechRecognitionModule } = NativeModules;

export const initTTS = (onSuccess, onError) => {
    console.log('🔵 initTTS() called'); // <-- Debug log
    if (!TextToSpeechRecognitionModule) {
    console.error('❌ TTS Module is NULL!');
    onError('TTS Module is not available');
    return;
    }

    TextToSpeechRecognitionModule.initTTS(
      (success) => {
        console.log('✅ TTS Initialized:', success);
        onSuccess();
      },
      (error) => {
        console.error('❌ Error initializing TTS:', error);
        onError(error);
      }
    );
};


export const speak = (text, onSuccess, onError) => {
    console.log('🟢 Calling TextToSpeechRecognitionModule.speak() with:', text);

    if (!TextToSpeechRecognitionModule || !TextToSpeechRecognitionModule.speak) {
        console.error("❌ 'speak' method is missing in Native Module");
        onError && onError("TTS Engine is not available");
        return;
    }

    TextToSpeechRecognitionModule.speak(
        text,
        (successMessage) => {
            console.log("✅ TTS Success:", successMessage);
            onSuccess && onSuccess(successMessage); // Call the success callback
        },
        (errorMessage) => {
            console.error("❌ TTS Error:", errorMessage);
            onError && onError(errorMessage);
        }
    );
};

