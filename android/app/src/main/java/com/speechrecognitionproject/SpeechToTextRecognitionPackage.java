package com.speechrecognitionproject;
import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.uimanager.ViewManager;
import java.util.ArrayList;
import java.util.Collections;
import com.speechrecognitionproject.SpeechToTextRecognitionModule;
import java.util.List;

public class SpeechToTextRecognitionPackage implements ReactPackage {
    @Override
    public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
        List<NativeModule> modules1 = new ArrayList<>();
        modules1.add(new SpeechToTextRecognitionModule(reactContext));
        return modules1;
    }

    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        return Collections.emptyList();
    }
}
