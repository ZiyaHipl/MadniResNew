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

const Favorite = ({ navigation }) => {
  const [data, setData] = useState([])

  useEffect(() => {
    getAllFevratData()
  }, [navigation]);

  const getAllFevratData = (id) => {
    NetInfo.fetch().then(state => {
      if (!state.isConnected) {
        Helper.showToast(AlertMsg.error.INTERNET_CONNECTION);
        return false;
      } else {
        Helper.globalLoader.showLoader()
        Helper.makeRequest({ url: ApiUrl.getFavourite, method: "GET" }).then((response) => {
          if (response.data.status == 200) {
            setData(response.data.categories)
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

  const removeFevratData = (id) => {
    NetInfo.fetch().then(state => {
      if (!state.isConnected) {
        Helper.showToast(AlertMsg.error.INTERNET_CONNECTION);
        return false;
      } else {
        Helper.globalLoader.showLoader()
        Helper.makeRequest({ url: ApiUrl.removeFavourite + id, method: "PUT" }).then((response) => {
          if (response.data.status == 200) {
            getAllFevratData()
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
      <View style={styles.card}>
        <FastImage resizeMode={'cover'} style={styles.img} source={{ uri: item.image }} />
        <View style={{ padding: s(10) }}>
          {/* <View style={styles.d_flex}>
            <Text style={styles.ras}>Rosado</Text>
            <Text style={styles.butn}>4.3*</Text>
          </View> */}
          <View style={styles.d_flex}>
            <Text style={styles.text}>{item.name}</Text>
            <Text style={styles.text}>₹ {item.price}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => { removeFevratData(item.id) }} style={styles.touch}>
          <Image style={styles.fev} source={images.fevrate} />
        </TouchableOpacity>
      </View>
    )
  }
  return (
    <View style={styles.contaner}>
      <View style={{flexDirection:'row', alignItems:'center'}}>
        <Image style={{height:20, width:20, resizeMode:'contain'}} source={images.backIcon}/>
        <Text style={[styles.head_text, {marginLeft:10}]}>Favorite</Text>
      </View>
      {
        data.length == 0 ?
          <Text style={styles.head_text}>Favorite Data not found</Text>
          :

          <FlatList
            data={data}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
          />
      }
    </View>
  )
}

export default Favorite

const styles = ScaledSheet.create({
  contaner: {
    flex: 1,
    paddingHorizontal: "5@s"
  },
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
  ras: {
    fontSize: '16@s',
    fontFamily: FONT_FAMILY.Poppins_SemiBold,
    color: "#000000",
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
  butn: {
    color: '#fff',
    backgroundColor: "green",
    paddingHorizontal: '8@s',
    paddingVertical: '3@s',
    borderRadius: '3@s'
  },
  fev: {
    height: s(18),
    width: s(18),
    resizeMode: 'contain',
    tintColor: 'red'
  },
  touch: {
    position: 'absolute',
    right: '12@s',
    top: '12@s'
  }
})