import React, { Component } from 'react';
import {Platform, WebView, ActivityIndicator, StyleSheet, Alert, BackHandler, View, Text} from 'react-native';

export default class AppTwoWebView extends Component {

    constructor(props){
        super(props);
    }

    onWebViewMessage1(event) {
        // post back reply as soon as possible to enable sending the next message
        this.myWebView1.postMessage(event.nativeEvent.data);
        let msgData;
        try {
            msgData = JSON.parse(event.nativeEvent.data);
        }
        catch(err) {
            console.warn(err);
            return;
        }
        // change function name from null to "receive" to update reception inputg
        msgData.targetFunc = "receive"
        this.myWebView2.postMessage(JSON.stringify(msgData));
      }
    
      onWebViewMessage2(event) {
        // post back reply as soon as possible to enable sending the next message
        this.myWebView2.postMessage(event.nativeEvent.data);
        let msgData;
        try {
            msgData = JSON.parse(event.nativeEvent.data);
        }
        catch(err) {
            console.warn(err);
            return;
        }
        // change function name from null to "receive" to update reception input
        msgData.targetFunc = "receive"
        this.myWebView1.postMessage(JSON.stringify(msgData));
      }

      render() {

        
        return (
            <View style={styles.container}>
                <Text style={{marginLeft:10}}>WebView 1</Text>
                <View style={{borderWidth:1, flex:1, margin:10}}>
                <WebView 
                ref={(myWebView1) => { this.myWebView1 = myWebView1; }} 
                javaScriptEnabled={true}
                domStorageEnabled={true}
                source={{uri : 'http://10.11.38.27:8080/chat'}} 
                onMessage={this.onWebViewMessage1.bind(this)}
                renderLoading={this.ActivityIndicatorLoadingView}
                startInLoadingState={true} 
                style={styles.WebViewStyle}
                scalesPageToFit={false}/>
                </View>
                <Text style={{marginLeft:10}}>WebView 2</Text>
                <View style={{borderWidth:1, flex:1, margin:10}}>
                <WebView 
                ref={(myWebView2) => { this.myWebView2 = myWebView2; }} 
                javaScriptEnabled={true}
                domStorageEnabled={true}
                source={{uri : "http://10.11.38.27:8080/chat"}} 
                onMessage={this.onWebViewMessage2.bind(this)}
                renderLoading={this.ActivityIndicatorLoadingView}
                startInLoadingState={true} 
                style={styles.WebViewStyle}
                scalesPageToFit={false}/>
                </View>
            </View>
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
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
        marginTop: Platform.OS === ("ios") ? 20 : 0,
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