import React, { useState, useEffect } from 'react';
import { View, Text, Button,Image,TextInput, StyleSheet } from 'react-native';
import jsonData from '/Users/anushkap/SpeechRecognitionProject/js/data/sample.json';
import { speak, initTTS } from '../utils/ttsUtils';  
import { startSpeechRecognition, initializeSpeechRecognizer } from '../utils/speechUtils'; 
import HomePage from './HomePage';

const steps = jsonData.steps;
const DynamicLayoutPage = ({navigation}) => {
    const [currentStep, setCurrentStep] = useState(steps[0]?.step_num || '');
    const [inputValues, setInputValues] = useState({});
    const [speakText,setspeakText] = useState('');
    const [showSummary,setShowSummary] = useState('');
    const [speechResult,setspeechResult] = useState('');

useEffect(() => {
    console.log(`Current Step: ${currentStep}`);
    const currentStepData = steps.find(step => step.step_num === currentStep);
    if (currentStepData) {
        setspeakText(currentStepData.step_label);
        runTTSAndSpeechRecognition( currentStepData.step_label);
    } else {
        console.error(`Step data for step number ${currentStep} not found.`);
    }
}, [currentStep]);


const runTTSAndSpeechRecognition = (speakText) => {
    initTTS()
        .then(() => {
            return speak(speakText); 
        })
        .then(() => {
            return startSpeechRecognition()
                .then((speechResult) => {
                    console.log('Recognized text:', speechResult);
                    setspeechResult(speechResult);
                    if (!speechResult.toLowerCase().includes('yes') && !speechResult.toLowerCase().includes('no')) { 
                            return runTTSAndSpeechRecognition("confirm"+speechResult);
                     }
                    else if (speechResult.toLowerCase().includes('yes')) {
                            handleInputChange(speechResult, currentStep);
                    } 
                     else if (speechResult.toLowerCase().includes('no')) {
                           startSpeechRecognition();
                    }
                    else {
                            console.log("result not found");
                    }
                });
        })
     .catch((error) => console.error('Error with TTS or speech recognition:', error));
};

    
const handleInputChange = (text, step_num) => {
    setspeechResult('');
    setInputValues(prevValues => ({
        ...prevValues,
        [currentStep]: text
    }));
    console.log("handleInputChange","");
    if (text.trim() !== '') {
        const currentStepData = steps.find(step => step.step_num === step_num);
        if (currentStepData) {
            console.log(`Moving to next step: ${currentStepData.next_step}`);
            if (currentStepData.next_step) {
                setCurrentStep(currentStepData.next_step);
            } else {
                setShowSummary(true);
            }
        } else {
            console.warn('currentStepData or next_step is undefined');
        }
    } else {
        console.warn('Text is empty after trimming');
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

    const renderSummary = () => {
        return (
            <View style={styles.summaryContainer}>
                <Text style={styles.summaryTitle}>Entered Values Are:</Text>
                {Object.keys(inputValues).map(step_num => {
                    const step = steps.find(s => s.step_num === parseInt(step_num));
                    if (step) {
                        return (
                            <View key={step.step_num} style={styles.summaryItem}>
                                <Text style={styles.summaryLabel}>{step.step_label}: </Text>
                                <Text style={styles.summaryValue}>{inputValues[step_num]}</Text>
                            </View>
                        );
                    }
                    return null;
                })}
                <Button title="Back to Start" onPress={() => navigation.navigate('HomePage')} />
            </View>
        );
    };
    return (
        <View style={styles.container}>
            {speechResult && (
                <View style={styles.speechResultContainer}>
                    <Text style={styles.speechResultText}>You Entered : {speechResult}</Text>
                </View>
            )}
            {!showSummary ? (
                <>
                    {renderTextboxes()}
                    {currentStep === null && (
                        <Button title="Show Summary" onPress={() => setShowSummary(true)} />
                    )}
                </>
            ) : (
                renderSummary()
            )}
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
        marginBottom: 100,
        marginLeft: 200,
    },
    speechResultContainer: {
        marginTop: 20,
        padding: 10,
        backgroundColor: '#d3d3d3',
        borderRadius: 5,
    },
    speechResultText: {
        fontSize: 16,
        fontStyle: 'italic',
    },
});

export default DynamicLayoutPage;
