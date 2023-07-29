import { FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, Keyboard, View } from 'react-native'
import React, { useState, useEffect } from 'react'
import { ScaledSheet, s } from 'react-native-size-matters';
import images from '../Components/images'
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { FONT_FAMILY } from '../Components/Fonts';
import Helper from '../Components/Lib/Helper';
import NetInfo from "@react-native-community/netinfo";
import AlertMsg from '../Components/Lib/AlertMsg';
import ApiUrl from '../Components/Lib/ApiUrl';

const Profile = ({ navigation }) => {
    const [fName, setfName] = useState('')
    const [lName, setLName] = useState('')
    const [phone, setPhone] = useState('')
    const [email, setEmail] = useState('')


    useEffect(() => {
        getProfile()
    }, [navigation]);

    const getProfile = () => {
        NetInfo.fetch().then(state => {
            if (!state.isConnected) {
                Helper.showToast(AlertMsg.error.INTERNET_CONNECTION);
                return false;
            } else {
                {
                    Helper.getData('userdata').then(async (responseData) => {
                        Helper.globalLoader.showLoader()

                        Helper.makeRequest({ url: ApiUrl.GETUSERPROFILE + responseData.user, method: "GET" }).then((response) => {
                            if (response.data.status == 200) {
                                console.log('responseresponse', response.data.email);
                                setfName(response.data.firstName)
                                setLName(response.data.lastName)
                                setPhone(response.data.mobile)
                                setEmail(response.data.email)
                                Helper.globalLoader.hideLoader()
                            }
                            else {
                                Helper.globalLoader.hideLoader()
                                Helper.showToast(response.message);
                            }
                        }).catch(err => {
                            Helper.globalLoader.hideLoader()
                        })
                    });
                }
            }
        })
    }


    const updateProfile = () => {
        Keyboard.dismiss();
        NetInfo.fetch().then(state => {
            if (!state.isConnected) {
                Helper.showToast(AlertMsg.error.INTERNET_CONNECTION);
                return false;
            } else {
                var data = {
                    firstName: fName,
                    lastName: lName,
                    email: email
                }
                Helper.makeRequest({ url: ApiUrl.UPDATEPROFILE, method: "PUT", data: data }).then((response) => {
                    if (response.data.status == 200) {
                        console.log('responseresponse', response.data);
                        getProfile()
                        Helper.globalLoader.hideLoader()
                    }
                    else {
                        Helper.globalLoader.hideLoader()
                        Helper.showToast(response.message);
                    }
                }).catch(err => {
                    Helper.globalLoader.hideLoader()
                })
            }
        })
    }

    return (
        <View style={{ flex: 1 }}>
            <Text style={styles.headerTxt}>Profile</Text>
            <View style={{ marginHorizontal: 10, marginTop: 20 }}>
                <View style={styles.inputView}>
                    <View style={[styles.inputMainView, { borderBottomWidth: 2, borderColor: '#E3E3E3', }]}>
                        <Image style={styles.inputIcon} source={images.user} />
                        <TextInput style={styles.inputTxt}
                            placeholder='First Name'
                            onChangeText={(e) => { setfName(e) }}
                            value={fName}
                            placeholderTextColor={'#B4B4B4'}
                            returnKeyType={'next'}
                        />
                    </View>
                    <View style={[styles.inputMainView, { borderBottomWidth: 2, borderColor: '#E3E3E3', }]}>
                        <Image style={styles.inputIcon} source={images.user} />
                        <TextInput style={styles.inputTxt}
                            placeholder='Last Name'
                            onChangeText={(e) => { setLName(e) }}
                            value={lName}
                            placeholderTextColor={'#B4B4B4'}
                            returnKeyType={'next'}
                        />
                    </View>
                    <View style={[styles.inputMainView, { borderBottomWidth: 2, borderColor: '#E3E3E3', }]}>
                        <Image style={styles.inputIcon} source={images.phone} />
                        <TextInput style={styles.inputTxt}
                            placeholder='Phone Number'
                            onChangeText={(e) => { setPhone(e) }}
                            value={phone.toString()}
                            placeholderTextColor={'#B4B4B4'}
                            returnKeyType={'next'}
                            maxLength={10}
                            editable={false}
                        />
                    </View>
                    <View style={[styles.inputMainView, { marginTop: 5 }]}>
                        <Image style={styles.inputIcon} source={images.email} />
                        <TextInput style={styles.inputTxt}
                            placeholder='Password'
                            onChangeText={(e) => { setEmail(e) }}
                            value={email}
                            keyboardType={'email-address'}
                            placeholderTextColor={'#B4B4B4'}
                            returnKeyType={'done'}
                        />
                    </View>
                </View>
            </View>
            <TouchableOpacity activeOpacity={0.9} onPress={() => { updateProfile() }} style={styles.signinView}>
                <Text style={styles.signinTxt}>SAVE</Text>
            </TouchableOpacity>
        </View>
    )
}

export default Profile

const styles = StyleSheet.create({
    headerTxt: { fontSize: 18, textAlign: 'center', marginTop: 4, fontFamily: FONT_FAMILY.Poppins_Medium },
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
    inputTxt: { paddingLeft: wp(4), width: '90%', color: '#363C6B', fontFamily: FONT_FAMILY.Poppins_Medium },
    signinView: { alignItems: 'center', paddingVertical: 15, marginHorizontal: 10, backgroundColor: '#EE3332', borderRadius: 5, marginTop: 30 },
    signinTxt: { color: '#FFFFFF', fontSize: RFValue(16), lineHeight: 29, fontWeight: '500', fontFamily: FONT_FAMILY.Poppins_SemiBold },
})