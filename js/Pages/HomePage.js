import React, { useEffect } from 'react';
import { Alert, Button, Image, Text, View } from 'react-native';
import styles from '../styles/HomePageStyle';
import { startSpeechRecognition } from '../utils/speechUtils';
import { initTTS, speak } from '../utils/ttsUtils';

const HomePage = ({ navigation }) => {
  useEffect(() => {
    initTTS(
      () => {
        console.log('TTS Engine initialized successfully');
        speak("Say Start or Tap to Start Recognition",
          (result) => {
            console.log('Result from speak:', result);
            startSpeechRecognition(
              (speechResult) => {
                console.log('Recognized text is:', speechResult);
                if (speechResult.toLowerCase().includes('start')) {
                  navigation.navigate('DynamicLayoutPage');
                }
              },
              (errorMessage) => {
                console.error('Error recognizing speech:', errorMessage);
                Alert.alert('Error', errorMessage);
              }
            );
          },
          (errorMessage) => {
            console.error('Error speaking:', errorMessage);
            Alert.alert('Error', errorMessage);
          }
        );
      },
      (errorMessage) => {
        console.error('Error initializing TTS:', errorMessage);
        Alert.alert('Error', errorMessage);
      }
    );
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Say Start or Tap to Start Recognition</Text>
      <Image source={require('/home/sunbeam/speechRecogniton/SpeechRecognitionProject/js/assets/mic.jpeg')} style={styles.image} />
      <Button title="start" onPress={() => navigation.navigate('DynamicLayoutPage')} />
    </View>
  );
};

export default HomePage;
