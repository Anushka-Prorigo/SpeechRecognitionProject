package com.speechrecognitionproject.speech;

import androidx.annotation.Nullable;

public interface ISpeechRecognizer {
    void startRecognition();

    void stopRecognition();

    void setRecognitionListener(@Nullable SpeechRecognitionListener listener);
}
