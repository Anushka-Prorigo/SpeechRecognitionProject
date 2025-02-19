import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomePage from './js/Pages/HomePage';
import DynamicLayoutPage from './js/Pages/DynamicLayoutPage';
import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';


const Stack = createStackNavigator();

function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="HomePage">
                <Stack.Screen name="HomePage" component={HomePage} options={{ title: 'First Page' }} />
                <Stack.Screen name="DynamicLayoutPage" component={DynamicLayoutPage} options={{ title: 'Second Page' }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
export default App;
