import { ScrollView, Text, Image, View, TextInput, TouchableOpacity, FlatList, Modal } from 'react-native'
import React, { useState, useEffect } from 'react'
import { ScaledSheet, s } from 'react-native-size-matters';
import images from '../Components/images';
import { FONT_FAMILY } from '../Components/Fonts';
import Helper from '../Components/Lib/Helper';
import NetInfo from "@react-native-community/netinfo";
import AlertMsg from '../Components/Lib/AlertMsg';
import ApiUrl from '../Components/Lib/ApiUrl';
import FastImage from '../Components/Lib/LoadImage'

const ProdectDetails = ({ navigation, route }) => {
  const [counter, setCounter] = useState(1);
  const [selectQuan, setSelectQuan] = useState([1, 2, 3, 4, 5])
  const [pageDetails, setPageDatils] = useState('')
  const [amount,setamount]=useState('')
  const [size, setSize] = useState('')
  useEffect(() => {
    getItemDetails()
  }, [navigation]);
  const incrementCounter = () => {
    if (counter <= 9) {
      setCounter(counter + 1);
    } else {
      alert('alert')
    }
  };

  const decrementCounter = () => {
    if (counter >= 2) {
      setCounter(counter - 1);
    }
  };


  const selectSize = (item) => {
    setSize(item._id)
    setamount(item.price)
  }

  const chooseQuantity = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => { selectSize(item) }} style={[styles.select, { backgroundColor: size == item._id ? '#F04F5F':'#FFF' }]}>
        <Text style={[styles.sl_text, { color: size == item._id ? "#FFF" : '#E59773', }]}>{item.name}</Text>
      </TouchableOpacity>
    )
  }



  const getItemDetails = () => {
    NetInfo.fetch().then(state => {
      if (!state.isConnected) {
        Helper.showToast(AlertMsg.error.INTERNET_CONNECTION);
        return false;
      } else {
        Helper.globalLoader.showLoader()
        Helper.makeRequest({ url: ApiUrl.GETDETAILS + route.params.id, method: "GET" }).then((response) => {
          if (response.data.status == 200) {
            setPageDatils(response.data.categories)
            setSelectQuan(response.data.categories.details)
            setamount(response.data.categories.price)
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


  const addToCard = async () => {
    NetInfo.fetch().then(state => {
      if (!state.isConnected) {
        Helper.showToast(AlertMsg.error.INTERNET_CONNECTION);
        return false;
      } else {
        var data = {
          productId: pageDetails.id,
          quantity: counter,
          price: pageDetails.price
        }
        Helper.globalLoader.showLoader()
        Helper.makeRequest({ url: ApiUrl.ADDCARD, method: "POST", data: data }).then((response) => {
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
    <ScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor: '#F5F5F5' }}>
      <View style={styles.header}>
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image style={styles.back} source={images.backIcon} />
          </TouchableOpacity>
          <Text style={styles.title}>{pageDetails.name}</Text>
        </View>
      </View>
      <View style={styles.container}>
        <View style={styles.modal_popup}>
          <View style={{ backgroundColor: "#fff", borderRadius: s(10), padding: s(5) }}>
            <FastImage resizeMode={'contain'} style={styles.detailsImg} source={{ uri: pageDetails.image }} />
            <View style={styles.nameView}>
              <Text style={styles.nameTxt}>{pageDetails.name}</Text>
              {
                pageDetails.isFavorite == true &&
                <Image style={styles.fevIcon} source={images.Group4} />
              }

            </View>
            <Text style={styles.nameTxt}>price: {pageDetails.price}  <Text style={[styles.nameTxt, { color: 'red', textDecorationLine: 'line-through', textDecorationStyle: 'solid', }]}>{pageDetails.discount}% Off</Text></Text>
            <Text numberOfLines={3} style={[styles.discriptionTxt, { marginTop: 10 }]}>{pageDetails.description}</Text>
          </View>
          <View style={{ backgroundColor: "#fff", borderRadius: s(10), padding: s(5), marginTop: s(10) }}>
            <View style={styles.nameView}>
              <Text style={styles.nameTxt}>Size</Text>
            </View>
            <Text style={styles.discriptionTxt}>Select any 1 option</Text>
            <FlatList
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              renderItem={chooseQuantity}
              data={selectQuan}
            />

          </View>
        </View>
        <View style={{ flexDirection: 'row', backgroundColor: '#fff', padding: s(8) }}>
          <View style={styles.add_butn}>
            <TouchableOpacity style={{ paddingHorizontal: 5 }} onPress={decrementCounter}>
              <Text style={{ fontSize: 22 }}>-</Text>
            </TouchableOpacity>
            <Text style={{ fontSize: 22 }}>{counter}</Text>
            <TouchableOpacity onPress={incrementCounter}>
              <Text style={{ fontSize: 22 }}>+</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={() => { addToCard() }} style={styles.add_butn2}>
            <Text style={{ fontSize: 16, fontFamily: FONT_FAMILY.Poppins_Bold, color: '#fff', textAlign: 'center' }}>Add item ₹ {counter * amount} </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  )
}

export default ProdectDetails

const styles = ScaledSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: "10@s",
    backgroundColor: '#FFF'
  },
  detailsImg: { width: '100%', height: s(200), borderRadius: s(10), marginBottom: s(5) },
  nameView: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  nameTxt: { fontSize: s(12), color: '#2C2C38', fontFamily: FONT_FAMILY.Poppins_Medium },
  fevIcon: { height: s(25), width: s(25), resizeMode: 'contain' },
  discriptionTxt: { fontSize: s(10), color: '#6A6B70', fontFamily: FONT_FAMILY.Poppins_Medium },
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
  title: {
    fontSize: '14@s',
    fontWeight: "500",
    fontFamily: FONT_FAMILY.Poppins_Regular,
    color: "#939393",
    marginLeft: "8@s"
  },
  vag: {
    height: '20@s',
    width: '20@s',
    resizeMode: 'contain',
  },
  sweet: {
    height: '150@s',
    width: '100%',
    resizeMode: 'contain'
  },
  modal_popup: {
    backgroundColor: '#F5F6FB',
    borderTopEndRadius: '15@s',
    borderTopStartRadius: '15@s'
  },
  select: { borderWidth: 0.5, borderRadius: "4@s", borderColor: "#E59773", margin: "8@s", height: 30, width: 70, alignItems: 'center', justifyContent: 'center' },
  sl_text: { fontSize: s(15), textAlign: 'center' },
  add_butn: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF6F7', borderWidth: 1, borderColor: '#E3C0C7', paddingHorizontal: "10@s", borderRadius: "5@s", flex: 1, margin: "5@s", justifyContent: 'space-between', padding: '6@s'
  },
  add_butn2: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#F04F5F', flex: 4, margin: "5@s", borderRadius: "5@s", justifyContent: 'center'
  }
})