import { Text, View, StyleSheet, TouchableOpacity, Image, Dimensions, PermissionsAndroid } from 'react-native';
import React, { useState, useEffect } from "react";
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import Geocoder from 'react-native-geocoder';
import images from '../Components/images';
import { FONT_FAMILY } from '../Components/Fonts';
import Helper from '../Components/Lib/Helper';
import NetInfo from "@react-native-community/netinfo";
import AlertMsg from '../Components/Lib/AlertMsg';
import ApiUrl from '../Components/Lib/ApiUrl';
// import GooglePlaces from '../Components/GooglePlaces';


const SelectAddress = ({ navigation }) => {
    const { width, height } = Dimensions.get('window');
    const placesRef = React.createRef();
    const [address, setAddress] = useState('')
    const [subLocality, setSubLocality] = useState('')
    const [position, setPosition] = useState({})
    const [originlatlong, setOriginlatlong] = useState("")
    const [origin, setOrigin] = useState("")
    const [visible, setVisible] = useState(false)
    const [addressName, setAddressName] = useState('')
    const [fullAddre, setFullAddre] = useState('')
    const myMap = React.createRef();
    var MY_KEY = 'AIzaSyCFvrQR-pYzvjLQn7Azsd38wLnN0hMTW2c'
    // Geocoder.fallbackToGoogle(MY_KEY);

    let originLoc = {
        latitude: position.lat,
        longitude: position.lng,
    };

    useEffect(async (props) => {
        PermisionGenret()
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
                            setAddressName(res[0].locality)
                            let address = (res[0].formattedAddress)
                            const addr = address.slice(address.indexOf(' ') + 1);
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


    const addAddress = async () => {
        NetInfo.fetch().then(state => {
            if (!state.isConnected) {
                Helper.showToast(AlertMsg.error.INTERNET_CONNECTION);
                return false;
            } else {
                var data = {
                    address: address,
                    longitude: originLoc.longitude,
                    latitude: originLoc.latitude
                }
                Helper.globalLoader.showLoader()
                Helper.makeRequest({ url: ApiUrl.ADDADDRESS, method: "POST", data: data }).then((response) => {
                    if (response.data.status == 200) {
                        Helper.globalLoader.hideLoader()
                        Helper.showToast(response.data.message);
                        navigation.navigate('MyCard')
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
        <View style={{ flex: 1 }}>
            {
                originLoc != '' && undefined ?
                    <View style={{ marginHorizontal: 15 }}>
                        <GooglePlacesAutocomplete
                            ref={placesRef}
                            placeholder='Search'
                            enableHighAccuracyLocation={true}
                            poweredContainer={false}
                            minLength={1}
                            autoFocus={false}
                            renderDescription={row => row.description}
                            returnKeyType={'search'}
                            keyboardAppearance={'light'}
                            listViewDisplayed="auto"
                            fetchDetails={true}
                            onPress={(data, details = null) => {
                                setPosition(details.geometry.location)
                                if (details && details.formatted_address) {
                                    let address = (details.formatted_address)
                                    const addr = address.slice(address.indexOf(' ') + 1);
                                    setAddress(addr)
                                    let name = (details.name)
                                    setAddressName(name)
                                }
                                if (
                                    details &&
                                    details.geometry &&
                                    details.geometry.location
                                ) {
                                    let position = (details.geometry.location)
                                    setOriginlatlong()
                                    // this.setState({ position: position })
                                }
                            }}
                            getDefaultValue={{
                                latitude: position.lat,
                                longitude: position.lng,
                                latitudeDelta: 0.0922,
                                longitudeDelta: 0.0421,
                            }}
                            enablePoweredByContainer={false}
                            // currentLocation={true}
                            // currentLocationLabel="Current location"
                            nearbyPlacesAPI="GooglePlacesSearch"
                            GooglePlacesSearchQuery={{
                                rankby: 'distance',
                            }}
                            styles={{
                                container: {
                                    position: 'absolute',
                                    top: height / 25.7,
                                    zIndex: 9999,
                                    width: '100%',
                                },
                                textInputContainer: {
                                    height: height / 15,
                                    width: '100%',
                                },
                                textInput: {
                                    borderRadius: 5,
                                    fontSize: 12,
                                    height: '100%',
                                    width: '90%',
                                    elevation: 5,
                                    backgroundColor: '#fff',
                                    fontWeight: '600',
                                    color: '#000',
                                },
                                description: {
                                    fontWeight: 'bold',
                                },
                                listView: {
                                    color: 'black',
                                    zIndex: 1000,
                                },
                            }}
                            query={{
                                key: 'AIzaSyCFvrQR-pYzvjLQn7Azsd38wLnN0hMTW2c',
                                language: 'en',
                                types: 'establishment',
                                radius: "10000", //100 km
                                components: "country:IN", // country name
                            }}
                            GoogleReverseGeocodingQuery={{}}
                            GooglePlacesDetailsQuery={{
                                fields: ['formatted_address', 'geometry'],
                            }}
                            filterReverseGeocodingByTypes={[
                                'locality',
                                'administrative_area_level_3',
                            ]}
                            predefinedPlacesAlwaysVisible={true}
                        />

                        <View style={{ height: '100%', width: '100%' }}>
                            <MapView
                                ref={myMap}
                                style={{ flex: 1 }}
                                initialRegion={{
                                    latitude: position.lat,
                                    longitude: position.lng,
                                    latitudeDelta: 0.001 * 1.5,
                                    longitudeDelta: 0.001 * 1.5,
                                }}
                                region={{
                                    latitude: position.lat,
                                    longitude: position.lng,
                                    latitudeDelta: 0.001 * 1.5,
                                    longitudeDelta: 0.001 * 1.5,
                                }}
                                mapType="standard"
                                zoomEnabled={true}
                                pitchEnabled={true}
                                showsCompass={true}
                                showsBuildings={true}
                                userLocationPriority='high'
                                showsIndoors={true}
                                userInterfaceStyle='dark'
                                userLocationUpdateInterval={5000}
                                userLocationFastestInterval={5000}
                                showsMyLocationButton={true}
                                showsIndoorLevelPicker={true}
                                moveOnMarkerPress={true}
                            >
                                <Marker
                                    coordinate={originLoc}
                                    image={images.location}
                                    width={50}
                                    height={50}
                                    draggable={true}
                                />
                            </MapView>
                        </View>
                    </View> : null
            }
            <View style={styles.addressView}>
                <View style={{ flexDirection: 'row', marginTop: 20, marginHorizontal: 10 }}>
                    <View style={{ flex: 0.15, }}>
                        <Image style={styles.saveLocationIcon} source={images.location} />
                    </View>
                    <View style={{ flex: 0.85 }}>
                        <Text style={styles.addressTxt}>{addressName ? addressName : address}</Text>
                        <Text style={styles.bottomTxt}>{fullAddre ? fullAddre : address}</Text>
                    </View>
                </View>
                <TouchableOpacity activeOpacity={0.9} onPress={() => { addAddress() }} style={styles.signinView}>
                    <Text style={styles.signinTxt}>Save Address</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    addressView: { position: 'absolute', bottom: 0, height: 150, width: '100%', backgroundColor: '#FFF', borderTopRightRadius: 20, borderTopLeftRadius: 20, elevation: 2 },
    saveLocationIcon: { height: 30, width: 30, resizeMode: 'contain' },
    addressTxt: { fontSize: 14, fontFamily: FONT_FAMILY.Poppins_SemiBold, fontWeight: '300', color: 'black' },
    bottomTxt: { fontSize: 12, fontFamily: FONT_FAMILY.Poppins_Light, fontWeight: '200', },
    signinView: { alignItems: 'center', paddingVertical: 15, backgroundColor: '#EE3332', borderRadius: 5, marginHorizontal: 10, marginTop: 15 },
    signinTxt: { color: '#FFFFFF', fontSize: 16, lineHeight: 29, fontWeight: '500', fontFamily: FONT_FAMILY.Poppins_SemiBold },
})
export default SelectAddress;