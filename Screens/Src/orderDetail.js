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
import moment from "moment";

const orderDetail = ({ navigation, route }) => {
    const [pendingData, setpendingData] = useState([])
    const [details, setDetails] = useState('')
    useEffect(() => {
        orderHistory()
    }, [navigation]);


    const orderHistory = async (filterTab) => {
        NetInfo.fetch().then(state => {
            if (!state.isConnected) {
                Helper.showToast(AlertMsg.error.INTERNET_CONNECTION);
                return false;
            } else {
                Helper.globalLoader.showLoader()
                Helper.makeRequest({ url: ApiUrl.ODERDETAILS + route.params.order_Id, method: "GET" }).then((response) => {
                    if (response.data.status == 200) {
                        console.log('response.data.orderHistory[0].orders', response.data);
                        setpendingData(response.data.order.cartItems)
                        setDetails(response.data.order)
                        Helper.globalLoader.hideLoader()
                        // Helper.showToast(response.data.message)
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

    const pendingList = ({ item }) => {
        return (
            <View style={styles.cardmainView}>
                <View style={{ flexDirection: 'row', marginTop: 10, borderBottomWidth: 1, borderColor: '#e7e9ea', paddingBottom: 5 }}>
                    <View style={{ flex: 0.33, alignItems: 'center' }}>
                        <FastImage resizeMode={'cover'} style={styles.productImg} source={{ uri: item.productId.image }} />
                    </View>
                    <View style={{ flex: 0.67, justifyContent: 'center' }}>
                        <Text numberOfLines={2} style={styles.productName}>{item.productId.name}</Text>
                        <Text numberOfLines={1} style={styles.addressTxt}>{details.address}</Text>
                    </View>
                </View>
                <View style={styles.quaView}>
                    <View style={{ marginLeft: 15, }}>
                        <Text style={styles.qunatity}> Quantity:</Text>
                    </View>
                    <Text numberOfLines={1} style={[styles.qunatity, { marginLeft: 4 }]}>{item.quantity} x {item.productId.name}</Text>
                </View>
                <View style={styles.dateMainView}>
                    <Text style={styles.dateTxt}>{moment(details.date).format('DD MMM YYYY')} at {moment(details.date).format('HH :MM A')}</Text>
                    <Text style={[styles.dateTxt, { marginRight: 15 }]}>₹ {item.quantity * item.price}</Text>
                </View>
            </View>
        )
    }

    const orderCancel = () => {
        NetInfo.fetch().then(state => {
            if (!state.isConnected) {
                Helper.showToast(AlertMsg.error.INTERNET_CONNECTION);
                return false;
            } else {
                Helper.globalLoader.showLoader()
                Helper.makeRequest({ url: ApiUrl.CANCELORDER + route.params.order_Id, method: "PUT", }).then((response) => {
                    if (response.data.status == 200) {
                        Helper.globalLoader.hideLoader()
                        Helper.showToast(response.data.message)
                        navigation.navigate('History')
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
        <View style={styles.contaner}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity onPress={() => { navigation.goBack() }}>
                    <Image style={{ height: 20, width: 20, resizeMode: 'contain' }} source={images.backIcon} />
                </TouchableOpacity>
                <Text style={[styles.head_text, { marginLeft: 10 }]}>Order Details</Text>
            </View>
            <View style={{ flex: 1, marginHorizontal: 5 }}>
                <FlatList
                    renderItem={pendingList}
                    data={pendingData}
                />
            </View>
            <TouchableOpacity activeOpacity={1} onPress={() => { orderCancel() }} style={styles.btnView}>
                <Text style={styles.btnTxt}>Order Cancel</Text>
            </TouchableOpacity>
        </View>
    )
}

export default orderDetail

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
    cardmainView: {
        borderWidth: 1,
        marginTop: 20,
        paddingBottom: 20,
        borderColor: '#e7e9ea',
        borderRadius: 10,
        shadowColor: '#171717',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.4,
        shadowRadius: 2,
    },
    productName: {
        fontSize: '16@s',
        fontFamily: FONT_FAMILY.Poppins_SemiBold,
        color: 'black'
    },
    productImg: {
        height: '75@s',
        width: '75@s',
        resizeMode: 'contain',
        borderRadius: 10
    },
    addressTxt: {
        fontSize: '14@s',
        fontFamily: FONT_FAMILY.Poppins_Light,
        color: '#00000'
    },
    qunatity: {
        fontSize: '14@s',
        fontFamily: FONT_FAMILY.Poppins_Regular,
        marginTop: 5,
        color: 'black'
    },
    quaView: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: '#e7e9ea',
        paddingBottom: 4
    },
    dateTxt: {
        fontSize: '12@s',
        fontWeight: '500',
        color: '#84858d'
    },
    dateMainView: {
        marginLeft: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10
    },
    btnTxt: {
        fontSize: '14@s',
        color: '#FFF',
        fontFamily: FONT_FAMILY.Poppins_SemiBold,
        textAlign: 'center'
    },
    btnView: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        backgroundColor: '#EE3332',
        alignSelf: 'center',
        paddingVertical: 15
    }
})