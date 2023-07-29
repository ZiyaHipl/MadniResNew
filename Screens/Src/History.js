import { Alert, FlatList, Image, ScrollView, RefreshControl, Text, TouchableOpacity, View } from 'react-native'
import React, { useState, useEffect } from 'react'
import { FONT_FAMILY } from '../Components/Fonts';
import { ScaledSheet, s } from 'react-native-size-matters';
import images from '../Components/images';
import Helper from '../Components/Lib/Helper';
import NetInfo from "@react-native-community/netinfo";
import AlertMsg from '../Components/Lib/AlertMsg';
import ApiUrl from '../Components/Lib/ApiUrl';
import FastImage from '../Components/Lib/LoadImage'
import moment from "moment";


const History = ({ navigation }) => {
  const [pending, setPending] = useState(true)
  const [complit, setComplit] = useState(false)
  const [cancel, setCancel] = useState(false)
  const [pendingData, setpendingData] = useState([])
  const [filterTab, setfilterTab] = useState('Pending')
  const [isRefreshing, setisRefreshing] = useState(false)

  useEffect(() => {
    orderHistory('Pending')
  }, [navigation]);

  const onRefresh = () => {
    setisRefreshing(true)
    // orderHistory(false)
  }

  const slelectOption = async (status) => {
    console.log('filterTabfilterTabfilterTabfilterTab', filterTab);
    if (status == 'pending') {
      setPending(true), setComplit(false), setCancel(false)
      await setfilterTab('Pending')
      orderHistory('Pending')
    } else if (status == 'complete') {
      setPending(false), setComplit(true), setCancel(false)
      await setfilterTab('Completed')
      orderHistory('Completed')
    } else if (status == 'cancel') {
      setPending(false), setComplit(false), setCancel(true)
      await setfilterTab('Cancelled')
      orderHistory('Cancelled')
    } else {
      setPending(false), setComplit(false), setCancel(false)
    }
  }

  const orderHistory = async (filterTab) => {
    NetInfo.fetch().then(state => {
      if (!state.isConnected) {
        Helper.showToast(AlertMsg.error.INTERNET_CONNECTION);
        return false;
      } else {
        Helper.globalLoader.showLoader()
        Helper.makeRequest({ url: ApiUrl.ORDERHISTPRY + filterTab, method: "GET" }).then((response) => {
          if (response.data.status == 200) {
            setpendingData(response.data.orderHistory)
            Helper.globalLoader.hideLoader()
            setisRefreshing(false)
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
      <TouchableOpacity activeOpacity={5} onPress={() => { filterTab === 'Pending' ? navigation.navigate('orderDetail', { order_Id: item.id }) : null }} style={styles.cardmainView}>
        <View style={{ flexDirection: 'row', marginTop: 10, borderBottomWidth: 1, borderColor: '#e7e9ea', paddingBottom: 5 }}>
          <View style={{ flex: 0.33, alignItems: 'center' }}>
            <FastImage resizeMode={'cover'} style={styles.productImg} source={{ uri: item.image }} />
          </View>
          <View style={{ flex: 0.67, justifyContent: 'center' }}>
            <Text numberOfLines={2} style={styles.productName}>{item.name}</Text>
            <Text numberOfLines={1} style={styles.addressTxt}>{item.address}</Text>
          </View>
        </View>
        <View style={styles.quaView}>
          <View style={{ marginLeft: 15, }}>
            <Text style={styles.qunatity}> Quantity:</Text>
          </View>
          <Text numberOfLines={1} style={[styles.qunatity, { marginLeft: 4 }]}>{item.quantity} x {item.name}</Text>
        </View>
        <View style={styles.dateMainView}>
          <Text style={styles.dateTxt}>{moment(item.date).format('DD MMM YYYY')} at {moment(item.date).format('HH :MM A')}</Text>
          <Text style={[styles.dateTxt, { marginRight: 15 }]}>₹ {item.quantity * item.price}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  const emptyList = (
    <View style={[styles.empty_data, { marginTop: 20 }]}>
      <Text> Order Data not found </Text>
    </View>
  )

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <Text style={styles.head_text}>My Order</Text>
      <View style={styles.mainView}>
        <TouchableOpacity onPress={() => { slelectOption('pending') }} style={styles.topView}>
          <Text style={styles.statusTxt}>Pending</Text>
          {
            filterTab == 'Pending' && <View style={styles.bottomBorderView} />
          }

        </TouchableOpacity>
        <TouchableOpacity onPress={() => { slelectOption('complete') }} style={styles.topView}>
          <Text style={styles.statusTxt}>Complete</Text>
          {
            filterTab == 'Completed' && <View style={styles.bottomBorderView} />
          }
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { slelectOption('cancel') }} style={styles.topView}>
          <Text style={styles.statusTxt}>Cancel</Text>
          {
            filterTab == 'Cancelled' && <View style={styles.bottomBorderView} />
          }
        </TouchableOpacity>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, }}>
        {
          pending == true ?
            <View style={{ flex: 1, marginHorizontal: 5 }}>
              <FlatList
                renderItem={pendingList}
                data={pendingData}
                ListEmptyComponent={emptyList}
                refreshControl={
                  <RefreshControl
                    tintColor={'bluie'}
                    refreshing={isRefreshing}
                    onRefresh={() => onRefresh()}
                  />
                }
              />
            </View>
            :
            null
        }
        {
          complit == true ?
            <View style={{ flex: 1, marginHorizontal: 5 }}>
              <FlatList
                renderItem={pendingList}
                data={pendingData}
                ListEmptyComponent={emptyList}
                refreshControl={
                  <RefreshControl
                    tintColor={'bluie'}
                    refreshing={isRefreshing}
                    onRefresh={() => onRefresh()}
                  />
                }
              />
            </View>
            :
            null
        }
        {
          cancel == true ?
            <View style={{ flex: 1, marginHorizontal: 5 }}>
              <FlatList
                renderItem={pendingList}
                data={pendingData}
                ListEmptyComponent={emptyList}
                refreshControl={
                  <RefreshControl
                    tintColor={'bluie'}
                    refreshing={isRefreshing}
                    onRefresh={() => onRefresh()}
                  />
                }
              />
            </View>
            :
            null
        }
      </ScrollView>
    </View>
  )
}

export default History

const styles = ScaledSheet.create({
  head_text: {
    fontSize: '18@s',
    marginVertical: '8@s',
    fontFamily: FONT_FAMILY.Poppins_SemiBold,
    color: "#000000",
    textAlign: 'center'
  },
  bottomBorderView: {
    backgroundColor: '#EE3332',
    width: '100%',
    height: 5,
    marginTop: 5
  },
  topView: {
    flex: 33.3,
    alignItems: 'center'
  },
  statusTxt: {
    fontSize: '14@s',
    fontFamily: FONT_FAMILY.Poppins_SemiBold,
    lineHeight: 20,
    fontWeight: '600',
    color: 'black'
  },
  mainView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: '10@s',
    marginHorizontal: '5@s',
    elevation: 2
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