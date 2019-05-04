import React, { Component } from 'react';
import {
  StyleSheet,
  Image,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { Container,
  Header, Content,
   Form, Item,
    Input, Label,
     Button, Text, 
     Body, View,
     Left, Right } from 'native-base';
import firebase from 'react-native-firebase'
import validate from "../utility/validation";
const imageUrl =
  'https://www.shareicon.net/data/512x512/2016/07/19/798524_sms_512x512.png';

export default class PhoneAuth extends Component {
  static getDefaultState() {
    return {
      error: '',
      codeInput: {
        value: '',
        valid: false,
        validationRules: {			  
            notEmpty: true,			  
        },
        touched: false
      },
      phoneNumber: {
        value: '+880',
        valid: false,
        validationRules: {
          ismobileNumber: true,
          notEmpty: true,
          maxLength: 15
        },
        touched: false
      },
      auto: Platform.OS === 'android',
      autoVerifyCountDown: 0,
      sent: false,
      started: false,
      user: null,
    };
  }
    componentDidMount() {
    this.unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({ 
          user: JSON.stringify(user),
          phoneNumber: {
            value: user.phoneNumber
          }
         });
      } else {
        // User has been signed out, reset the state
        this.setState({
        error: '',
        codeInput: {
            value: '',
            valid: false,
            validationRules: {			  
                notEmpty: true,			  
            },
            touched: false
          },
          phoneNumber: {
            value: '+880',
            valid: false,
            validationRules: {
              ismobileNumber: true,
              notEmpty: true,
              maxLength: 15
            },
            touched: false
          },
        auto: Platform.OS === 'android',
        autoVerifyCountDown: 0,
        sent: false,
        started: false,
        user: null,
        });
      }
    });
  }
  constructor(props) {
    super(props);
    this.timeout = 20;
    this._autoVerifyInterval = null;
    this.state = PhoneAuth.getDefaultState();
  }

  _tick() {
    this.setState({
      autoVerifyCountDown: this.state.autoVerifyCountDown - 1,
    });
  }

  /**
   * Called when confirm code is pressed - we should have the code and verificationId now in state.
   */
  afterVerify = () => {
    const { codeInput, verificationId } = this.state;
    const credential = firebase.auth.PhoneAuthProvider.credential(
      verificationId,
      codeInput.value
    );

    // TODO do something with credential for example:
    firebase
      .auth()
      .signInWithCredential(credential)
      .then(user => {
        console.log('PHONE AUTH USER ->>>>>', JSON.stringify(user));
        this.setState({ user: JSON.stringify(user) });
      })
      .catch(console.error);
  };

  signIn = () => {
    const { phoneNumber } = this.state;
    this.setState(
      {
        error: '',
        started: true,
        autoVerifyCountDown: this.timeout,
      },
      () => {
        firebase
          .auth()
          .verifyPhoneNumber(phoneNumber.value)
          .on('state_changed', phoneAuthSnapshot => {
            console.log(phoneAuthSnapshot);
            switch (phoneAuthSnapshot.state) {
              case firebase.auth.PhoneAuthState.CODE_SENT: // or 'sent'
                // update state with code sent and if android start a interval timer
                // for auto verify - to provide visual feedback
                this.setState(
                  {
                    sent: true,
                    verificationId: phoneAuthSnapshot.verificationId,
                    autoVerifyCountDown: this.timeout,
                  },
                  () => {
                    if (this.state.auto) {
                      this._autoVerifyInterval = setInterval(
                        this._tick.bind(this),
                        1000
                      );
                    }
                  }
                );
                break;
              case firebase.auth.PhoneAuthState.ERROR: // or 'error'
                // restart the phone flow again on error
                clearInterval(this._autoVerifyInterval);
                this.setState({
                  ...PhoneAuth.getDefaultState(),
                  error: phoneAuthSnapshot.error.message,
                });
                break;

              // ---------------------
              // ANDROID ONLY EVENTS
              // ---------------------
              case firebase.auth.PhoneAuthState.AUTO_VERIFY_TIMEOUT: // or 'timeout'
                clearInterval(this._autoVerifyInterval);
                this.setState({
                  sent: true,
                  auto: false,
                  verificationId: phoneAuthSnapshot.verificationId,
                });
                break;
              case firebase.auth.PhoneAuthState.AUTO_VERIFIED: // or 'verified'
                clearInterval(this._autoVerifyInterval);
                this.setState({
                  sent: true,
                  codeInput: {
                    value: phoneAuthSnapshot.code,
                    valid: true
                  },
                  verificationId: phoneAuthSnapshot.verificationId,
                });
                break;
              default:
              // will never get here - just for linting
            }
          });
      }
    );
  };
  phoneNumberInputHandler = val => {
    this.setState(prevState => {
      return {
        phoneNumber: {
            ...prevState.phoneNumber,
            value: val,
            valid: validate(val, prevState.phoneNumber.validationRules),
            touched: true
          
        }
      };
    });
  };
  renderInputPhoneNumber() {
    const { phoneNumber } = this.state;
    return (
      <View>
			        	<Form>
                      <Input
                        autoFocus
                        style={[styles.input, !phoneNumber.valid && phoneNumber.touched ? styles.invalid : null]}
                        onChangeText={this.phoneNumberInputHandler}
                        placeholder="Phone number ... "
                        value={phoneNumber.value}
                        keyboardType = 'phone-pad'
                />
                <Button   
                    primary 
                    block
                    disabled={!phoneNumber.valid}
                    style={styles.signInButton}
                    onPress={this.signIn.bind(this)}
                    >
                  <Text> Sign In</Text>
                </Button>
                  
                
          	</Form>
				
        </View>
    );
  }

  renderSendingCode() {
    const { phoneNumber } = this.state;

    return (
      <View style={{ paddingBottom: 15 }}>
        <Text style={{ paddingBottom: 25 }}>
          {`Sending verification code to '${phoneNumber.value}'.`}
        </Text>
        <ActivityIndicator animating style={{ padding: 50 }} size="large" />
      </View>
    );
  }

  renderAutoVerifyProgress() {
    const {
      autoVerifyCountDown,
      started,
      error,
      sent,
      phoneNumber,
    } = this.state;
    if (!sent && started && !error.length) {
      return this.renderSendingCode();
    }
    return (
      <View style={{ padding: 0 }}>
        <Text style={{ paddingBottom: 25 }}>
         {`Verification code has been successfully sent to '${phoneNumber.value}'.`}
        </Text>
        <Text style={{ marginBottom: 25 }}>
          {`We'll now attempt to automatically verify the code for you. This will timeout in ${autoVerifyCountDown} seconds.`}
        </Text>
        <Button
        primary 
        block
        style={styles.signInButton}
        onPress={() => this.setState({ auto: false })}
        >
        <Text>I have a code already</Text>
          </Button>
      </View>
    );
  }

  renderError() {
    const { error } = this.state;

    return (
      <View
        style={{
          padding: 10,
          borderRadius: 5,
          margin: 10,
          backgroundColor: 'rgb(255,0,0)',
        }}
      >
        <Text style={{ color: '#fff' }}>{error}</Text>
      </View>
    );
  }
  signOut = () => {
    firebase.auth().signOut();
  }
  phoneVerificationInputHandler = val => {
    this.setState(prevState => {
      return {
       
          codeInput: {
            ...prevState.codeInput,
            value: val,
            valid: validate(val, prevState.codeInput.validationRules),
            touched: true
          }
        }
     
    });
  };
  renderVerificationCode(){
    const { codeInput } = this.state;
    return (
      <View style={{ }}>
           
			        	<Form>
                    <Label>Enter verification code below:</Label>
                    <Input 
                    autoFocus
                    style={[styles.input, !codeInput.valid && codeInput.touched ? styles.invalid : null]}
                    onChangeText={this.phoneVerificationInputHandler}
                    placeholder="Code ... "
                    value={codeInput.value}
                     />
                    
                    <Button 
                    primary 
                    block
                    style={styles.signInButton}
                    disabled={!codeInput.valid}
                    onPress={this.afterVerify.bind(this)}>
                      <Text> Confirm Code</Text>
                    </Button>
           </Form>
				
        </View>
    )
  }
    scanQRCode(){
    this.props.navigation.navigate('QrCodeCamera');
  }
  render() {
    const { started, error, codeInput, sent, auto, user, phoneNumber } = this.state;
    return (
      <Container
      style={styles.loginContainer}
     > 
     <Content>
       <View style={{ alignItems: 'center' ,justifyContent:'center'}}>
             <Image
                 source={{ uri: imageUrl }}
                 style={{
                 width: 100,
                 height: 100,
                 marginBottom: 15,
                 }}
             /> 
             <Text style={{ fontSize: 20, marginBottom: 20 }}>
                 Welcome to Vendor 
             </Text>
         </View>
          {error && error.length ? this.renderError() : null}
          {!user && !started && !sent ? this.renderInputPhoneNumber() : null}
          {started && auto && !codeInput.value.length
            ? this.renderAutoVerifyProgress()
            : null}
          {!user && started && sent && (codeInput.value.length || !auto) ? this.renderVerificationCode() : null}
          {user ? (
            <View style={{ marginTop: 15 }}>
              <Text>{`Signed in with phone Number: '${ phoneNumber.value }'`}</Text>
              <Button 
                    danger  
                    block
                    style={styles.signInButton}
                    onPress={this.signOut}>
                      <Text> Sign Out</Text>
                    </Button>
                <Button 
                    primary  
                    block
                    style={styles.signInButton}
                    onPress={this.scanQRCode.bind(this)}
                    >
                      <Text> Scan QR Code</Text>
                    </Button>
            </View>
          ) : null}
        </Content>
      </Container> 
    );
  }
}
const styles = StyleSheet.create({
	loginContainer: {
        flex:1,
		justifyContent: 'center', 
		alignItems: 'center',
		flexDirection: 'row',
		padding: 40
	},
	link: {
		fontSize: 13
	},
	signInButton: {
		marginTop: 20
	},
    input: {
        width: "100%",
        borderWidth: 1,
        borderColor: "#eee",
        padding: 5,
        marginTop: 8,
        marginBottom: 8,
        borderRadius: 8,

    },
	invalid: {
		backgroundColor: '#f9c0c0',
		borderColor: "red"
	}
});