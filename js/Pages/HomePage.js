import React, { useState, useEffect } from 'react';
import { NativeModules } from 'react-native';
console.log(NativeModules);
import { View, Text, Image, Button, StyleSheet } from 'react-native';

const {TextToSpeechRecognitionModule} = NativeModules;
const {SpeechToTextRecognitionModule} = NativeModules;

const HomePage = ({ navigation }) => {

  const [isTTSReady, setIsTTSReady] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isTTSComplete,setTTSComplete] = useState(false);
  const [recognizedText, setRecognizedText] = useState('');

  useEffect(() => {
    setIsLoaded(true);
}, []);

useEffect(() => {
  if (isLoaded) {
      console.log('Layout has been loaded and displayed');
      initTTS();
     
  }
}, [isLoaded]);

useEffect(() => {
  if (isTTSComplete) {
      console.log('TTS completed');
      startSpeechRecognition();
     
  }
}, [isTTSComplete]);


const initTTS = () => {
    if (!TextToSpeechRecognitionModule) {
       console.error('TextToSpeechRecognitionModule is not available');
      return;
    }

    TextToSpeechRecognitionModule.initTTS((error, result) => {
      if (error) {
        console.log('TTS Initialization failed:', error);
        return;
      }

      console.log(result);
      if (result === 'TTS Engine is ready') {
        setIsTTSReady(true);
        console.log('TTS engine is ready in JavaScript');
        const speakText = "Say start or tap to start recognition";
        TextToSpeechRecognitionModule.speak(speakText ,(error,result)=> {
          if (error) {
            console.error('Speech failed:', error);
          } else {
            console.log('Speech result:', result);
            setTTSComplete(true);

         }
        }
    )};
    });
  };
  
  const initializeSpeechRecognizer = () => {
    if (!SpeechToTextRecognitionModule) {
       console.error('SpeechRecognitionModule is not available');
      return;
    }

    SpeechToTextRecognitionModule.initializeSpeechRecognizer((error, result) => {
      if (error) {
        console.log('SpeechToTextRecognition Initialization failed:', error);
        return;
      }
     console.log(result);
      if (result === 'SpeechToTextRecognition Engine is ready') {
        setIsSpeechToTextRecognitionReady(true);
        console.log('TTS engine is ready in JavaScript');
        };
    });
  };

  const startSpeechRecognition = () => {
    
    SpeechToTextRecognitionModule.startSpeechRecognition((error, result) => {
      if (error) {
        console.log('Not Recognized Text:', error);
        return;
      }
     console.log(result);
      if (result) {
        console.log('recognized text is:',result);
        setRecognizedText(result);
        };
    });
  };

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Say Start or Tap to Start Recognition</Text>
            <Image source={require('/Users/anushkap/SpeechRecognitionProject/js/assets/mic.jpeg')} style={styles.image} />
            <Button title="start" onPress={() => navigation.navigate('DynamicLayoutPage')} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 24,
        marginBottom: 20,
    },
    image: {
        width: 100,
        height: 100,
        marginBottom: 20,
    },
});

export default HomePage;
