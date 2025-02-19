import React, { useState, useEffect } from 'react';
import { View, Text, Button,Image,TextInput, StyleSheet } from 'react-native';
import jsonData from '/Users/anushkap/SpeechRecognitionProject/js/data/sample.json';
import { NativeModules } from 'react-native';
const {TextToSpeechRecognitionModule} = NativeModules;
const {SpeechToTextRecognitionModule} = NativeModules;

const steps = jsonData.steps;
const DynamicLayoutPage = () => {
    const [currentStep, setCurrentStep] = useState(steps[0]?.step_num || '');
    const [inputValues, setInputValues] = useState({});
    const [isTTSReady, setIsTTSReady] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isTTSComplete,setTTSComplete] = useState(false);
    const [recognizedText, setRecognizedText] = useState('');
    const [speakText,setspeakText] = useState('');
    
      useEffect(() => {
        setIsLoaded(true);
    }, []);
    
    useEffect(() => {
        const currentStepData = steps.find(step => step.step_num === currentStep);
        if (currentStepData) {
          setspeakText(currentStepData.step_label);  
        }
        else {
          console.error('currentStepData not found for step_id:', currentStep);  // Debugging step
      }
    }, [currentStep]);
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
            //const speakText = "hello";
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
      
     const startSpeechRecognition = () => {
        
        SpeechToTextRecognitionModule.startSpeechRecognition((error, result) => {
          if (error) {
            console.log('Not Recognized Text:', error);
            return;
          }
         console.log(result);
          if (result) {
            console.log('recognized text is:',result);
            setspeakText(result);
            TextToSpeechRecognitionModule.speak(speakText ,(error,result)=> {
              if (error) {
                console.error('Speech failed:', error);
              } else {
                console.log('Speech result:', result);
                setTTSComplete(true);
              }
            }
        );
            };
        });
      };

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
