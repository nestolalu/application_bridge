/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 * 
 * TODO think about how to configure config.json and render componet / inject component (module) dynamically
 * CHECK the config json... read & generate or generate & read
 * 
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  WebView,
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  BackHandler
} from 'react-native';

import Toast from 'react-native-toast-native';
import DropdownAlert from 'react-native-dropdownalert';
import PopupDialog, { SlideAnimation,DialogTitle } from 'react-native-popup-dialog';
import { DatePickerDialog } from 'react-native-datepicker-dialog';

import SideMenu from 'react-native-side-menu';
const image = require('./assets/menu.png');
import Menu from './Menu';

const slideAnimation = new SlideAnimation({
  slideFrom: 'bottom',
});

import FingerprintScanner from 'react-native-fingerprint-scanner';
import FingerprintPopup from './FingerPrintPopup/FingerprintPopup';

export default class AppTestBridge extends Component {
  
  
  constructor(props){
    super(props)
    this.onWebViewMessage = this.onWebViewMessage.bind(this);
    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false,
      selectedItem: 'About',
      popupShowed: false, //FingerPrint
      popupShowed: false, //FingerPrint
      url : "http://10.11.38.88:8080"
    };
  }

  handleFingerprintShowed = () => {
    this.setState({ popupShowed: true });
  };

  handleFingerprintDismissed = () => {
    this.setState({ popupShowed: false });
  };

  componentDidMount() {
    FingerprintScanner
      .isSensorAvailable()
      .catch(error => this.setState({ errorMessage: error.message }));
      BackHandler.addEventListener('hardwareBackPress', this.backHandler);
  }
 
  toggle() {
    isOpen: !this.state.isOpen;this.setState({
      isOpen: !this.state.isOpen,
    });
  }

  updateMenuState(isOpen) {
    this.setState({ isOpen });
  }

  onMenuItemSelected = item => {
    this.setState({
      isOpen: false,
      selectedItem: item,
    });
    if(item == "TestBridge"){
      if('http://10.11.38.88:8080' != this.state.url)
        this.setState({ url: 'http://10.11.38.88:8080'});
    }else{
      if('http://www.google.com' != this.state.url)
        this.setState({ url: 'http://www.google.com'});
    }
  };

  _refWebView = (webview) => {
    this.myWebView = webview;
  }

  onWebViewMessage(event) {
    // post back reply as soon as possible to enable sending the next message
    this.myWebView.postMessage(event.nativeEvent.data);

    let msgData;
    try {
        msgData = JSON.parse(event.nativeEvent.data);
    }
    catch(err) {
        console.warn(err);
        return;
    }

    // invoke target function
    //const response = this[msgData.targetFunc].apply(this, [msgData]);

    const response = "response"
    if(typeof (this[msgData.targetFunc]) !== "undefined")
      this[msgData.targetFunc].apply(this, [msgData.data]);
    else
      alert("The function '" +msgData.targetFunc+ "' is not defined")
    
    // trigger success callback

    msgData.isSuccessfull = true;
    msgData.args = [response];
    this.myWebView.postMessage(JSON.stringify(msgData))
  }

  onError = error => {
  }

  onClose(data) {
  }

  onJourneyDatePress = () => {
    this.refs.journeyDialog.open({
      date: new Date(),
      minDate: new Date() //To restirct past date
    });
  }

  onJourneyDatePicked = (date) => {
  }

 
  componentWillUnmount(){
    BackHandler.removeEventListener('hardwareBackPress', this.backHandler);
  }
  backHandler = () => {
      if(this.state.backButtonEnabled) {
        this.myWebView.goBack();
        return true;
      }else{
        BackHandler.exitApp();
      }
  }

  onNavigationStateChange = (navState) => {
    this.setState({
        backButtonEnabled: navState.canGoBack,
    });
  };

  render() {

    const menu = <Menu onItemSelected={this.onMenuItemSelected} />;
    const errorMessage = this.state.errorMessage;
    const popupShowed = this.state.popupShowed;
    return (
      <SideMenu
        menu={menu}
        isOpen={this.state.isOpen}
        onChange={isOpen => this.updateMenuState(isOpen)} >
        <View style={styles.container}>
          <View style={styles.header}>
              <TouchableOpacity onPress={this.toggle} style={{marginLeft:10}}>
                <Image source={image} style={{ width: 32, height: 32 }}  />
              </TouchableOpacity>
              <Text style={{fontSize:30, fontWeight:'bold', marginLeft:30}}>Title</Text>
              <View style={{flex:1}}>
                <TouchableOpacity
                  disabled={!this.state.backButtonEnabled}
                  onPress={this.backHandler.bind(this)}
                  style={{ alignSelf: 'flex-end', marginRight:10, display: !this.state.backButtonEnabled ? 'none':'flex'}}>
                  <Text style={styles.topbarText}>Go Back</Text>
                </TouchableOpacity>
            </View>
          </View>
          <WebView 
            ref={this._refWebView} 
            javaScriptEnabled={true}
            domStorageEnabled={true}
            source={{uri : this.state.url}} 
            onMessage={this.onWebViewMessage}
            renderLoading={this.ActivityIndicatorLoadingView}
            startInLoadingState={true} 
            style={styles.WebViewStyle}
            onNavigationStateChange={this.onNavigationStateChange}/>
          
          <PopupDialog ref={(popupDialog) => { this.popupDialog = popupDialog; }} dialogAnimation={slideAnimation} dialogTitle={<DialogTitle title="Dialog Title" />} width={200}height={200}>
            <View><Text>Test </Text></View>
          </PopupDialog>

          {errorMessage && (
            <Text >
              {errorMessage}
            </Text>
          )}

          {popupShowed && (
          <FingerprintPopup
            handlePopupDismissed={this.handleFingerprintDismissed}
          />
          )}
          
          <DatePickerDialog ref="journeyDialog" onDatePicked={this.onJourneyDatePicked.bind(this)} />
          <DropdownAlert ref={ref => this.dropdown = ref} onClose={data => this.onClose(data)} />
        </View>
        
      </SideMenu>
    );
  }

  ActivityIndicatorLoadingView() {
    return (
      <ActivityIndicator
        color='#009688'
        size='large'
        style={styles.ActivityIndicatorStyle}
      />
    );
  }

  showToast = (message) => {
    let toastStyle={
      backgroundColor: "#999999",
      width: 300,
      height: Platform.OS === ("ios") ? 65 : 130,
      color: "#ffffff",
      fontSize: 60,

      borderRadius: 15,
      fontWeight: "bold",
      yOffset: 200
    };
    Toast.show(message, Toast.SHORT, Toast.BOTTOM,toastStyle);
  }

  fingerprintLogin = () => {
    this.handleFingerprintShowed()
  }

  dropDownAlert = (message) => {
    this.dropdown.alertWithType('info', 'INFO', message);
  }

  showDialog = (message) => {
    this.popupDialog.show();
  }

  showDatePicker = () => {
    this.onJourneyDatePress();
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    marginTop: Platform.OS === ("ios") ? 20 : 0,
  },
  header:{
    height : 60,
    backgroundColor:'#7795c6',
    alignItems : 'center',
    flexDirection: 'row'
  },
  WebViewStyle:
  {
     justifyContent: 'center',
     alignItems: 'center',
     flex:1,
     margin: 5,
     backgroundColor : 'transparent'
  },
  ActivityIndicatorStyle:{
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      alignItems: 'center',
      justifyContent: 'center'
    
  }
});