import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { ScaledSheet, s } from 'react-native-size-matters';
import AsyncStorage from '@react-native-async-storage/async-storage';
import images from '../Components/images'
import { FONT_FAMILY } from '../Components/Fonts';
import Helper from '../Components/Lib/Helper';

const Setting = ({ navigation }) => {
    const [listData, setListData] = useState([{ name: 'Profile', route: 'Profile' }])
    const pageList = ({ item }) => {
        return (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                <Text>{item.name}</Text>
                <Image style={{ height: 15, width: 15, resizeMode: 'contain' }} source={images.Shape} />
            </View>
        )
    }

    const AppLogout = () => {
        AsyncStorage.removeItem("token");
        AsyncStorage.removeItem('userdata')
        navigation.navigate('LoginScreen')
    }

    logoutClick = () => {
        Helper.confirmPopUp("Are you sure want logout?", (status) => {
            if (status) {
                AppLogout()
            }
        });
    }

    return (
        <View style={{ flex: 1 }}>
            <Text style={styles.headerTxt}>Setting</Text>
            <View style={{ marginHorizontal: 10, marginTop: 20 }}>
                <TouchableOpacity onPress={() => { navigation.navigate('Profile') }} style={styles.txtView}>
                    <Text style={styles.titleTxt}>Profile</Text>
                    <Image style={styles.rightIcon} source={images.Shape} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { navigation.navigate('Favorite') }} style={styles.txtView}>
                    <Text style={styles.titleTxt}>Favorite</Text>
                    <Image style={styles.rightIcon} source={images.Shape} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { navigation.navigate('Notification') }} style={styles.txtView}>
                    <Text style={styles.titleTxt}>Notification</Text>
                    <Image style={styles.rightIcon} source={images.Shape} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { navigation.navigate('PrivacyPolicy') }} style={styles.txtView}>
                    <Text style={styles.titleTxt}>Privacy Policy</Text>
                    <Image style={styles.rightIcon} source={images.Shape} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { navigation.navigate('TermsAndCondition') }} style={styles.txtView}>
                    <Text style={styles.titleTxt}>Terms&Condition</Text>
                    <Image style={styles.rightIcon} source={images.Shape} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { logoutClick() }} style={styles.txtView}>
                    <Text style={styles.titleTxt}>LOGOUT</Text>
                    <Image style={styles.rightIcon} source={images.Shape} />
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default Setting

const styles = ScaledSheet.create({
    headerTxt: { fontSize: '18@s', textAlign: 'center', marginTop: s(4), fontFamily: FONT_FAMILY.Poppins_Medium },
    txtView: { flexDirection: 'row', justifyContent: 'space-between', marginTop: s(10), alignItems: 'center' },
    rightIcon: { height: s(15), width: s(15), resizeMode: 'contain' },
    titleTxt: { fontSize: '16@s', fontFamily: FONT_FAMILY.Poppins_Regular, color: 'black', lineHeight: 25, fontWeight: '500' }
})