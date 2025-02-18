import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import { NativeModules } from 'react-native';
console.log(NativeModules);

const {TextToSpeechRecognitionModule} = NativeModules;
const {SpeechToTextRecognitionModule} = NativeModules;
const App = () => {
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
     <Text style={styles.recognizedText}> {recognizedText}</Text>
      <Text style={styles.text}>Say start or tap to start recognition</Text>
      <Button title="Start" onPress={initTTS} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 20,
    color: '#000',
    marginBottom: 20,
  },
  recognizedText: {
    fontSize: 18,
    marginTop: 16,
    textAlign: 'center',
},
});

export default App;
