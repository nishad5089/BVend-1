import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { Container, Header, Content, Form, Item, Input, Label, Button, Text, View } from 'native-base';
import HeaderPlain  from '../components/Header/HeaderPlain';

export default class ForgotPasswordScreen extends Component {
	render() {
		const {registraionContainer, registerButton, input} = styles
		return (
			<Container>
				<HeaderPlain navigation={this.props.navigation} />
				<View style={registraionContainer}>
					<Text>This is Forgot Password Screen</Text>
				</View>
			</Container>
		);
	}
}

const styles = StyleSheet.create({
	registraionContainer: {
		flex:1,
		justifyContent: 'center', 
		alignItems: 'center',
		flexDirection: 'row',
	},

	input: {
		backgroundColor: '#eee',
		marginBottom: 10
	},

	registerButton: {
		marginTop: 20
	}
});
