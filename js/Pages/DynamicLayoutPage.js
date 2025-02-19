import React, { useState, useEffect } from 'react';
import { View, Text, Button,Image,TextInput, StyleSheet } from 'react-native';
import jsonData from '/Users/anushkap/SpeechRecognitionProject/js/data/sample.json';
import { speak, initTTS } from '../utils/ttsUtils';  
import { startSpeechRecognition, initializeSpeechRecognizer } from '../utils/speechUtils'; 

const steps = jsonData.steps;
const DynamicLayoutPage = () => {
    const [currentStep, setCurrentStep] = useState(steps[0]?.step_num || '');
    const [inputValues, setInputValues] = useState({});
    const [recognizedText, setRecognizedText] = useState('');
    const [speakText,setspeakText] = useState('');

  useEffect(() => {
      const currentStepData = steps.find(step => step.step_num === currentStep);
      if (currentStepData) {
          setspeakText(currentStepData.step_label);
      }
  }, [currentStep]);

  useEffect(() => {
      if (speakText) {
          speak(speakText) 
              .then(() => {
                  startSpeechRecognition()
                     .then(result) (()=>{
                         console.log("text is"+result);
                   })
                   
              })
              .catch((error) => console.error('Error speaking:', error));
      }
  }, [speakText]);
    
 const handleInputChange = (text, step_num) => {
        setInputValues({ ...inputValues, [step_num]: text });
        if (text.trim() !== '') {
            const currentStepData = steps.find(steps => steps.step_num === step_num);
            if (currentStepData) {
              setCurrentStep(currentStepData.next_step);
          }
        }
    };

    const renderTextboxes = () => {
        const currentStepData = steps.find(step => step.step_num === currentStep);
        if (!currentStepData) return null;

        return (
            <View key={currentStepData.step_num} style={styles.inputContainer}>
                <Text style={styles.label}>{currentStepData.step_label}</Text>
                <TextInput
                    style={styles.textInput}
                    onChangeText={(text) => handleInputChange(text, currentStepData.step_num)}
                    value={inputValues[currentStepData.step_num]}
                    placeholder={`Enter ${currentStepData.step_label}`}
                />
                 <Image source={require('/Users/anushkap/SpeechRecognitionProject/js/assets/mic.jpeg')} style={styles.image} />

            </View>
        );
    };

    return (
        <View style={styles.container}>
            {renderTextboxes()}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    inputContainer: {
        width: '100%',
        marginBottom: 20,
    },
    label: {
        fontSize: 18,
        marginBottom: 8,
    },
    textInput: {
        width: '100%',
        height: 40,
        borderColor: '#000',
        borderWidth: 1,
        paddingHorizontal: 8,
        marginBottom: 20,
    },
    image: {
        width: 100,
        height: 100,
        marginBottom: 20,
        marginLeft:100,
    },
});

export default DynamicLayoutPage;
