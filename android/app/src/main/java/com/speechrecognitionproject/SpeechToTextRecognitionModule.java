package com.speechrecognitionproject;

import android.os.Handler;
import android.os.Looper;
import android.util.Log;
import android.content.Intent; 
import androidx.annotation.NonNull;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.speechrecognitionproject.voice.ITextToSpeechListener;
import com.facebook.react.bridge.Callback;
import com.speechrecognitionproject.voice.NativeTextToVoiceRecognizer;
import com.speechrecognitionproject.speech.SpeechRecognitionListener;
import com.speechrecognitionproject.speech.NativeSpeechRecognizer;

public class SpeechToTextRecognitionModule extends ReactContextBaseJavaModule {
    private NativeTextToVoiceRecognizer nativeTextToVoiceRecognizer;
    private Callback speechCallback;
    private Callback speechFailCallback;
    private Callback recognitionCallback;
    private boolean isTTSReady = false;
    String recognizedText = "abc";
    private NativeSpeechRecognizer nativeSpeechRecognizer;
    private Callback engineReadyCallback;
    private Callback engineNotReadyCallback;

    @NonNull
    @Override
    public String getName() {
        return "SpeechToTextRecognitionModule";
    }

    public SpeechToTextRecognitionModule(ReactApplicationContext context) {
        super(context);
        this.nativeSpeechRecognizer = new NativeSpeechRecognizer(context); 
    }

    public void setListener(SpeechRecognitionListener listener) { 
        this.speechRecognitionListener = listener;
    }

    public SpeechRecognitionListener getListener() {
        Log.d("Tag","" + speechRecognitionListener);
        return speechRecognitionListener;
    }

    private ITextToSpeechListener listener = new ITextToSpeechListener() {
        @Override
        public void onFinishedSpeaking(@NonNull String speakText) {
            Log.d("Tag", "onFinishedSpeaking");
        }

        @Override
        public void onReceiveError(@NonNull Error error) {
            Log.e("Tag", "Something went wrong: " + error.getMessage());
        }

        @Override
        public void onTTSEngineReady() {
            Handler mainHandler = new Handler(Looper.getMainLooper());
            mainHandler.post(() -> {
                isTTSReady = true;
                if (engineReadyCallback != null) {
                    engineReadyCallback.invoke(null, "TTS Engine is ready");
                }
            });
        }
    };

    public SpeechRecognitionListener speechRecognitionListener = new SpeechRecognitionListener() {
        @Override
        public void onReceiveSpeechRecognitionResult(@NonNull String speechResult) {
            Log.d("SpeechRecognition", "Speech Result: " + speechResult);
            if (speechResult != null && !speechResult.isEmpty()) {
                String recognizedText = speechResult;
                Log.d("SpeechRecognition", "✅ Recognized Text: " + recognizedText);
        
                // Pass recognized text to React Native
                if (speechCallback != null) {
                    speechCallback.invoke(recognizedText);
                }
            } else {
                Log.w("SpeechRecognition", "⚠️ No speech detected in results.");
                if (speechFailCallback != null) {
                    speechFailCallback.invoke("No speech detected.");
                }
            }
        }
        
        @Override
        public void onReceiveError(@NonNull String error) {
                if(speechFailCallback != null){
                speechFailCallback.invoke(error, null);
                }
            

            Handler mainHandler = new Handler(Looper.getMainLooper());
            mainHandler.post(() -> {
                nativeSpeechRecognizer.stopRecognition();
                nativeSpeechRecognizer.setRecognitionListener(speechRecognitionListener);
                nativeSpeechRecognizer.startRecognition();
            });
        }
    };

    @ReactMethod
    public void initializeSpeechRecognizer(Callback successCallback, Callback errorCallback) {
        this.engineReadyCallback = successCallback;
        this.engineNotReadyCallback = errorCallback;
        ReactApplicationContext context = getReactApplicationContext();
        Intent intent = new Intent(context, MainActivity.class);
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        context.startActivity(intent);
    }

    @ReactMethod
    public void startSpeechRecognition(Callback successCallback, Callback errorCallback) {
        Log.d("SpeechRecognition", "🟢 Java: startSpeechRecognition() called");
        this.speechCallback = successCallback;
        this.speechFailCallback = errorCallback;
    
        Handler mainHandler = new Handler(Looper.getMainLooper());
        mainHandler.post(() -> {
            Log.d("SpeechRecognition", "🔵 Stopping previous recognition...");
            nativeSpeechRecognizer.stopRecognition();
    
            Log.d("SpeechRecognition", "🟠 Setting listener...");
            nativeSpeechRecognizer.setRecognitionListener(speechRecognitionListener);
    
            Log.d("SpeechRecognition", "🟢 Starting new recognition...");
            nativeSpeechRecognizer.startRecognition();
        });
    }
    
}
