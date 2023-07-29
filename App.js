import React, { useEffect } from 'react';
import { StyleSheet, View, } from 'react-native';
import LoginNavigator from './Screens/Navigation/LoginNavigator'
import ActivityIndicatorApp from './Screens/Components/Lib/ActivityIndicatorApp';
import messaging from '@react-native-firebase/messaging';
import PushNotification from "react-native-push-notification";
import Helper from './Screens/Components/Lib/Helper';
import Forgroundhandler from './Screens/Components/Lib/Forgroundhandler';

const App = ({ props }) => {

  useEffect((props) => {
    checkPermission()
    PushNotification.getChannels(function(channels) {
      console.log('getchannels gives us', channels);
    });
  }, [props]);


  const checkPermission = async () => {
    const enabled = await messaging().hasPermission();
    if (enabled) {
      getToken();
    } else {
      requestPermission();
    }
  }

  const getToken = async () => {
    fcmToken = await messaging().getToken();
    if (fcmToken) {
      Helper.device_token = fcmToken
      console.log(fcmToken,'--------------- Helper.device_token-----', Helper.device_token);
    }
  }


  const requestPermission = async () => {
    console.log('call requestPermission')
    try {
      await messaging().requestPermission();
      getToken();
    } catch (error) {

    }
  }

  return (
    <View style={{ flex: 1, }}>
      <Forgroundhandler/>
      <LoginNavigator />
      <ActivityIndicatorApp
        onRef={ref => { Helper.globalLoader = ref }}
      />
    </View>
  )
}

const styles = StyleSheet.create({

});
export default App;