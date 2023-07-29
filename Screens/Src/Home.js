import { Text, View, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, PermissionsAndroid, FlatList, Keyboard } from 'react-native';
import React, { useState, useEffect } from "react";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import images from '../Components/images';
import { FONT_FAMILY } from '../Components/Fonts';
import Helper from '../Components/Lib/Helper';
import NetInfo from "@react-native-community/netinfo";
import AlertMsg from '../Components/Lib/AlertMsg';
import ApiUrl from '../Components/Lib/ApiUrl';
import FastImage from '../Components/Lib/LoadImage'
import Geocoder from 'react-native-geocoder';
import Geolocation from '@react-native-community/geolocation';

const Home = ({ navigation }) => {
    const [cateData, setCateData] = useState([])
    const [search, setSearch] = useState('')
    const [data, setData] = useState([1, 2, 3, 4, 5, 6])
    const [categoryId, setCategoryId] = useState('')
    const [address, setAddress] = useState('')
    const [subLocality, setSubLocality] = useState('')
    const [position, setPosition] = useState({})
    const [selectDataSearch, setSelectDataSearch] = useState([])

    var MY_KEY = 'AIzaSyCFvrQR-pYzvjLQn7Azsd38wLnN0hMTW2c'

    useEffect(async () => {
        await PermisionGenret()
        getCategory()
    }, [navigation]);

    const PermisionGenret = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
            )
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                try {
                    Geolocation.getCurrentPosition(info => {
                        Geocoder.fallbackToGoogle(MY_KEY);
                        Geocoder.geocodePosition({
                            lat: info.coords.latitude,
                            lng: info.coords.longitude
                        }).then(res => {
                            let address = (res[0].formattedAddress)
                            const addr = address.slice(address.indexOf(' ') + 1);
                            console.log('addraddraddr', addr);
                            setAddress(addr)
                            let subLoc = (res[0].subLocality)
                            setSubLocality(subLoc)
                            let position = (res[0].position)
                            setPosition(position)
                        })
                            .catch(err => console.log(err))
                    });
                }
                catch (err) {
                    console.log(err)
                }
            }
            else {
                console.log("Location permission denied")
            }
        }
        catch (err) {
            console.log(err)
        }
    }

    const getCategory = async () => {
        Keyboard.dismiss();
        NetInfo.fetch().then(async (state) => {
            if (!state.isConnected) {
                Helper.showToast(AlertMsg.error.INTERNET_CONNECTION);
                return false;
            } else {
                Helper.globalLoader.showLoader()
                Helper.makeRequest({ url: ApiUrl.GETCATEGORY, method: "GET" }).then(async (response) => {
                    if (response.data.status == 200) {
                        setCateData(response.data.categories)
                        console.log('response.data.categories', JSON.stringify(response.data.categories));
                        await setCategoryId(response.data.categories[0].id)
                        console.log()
                        getCategoryItem(response.data.categories[0].id)
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

    const categoryList = ({ item }) => {
        return (
            <TouchableOpacity onPress={() => { onSetCateroryId(item) }} style={{ alignItems: 'center', paddingHorizontal: 5, marginTop: 20 }}>
                <FastImage resizeMode={'contain'} style={[styles.catIcon]} source={{ uri: item.image }} />
                <Text style={styles.categoryTxt}>{item.name}</Text>
                {/* <View style={{ height: 5, backgroundColor: 'red', width:'20%'}}></View> */}
            </TouchableOpacity>
        )
    }

    const onSetCateroryId = (item) => {
        setCategoryId(item.id)
        getCategoryItem(item.id)
    }

    const getCategoryItem = async (id) => {
        Keyboard.dismiss();
        NetInfo.fetch().then(state => {
            if (!state.isConnected) {
                Helper.showToast(AlertMsg.error.INTERNET_CONNECTION);
                return false;
            } else {
                Helper.globalLoader.showLoader()
                Helper.makeRequest({ url: ApiUrl.CATEROGYLIST + id, method: "GET" }).then((response) => {
                    if (response.data.status == 200) {
                        setData(response.data.categories)
                        console.log('response.data.categories', response.data.categories);
                        setSelectDataSearch(response.data.categories)
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

    const searchFilterFunction = (text) => {
        if (text) {
            const newData = selectDataSearch.filter(
                function (item) {
                    const itemData = item.name
                        ? item.name.toUpperCase()
                        : ''.toUpperCase();
                    const textData = text.toUpperCase();
                    return itemData.indexOf(textData) > -1;
                });
            setData(newData)
            setSearch(text)
        } else {
            setData(selectDataSearch)
            setSearch(text)
        }
    };

    const getFevratApi = (id) => {
        NetInfo.fetch().then(state => {
            if (!state.isConnected) {
                Helper.showToast(AlertMsg.error.INTERNET_CONNECTION);
                return false;
            } else {
                Helper.globalLoader.showLoader()
                Helper.makeRequest({ url: ApiUrl.addfavourite + id, method: "GET" }).then((response) => {
                    if (response.data.status == 200) {
                        getCategoryItem(categoryId)
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

    const renderItem = ({ item }) => {
        return (
            <TouchableOpacity activeOpacity={0.8} onPress={() => { navigation.navigate('ProdectDetails', { id: item.id }) }} style={styles.cartMainView}>
                <FastImage resizeMode={'contain'} style={styles.iconImg} source={{ uri: item.image }} />
                <View style={styles.priceView}>
                    <View style={styles.nameView}>
                        <Text style={styles.nameTxt}>{item.name} - {item.price}</Text>
                    </View>
                    <TouchableOpacity onPress={() => { getFevratApi(item.id) }}>
                        <Image style={[styles.searchIcon, { tintColor: item.isFavorite === false ? '#fff' : 'red' }]} source={images.fevrate} />
                    </TouchableOpacity>
                </View>
                {
                    item.discount &&

                    <View style={styles.offerView}>
                        <View style={{ flexDirection: 'row' }}>
                            <Image style={styles.offerImg} source={images.Group17} />
                            <Text style={styles.oferTxt}>{item.discount}% OFF</Text>
                        </View>
                    </View>
                }
            </TouchableOpacity>
        )
    }

    const emptyList = (
        <View style={[styles.empty_data, {marginTop:20}]}>
            <Text> Data not found ! </Text>
        </View>
    )

    return (
        <View style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
            <View style={{ marginHorizontal: 10 }}>
                <View style={styles.searchView}>
                    <Image style={styles.searchIcon} source={images.search} />
                    <TextInput style={styles.searchInput}
                        placeholder='Product Name'
                        value={search}
                        onChangeText={(e) => { searchFilterFunction(e) }}
                        placeholderTextColor="#939393"
                    />

                </View>
                <View style={{ marginTop: 15 }}>
                    <FlatList
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        renderItem={categoryList}
                        data={cateData}
                    />
                </View>
            </View>
            <ScrollView contentContainerStyle={{ flexGrow: 1, }}>
                <View style={{ marginHorizontal: 10 }}>

                    <View style={{ marginTop: 20, flex: 1 }}>
                        <FlatList
                            horizontal={false}
                            showsVerticalScrollIndicator={false}
                            renderItem={renderItem}
                            data={data}
                            ListEmptyComponent={emptyList}
                        />
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}
const styles = StyleSheet.create({
    catIcon: { height: 70, width: 70, borderRadius: 100 },
    searchIcon: { height: hp(5), width: wp(5), resizeMode: 'contain' },
    searchView: { flexDirection: 'row', borderWidth: 0.5, borderRadius: 10, marginTop: hp(5), paddingHorizontal: wp(2), alignItems: 'center' },
    searchInput: { width: '95%', fontSize: 16, fontWeight: '500', lineHeight: 20, color: '#939393' },
    categoryTxt: { fontSize: 14, color: '#828282', fontFamily: FONT_FAMILY.Poppins_Regular, fontWeight: '500', lineHeight: 30 },
    cartMainView: { width: '100%', backgroundColor: "#000000", borderRadius: 25, height: hp(30), marginBottom: 25 },
    iconImg: { height: hp(30), width: wp(100) },
    priceView: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 15, position: 'absolute', top: 10, width: '100%', alignItems: 'center' },
    nameView: { paddingHorizontal: 6, backgroundColor: "#45454580", height: 30, justifyContent: 'center', borderWidth: 1, borderColor: '#fff', borderRadius: 10 },
    nameTxt: { color: "#FFFFFF", fontFamily: FONT_FAMILY.Poppins_Regular, },
    offerView: { backgroundColor: "#548BF1", padding: 8, borderRadius: 33, position: 'absolute', width: '95%', alignSelf: 'center', bottom: -15, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    offerImg: { height: 22, width: 22, resizeMode: 'contain', marginRight: 10 },
    oferTxt: { color: "#FFFFFF", fontFamily: FONT_FAMILY.Poppins_Regular, fontWeight: '500', fontSize: 18 },
    empty_data: {
        alignSelf: 'center',
        padding: 5,
        borderWidth: 1,
        borderRadius: 5,
        borderStyle: 'dotted',
        borderColor: '#72b4d0',
        backgroundColor: '#ebf9ff'
    }
})
export default Home;