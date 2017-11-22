import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    View,
    Text,
    TouchableHighlight,
  } from 'react-native';
  
  export default class App extends Component {
    render() {
        const { navigate } = this.props.navigation;
        return(
            <View style={styles.container}>
                <View style={styles.inputsContainer}>
                    <TouchableHighlight style={styles.fullWidthButton} onPress={() => navigate('AppTestBridge')}>
                        <Text style={styles.fullWidthButtonText}>TestBridge</Text>
                    </TouchableHighlight>
                </View>
                <View style={styles.inputsContainer}>
                    <TouchableHighlight style={styles.fullWidthButton} onPress={() => navigate('AppTwoWebView')}>
                        <Text style={styles.fullWidthButtonText}>TwoWebView</Text>
                    </TouchableHighlight>
                </View>
                <View style={styles.inputsContainer}>
                    <TouchableHighlight style={styles.fullWidthButton} onPress={() => navigate('AppDynamicLocalConfig')}>
                        <Text style={styles.fullWidthButtonText}>LocalConfig</Text>
                    </TouchableHighlight>
                </View>
                <View style={styles.inputsContainer}>
                    <TouchableHighlight style={styles.fullWidthButton} onPress={() => navigate('AppDynamicRemoteConfig')}>
                        <Text style={styles.fullWidthButtonText}>RemoteConfig</Text>
                    </TouchableHighlight>
                </View>
            </View>
        );
    }
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      margin : 60
    },
    inputsContainer: {
        flex: 1
      },
      fullWidthButton: {
        backgroundColor: 'gray',
        height:70,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
      },
      fullWidthButtonText: {
        fontSize:24,
        color: 'white'
      }
  });
  