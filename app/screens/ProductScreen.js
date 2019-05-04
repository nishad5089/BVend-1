import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView, Dimensions } from 'react-native';
import { View, Text, Container, Content, Right, Grid, Col, Row, Drawer, Button } from 'native-base';
import ContentTitle  from '../components/ContentTitle/ContentTitle';

import CardGridWithBody  from '../components/Card/CardGridWithBody';
import HeaderPlain  from '../components/Header/HeaderPlain';
import HorizontalList  from '../components/List/HorizontalList';
import API  from '../assets/help-files/Api';
import Modal from 'react-native-modalbox';

var screen = Dimensions.get('window');

export default class ProductScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            items: [],
            isOpen: false,
            isDisabled: false,
            swipeToClose: true,
            selectedItem:[],
            totalAmount: 0
        }
    }
 
    updateState (data,item) {
        var joinedItem = this.state.selectedItem.concat(item);
        var totalPrice = 0;
        this.setState(data);
        joinedItem.map((rowItem)=>{
            totalPrice += parseFloat(rowItem.price)

        })
        this.setState({
            selectedItem: joinedItem,
            totalAmount: totalPrice
        })

    }
    totalAmountCout(){
        totalPrice = 0
         this.state.selectedItem.map((rowItem)=>{
            totalPrice += parseFloat(rowItem.price)
    
        })
    }
    updateSlected(index){
 
       var array = [...this.state.selectedItem];
       item = array[index].price

       currentTotalAmount = (this.state.totalAmount - parseFloat(item))
    

         if (index !== -1) {
            array.splice(index, 1);
            this.setState({selectedItem: array});
           }
           this.setState({totalAmount: currentTotalAmount})    
          
    }

    render() {

        let headerProps = {
            navigation: this.props.navigation,
            bg_color: 'transparent'
        }

        let CardGridWithBodyProps = {
            navigation: this.props.navigation,
            api: API,
            gridNumber: 3,
        }

        let listImageProps = {
            navigation: this.props.navigation,
            api: this.state.selectedItem
        }
    
        if (this.state.selectedItem && this.state.selectedItem.length) {
            model = (
                <Modal position={"bottom"} isOpen={this.state.isOpen} onClosed={() => this.setState({isOpen: false})} style={[styles.modal, styles.modal4]}>
                        
                        <View style={styles.topContent}>
                        <Text>Product Added</Text>
                        <Text style={{ fontWeight: 'bold',fontSize:20 }}>{this.state.totalAmount}</Text>
                    </View>
                        <View style={styles.mainContent}>
                            <ScrollView showsVerticalScrollIndicator={false}>
                                <HorizontalList   {...listImageProps} updateSelectedItem={this.updateSlected.bind(this)}/>
                           </ScrollView> 
                        </View>
                        <View style={styles.bottomContent}>
                            <View style={styles.buttonContainer}>
                                <Button block danger onPress={() => this.setState({isOpen: false})}>
                                    <Text>Add More</Text>
                                </Button>
                            </View>
                            <View style={styles.buttonContainer}>
                                <Button block success onPress={() => this.setState({isOpen: false})}>
                                    <Text>Vend</Text>
                                </Button>
                            </View>
                        </View>
                    </Modal>
            ) 
       } else{
           model = (
            <Modal position={"bottom"} isOpen={this.state.isOpen} onClosed={() => this.setState({isOpen: false})} style={[styles.modal, styles.modal4]}>
                <View style={styles.topContent}>
                    <Text>Product Added</Text>
                </View>
            </Modal>
           )
       }
        return (
            <Container>
                <HeaderPlain {...headerProps} />
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View>
                        <ContentTitle contentTitle={'Products'} />
                        <View style={styles.content}>
                            <CardGridWithBody updateParentState={this.updateState.bind(this)} {...CardGridWithBodyProps} />
                        </View>
                    </View>
                  
                </ScrollView>
        
                {model}
                {/* <Modal position={"bottom"} isOpen={this.state.isOpen} onClosed={() => this.setState({isOpen: false})} style={[styles.modal, styles.modal4]}>
                    <View style={styles.topContent}>
                        <Text>Product Added</Text>
                    </View>
                    <View style={styles.mainContent}>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <HorizontalList   {...listImageProps} />
                       </ScrollView> 
                    </View>
                    <View style={styles.bottomContent}>
                        <View style={styles.buttonContainer}>
                            <Button block danger onPress={() => this.setState({isOpen: false})}>
                                <Text>Add More</Text>
                            </Button>
                        </View>
                        <View style={styles.buttonContainer}>
                            <Button block success onPress={() => this.setState({isOpen: false})}>
                                <Text>Vend</Text>
                            </Button>
                        </View>
                    </View>
                </Modal> */}
            </Container>
        )
    }
}

const styles = StyleSheet.create({
    content: {
        marginLeft: 0,
        marginRight: 0,
    },

    topContent: {
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        backgroundColor: 'white',
        height: 50,
        // alignItems: 'flex-start',
        fontSize:20,
        fontWeight:'bold',
        paddingLeft: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 5, 
        alignItems: 'center',
        justifyContent: 'space-between' 
    },
    mainContent: {
        flexDirection: 'row',
        height: 240
    },
    

    bottomContent: {
        borderTopWidth: 1,
        borderTopColor: '#ccc',
        flexDirection: 'row',
        height: 60,
        paddingTop: 6
    },

    buttonContainer: {
        flex: 1,
        paddingLeft: 5,
        paddingRight: 5
    },

    modal4: {
        height: 350
    }
});