import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { createDrawerNavigator } from 'react-navigation';
import ProductScreen from '../screens/ProductScreen';
import SideBar from '../components/SideBar/SideBar';

export const Drawer = createDrawerNavigator(
    {
        Home: { screen: ProductScreen }
    },
    {
        navigationOptions: () => ({
            drawerLockMode: 'locked-closed'
        }),
        initialRouteName: "Home",
        drawerPosition: 'left',
        contentComponent: props => <SideBar {...props} />
    }
);
