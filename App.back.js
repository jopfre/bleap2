/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Image, Button} from 'react-native';

import { BleManager } from 'react-native-ble-plx';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

type Props = {};

class Ble extends Component {
  constructor() {
    super()
    this.manager = new BleManager()
    this.state = { devices: [] };
    this.componentWillMount = function() {
      const subscription = this.manager.onStateChange((state) => {
        if (state === 'PoweredOn') {
            this.scanAndConnect();
            subscription.remove();
        }
      }, true);
    }
    this.scanAndConnect = function() {
      console.log('scanning');
      this.manager.startDeviceScan(null, null, (error, device) => {
        if (error) {
            // Handle error (scanning will be stopped automatically)
            console.log(error);
            return
        }

        // console.log(device.name);
        if(device.name && !this.state.devices.includes(device.name)) {
          this.state.devices.push(device.name);
        }
        console.log(this.state.devices);
        // Check if it is a device you are looking for based on advertisement data
        // or other criteria.
        if (device.name === 'TI BLE Sensor Tag' || 
            device.name === 'SensorTag') {
            
            // Stop scanning as it's not necessary if you are scanning for one device.
            this.manager.stopDeviceScan();

            // Proceed with connection.
        }
      });
    }
  }
  render() {
    this.scanAndConnect();
    // if(componentWillMount())
    return (
      <Text>{this.state.device}</Text>
    );
  }

  
}

class Greeting extends Component {
  render() {
    return (
      <Text>Hello {this.props.name}!</Text>
    );
  }
}

class Blink extends Component {
  constructor(props) {
    super(props);
    this.state = {isShowingText: true};

    // Toggle the state every second
    setInterval(() => {
      this.setState(previousState => {
        return { isShowingText: !previousState.isShowingText };
      });
    }, 1000);
  }

  render() {
    let display = this.state.isShowingText ? this.props.text : ' ';
    return (
      <Text>{display}</Text>
    );
  }
}

export default class App extends Component<Props> {
  render() {
    // console.log(Ble.scanAndConnect());
    let pic = {
      uri: 'https://upload.wikimedia.org/wikipedia/commons/d/de/Bananavarieties.jpg'
    };
    return (
      <View style={styles.container}>
        <Blink text='I love to <<meeee></meeee>ow> </meow>' />
        <Image source={pic} style={{width: 193, height: 110}}/>
        <Text style={styles.welcome}>Welcome to Cat4 Native!</Text>
        <Text style={styles.instructions}>To get started, edit App.js</Text>
        <Text style={styles.instructions}>{instructions}</Text>
        <Ble></Ble>
        <Greeting name='Rexxar' />
      </View>


    );
  }
}
  
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
