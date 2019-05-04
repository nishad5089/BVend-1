import React from 'react';
import { createStackNavigator, HeaderBackButton } from 'react-navigation';
import { Drawer } from './Drawer';
import ItemDetailsScreen from '../screens/ItemDetailsScreen';
import ItemSearchScreen from '../screens/ItemSearchScreen';
import ProductScreen from '../screens/ProductScreen';

import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import PhoneAuth from '../screens/PhoneAuthtication';
import QrCodeCamera from '../screens/QRCodeScanner';

export const App = createStackNavigator(
    {
        Drawer: { 
            screen: Drawer
        },

        Login: {
            screen: PhoneAuth
        },
        QrCodeCamera: {
            screen: QrCodeCamera
        },

        product: {
           screen: ProductScreen
        },
        ForgotPassword: {
           screen: ForgotPasswordScreen
        },

        ItemDetails: {
            screen: ItemDetailsScreen
        },

        ItemSearch: {
            screen: ItemSearchScreen
        }
    },
    {
        initialRouteName: "Login",
        headerMode: "none"
    }
)
