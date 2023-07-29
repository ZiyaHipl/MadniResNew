import { Text, View, StyleSheet, ScrollView, Image, TextInput, TouchableOpacity, Keyboard } from 'react-native';
import React, { useState, useRef, useEffect } from "react";
import images from '../Components/images';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Helper from '../Components/Lib/Helper';
import NetInfo from "@react-native-community/netinfo";
import AlertMsg from '../Components/Lib/AlertMsg';
import ApiUrl from '../Components/Lib/ApiUrl';
import { validators } from '../Components/Lib/validationFunctions';
import { FONT_FAMILY } from '../Components/Fonts';


const SignUp = ({ navigation }) => {
    const [fName, setFName] = useState('')
    const [lName, setLName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [password, setPassword] = useState('')
    const [cPassword, setCPassword] = useState('')
    const [hidePass, setHidePass] = useState(false)
    const [conHidePass, setConHidePass] = useState(false)

    const onShowPassword = (value) => {
        if (value == 'password') {
            setHidePass(!hidePass)
        }
        if (value == 'Cpassword') {
            setConHidePass(!conHidePass)
            return
        }
    }

    const _SignupAccount = () => {
        Keyboard.dismiss();
        NetInfo.fetch().then(state => {
            if (!state.isConnected) {
                Helper.showToast(AlertMsg.error.INTERNET_CONNECTION);
                return false;
            } else {
                if (
                    validators.checkAlphabet("FristName ", 2, 45, Helper.setTrim(fName)) &&
                    validators.checkAlphabet("FristName ", 2, 45, Helper.setTrim(lName)) &&
                    validators.checkEmail("Email ", Helper.setTrim(email)) &&
                    validators.checkPhoneNumber("phone ", 7, 15, Helper.setTrim(phone)) &&
                    validators.checkPassword("Password", 7, 15, Helper.setTrim(password))
                ) {
                    if (password.trim() != cPassword.trim()) {
                        Helper.showToast(AlertMsg.error.PASSWORD_NOT_MATCH)
                        return false;
                    }
                    var data = {
                        firstName: fName,
                        lastName: lName,
                        email: email,
                        mobile: phone,
                        password: password,
                        deviceToken: Helper.device_token
                    }
                    Helper.globalLoader.showLoader()
                    Helper.makeRequest({ url: ApiUrl.SIGNUP, method: "POST", data: data }).then((response) => {
                        if (response.data.status == 200) {
                            Helper.globalLoader.hideLoader()
                            Helper.showToast(response.data.message);
                            navigation.navigate('OtpScreens', { phone: phone, type: 'Signup' })
                        }
                        else {
                            Helper.globalLoader.hideLoader()
                            Helper.showToast(response.data.message);
                        }
                    }).catch(err => {
                        Helper.globalLoader.hideLoader()
                        Helper.showToast(err.message)
                    })
                }
            }
        })
    }

    return (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, backgroundColor: '#F5F5F5' }}>
            <Image style={styles.iconsStyl} source={images.Applogo} />
            <View style={{ marginHorizontal: wp(5) }}>
                <View style={styles.inputView}>
                    <View style={[styles.inputMainView, { borderBottomWidth: 2, borderColor: '#E3E3E3', }]}>
                        <Image style={styles.inputIcon} source={images.user} />
                        <TextInput style={styles.inpuTxt}
                            placeholder='First name'
                            onChangeText={(e) => { setFName(e) }}
                            value={fName}
                            placeholderTextColor={'#B4B4B4'}
                            returnKeyType={'next'}
                        />
                    </View>
                    <View style={[styles.inputMainView, { borderBottomWidth: 2, borderColor: '#E3E3E3', }]}>
                        <Image style={styles.inputIcon} source={images.user} />
                        <TextInput style={styles.inpuTxt}
                            placeholder='Last name'
                            onChangeText={(e) => { setLName(e) }}
                            value={lName}
                            placeholderTextColor={'#B4B4B4'}
                            returnKeyType={'next'}
                        />
                    </View>
                    <View style={[styles.inputMainView, { borderBottomWidth: 2, borderColor: '#E3E3E3', }]}>
                        <Image style={styles.inputIcon} source={images.email} />
                        <TextInput style={styles.inpuTxt}
                            placeholder='Email'
                            onChangeText={(e) => { setEmail(e) }}
                            value={email}
                            placeholderTextColor={'#B4B4B4'}
                            returnKeyType={'next'}
                            keyboardType={'email-address'}
                        />
                    </View>
                    <View style={[styles.inputMainView, { borderBottomWidth: 2, borderColor: '#E3E3E3', }]}>
                        <Image style={styles.inputIcon} source={images.phone} />
                        <TextInput style={styles.inpuTxt}
                            placeholder='Phone Number'
                            onChangeText={(e) => { setPhone(e.replace(/[^0-9]/g, '')) }}
                            value={phone}
                            placeholderTextColor={'#B4B4B4'}
                            keyboardType={"numeric"}
                            returnKeyType={'next'}
                            maxLength={10}
                        />
                    </View>
                    <View style={[styles.inputMainView, { borderBottomWidth: 2, borderColor: '#E3E3E3', }]}>
                        <Image style={styles.inputIcon} source={images.password} />
                        <TextInput style={styles.inpuTxt}
                            placeholder='Password'
                            onChangeText={(e) => { setPassword(e) }}
                            value={password}
                            placeholderTextColor={'#B4B4B4'}
                            returnKeyType={'next'}
                            secureTextEntry={hidePass == true ? false : true}
                            maxLength={10}
                        />
                        <TouchableOpacity onPress={() => { onShowPassword('password') }}>
                            <Image style={styles.hideIcon} source={hidePass ? images.showPassword : images.hidePassword} />
                        </TouchableOpacity>

                    </View>
                    <View style={[styles.inputMainView, { marginTop: 5 }]}>
                        <Image style={styles.inputIcon} source={images.password} />
                        <TextInput style={styles.inpuTxt}
                            placeholder='Confirm Password'
                            onChangeText={(e) => { setCPassword(e) }}
                            value={cPassword}
                            placeholderTextColor={'#B4B4B4'}
                            secureTextEntry={conHidePass == true ? false : true}
                            returnKeyType={'done'}
                        />
                        <TouchableOpacity onPress={() => { onShowPassword('Cpassword') }}>
                            <Image style={styles.hideIcon} source={conHidePass ? images.showPassword : images.hidePassword} />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', marginTop: hp(5) }}>
                    <View style={styles.signupView}>
                        <TouchableOpacity activeOpacity={0.9} onPress={() => { navigation.navigate('LoginScreen') }}>
                            <Text style={styles.signupTxt}>SING IN</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity activeOpacity={0.9} onPress={() => { _SignupAccount() }} style={styles.signinView}>
                        <Text style={styles.signinTxt}>SING UP</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView >
    )
}
const styles = StyleSheet.create({
    iconsStyl: { height: hp(15), width: wp(42), resizeMode: 'contain', alignSelf: 'center', marginTop: hp(7) },
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
    signupView: { flex: 0.5, alignItems: 'center', justifyContent: 'center' },
    signupTxt: { color: '#EE3332', fontSize: RFValue(16), fontWeight: '500', lineHeight: 29, fontFamily: FONT_FAMILY.Poppins_Medium },
    signinView: { flex: 0.5, alignItems: 'center', paddingVertical: 15, marginHorizontal: 10, backgroundColor: '#EE3332', borderRadius: 5 },
    signinTxt: { color: '#FFFFFF', fontSize: RFValue(16), lineHeight: 29, fontWeight: '500', fontFamily: FONT_FAMILY.Poppins_Medium },
    hideIcon: { height: hp(5), width: wp(5), resizeMode: 'contain', tintColor: '#C9C9C9' },
    inpuTxt: { paddingLeft: wp(4), width: '85%', color: '#363C6B', fontFamily: FONT_FAMILY.Poppins_Medium }
})
export default SignUp;