import React, { useEffect, useState } from 'react';
import { Button, Image, Text, TextInput, View } from 'react-native';
import styles from '../styles/DynamicPageStyle';
import { startSpeechRecognition } from '../utils/speechUtils';
import { initTTS, speak } from '../utils/ttsUtils';
import jsonData from '/home/sunbeam/speechRecogniton/SpeechRecognitionProject/js/data/sample.json';

const steps = jsonData.steps;
let text = '';

const DynamicLayoutPage = ({navigation}) => {
    const [currentStep, setCurrentStep] = useState(steps[0]?.step_num || '');
    const [inputValues, setInputValues] = useState({});
    const [speakText, setspeakText] = useState('');
    const [showSummary, setShowSummary] = useState(false);
    const [speechResult, setspeechResult] = useState('');
    const [recognizing, setRecognizing] = useState(false);

    useEffect(() => {
        console.log(`Current Step: ${currentStep}`);
        const currentStepData = steps.find(step => step.step_num === currentStep);
        if (currentStepData) {
            setspeakText(currentStepData.step_label);
            runTTSAndSpeechRecognition(currentStepData.step_label);
        } else {
            console.error(`Step data for step number ${currentStep} not found.`);
        }
    }, [currentStep]);

    const runTTSAndSpeechRecognition = (speakText) => {
        initTTS(
            () => {
                speak(speakText, 
                    (result) => {
                        console.log('Result from speak:', result);
                        setRecognizing(true);
                        startSpeechRecognition(
                            (speechResult) => {
                                setRecognizing(false);
                                console.log('Recognized text:', speechResult);
                                setspeechResult(speechResult);
                                if (!speechResult.toLowerCase().includes('yes') && !speechResult.toLowerCase().includes('no')) { 
                                    text = speechResult;
                                    runTTSAndSpeechRecognition("confirm " + speechResult);
                                } else if (speechResult.toLowerCase().includes('yes')) {
                                    handleInputChange(text, currentStep);
                                } else if (speechResult.toLowerCase().includes('no')) {
                                    startSpeechRecognition();
                                } else {
                                    console.log("result not found");
                                }
                            },
                            (errorMessage) => {
                                console.error('Error recognizing speech:', errorMessage);
                                startSpeechRecognition();
                            }
                        );
                    },
                    (errorMessage) => {
                        console.error('Error speaking:', errorMessage);
                    }
                );
            },
            (errorMessage) => {
                console.error('Error initializing TTS:', errorMessage);
            }
        );
    };

    const handleInputChange = (text, step_num) => {
        console.log("text is", text);
        setspeechResult('');
        setInputValues(prevValues => ({
            ...prevValues,
            [currentStep]: text
        }));
        console.log("handleInputChange", "");
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

            {recognizing && (
                <View style={styles.recognizingContainer}>
                    <Image source={require('/home/sunbeam/speechRecogniton/SpeechRecognitionProject/js/assets/listening.gif')} style={styles.image} />
                    <Text style={styles.recognizingText}>Listening...</Text>
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

export default DynamicLayoutPage;
