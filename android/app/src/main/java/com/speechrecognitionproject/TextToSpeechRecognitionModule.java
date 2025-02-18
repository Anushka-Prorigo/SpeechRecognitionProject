package com.speechrecognitionproject;
import android.os.Handler;
import android.os.Looper;
import android.util.Log;
import androidx.annotation.NonNull;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.speechrecognitionproject.voice.ITextToSpeechListener;
import com.facebook.react.bridge.Callback;
import com.speechrecognitionproject.voice.NativeTextToVoiceRecognizer;
public class TextToSpeechRecognitionModule extends ReactContextBaseJavaModule {
    private NativeTextToVoiceRecognizer nativeTextToVoiceRecognizer;
    private Callback engineReadyCallback;
    private boolean isTTSReady = false;
    private Callback ttsCallback;


    private ITextToSpeechListener listener = new ITextToSpeechListener() {
        @Override
        public void onFinishedSpeaking(@NonNull String speakText) {
            Log.d("Tag","onFinishedSpeaking");
            if (ttsCallback != null) {
            ttsCallback.invoke(null, "complete speaking: " );
            ttsCallback = null;
        }
        }
        @Override
        public void onReceiveError(@NonNull Error error) {
            Log.e("Tag", "Something wen wrong ..");
        }
        @Override
        public void onTTSEngineReady() {
            Handler mainHandler = new Handler(Looper.getMainLooper());
            mainHandler.post(() -> {
                isTTSReady = true;
                if (engineReadyCallback != null) {
                     engineReadyCallback.invoke(null, "TTS Engine is ready");                }
            });
        }
    };
    public TextToSpeechRecognitionModule(ReactApplicationContext context) {
        super(context);
        nativeTextToVoiceRecognizer = new NativeTextToVoiceRecognizer(context);
    }

    @NonNull
    @Override
    public String getName() {
        return "TextToSpeechRecognitionModule";
    }
    @ReactMethod
    public void initTTS(Callback callback) {
        Log.e("Text","inittts called ny react native");
        this.engineReadyCallback = callback;
        nativeTextToVoiceRecognizer.addListener(listener);
        nativeTextToVoiceRecognizer.startEngine();
    }

    @ReactMethod
    public void speak(String speakText, Callback callback) {
       if (!isTTSReady) {
            callback.invoke("TTS Engine is not ready", null);
            return;
        }else{
            this.ttsCallback = callback;
            nativeTextToVoiceRecognizer.speak(speakText);
            
        }
    }

}
