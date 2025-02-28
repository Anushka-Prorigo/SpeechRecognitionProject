import React, {useEffect} from 'react';
import {View, Text, Image, Button} from 'react-native';
import {initTTS} from '../utils/ttsUtils';
import styles from '../styles/HomePageStyle';

const HomePage = ({navigation}) => {
  useEffect(() => {
    initTTS();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Say Start or Tap to Start Recognition</Text>
      <Image
        source={require('/Users/anushkap/SpeechRecognitionProject/js/assets/mic.jpeg')}
        style={styles.image}
      />
      <Button
        title="start"
        onPress={() => navigation.navigate('DynamicLayoutPage')}
      />
    </View>
  );
};

export default HomePage;
