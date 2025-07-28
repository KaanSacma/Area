import React, {useState} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import CreateAccountScreen from "./src/screens/CreateAccountScreen";
import SearchAREAScreen from "./src/screens/SearchAREAScreen";
import HomeScreen from "./src/screens/HomeScreen/HomeScreen";
import EditAREAScreen from "./src/screens/EditAREAScreen";
import { ZapListProvider } from './src/components/ZaptListContext/ZaptListContext';

const Stack = createStackNavigator();

const App = () => {
    const [accessToken, setAccessToken] = useState('');

    return (
        <ZapListProvider>
            <NavigationContainer>
                <Stack.Navigator>
                    <Stack.Screen name="Login" options={{ headerShown: false }} >
                        {props => (<LoginScreen {...props} setTokenAccess={setAccessToken}/>)}
                    </Stack.Screen>
                    <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
                    <Stack.Screen name="CreateAccount" component={CreateAccountScreen} options={{ headerShown: false }} />
                    <Stack.Screen name="Home" options={{ headerShown: false }} >
                        {props => (<HomeScreen {...props} AccessToken={accessToken}/>)}
                    </Stack.Screen>
                    <Stack.Screen name="SearchAREA" options={{ headerShown: false }} >
                        {props => (<SearchAREAScreen {...props} AccessToken={accessToken}/>)}
                    </Stack.Screen>
                    <Stack.Screen name="EditAREA" options={{ headerShown: false }} >
                        {props => (<EditAREAScreen {...props} AccessToken={accessToken}/>)}
                    </Stack.Screen>
            </Stack.Navigator>
            </NavigationContainer>
        </ZapListProvider>
    );
}

export default App;
