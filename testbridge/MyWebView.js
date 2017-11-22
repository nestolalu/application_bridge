import React, { Component } from 'react';
import {Platform, WebView, ActivityIndicator, StyleSheet, Alert, BackHandler} from 'react-native';
//import myData from './config.json';
import Toast from 'react-native-toast-native';

const myData = require('./config.json')
export default class MyWebView extends Component {

    componentDidMount(){
        BackHandler.addEventListener('hardwareBackPress', this.backHandler);
    }
    
    componentWillUnmount(){
        BackHandler.removeEventListener('hardwareBackPress', this.backHandler);
    }

    onNavigationStateChange = (navState) => {
        this.setState({
            backButtonEnabled: navState.canGoBack,
        });
    };

    backHandler = () => {
        if(this.state.backButtonEnabled) {
          this.myWebView.goBack();
          return true;
        }else{
          BackHandler.exitApp();
        }
    }

    constructor(props){
        super(props);
        this.state = {
            url: myData.application.webModule.url
          };
        this.backHandler = this.backHandler.bind(this);
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
        if(typeof (this[msgData.targetFunc]) !== "undefined"){
            var myModule = myData.application.modules[msgData.targetFunc]
            this.applyMyModule(myModule, msgData.data)
            //const response = this[msgData.targetFunc].apply(this, [msgData.data]);
        }else{
            alert("The function '" +msgData.targetFunc+ "' is not defined")
        }
        
        // trigger success callback

        msgData.isSuccessfull = true;
        //msgData.args = [response];
        //this.myWebView.postMessage(JSON.stringify(msgData))
      }

      render() {
        
        return (
            <WebView 
            ref={(myWebView) => { this.myWebView = myWebView; }} 
            javaScriptEnabled={true}
            domStorageEnabled={true}
            source={{uri : this.state.url}} 
            onMessage={this.onWebViewMessage.bind(this)}
            renderLoading={this.ActivityIndicatorLoadingView}
            startInLoadingState={true} 
            style={styles.WebViewStyle}
            onNavigationStateChange={this.onNavigationStateChange.bind(this)}/>
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
    
      applyMyModule(myModule, data){
        if(myModule.type == "toastModule"){
            this.showToast(myModule, data);
        }else if(myModule.type == "alertModule"){
            this.showAlert(myModule, data);
        }
    }

    showAlert(myModule, message){
        let buttons = [];
        // Android philosophy supports only 3 buttons 
        if("buttons" in myModule){
            for(var k in myModule.buttons){
                let textButton = k;
                let actionButton = myModule.buttons[k];
                if(actionButton == null)
                    buttons.push({text : textButton})
                else if("url" in actionButton)
                    buttons.push({text : textButton, onPress: () => {this.changeURL(actionButton.url)} });
                else{
                    buttons.push({text : textButton, onPress: ()=> {
                        var moduleName = Object.keys(actionButton)[0]; //getting the first key, check better solution
                        var data = actionButton[moduleName];
                        var myModule = myData.application.modules[moduleName]
                        this.applyMyModule(myModule, data);
                    }});
                }
            };
        }
        // Check if cancelable should be a given parameters
        // Check if title should be a given parameters
        Alert.alert(
            'Alert Title',
            message,
            buttons,
            { cancelable: false }
          );
    }

    changeURL(myURL){
        // Adding time because of refresh problem when coming back
        this.setState({ url: myURL+ '?t='+Date.now() });
    }

    showToast(myModule, message){
        let toastStyle = {}
        if("style" in myModule){
            var myStyle = myModule.style;
            toastStyle={
                backgroundColor: ("backgroundColor" in myStyle) ? myStyle.backgroundColor : "#000000",
                width: ("width" in myStyle) ? myStyle.width : 300,
                height : ("height" in myStyle) ? Platform.OS === ("ios") ? myStyle.height : myStyle.height+65 : Platform.OS === ("ios") ? 65 : 130,
                color: ("color" in myStyle) ? myStyle.color : "#ffffff",
                fontSize: ("fontSize" in myStyle) ? myStyle.fontSize : 15,
                borderRadius: 15,
                fontWeight: "bold",
                yOffset: 200
            };
        }else{
            toastStyle={
                backgroundColor: "#999999",
                width: 300,
                height: Platform.OS === ("ios") ? 65 : 130,
                color: "#ffffff",
                fontSize: 15,
                borderRadius: 15,
                fontWeight: "bold",
                yOffset: 200
              };
        }
        var duration = Toast.SHORT
        if("duration" in myModule) duration = (myModule.duration == "long") ? Toast.LONG : Toast.SHORT;
        var position = Toast.BOTTOM
        if("position" in myModule) position = (myModule.position == "top") ? Toast.TOP : Toast.BOTTOM;
        
        Toast.show(message, duration, position,toastStyle);
    }
}

const styles = StyleSheet.create({
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