import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../Src/LoginScreen';
import SplashScreen from '../Src/SplashScreen';
import SignUp from '../Src/SignUp';
import ForgotPassword from '../Src/ForgotPassword';
import OtpScreens from '../Src/OtpScreens';
import BottomTb from '../Src/BottomTab'
import NewPassword from '../Src/NewPassword';
import ProdectDetails from '../Src/ProdectDetails';
import ProductQuantity from '../Src/ProductQuantity';
import Favorite from '../Src/Favorite';
import SelectAddress from '../Src/SelectAddress';
import Notification from '../Src/Notification';
import orderDetail from '../Src/orderDetail'
import PrivacyPolicy from '../Src/PrivacyPolicy';
import TermsAndCondition from '../Src/TermsAndCondition';

const Stack = createNativeStackNavigator();

const App = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="SplashScreen">
                <Stack.Screen
                    name="SplashScreen"
                    component={SplashScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="NewPassword"
                    component={NewPassword}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Favorite"
                    component={Favorite}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="BottomTab"
                    component={BottomTb}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="LoginScreen"
                    component={LoginScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="SignUp"
                    component={SignUp}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="ForgotPassword"
                    component={ForgotPassword}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="OtpScreens"
                    component={OtpScreens}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="ProdectDetails"
                    component={ProdectDetails}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="ProductQuantity"
                    component={ProductQuantity}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="SelectAddress"
                    component={SelectAddress}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Notification"
                    component={Notification}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="orderDetail"
                    component={orderDetail}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="PrivacyPolicy"
                    component={PrivacyPolicy}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="TermsAndCondition"
                    component={TermsAndCondition}
                    options={{ headerShown: false }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};
export default App;