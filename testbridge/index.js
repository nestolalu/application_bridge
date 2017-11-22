import { AppRegistry } from 'react-native';
import App from "./App"
import AppTestBridge from './AppTestBridge';
import AppDynamicLocalConfig from './AppDynamicLocalConfig'
import AppTwoWebView from './AppTwoWebView'
import AppDynamicRemoteConfig from './AppDynamicRemoteConfig'

import {
    StackNavigator,
  } from 'react-navigation';
  
  const SimpleApp = StackNavigator(
    {
        App: { screen: App },
        AppTestBridge: { screen: AppTestBridge },
        AppDynamicLocalConfig: { screen: AppDynamicLocalConfig },
        AppTwoWebView: { screen: AppTwoWebView },
        AppDynamicRemoteConfig: { screen: AppDynamicRemoteConfig },
    },
    { headerMode: 'none' } 
  );

AppRegistry.registerComponent('testbridge', () => SimpleApp);
