import { Text, View, StyleSheet, ScrollView, Image, Keyboard, TouchableOpacity, Modal } from 'react-native';
import React, { useState, useRef, useEffect } from "react";
import images from '../Components/images';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import OTPTextInput from 'react-native-otp-textinput'
import Helper from '../Components/Lib/Helper';
import NetInfo from "@react-native-community/netinfo";
import AlertMsg from '../Components/Lib/AlertMsg';
import ApiUrl from '../Components/Lib/ApiUrl';
import { validators } from '../Components/Lib/validationFunctions';
import { FONT_FAMILY } from '../Components/Fonts';


const OtpScreens = ({ navigation, route }) => {
    const [otp, setotp] = useState("")
    const [timerCount, setTimer] = useState(30)
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        _generateOtp()
        let interval = setInterval(() => {
            setTimer(lastTimerCount => {
                lastTimerCount <= 1 && clearInterval(interval)
                return lastTimerCount - 1
            })
        }, 1000)
        return () => clearInterval(interval)
    }, []);

    const _ForgotOtp = () => {
        Keyboard.dismiss();
        NetInfo.fetch().then(state => {
            if (!state.isConnected) {
                Helper.showToast(AlertMsg.error.INTERNET_CONNECTION);
                return false;
            } else {
                if (otp == '') {
                    Helper.showToast('Enter OTP')
                } else {

                    var data = {
                        Otp: Number(otp),
                        mobile: route.params.phone,
                    }
                    console.log('datadatadataTOPPP', data);
                    Helper.globalLoader.showLoader()
                    Helper.makeRequest({ url: ApiUrl.VERIFYOTP, method: "POST", data: data }).then((response) => {
                        if (response.data.status == 200) {
                            navigation.navigate('NewPassword')
                            Helper.globalLoader.hideLoader()
                            Helper.showToast(response.message)
                        }
                        else {
                            Helper.globalLoader.hideLoader()
                            Helper.showToast(response.message);
                        }
                    }).catch(err => {
                        Helper.globalLoader.hideLoader()
                    })
                }
            }
        })
    }

    const _generateOtp = () => {
        Keyboard.dismiss();
        NetInfo.fetch().then(state => {
            if (!state.isConnected) {
                Helper.showToast(AlertMsg.error.INTERNET_CONNECTION);
                return false;
            } else {
                Helper.globalLoader.showLoader()
                Helper.makeRequest({ url: ApiUrl.GENERATEOTP + route.params.phone, method: "GET" }).then((response) => {
                    if (response.data.status == 200) {
                        console.log('LOGINDATA', JSON.stringify(response.data.status));
                        Helper.globalLoader.hideLoader()
                        Helper.showToast(response.data.otp);
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

    const OtpVrification = () => {
        Keyboard.dismiss();
        NetInfo.fetch().then(state => {
            if (!state.isConnected) {
                Helper.showToast(AlertMsg.error.INTERNET_CONNECTION);
                return false;
            } else {
                if (otp == '') {
                    Helper.showToast('Enter OTP')
                } else {

                    var data = {
                        Otp: Number(otp),
                        mobile: route.params.phone,
                    }
                    Helper.globalLoader.showLoader()
                    Helper.makeRequest({ url: ApiUrl.VERIFYOTP, method: "POST", data: data }).then((response) => {
                        if (response.data.status == 200) {
                            // navigation.navigate('BottomTab')
                            setModalVisible(true)
                            Helper.globalLoader.hideLoader()
                            Helper.showToast(response.message)
                            // {
                            //     modalVisible == true ?
                            setTimeout(() => { setModalVisible(false), navigation.navigate('LoginScreen') }, 2000)
                            // }
                        }
                        else {
                            Helper.globalLoader.hideLoader()
                            Helper.showToast(response.message);
                        }
                    }).catch(err => {
                        Helper.globalLoader.hideLoader()
                    })
                }
            }
        })
    }

    const verifyModal = () => {
        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}>
                <View style={styles.modalMainView}>
                    <View style={styles.modelView}>
                        <Image style={styles.modelIcon} source={images.verify} />
                        <Text style={styles.modelTxt}>Verified!</Text>
                    </View>
                </View>
            </Modal>
        )
    }

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor: '#F5F5F5' }}>
            {verifyModal()}
            <View style={{ marginHorizontal: wp(5) }}>
                <View style={styles.headerView}>
                    <View style={{ flex: 0.3 }}>
                        <TouchableOpacity onPress={() => { navigation.goBack() }}>
                            <Image style={styles.backIcon} source={images.backIcon} />
                        </TouchableOpacity>
                    </View>
                    <View style={{ flex: 0.7, }}>
                        <Text style={styles.ForgotText}>Phone Verification</Text>
                    </View>
                </View>
                <Text style={[styles.topTxt, { color: '#B6B6B6', marginTop: hp(7), fontFamily: FONT_FAMILY.Poppins_Medium }]}>Enter the verification code</Text>
                {/* <Text style={[styles.topTxt, { color: '#B6B6B6', fontFamily: FONT_FAMILY.Poppins_Medium }]}>sent to <Text style={[styles.topTxt, { color: '#526167', fontFamily: FONT_FAMILY.Poppins_Medium }]}>{route.params.phone}</Text></Text> */}
                <View style={styles.otpinput}>
                    <OTPTextInput
                        containerStyle={styles.OtpInput1}
                        textInputStyle={{ borderWidth: 0.5 }}
                        offTintColor={'#373737'}
                        tintColor={'#373737'}
                        inputCount={4}
                        handleTextChange={(e) => { setotp(e) }}
                    />
                </View>
                <TouchableOpacity activeOpacity={0.9} onPress={() => { route.params.type == 'Signup' ? OtpVrification() : _ForgotOtp() }} style={styles.signinView}>
                    <Text style={styles.signinTxt}>Verify</Text>
                </TouchableOpacity>
                <View style={{ flexDirection: 'row', marginTop: hp(3) }}>
                    <Text style={styles.reciveTxt}>Didn't receive the code?</Text>
                    {
                        timerCount == 0 ?
                            <TouchableOpacity onPress={() => { alert('okay') }}>
                                <Text style={styles.resendTxt}>Resend it (30s)</Text>
                            </TouchableOpacity>
                            :
                            <Text style={styles.resendTxt}> Resend it ({timerCount})</Text>
                    }

                </View>
            </View>
        </ScrollView >
    )
}
const styles = StyleSheet.create({
    signinView: { flex: 0.5, alignItems: 'center', paddingVertical: 15, backgroundColor: '#EE3332', borderRadius: 5, marginTop: hp(5) },
    signinTxt: { color: '#FFFFFF', fontSize: RFValue(16), lineHeight: 29, fontWeight: '500', fontFamily: FONT_FAMILY.Poppins_Medium },
    headerView: { flexDirection: 'row', paddingVertical: 10 },
    backIcon: { height: hp(3), width: wp(3), resizeMode: 'contain' },
    ForgotText: { textAlignVertical: 'center', fontSize: RFValue(16), fontWeight: '500', lineHeight: 23, color: '#363C6B', fontFamily: FONT_FAMILY.Poppins_Medium },
    topTxt: { textAlign: "center", fontSize: RFValue(15), fontWeight: 500, lineHeight: 23, },
    OtpInput1: { paddingHorizontal: wp(1) },
    otpinput: { marginTop: hp('7%'), alignSelf: "center", },
    reciveTxt: { color: '#363C6B', fontSize: RFValue(14), fontWeight: '500', lineHeight: 22, fontFamily: FONT_FAMILY.Poppins_Medium },
    resendTxt: { fontSize: RFValue(14), fontWeight: '500', lineHeight: 22, color: '#EE3332', marginLeft: 'auto', fontFamily: FONT_FAMILY.Poppins_Medium },
    modalMainView: { backgroundColor: 'rgba(255,255,255,255,0.8)', flex: 1, alignItems: 'center', justifyContent: 'center' },
    modelView: { alignItems: 'center', backgroundColor: '#FFFFFF', paddingHorizontal: wp(25), paddingVertical: hp(5), borderRadius: 20, elevation: 2 },
    modelIcon: { height: hp(10), width: wp(20), resizeMode: 'contain', },
    modelTxt: { fontSize: RFValue(20), marginTop: hp(3), lineHeight: 30, fontWeight: '600', fontFamily: FONT_FAMILY.Poppins_SemiBold, color: '#000870' }
})
export default OtpScreens;