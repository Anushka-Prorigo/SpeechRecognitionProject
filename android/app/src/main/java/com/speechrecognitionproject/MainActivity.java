package com.speechrecognitionproject;
import android.Manifest;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.speech.SpeechRecognizer;
import android.speech.tts.TextToSpeech;
import android.widget.ImageView;
import android.widget.Toast;
import android.util.Log;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import androidx.annotation.NonNull;
import com.speechrecognitionproject.speech.NativeSpeechRecognizer;
import com.speechrecognitionproject.speech.SpeechRecognitionListener;
import com.speechrecognitionproject.voice.NativeTextToVoiceRecognizer;
import java.lang.ref.WeakReference;
import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint;
import com.facebook.react.defaults.DefaultReactActivityDelegate;


public class MainActivity extends ReactActivity  {
    private static final int REQUEST_RECORD_AUDIO_PERMISSION = 1;
    private SpeechRecognizer speechRecognizer;
    private WeakReference<Context> contextRef;
    private NativeSpeechRecognizer nativeSpeechRecognizer ;
    String recognizedText = "";
    private String[] permissions = {Manifest.permission.RECORD_AUDIO};

     @Override
    protected String getMainComponentName() {
        return "SpeechRecognitionProject";
    }

   @Override
    protected ReactActivityDelegate createReactActivityDelegate() {
        return new ReactActivityDelegate(this, getMainComponentName());
    }
    private final SpeechRecognitionListener listener = new SpeechRecognitionListener() {
       @Override
        public void onReceiveSpeechRecognitionResult(@NonNull String speechResult) {
            Log.d("speech","text"+speechResult);
            
            if (speechResult.equalsIgnoreCase("start")) {
                    Intent intent = new Intent(MainActivity.this, SpeechToTextRecognitionModule.class);
                    intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                    startActivity(intent);
            }
        }
        @Override
        public void onReceiveError(@NonNull String error) {

        }
    };

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        if (ContextCompat.checkSelfPermission(this, Manifest.permission.RECORD_AUDIO) != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(this, new String[]{Manifest.permission.RECORD_AUDIO}, REQUEST_RECORD_AUDIO_PERMISSION);
        } else {
            initializeSpeechRecognizer();
        }
    }

    private void initializeSpeechRecognizer() {
        if (nativeSpeechRecognizer == null) {
            nativeSpeechRecognizer = new NativeSpeechRecognizer(getApplicationContext());
        }
        nativeSpeechRecognizer.setRecognitionListener(listener);
        //nativeSpeechRecognizer.startRecognition();
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (requestCode == REQUEST_RECORD_AUDIO_PERMISSION && grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
            initializeSpeechRecognizer();
        } else {
            initializeSpeechRecognizer();
              Toast.makeText(this, "Audio permission required for speech recognition", Toast.LENGTH_SHORT).show();
        }
    }
}
