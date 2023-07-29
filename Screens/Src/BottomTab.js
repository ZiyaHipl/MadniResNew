import React from "react";
import { Text, View, Dimensions, Image, StyleSheet } from "react-native";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "./Home";
import images from "../Components/images";
import History from "./History";
import Setting from "./Setting";
import Profile from "./Profile";
import MyCard from './MyCard'
const Tab = createBottomTabNavigator();
const DeviceW = Dimensions.get("screen").width;
const RenderTabIcons = (props) => {
    const { icon, label, isFocused, backgroundColor } = props;
    return (
        <View
            style={{
                alignItems: "center",
                justifyContent: "center",
                width: DeviceW / 4,
                height: 70,
                marginTop: 13,
                backgroundColor: backgroundColor,
            }}
        >
            <Image
                source={icon}
                style={{ height: 20, width: 20, resizeMode: "contain" }}
            />
            <Text
                style={[
                    styles.labelText,
                    { color: isFocused ? 'red' : '#000' },
                ]}
            >
                {label}
            </Text>
        </View>
    );
};
const HomeNavigator = createNativeStackNavigator();
function stackNavigatorHome() {
    return (
        <HomeNavigator.Navigator>
            <HomeNavigator.Screen name="Home" component={Home} options={{ headerShown: false, }} />
        </HomeNavigator.Navigator>
    );
}
const FavoriteNavigator = createNativeStackNavigator();
function stackNavigatorFavorite() {
    return (
        <FavoriteNavigator.Navigator>
            <FavoriteNavigator.Screen name="MyCard" component={MyCard} options={{ headerShown: false }} />
        </FavoriteNavigator.Navigator>
    );
}
const HistoryNavigator = createNativeStackNavigator();
function stackNavigatorHistory() {
    return (
        <HistoryNavigator.Navigator>
            <HistoryNavigator.Screen name="History" component={History} options={{ headerShown: false }} />
        </HistoryNavigator.Navigator>
    );
}
const SettingNavigator = createNativeStackNavigator();
function stackNavigatorSetting() {
    return (
        <SettingNavigator.Navigator>
            <SettingNavigator.Screen name="Setting" component={Setting} options={{ headerShown: false }} />
            <SettingNavigator.Screen name="Profile" component={Profile} options={{ headerShown: false }} />
        </SettingNavigator.Navigator>
    );
}

export default class ActiveTabs extends React.Component {
    render() {
        return (
            <View style={{ flex: 1 }}>
                <Tab.Navigator
                    screenOptions={{
                        style: {
                            height: 50,
                        },
                    }}
                >
                    <Tab.Screen
                        name="Active"
                        component={stackNavigatorHome}
                        options={{
                            headerShown: false,
                            tabBarLabel: "",
                            tabBarIcon: ({ focused }) => {
                                return (
                                    <RenderTabIcons
                                        icon={focused ? images.actHome : images.actHome}
                                        label={"Home"}
                                        isFocused={focused}
                                    />
                                );
                            },
                        }}
                    />
                    <Tab.Screen
                        name="MyCard"
                        component={stackNavigatorFavorite}
                        options={{
                            headerShown: false,
                            tabBarLabel: "",
                            tabBarIcon: ({ focused }) => {
                                return (
                                    <RenderTabIcons
                                        icon={focused ? images.fevrate : images.fevrate}
                                        label={"My Cartd"}
                                        isFocused={focused}
                                    />
                                );
                            },
                        }}
                    />
                    <Tab.Screen
                        name="History"
                        component={stackNavigatorHistory}
                        options={{
                            headerShown: false,
                            tabBarLabel: "",
                            tabBarIcon: ({ focused }) => {
                                return (
                                    <RenderTabIcons
                                        icon={
                                            focused ? images.histry : images.histry
                                        }
                                        label={"History"}
                                        isFocused={focused}
                                    />
                                );
                            },
                        }}
                    />
                    <Tab.Screen
                        name="Setting"
                        component={stackNavigatorSetting}
                        options={{
                            headerShown: false,
                            tabBarLabel: "",
                            tabBarIcon: ({ focused }) => {
                                return (
                                    <RenderTabIcons
                                        icon={focused ? images.setting : images.setting}
                                        label={"Setting"}
                                        isFocused={focused}
                                    />
                                );
                            },
                        }}
                    />
                </Tab.Navigator>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    labelText: {
        fontSize: 12,
    },
});