import { Text, View, StyleSheet, ScrollView, Image, TextInput, TouchableOpacity, Keyboard } from 'react-native';
import React, { useState, useRef, useEffect } from "react";
import images from '../Components/images';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { FONT_FAMILY } from '../Components/Fonts';
import Helper from '../Components/Lib/Helper';
import NetInfo from "@react-native-community/netinfo";
import AlertMsg from '../Components/Lib/AlertMsg';
import ApiUrl from '../Components/Lib/ApiUrl';
import { validators } from '../Components/Lib/validationFunctions';

const ForgotPassword = ({ navigation }) => {
    const [phone, setPhone] = useState('')

    const _Forgot = () => {
        Keyboard.dismiss();
        NetInfo.fetch().then(state => {
            if (!state.isConnected) {
                Helper.showToast(AlertMsg.error.INTERNET_CONNECTION);
                return false;
            } else {
                Helper.globalLoader.showLoader()
                Helper.makeRequest({ url: ApiUrl.FORGOTPASSWORD + phone, method: "GET" }).then((response) => {
                    if (response.data.status == 200) {
                        console.log('LOGINDATA', JSON.stringify(response.data.status));
                        Helper.globalLoader.hideLoader()
                        Helper.showToast(response.data.otp);
                        navigation.navigate('OtpScreens', { phone: phone, type: 'Forgot' })
                    }
                    else {
                        Helper.globalLoader.hideLoader()
                        Helper.showToast(response.data.message);
                    }
                }).catch(err => {
                    Helper.globalLoader.hideLoader()
                })
            }
        })
    }

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor: '#F5F5F5' }}>
            <View style={{ marginHorizontal: wp(5) }}>
                <View style={styles.headerView}>
                    <View style={{ flex: 0.3 }}>
                        <TouchableOpacity onPress={() => { navigation.goBack() }}>
                            <Image style={styles.backIcon} source={images.backIcon} />
                        </TouchableOpacity>
                    </View>
                    <View style={{ flex: 0.7, }}>
                        <Text style={styles.ForgotText}>Forgot Password</Text>
                    </View>
                </View>
                <Image style={[styles.iconsStyl]} source={images.forgotIcon} />
                <View style={[styles.inputView]}>
                    <View style={[styles.inputMainView]}>
                        <Image style={styles.inputIcon} source={images.phone} />
                        <TextInput style={{ paddingLeft: wp(4), width: '90%', color: '#363C6B', fontFamily: FONT_FAMILY.Poppins_Medium }}
                            placeholder='Phone Number'
                            onChangeText={(e) => { setPhone(e.replace(/[^0-9]/g, '')) }}
                            value={phone}
                            placeholderTextColor={'#B4B4B4'}
                            keyboardType={"numeric"}
                            returnKeyType={'next'}
                            maxLength={10}
                        />
                    </View>
                </View>

                <TouchableOpacity activeOpacity={0.9} onPress={() => { _Forgot() }} style={styles.signinView}>
                    <Text style={styles.signinTxt}>Next</Text>
                </TouchableOpacity>
            </View>
        </ScrollView >
    )
}
const styles = StyleSheet.create({
    iconsStyl: { height: hp(15), width: wp(42), resizeMode: 'contain', alignSelf: 'center', marginTop: hp(10) },
    inputView: {
        marginTop: hp(6), shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.37,
        shadowRadius: 7.49,

        elevation: 2,
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        paddingVertical: 5
    },
    inputMainView: { borderColor: '#000', flexDirection: 'row', alignItems: 'center', marginHorizontal: 5, },
    inputIcon: { height: hp(5), width: wp(5), resizeMode: 'contain', marginLeft: wp(2), },
    signinView: { flex: 0.5, alignItems: 'center', paddingVertical: 15, backgroundColor: '#EE3332', borderRadius: 5, marginTop: hp(5) },
    signinTxt: { color: '#FFFFFF', fontSize: RFValue(16), lineHeight: 29, fontWeight: '500', fontFamily: FONT_FAMILY.Poppins_Medium },
    headerView: { flexDirection: 'row', paddingVertical: 10 },
    backIcon: { height: hp(3), width: wp(3), resizeMode: 'contain' },
    ForgotText: { textAlignVertical: 'center', fontSize: RFValue(16), fontWeight: '500', lineHeight: 23, color: '#363C6B', fontFamily: FONT_FAMILY.Poppins_Medium }
})
export default ForgotPassword;