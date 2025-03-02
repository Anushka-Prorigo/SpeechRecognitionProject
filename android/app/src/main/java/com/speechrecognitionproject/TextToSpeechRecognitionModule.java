package com.speechrecognitionproject;
import android.os.Handler;
import android.os.Looper;
import android.util.Log;
import androidx.annotation.NonNull;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;
import com.speechrecognitionproject.voice.ITextToSpeechListener;
import com.speechrecognitionproject.voice.NativeTextToVoiceRecognizer;

public class TextToSpeechRecognitionModule extends ReactContextBaseJavaModule {
    private static final String TAG = "TTSModule";
    private final NativeTextToVoiceRecognizer nativeTextToVoiceRecognizer;
    private Callback engineReadyCallback;
    private Callback engineNotReadyCallback;
    private boolean isTTSReady = false;
    private Callback ttsCallback;

    private final ITextToSpeechListener listener = new ITextToSpeechListener() {
        @Override
        public void onFinishedSpeaking(@NonNull String speakText) {
            Log.d(TAG, "onFinishedSpeaking: " + speakText);
            if (ttsCallback != null) {
                ttsCallback.invoke(null, "Completed: " + speakText);
                ttsCallback = null;
            }
        }

        @Override
        public void onReceiveError(@NonNull Error error) {
            Log.e(TAG, "onReceiveError: " + error.getMessage());
            if (engineNotReadyCallback != null) {
                engineNotReadyCallback.invoke(error.getMessage(), null);
            }
        }

        @Override
public void onTTSEngineReady() {
    new Handler(Looper.getMainLooper()).post(() -> {
        isTTSReady = true;
        Log.d("TTSModule", "✅ TTS Engine is ready");
        if (engineReadyCallback != null) {
            engineReadyCallback.invoke(null, "TTS Engine is successfully initialized.");
        }
    });
}

    };

    public TextToSpeechRecognitionModule(ReactApplicationContext context) {
        super(context);
        nativeTextToVoiceRecognizer = new NativeTextToVoiceRecognizer(context);
        nativeTextToVoiceRecognizer.addListener(listener);
    }

    @NonNull
    @Override
    public String getName() {
        return "TextToSpeechRecognitionModule";
    }

    @ReactMethod
    public void initTTS(Callback successCallback, Callback errorCallback) {
        Log.d(TAG, "Initializing TTS Engine...");
        this.engineReadyCallback = successCallback;
        this.engineNotReadyCallback = errorCallback;
        nativeTextToVoiceRecognizer.startEngine();
    }

    @ReactMethod
public void speak(String speakText, Callback successCallback, Callback errorCallback) {
    if (!isTTSReady) {
        Log.e("TTSModule", "❌ TTS Engine is not ready");
        errorCallback.invoke("TTS Engine is not ready", null);
        return;
    }

    Log.d("TTSModule", "🔊 Speaking: " + speakText);
    this.ttsCallback = successCallback;

    try {
        if (nativeTextToVoiceRecognizer != null) {
            Log.d("TTSModule", "✅ Sending text to TTS Engine: " + speakText);
            nativeTextToVoiceRecognizer.speak(speakText);
        } else {
            Log.e("TTSModule", "❌ nativeTextToVoiceRecognizer is NULL!");
            errorCallback.invoke("TTS Engine is not initialized properly", null);
        }
    } catch (Exception e) {
        Log.e("TTSModule", "❌ Error while speaking: " + e.getMessage());
        errorCallback.invoke("Error while speaking: " + e.getMessage(), null);
    }
}

    }
    

