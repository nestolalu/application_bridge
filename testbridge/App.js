/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 * 
 * TODO think about how to configure config.json and render componet / inject component (module) dynamically
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
  Image
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

export default class App extends Component {
  constructor(props){
    super(props)
    this.onWebViewMessage = this.onWebViewMessage.bind(this);
    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false,
      selectedItem: 'About',
    };
  }
 
  toggle() {
    isOpen: !this.state.isOpen;this.setState({
      isOpen: !this.state.isOpen,
    });
  }

  updateMenuState(isOpen) {
    this.setState({ isOpen });
  }

  onMenuItemSelected = item =>
  this.setState({
    isOpen: false,
    selectedItem: item,
  });

  _refWebView = (webview) => {
    this.myWebView = webview;
  }

  onWebViewMessage(event) {
    // post back reply as soon as possible to enable sending the next message
    console.log("oui");
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
    const response = this[msgData.targetFunc].apply(this, [msgData.data]);
    
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

  render() {
    var url = "http://10.11.38.74:8080";
    const menu = <Menu onItemSelected={this.onMenuItemSelected} />;
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
          </View>
          <WebView 
            ref={this._refWebView} 
            javaScriptEnabled={true}
            domStorageEnabled={true}
            source={{uri : url}} 
            onMessage={this.onWebViewMessage}
            renderLoading={this.ActivityIndicatorLoadingView}
            startInLoadingState={true} 
            style={styles.WebViewStyle}/>
          
          <PopupDialog ref={(popupDialog) => { this.popupDialog = popupDialog; }} dialogAnimation={slideAnimation} dialogTitle={<DialogTitle title="Dialog Title" />} width={200}height={200}>
            <View><Text>Test </Text></View>
          </PopupDialog>
          
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
      backgroundColor: "#000000",
      width: 300,
      height: Platform.OS === ("ios") ? 65 : 130,
      color: "#ffffff",
      fontSize: 15,
      lineHeight: 2,
      lines: 4,
      borderRadius: 15,
      fontWeight: "bold",
      yOffset: 200
    };
    Toast.show(message, Toast.SHORT, Toast.BOTTOM,toastStyle);
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
     margin: 5
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



