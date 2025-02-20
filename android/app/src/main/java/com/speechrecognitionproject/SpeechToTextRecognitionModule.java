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
import android.util.Log;
import com.speechrecognitionproject.voice.NativeTextToVoiceRecognizer;
import com.speechrecognitionproject.speech.SpeechRecognitionListener;
import com.speechrecognitionproject.speech.NativeSpeechRecognizer;

public class SpeechToTextRecognitionModule extends ReactContextBaseJavaModule {
    private NativeTextToVoiceRecognizer nativeTextToVoiceRecognizer;
    private Callback speechCallback;
    private Callback recognitionCallback;
    private boolean isTTSReady = false;
    String recognizedText = "abc";
    private NativeSpeechRecognizer nativeSpeechRecognizer ;

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
        Log.d("Tag","" +speechRecognitionListener);
        return speechRecognitionListener;
    }

    private ITextToSpeechListener listener = new ITextToSpeechListener() {
        @Override
        public void onFinishedSpeaking(@NonNull String speakText) {
            Log.d("Tag","onFinishedSpeaking");
        }
        @Override
        public void onReceiveError(@NonNull Error error) {
            Log.e("Tag", "Something when wrong ..");
        }

        @Override
        public void onTTSEngineReady() {
            Handler mainHandler = new Handler(Looper.getMainLooper());
            mainHandler.post(() -> {
                isTTSReady = true;
                if (speechCallback != null) {
                     speechCallback.invoke(null, "TTS Engine is ready");                }
            });
        }
    };

     public SpeechRecognitionListener speechRecognitionListener = new SpeechRecognitionListener() {
       @Override
        public void onReceiveSpeechRecognitionResult(@NonNull String speechResult) {
             String speechText = speechResult;
             if (speechResult != null) {
                    String recognizedText = speechResult;
                    Log.d("SpeechRecognition", "Entered Text: " + recognizedText);
                    if (speechCallback != null) {
                        Log.d("SpeechRecognition", "Recognized Text: " + recognizedText);

                        speechCallback.invoke(null, " " + recognizedText); 
                       Handler mainHandler = new Handler(Looper.getMainLooper());
                        mainHandler.post(()-> {
                        nativeSpeechRecognizer.stopRecognition();
                    }); 
                        speechCallback = null;
                    }
                } else {
                    if (speechCallback == null) {
                        speechCallback.invoke("No recognition results", null);
                        speechCallback = null;
                    }
                }
            };
          
        
        
        @Override
        public void onReceiveError(@NonNull String error) {

        }
     };

    @ReactMethod
    public void initializeSpeechRecognizer(Callback callback) {
        this.speechCallback = callback;
        
        ReactApplicationContext context = getReactApplicationContext();
        Intent intent = new Intent(context, MainActivity.class);
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        context.startActivity(intent);
       
    }
    @ReactMethod
    public void startSpeechRecognition(Callback callback)
    {
        this.speechCallback=callback;

         Handler mainHandler = new Handler(Looper.getMainLooper());
                       mainHandler.post(()-> {
                       nativeSpeechRecognizer.stopRecognition();
                       nativeSpeechRecognizer.setRecognitionListener(speechRecognitionListener);
                       nativeSpeechRecognizer.startRecognition();
                    }); 
       
        
    }
};

