import { Text, View, StyleSheet, ScrollView, Image } from 'react-native';
import React, { useState, useRef, useEffect } from "react";
import images from '../Components/images';
import Helper from '../Components/Lib/Helper';

const SplashScreen = ({ navigation }) => {
    useEffect(() => {
        // setTimeout(() => {
        //     navigation.navigate('LoginScreen')
        // }, 3000);
        focusListener = navigation.addListener("focus", () => {
            Helper.getData('userdata').then(async (responseData) => {
                Helper.UserInfo = responseData;
                if (responseData === null || responseData === 'undefined' || responseData === '') {
                    navigation.reset({
                        routes: [{ name: "LoginScreen" }],
                    });
                } else {
                    navigation.reset({
                        routes: [{ name: "BottomTab" }],
                    });
                }
            })
            Helper.navigationRef = navigation
        })
    }, [navigation]);

    return (
        <View style={{ flex: 1 }}>
            <Image style={{ height: '100%', width: '100%' }} source={images.splash} />
        </View>
    )
}
const styles = StyleSheet.create({
})
export default SplashScreen;