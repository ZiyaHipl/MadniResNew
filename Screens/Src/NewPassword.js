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

const NewPassword = ({ navigation }) => {
    const [password, setPassword] = useState('')
    const [cPassword, setCPassword] = useState('')

    const setNewPassword = () => {
        Keyboard.dismiss();
        NetInfo.fetch().then(state => {
            if (!state.isConnected) {
                Helper.showToast(AlertMsg.error.INTERNET_CONNECTION);
                return false;
            } else {
                if (
                    validators.checkPassword("Password", 7, 15, Helper.setTrim(password))
                ) {
                    if (password.trim() != cPassword.trim()) {
                        Helper.showToast(AlertMsg.error.PASSWORD_NOT_MATCH)
                        return false;
                    }
                    var data = {
                        password: password,
                        confirmPassword: cPassword
                    }
                    Helper.globalLoader.showLoader()
                    Helper.makeRequest({ url: ApiUrl.NEWPASSWORD, method: "PUT", data: data }).then((response) => {
                        if (response.data.status == 200) {
                            console.log('LOGINDATA', JSON.stringify(response.data));
                            Helper.globalLoader.hideLoader()
                            Helper.showToast(response.data.message)
                            navigation.navigate('LoginScreen')
                        }
                        else {
                            Helper.globalLoader.hideLoader()
                            Helper.showToast(response.data.message);
                        }
                    }).catch(err => {
                        Helper.globalLoader.hideLoader()
                    })
                }
            }
        })
    }

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor: '#F5F5F5' }}>
            <Image style={styles.iconsStyl} source={images.Applogo} />
            <View style={{ marginHorizontal: wp(5) }}>
                <View style={styles.inputView}>
                    <View style={[styles.inputMainView, { borderBottomWidth: 2, borderColor: '#E3E3E3', }]}>
                        <Image style={styles.inputIcon} source={images.password} />
                        <TextInput style={{ paddingLeft: wp(4), width: '90%', color: '#363C6B' }}
                            placeholder='Password'
                            onChangeText={(e) => { setPassword(e) }}
                            value={password}
                            placeholderTextColor={'#B4B4B4'}
                            returnKeyType={'next'}
                            maxLength={10}
                        />
                    </View>
                    <View style={[styles.inputMainView, { marginTop: 5 }]}>
                        <Image style={styles.inputIcon} source={images.password} />
                        <TextInput style={{ paddingLeft: wp(4), width: '90%', color: '#363C6B' }}
                            placeholder='Confirm Password'
                            onChangeText={(e) => { setCPassword(e) }}
                            value={cPassword}
                            placeholderTextColor={'#B4B4B4'}
                            returnKeyType={'done'}
                        />
                    </View>
                </View>
                <TouchableOpacity activeOpacity={0.9} onPress={() => { setNewPassword() }} style={styles.signinView}>
                    <Text style={styles.signinTxt}>SAVE</Text>
                </TouchableOpacity>
            </View>
        </ScrollView >
    )
}
const styles = StyleSheet.create({
    iconsStyl: { height: hp(15), width: wp(42), resizeMode: 'contain', alignSelf: 'center', marginTop: hp(15) },
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
        paddingVertical: 10
    },
    inputMainView: { borderColor: '#000', flexDirection: 'row', alignItems: 'center', marginHorizontal: 5 },
    inputIcon: { height: hp(5), width: wp(5), resizeMode: 'contain', marginLeft: wp(2), },
    checkBox: { height: hp(6), width: wp(6), resizeMode: 'contain', tintColor: '#C82330' },
    remberTxt: { fontSize: RFValue(14), color: '#363C6B', fontWeight: 300, lineHeight: 20, marginLeft: wp(2.5) },
    signupView: { flex: 0.5, alignItems: 'center', justifyContent: 'center' },
    signupTxt: { color: '#EE3332', fontSize: RFValue(16), fontWeight: '500', lineHeight: 29 },
    signinView: { alignItems: 'center', paddingVertical: 15, marginHorizontal: 10, backgroundColor: '#EE3332', borderRadius: 5, marginTop: '20%' },
    signinTxt: { color: '#FFFFFF', fontSize: RFValue(16), lineHeight: 29, fontWeight: '500' }
})
export default NewPassword;