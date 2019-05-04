import React, { Component } from 'react';
import { TouchableOpacity,Platform} from 'react-native';
import { Container, Header, Content, List, ListItem, Left, Body, Right, 
	Thumbnail, Text, View, Input, Item, Button } from 'native-base';
import axios from 'axios';
import Icon from 'react-native-vector-icons/AntDesign';
import Icons from 'react-native-vector-icons/Ionicons';
export default class HorizontalList extends Component {
	constructor(props) {
        super(props)
        this.state = {
			items: this.props.api,
			totalAmount: 0
		}
			
    }
    // componentWillMount() {
    // 	const {api} = this.props
    //     axios.get(api ? api : '').then(response => 
    //         this.setState({
    //             items: response.data
    //         }))
    //     .catch((error) => {
    //         console.error(error)
    //     })
	// }
	// totalAmountCout(){
	// 	totalPrice = 0
	// 	 this.state.items.map((rowItem)=>{
	// 		totalPrice += parseFloat(rowItem.price)
	// 		// this.setState({
	// 		// 	totalAmount: totalPrice
	// 		// });
	// 	})
	// 	console.log(totalPrice)
	// 	return totalPrice
	// }
	deleteItem(index){
		
		 var array = [...this.state.items];
		if (index !== -1) {
			array.splice(index, 1);
			this.setState({items: array});
		  }
		  this.props.updateSelectedItem(index)
		
	}
    renderList() {
    	const rowItems = this.state.items
    	return rowItems.map((rowItem, index) => {
	    	return (
	    		<List key={index}>
					<ListItem avatar noBorder>
						<Left>
							<Thumbnail source={ rowItem.image } />
						</Left>
						<Body>
							<Text>{ rowItem.title }</Text>
							<Text note>{ parseFloat(rowItem.price)  } TK</Text>
						</Body>
						<Right>
							<Text note>3:43 pm</Text>
							<TouchableOpacity onPress={()=>this.deleteItem(index)} >
           						<Icons size={30} name={Platform.OS == 'android'? 'md-trash':'ios-trash' } color='red'/>
							  </TouchableOpacity>
							
						</Right>
					</ListItem>
		    	</List>
			)
		})
    }

	render() {
		return (
			<View>			
				{this.renderList()}
			</View>
		);
	}
}