import React, { Component } from 'react';
import {Platform, WebView, ActivityIndicator, StyleSheet, Alert} from 'react-native';
//import myData from './config.json';
import Toast from 'react-native-toast-native';

const myData = require('./config.json')
export default class MyWebView extends Component {

    constructor(props){
        super(props);
        this.state = {
            url: myData.application.webModule.url
          };
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
        var myModule = myData.application.modules[msgData.targetFunc]
        this.applyMyModule(myModule, msgData.data)
        //const response = this[msgData.targetFunc].apply(this, [msgData.data]);
        
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
            style={styles.WebViewStyle}/>
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
        if("buttons" in myModule){
            for(var k in myModule.buttons){
                let textButton = k;
                let actionButton = myModule.buttons[k];
                if(actionButton == null)
                    buttons.push({text : textButton})
                else if("url" in actionButton)
                    buttons.push({text : textButton, onPress: () => {this.changeURL(actionButton.url)} })
                else{
                    buttons.push({text : textButton})
                }
            };
        }
        Alert.alert(
            'Alert Title',
            message,
            buttons
          );
    }

    changeURL(myURL){
        this.setState({ url: 'http://google.com' });
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