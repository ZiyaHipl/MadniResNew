import { Text, View, StyleSheet, ScrollView, Image, TextInput, TouchableOpacity, Keyboard } from 'react-native';
import React, { useState, useRef, useEffect } from "react";
import images from '../Components/images';
import { RFValue } from "react-native-responsive-fontsize";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { FONT_FAMILY } from '../Components/Fonts';
import Helper from '../Components/Lib/Helper';
import NetInfo from "@react-native-community/netinfo";
import AlertMsg from '../Components/Lib/AlertMsg';
import ApiUrl from '../Components/Lib/ApiUrl';
import { validators } from '../Components/Lib/validationFunctions';
import DeviceInfo from 'react-native-device-info';


const LoginScreen = ({ navigation }) => {
    const [phone, setPhone] = useState('')
    const [password, setPassword] = useState('')
    const [rember, setRember] = useState(false)
    const [deviceid, setDeviceid] = useState("")


    useEffect(async () => {
        DeviceInfo.getUniqueId().then((uniqueId) => {
            setDeviceid(uniqueId)
            console.log("uniqueId++++", uniqueId)
        });
    }, [])

    const remberCheck = () => {
        console.log('remberrember', rember);
        setRember(!rember)
    }

    const _Login = () => {
        Keyboard.dismiss();
        NetInfo.fetch().then(state => {
            if (!state.isConnected) {
                Helper.showToast(AlertMsg.error.INTERNET_CONNECTION);
                return false;
            } else {
                if (
                    validators.checkNumber("Phone ", 7, 15, Helper.setTrim(phone)) &&
                    validators.checkPassword("Password", 7, 15, Helper.setTrim(password))
                ) {
                    var data = {
                        mobile: phone,
                        password: password
                    }
                    Helper.globalLoader.showLoader()
                    Helper.makeRequest({ url: ApiUrl.LOGIN, method: "POST", data: data }).then((response) => {
                        if (response.data.status == 200) {
                            Helper.globalLoader.hideLoader()
                            Helper.showToast(response.data.message)
                            Helper.setData('userdata', response.data)
                            Helper.setData('token', response.data.token)
                            navigation.navigate('BottomTab')
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
                        <Image style={styles.inputIcon} source={images.phone} />
                        <TextInput style={styles.inputTxt}
                            placeholder='Phone Number'
                            onChangeText={(e) => { setPhone(e.replace(/[^0-9]/g, '')) }}
                            value={phone}
                            placeholderTextColor={'#B4B4B4'}
                            keyboardType={"numeric"}
                            returnKeyType={'next'}
                            maxLength={10}
                        />
                    </View>
                    <View style={[styles.inputMainView, { marginTop: 5 }]}>
                        <Image style={styles.inputIcon} source={images.password} />
                        <TextInput style={styles.inputTxt}
                            placeholder='Password'
                            onChangeText={(e) => { setPassword(e) }}
                            value={password}
                            placeholderTextColor={'#B4B4B4'}
                            returnKeyType={'done'}
                        />
                    </View>
                </View>
                <View style={{ flexDirection: 'row', marginTop: hp(2) }}>
                    <TouchableOpacity activeOpacity={0.9} style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => { remberCheck() }}>
                        <Image style={styles.checkBox} source={rember ? images.blank : images.check} />
                        <Text style={styles.remberTxt}>Remember me</Text>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.9} onPress={() => { navigation.navigate('ForgotPassword') }} style={{ marginLeft: 'auto', justifyContent: 'center' }}>
                        <Text style={{ color: '#EE3332', fontSize: RFValue(14), fontWeight: 300, lineHeight: 20, fontFamily: FONT_FAMILY.Poppins_Medium }}>Forget password?</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ flexDirection: 'row', marginTop: (5) }}>
                    <View style={styles.signupView}>
                        <TouchableOpacity activeOpacity={0.9} onPress={() => { navigation.navigate('SignUp') }}>
                            <Text style={[styles.signupTxt]}>SING UP</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity activeOpacity={0.9} onPress={() => { _Login() }} style={styles.signinView}>
                        <Text style={styles.signinTxt}>SING IN</Text>
                    </TouchableOpacity>
                </View>
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
    remberTxt: { fontSize: RFValue(14), color: '#363C6B', fontWeight: 300, lineHeight: 20, marginLeft: wp(2.5), fontFamily: FONT_FAMILY.Poppins_Medium },
    signupView: { flex: 0.5, alignItems: 'center', justifyContent: 'center' },
    signupTxt: { color: '#EE3332', fontSize: RFValue(16), fontWeight: '500', lineHeight: 29, fontFamily: FONT_FAMILY.Poppins_SemiBold },
    signinView: { flex: 0.5, alignItems: 'center', paddingVertical: 15, marginHorizontal: 10, backgroundColor: '#EE3332', borderRadius: 5 },
    signinTxt: { color: '#FFFFFF', fontSize: RFValue(16), lineHeight: 29, fontWeight: '500', fontFamily: FONT_FAMILY.Poppins_SemiBold },
    inputTxt: { paddingLeft: wp(4), width: '90%', color: '#363C6B', fontFamily: FONT_FAMILY.Poppins_Medium }
})
export default LoginScreen;