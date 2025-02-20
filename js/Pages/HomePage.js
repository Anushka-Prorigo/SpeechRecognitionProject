import React, { useState, useEffect } from 'react';
import { View, Text, Image, Button, StyleSheet } from 'react-native';
import { speak, initTTS } from '../utils/ttsUtils';  
import { startSpeechRecognition} from '../utils/speechUtils'; 

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
