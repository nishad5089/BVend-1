import React, { Component } from 'react';
import { StyleSheet, Dimensions, View } from 'react-native';
import { Header, Icon, Left, Body } from 'native-base';

export default class HeaderPlain extends Component {
    render() {
        const {navigation, bg_color} = this.props
        const {drawerIcon} = styles
        return (
            <Header style={{backgroundColor: bg_color}}>
                <Left>
                    <Icon name='arrow-back' style={drawerIcon} onPress={()=> navigation.goBack()} />
                </Left>
                <Body />
            </Header>
        );
    }
}

const styles = StyleSheet.create({
    drawerIcon: {
        color: '#000'
    }
});

