import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState, useEffect } from 'react'
import { ScaledSheet, s } from 'react-native-size-matters';
import images from '../Components/images';
import { FONT_FAMILY } from '../Components/Fonts';
import Helper from '../Components/Lib/Helper';
import NetInfo from "@react-native-community/netinfo";
import AlertMsg from '../Components/Lib/AlertMsg';
import ApiUrl from '../Components/Lib/ApiUrl';
import FastImage from '../Components/Lib/LoadImage'
import { WebView } from 'react-native-webview';


const PrivacyPolicy = ({ navigation }) => {

    useEffect(() => {
    }, [navigation]);


    // const orderCancel = () => {
    //     NetInfo.fetch().then(state => {
    //         if (!state.isConnected) {
    //             Helper.showToast(AlertMsg.error.INTERNET_CONNECTION);
    //             return false;
    //         } else {
    //             var data = {
    //                 orderId: route.params.order_Id,
    //                 status: 'Cancle'
    //             }
    //             Helper.globalLoader.showLoader()
    //             Helper.makeRequest({ url: ApiUrl.CANCELORDER, method: "PUT", data: data }).then((response) => {
    //                 if (response.data.status == 200) {
    //                     Helper.globalLoader.hideLoader()
    //                     Helper.showToast(response.data.message)
    //                     navigation.navigate('History')
    //                 }
    //                 else {
    //                     Helper.globalLoader.hideLoader()
    //                     Helper.showToast(response.data.message);
    //                 }
    //             }).catch(err => {
    //                 Helper.globalLoader.hideLoader()
    //             })
    //         }
    //     })
    // }

    return (
        <View style={styles.contaner}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity onPress={() => { navigation.goBack() }}>
                    <Image style={{ height: 20, width: 20, resizeMode: 'contain' }} source={images.backIcon} />
                </TouchableOpacity>
                <Text style={[styles.head_text, { marginLeft: 10 }]}>Privacy Policy</Text>
            </View>
            <View style={{ flex: 1 }}>
                <WebView
                    source={{ uri: "https://fooddeliveryapp.onrender.com/privacy-policy" }}
                    style={{ flex: 1 }}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    startInLoadingState={true}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        </View>
    )
}

export default PrivacyPolicy

const styles = ScaledSheet.create({
    contaner: {
        flex: 1,
        backgroundColor: '#FFF'
    },
    head_text: {
        fontSize: '18@s',
        marginVertical: '8@s',
        fontFamily: FONT_FAMILY.Poppins_SemiBold,
        color: "#000000",
        textAlign: 'center'
    },
})