import React, {  useEffect } from 'react';
import { View, Text, Image, Button, StyleSheet } from 'react-native';
import { speak, initTTS } from '../utils/ttsUtils';  
import { startSpeechRecognition} from '../utils/speechUtils'; 
import styles from '../styles/HomePageStyle';

const HomePage = ({ navigation }) => {
  useEffect(() => {
    initTTS()
          .then(() => {
             return speak("Say Start or Tap to Start Recognition");  
         })
           .then((result) => {
              console.log('Result from speak:', result); 
               return startSpeechRecognition(); 
          })
            .then((speechResult) => {
             console.log('Recognized text is:', speechResult); 
             if (speechResult.toLowerCase().includes('start')) {
                    navigation.navigate('DynamicLayoutPage');
             }
          })
        .catch((error) => console.error('Error initializing TTS:', error));
}, []);

return (
        <View style={styles.container}>
            <Text style={styles.text}>Say Start or Tap to Start Recognition</Text>
            <Image source={require('/Users/anushkap/SpeechRecognitionProject/js/assets/mic.jpeg')} style={styles.image} />
            <Button title="start" onPress={() => navigation.navigate('DynamicLayoutPage')} />
        </View>
    );
};

export default HomePage;
