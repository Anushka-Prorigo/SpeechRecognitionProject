package com.speechrecognitionproject; // replace your-app-name with your app’s name
import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;
import com.speechrecognitionproject.TextToSpeechRecognitionModule;
import com.speechrecognitionproject.SpeechToTextRecognitionModule;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class MyAppPackage implements ReactPackage {

    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        return Collections.emptyList();
    }

    @Override
    public List<NativeModule> createNativeModules( ReactApplicationContext reactContext) {
        List<NativeModule> modules = new ArrayList<>();
        modules.add(new TextToSpeechRecognitionModule(reactContext));
        modules.add(new SpeechToTextRecognitionModule(reactContext));
        return modules;
    }
}