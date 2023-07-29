import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, TextInput } from 'react-native'
import React from 'react'
import { ScaledSheet, s } from 'react-native-size-matters';
import { FONT_FAMILY } from '../Components/Fonts';
import images from '../Components/images';

const ProductQuantity = () => {
    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor: '#E6E6E6' }}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Image style={styles.back} source={images.backIcon} />
                        </TouchableOpacity>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <View style={styles.input_con}>
                            <Image style={styles.search} source={images.search} />
                            <TextInput
                                style={styles.input}
                                placeholder="Search menu"
                            />
                        </View>
                        <TouchableOpacity>
                            <Image style={styles.bar} source={images.Group86} />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.box}>
                    <View style={{ flex: 3 }}>
                        <Text style={styles.ras_text}>Special Rasgulla</Text>
                        <Text style={styles.place}>Jhotwara, Jaipur</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                            <Image style={{ height: s(10), width: s(12), resizeMode: 'contain' }} source={images.Group228} />
                            <Text style={{ fontSize: s(9), fontFamily: FONT_FAMILY.Poppins_Regular, color: '#E0AB8B', marginLeft: s(3) }}>20-25 min (closes in 55 mins)</Text>
                            <Text style={{ fontSize: s(9), fontFamily: FONT_FAMILY.Poppins_Regular, color: '#000', marginLeft: s(3) }}>| 2 km away</Text>
                        </View>
                    </View>
                    <View style={{ flex: 1, backgroundColor: 'green', borderRadius: s(22), borderWidth: 1, borderColor: '#000', overflow: 'hidden' }}>
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ color: '#fff', fontFamily:FONT_FAMILY.Poppins_SemiBold, }}>3.6 *</Text>
                        </View>
                        <View style={{ backgroundColor: "#fff", flex: 1, alignItems: 'center' }}>
                            <Text style={{ color: '#3E3E46', textAlign: 'center', fontSize: s(10), fontFamily:FONT_FAMILY.Poppins_SemiBold,}}>600{"\n"}Reviews</Text>
                        </View>
                    </View>
                </View>
            </View>
        </ScrollView>
    )
}

export default ProductQuantity

const styles = ScaledSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: "10@s"
    },
    header: {
        flexDirection: 'row',
        paddingVertical: "10@s",
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    back: {
        height: '17@s',
        width: '17@s',
        resizeMode: 'contain'
    },
    bar: {
        height: '32@s',
        width: '32@s',
        resizeMode: 'contain'
    },
    title: {
        fontSize: '13@s',
        fontWeight: "500",
        fontFamily: FONT_FAMILY.Poppins_Regular,
        color: "#939393",
        marginLeft: "8@s"
    },
    input: {
        fontSize: '10@s',
        flex: 1
    },
    input_con: {
        borderWidth: 1,
        height: '32@s',
        borderColor: "#999",
        borderRadius: '25@s',
        marginRight: "10@s",
        width: '130@s',
        flexDirection: 'row',
        alignItems: 'center', paddingLeft: "5@s",
        backgroundColor: '#fff'
    },
    search: {
        height: '14@s',
        width: '14@s',
        resizeMode: 'contain',
        tintColor: "#D75D6C"
    },
    box: {
        backgroundColor: "#ffff",
        padding: "8@s",
        borderRadius: "15@s",
        flexDirection: 'row'
    },
    ras_text: {
        fontSize: 18,
        color: "#2C2C38",
        fontFamily: FONT_FAMILY.Poppins_SemiBold
    },
    place: {
        fontSize: 12,
        color: "#737479",
        fontFamily: FONT_FAMILY.Poppins_Regular,
        marginTop: "7@s"
    }
})