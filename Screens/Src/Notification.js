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

const Notification = ({ navigation }) => {
    const [data, setData] = useState([])

    useEffect(() => {
        getAllNotifications()
    }, [navigation]);

    const getAllNotifications = (id) => {
        NetInfo.fetch().then(state => {
            if (!state.isConnected) {
                Helper.showToast(AlertMsg.error.INTERNET_CONNECTION);
                return false;
            } else {
                Helper.globalLoader.showLoader()
                Helper.makeRequest({ url: ApiUrl.NOTIFICATION, method: "GET" }).then((response) => {
                    if (response.data.status == 200) {
                        setData(response.data.notifications)
                        Helper.globalLoader.hideLoader()
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

    const notificationList = ({ item }) => {
        return (
            <View style={styles.mainViewCard}>
                <FastImage style={styles.icon} source={{ uri: item.icon }} />
                <View style={{ marginLeft: 10 }}>
                    <Text style={styles.title}>{item.title}</Text>
                    <Text style={styles.body}>{item.body}</Text>
                </View>
            </View>
        )
    }

    return (
        <View style={styles.contaner}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity onPress={() => { navigation.goBack() }}>
                    <Image style={{ height: 20, width: 20, resizeMode: 'contain' }} source={images.backIcon} />
                </TouchableOpacity>
                <Text style={[styles.head_text, { marginLeft: 10 }]}>Notification</Text>
            </View>
            <FlatList
                renderItem={notificationList}
                data={data}
            />
        </View>
    )
}

export default Notification

const styles = ScaledSheet.create({
    contaner: {
        flex: 1,
        paddingHorizontal: "5@s",
        backgroundColor: '#FFF'
    },
    head_text: {
        fontSize: '18@s',
        marginVertical: '8@s',
        fontFamily: FONT_FAMILY.Poppins_SemiBold,
        color: "#000000",
        textAlign: 'center'
    },
    icon: {
        height: '80@s',
        width: '80@s',
        resizeMode: 'contain',
        marginLeft: 5
    },
    title: {
        fontSize: '14@s',
        fontFamily: FONT_FAMILY.Poppins_SemiBold,
        color: 'black',
        lineHeight: 20,
        fontWeight: '500'
    },
    body: {
        fontSize: '12@s',
        fontFamily: FONT_FAMILY.Poppins_Medium,
        color: 'black',
        lineHeight: 20,
        fontWeight: '500'
    },
    mainViewCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        borderRadius: 10,
        marginHorizontal: 5,
        marginTop: 10,
    }
})