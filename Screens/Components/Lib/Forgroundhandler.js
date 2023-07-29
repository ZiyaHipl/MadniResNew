import messaging from '@react-native-firebase/messaging';
import { useEffect } from 'react';
import PushNotification from "react-native-push-notification";

 export default Forgroundhandler=()=>{
    useEffect(()=>{
        const unSubcripber= messaging().onMessage(async remoteMessage=>{
            PushNotification.localNotification({
                channelId: 'channel-id',
                title: "My Notification Ticker",
                body:"body",
                soundName: "default",
                vibrate: true,
                playSound: false,
            });
        })
        return unSubcripber
    },[])
    return null
}