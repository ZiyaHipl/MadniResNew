import { FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, Modal, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import { ScaledSheet, s } from 'react-native-size-matters';
import images from '../Components/images';
import { FONT_FAMILY } from '../Components/Fonts';
import Helper from '../Components/Lib/Helper';
import NetInfo from "@react-native-community/netinfo";
import AlertMsg from '../Components/Lib/AlertMsg';
import ApiUrl from '../Components/Lib/ApiUrl';
import FastImage from '../Components/Lib/LoadImage'
import RazorpayCheckout from 'react-native-razorpay'
import RNUpiPayment from 'react-native-upi-payment'
const MyCard = ({ navigation }) => {
    // alert('ikkkkk')
    const [dataorder, setData] = useState([])
    const [subTotal, setSubTotal] = useState('')
    const [modalVisible, setModalVisible] = useState(false);
    const [address, setAddress] = useState([])
    const [selectAddre, setselectAddre] = useState('')
    const [selectAddre_id, setselectAddre_id] = useState('')

    useEffect(() => {
        getAllCardData()
        getAddress()
    }, []);

    const getAllCardData = async () => {
        NetInfo.fetch().then(state => {
            if (!state.isConnected) {
                Helper.showToast(AlertMsg.error.INTERNET_CONNECTION);
                return false;
            } else {
                Helper.globalLoader.showLoader()
                Helper.makeRequest({ url: ApiUrl.GETCARD, method: "GET" }).then((response) => {
                    if (response.data.status == 200) {
                        setData(response.data.categories[0].cartItems)
                        setSubTotal(response.data.categories[0])
                        Helper.globalLoader.hideLoader()
                        Helper.showToast(response.data.message)
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

    const deleteApi = async (productId) => {
        NetInfo.fetch().then(state => {
            if (!state.isConnected) {
                Helper.showToast(AlertMsg.error.INTERNET_CONNECTION);
                return false;
            } else {
                Helper.globalLoader.showLoader()
                Helper.makeRequest({ url: ApiUrl.REMOVECARD + productId, method: "PUT" }).then((response) => {
                    if (response.data.status == 200) {
                        getAllCardData()
                        Helper.globalLoader.hideLoader()
                        Helper.showToast(response.data.message)
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

    const addQuantity = (item) => {
        NetInfo.fetch().then(state => {
            if (!state.isConnected) {
                Helper.showToast(AlertMsg.error.INTERNET_CONNECTION);
                return false;
            } else {
                Helper.globalLoader.showLoader()
                Helper.makeRequest({ url: ApiUrl.ADDQuantity + item.productId + `&quantity=1`, method: "GET" }).then((response) => {
                    if (response.data.status == 200) {
                        getAllCardData()
                        Helper.globalLoader.hideLoader()
                        // Helper.showToast(response.data.message)
                    }
                    else {
                        Helper.globalLoader.hideLoader()
                        // Helper.showToast(response.data.message);
                    }
                }).catch(err => {
                    Helper.globalLoader.hideLoader()
                })
            }
        })
    }

    const removeQuantity = (item) => {
        NetInfo.fetch().then(state => {
            if (!state.isConnected) {
                Helper.showToast(AlertMsg.error.INTERNET_CONNECTION);
                return false;
            } else {
                Helper.globalLoader.showLoader()
                Helper.makeRequest({ url: ApiUrl.ADDQuantity + item.productId + `&quantity=-1`, method: "GET" }).then((response) => {
                    if (response.data.status == 200) {
                        getAllCardData()
                        Helper.globalLoader.hideLoader()
                        // Helper.showToast(response.data.message)
                    }
                    else {
                        Helper.globalLoader.hideLoader()
                        // Helper.showToast(response.data.message);
                    }
                }).catch(err => {
                    Helper.globalLoader.hideLoader()
                })
            }
        })
    }

    const getAddress = (item) => {
        NetInfo.fetch().then(state => {
            if (!state.isConnected) {
                Helper.showToast(AlertMsg.error.INTERNET_CONNECTION);
                return false;
            } else {
                Helper.globalLoader.showLoader()
                Helper.makeRequest({ url: ApiUrl.GETADDRESS, method: "GET" }).then(async (response) => {
                    if (response.data.status == 200) {
                        setAddress(response.data.addresses)
                        await setselectAddre(response.data.addresses[0] != '' ? response.data.addresses[0].name : null)
                        setselectAddre_id(response.data.addresses[0].id)
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

    const removeAddressApi = (id) => {
        NetInfo.fetch().then(state => {
            if (!state.isConnected) {
                Helper.showToast(AlertMsg.error.INTERNET_CONNECTION);
                return false;
            } else {
                Helper.globalLoader.showLoader()
                Helper.makeRequest({ url: ApiUrl.REMOVEADDRESS + id, method: "PUT" }).then((response) => {
                    if (response.data.status == 200) {
                        Helper.globalLoader.hideLoader()
                        getAddress()
                        Helper.showToast(response.data.message)
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

    const selectAddress = async (item) => {
        setselectAddre(item.name)
        setModalVisible(false)
        // getAddress()
    }

    const getAddressList = ({ item }) => {
        return (
            <TouchableOpacity onPress={() => { selectAddress(item) }} style={{ flexDirection: 'row', marginTop: 20, marginLeft: 5, alignItems: 'center' }}>
                <View style={{ flex: 0.1, alignSelf: 'center' }}>
                    <Image style={styles.addressIcon} source={images.address} />
                </View>
                <View style={{ flex: 0.8 }}>
                    <Text numberOfLines={3} style={styles.addressTxt}>{item.name}</Text>
                </View>
                <View style={{ flex: 0.1, justifyContent: 'center', alignItems: 'center', }}>
                    <TouchableOpacity onPress={() => { removeAddressApi(item.id) }}>
                        <Image style={{ height: 20, width: 20, resizeMode: 'contain' }} source={images.trash} />
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        )
    }

    const renderItem = ({ item }) => {
        return (
            <View style={styles.card}>
                <FastImage resizeMode={'cover'} style={styles.img} source={{ uri: item.image }} />
                <View style={{ padding: s(10) }}>
                    <View style={styles.d_flex}>
                        <Text numberOfLines={1} style={[styles.text, { width: '80%' }]}> Name :{item.name}</Text>
                        <Text style={styles.text}>₹ {item.quantity * item.price}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ flex: 0.25 }}>
                            <Text style={styles.text}> Quantity</Text>
                        </View>
                        <View style={{ flex: 0.75 }}>
                            <View style={[styles.add_butn, { width: '30%' }]}>
                                <TouchableOpacity style={{ paddingHorizontal: 5 }} onPress={() => { removeQuantity(item) }}>
                                    <Text style={{ fontSize: 22 }}>-</Text>
                                </TouchableOpacity>
                                <Text style={styles.text}>{item.quantity}</Text>
                                <TouchableOpacity onPress={() => { addQuantity(item) }}>
                                    <Text style={{ fontSize: 22 }}>+</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
                <TouchableOpacity onPress={() => { deleteApi(item.productId) }} style={styles.deleteView}>
                    <Image style={styles.deleteIcon} source={images.trash} />
                </TouchableOpacity>
            </View>
        )
    }

    const emptyList = (
        <View style={styles.empty_data}>
            <Text> Favorite Data not found </Text>
        </View>
    )

    const _OrderApiCall = async () => {
        NetInfo.fetch().then(state => {
            if (!state.isConnected) {
                Helper.showToast(AlertMsg.error.INTERNET_CONNECTION);
                return false;
            } else {
                var data = {
                    addressId: selectAddre_id,
                    cartItems: dataorder,
                    totalPrice: subTotal.overAllPrice
                }
                Helper.globalLoader.showLoader()
                Helper.makeRequest({ url: ApiUrl.ORDERPLACE, method: "POST", data: data }).then((response) => {
                    if (response.data.status == 200) {
                        Helper.globalLoader.hideLoader()
                        // PaymentCalling()
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



    return (
        <View style={styles.mainView}>
            <Text style={styles.head_text}>My Cart</Text>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.contaner, { paddingBottom: '30%' }]}>

                <View style={{ marginBottom: 0, }}>
                    <FlatList
                        data={dataorder}
                        renderItem={renderItem}
                        showsVerticalScrollIndicator={false}
                        ListEmptyComponent={emptyList}
                    />
                </View>
                {
                    dataorder.length != 0 &&
                    <View style={styles.totalCartView}>
                        <Text style={styles.billTxt}>Bill Details</Text>
                        <View style={styles.totlaView}>
                            <Text style={styles.ItemTxt}>Item total (incl. texes)</Text>
                            <Text style={styles.ItemTxt}>{subTotal.overAllPrice}</Text>
                        </View>
                        <View style={styles.totlaView}>
                            <Text style={styles.ItemTxt}>Delivery Charg</Text>
                            <Text style={styles.ItemTxt}>300</Text>
                        </View>
                        <View style={styles.totlaView}>
                            <Text style={styles.ItemTxt}>Grand Total</Text>
                            <Text style={styles.ItemTxt}>{subTotal.overAllPrice}</Text>
                        </View>
                    </View>
                }

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        setModalVisible(false);
                    }}>
                    <View style={styles.centeredView}>
                        <View style={{ marginHorizontal: 10 }}>
                            <Text style={styles.selectTxt}>Select a location</Text>
                            <TouchableOpacity onPress={() => { navigation.navigate('SelectAddress') }}>
                                <Text style={styles.addTxt}>+ Add New Address</Text>
                            </TouchableOpacity>
                            <View style={styles.borderView} />
                            <Text style={styles.saveTxt}>Save address</Text>
                        </View>
                        <FlatList
                            renderItem={getAddressList}
                            data={address}
                        />
                    </View>
                </Modal>

            </ScrollView>
            <View style={styles.buttonView}>
                {
                    selectAddre == '' ?
                        // <View>
                        //     <Text style={[styles.buttonTxt, { color: 'red' }]}>Add Address at next step</Text>
                        // </View>
                        null
                        :
                        <View style={{ backgroundColor: '#EE3332', paddingVertical: 10, flexDirection: 'row', width: '100%', borderBottomWidth: 0.3, color: 'gray', alignItems: 'center' }}>
                            <View style={{ flex: 0.15 }}>
                                <Image style={styles.bottomIcon} source={images.address} />
                            </View>
                            <View style={{ flex: 0.65, }}>
                                <Text numberOfLines={2} style={styles.selectModalAdd}>{selectAddre}</Text>
                            </View>
                            <TouchableOpacity onPress={() => { setModalVisible(true) }} style={{ flex: 0.20, }}>
                                <Text style={styles.changeTxt}>Change</Text>
                            </TouchableOpacity>
                        </View>
                }
                {
                    selectAddre == '' ?
                        <TouchableOpacity style={styles.clickView} onPress={() => { selectAddre != '' ? setModalVisible(true) : navigation.navigate('SelectAddress') }}>
                            <Text style={styles.buttonTxt}>Add Address at next step</Text>
                        </TouchableOpacity>
                        :
                        <TouchableOpacity style={styles.clickView} onPress={() => {
                            RNUpiPayment.initializePayment({
                                vpa: '6377667088@ybi', // or can be john@ybl or mobileNo@upi
                                payeeName: 'John Doe',
                                amount: '100',
                                transactionRef: 'aasf-332-aoei-fn'
                            }, ()=>{console.log('successCallback');}, ()=>{console.log('failureCallback');});
                        }}>
                            <Text style={styles.buttonTxt}>Order</Text>
                        </TouchableOpacity>
                }
            </View>
        </View>
    )
}

export default MyCard

const styles = ScaledSheet.create({
    contaner: {
        flexGrow: 1,
    },
    mainView: { flex: 1, paddingHorizontal: "5@s" },
    head_text: {
        fontSize: '18@s',
        marginVertical: '8@s',
        fontFamily: FONT_FAMILY.Poppins_SemiBold,
        color: "#000000",
        textAlign: 'center'
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: "10@s",
        elevation: "5@s",
        margin: "5@s",
        overflow: 'hidden'
    },
    img: {
        height: "200@s",
        width: "100%",
    },
    text: {
        fontSize: '12@s',
        fontFamily: FONT_FAMILY.Poppins_Light,
        color: "#555",
    },
    d_flex: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    buttonView: { position: 'absolute', bottom: 5, width: '100%', alignSelf: 'center' },
    clickView: { backgroundColor: '#EE3332', padding: 10, },
    buttonTxt: { color: '#FFFFFF', fontSize: '12@s', lineHeight: 29, fontWeight: '500', fontFamily: FONT_FAMILY.Poppins_SemiBold, textAlign: 'center' },
    totlaView: { flexDirection: 'row', justifyContent: 'space-between' },
    totalCartView: { backgroundColor: '#FFF', elevation: 2, margin: s(5), borderRadius: 10, padding: s(5), paddingHorizontal: s(15), paddingVertical: s(10) },
    billTxt: { fontSize: '14@s', fontFamily: FONT_FAMILY.Poppins_Bold, fontWeight: '500', lineHeight: 30 },
    ItemTxt: { fontSize: '12@s', fontFamily: FONT_FAMILY.Poppins_Medium, fontWeight: '500', lineHeight: 20 },
    deleteView: { position: 'absolute', top: 10, right: 10 },
    deleteIcon: { height: 22, width: 22, resizeMode: 'contain' },
    add_butn: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF6F7', borderWidth: 1, borderColor: '#E3C0C7', paddingHorizontal: "10@s", borderRadius: "5@s", flex: 1, margin: "5@s", justifyContent: 'space-between', padding: '6@s'
    },
    centeredView: {
        height: '80%',
        width: '100%',
        backgroundColor: '#E8EBE9',
        position: 'absolute',
        bottom: 0,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30
    },
    selectTxt: {
        fontSize: '14@s',
        fontFamily: FONT_FAMILY.Poppins_Bold,
        fontWeight: '600',
        lineHeight: 30,
        marginTop: 10,
        color: "#000000"
    },
    addTxt: {
        fontSize: '14@s',
        fontFamily: FONT_FAMILY.Poppins_Bold,
        fontWeight: '600',
        lineHeight: 30,
        color: '#254d33',
        marginTop: 10
    },
    borderView: {
        height: 2,
        backgroundColor: '#ada4a4',
        width: '100%',
        marginTop: 5
    },
    saveTxt: {
        fontSize: '14@s',
        fontFamily: FONT_FAMILY.Poppins_Bold,
        fontWeight: '600',
        lineHeight: 30,
        marginTop: 15
    },
    addressIcon: { height: 25, width: 25, resizeMode: 'contain' },
    addressTxt: {
        fontSize: '12@s',
        fontFamily: FONT_FAMILY.Poppins_Medium,
        fontWeight: '200',
        lineHeight: 20,
        color: 'black',
    },
    bottomIcon: { height: 20, width: 20, resizeMode: 'contain', alignSelf: "center" },
    selectModalAdd: {
        fontSize: 14,
        fontFamily: FONT_FAMILY.Poppins_SemiBold,
        fontWeight: '500',
        color: 'black'
    },
    changeTxt: {
        fontSize: 14,
        fontFamily: FONT_FAMILY.Poppins_Regular,
        fontWeight: '200',
        textAlign: 'center',
        color: 'green'
    },
    empty_data: {
        alignSelf: 'center',
        padding: 5,
        borderWidth: 1,
        borderRadius: 5,
        borderStyle: 'dotted',
        borderColor: '#72b4d0',
        backgroundColor: '#ebf9ff',
    }
})