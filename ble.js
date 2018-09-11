import React, {Component} from 'react';
import {View, Button, Text} from 'react-native';
import { BleManager } from 'react-native-ble-plx';

export class Ble extends Component {
  constructor(props) {
    super(props)
    this.manager = new BleManager()
    this.state =  {devices: [ ]};
    this.scan = this.scan.bind(this);
    this.stopScan = this.stopScan.bind(this);
    this.getState = this.getState.bind(this);
  }
  scan() {
    console.log('scanning');
    this.manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.log(error);
        return
      }
      if(!device.name) {
        device.name = device.id;
      }
      let deviceExists = this.state.devices.some(function(object){
        return object["name"] === device.name;
      });
      if(!deviceExists) {
        this.setState(prevState => ({
          devices: [...prevState.devices, {name: device.name, rssi: device.rssi}]
        }));
      } else {
        let devicesCopy = JSON.parse(JSON.stringify(this.state.devices))
        let currentDeviceIndex = this.state.devices.findIndex(obj => obj.name === device.name);
        devicesCopy[currentDeviceIndex].rssi = device.rssi;
        // console.log(this.state.devices[currentDeviceIndex].rssi, device.rssi);
        this.setState({
          devices:devicesCopy
      });
      console.log(device.txPowerLevel);
      //todo
      //remove devices if they are not around after some time 
      }
    });
  }
  stopScan() {
    this.manager.stopDeviceScan();
  }
  getState() {
    console.log("state: ");
    console.log(this.state);
  }
  // componentWillUpdate(nextProps, nextState) {
  //   console.log("componentWillUpdate");
  // }
  renderDevices() { 
    return this.state.devices.map(function(device, i){
      return(
        <View key={i}>
          <Text>{device.name}</Text>
          <View>
            <Text>{device.rssi}</Text>
          </View>
        </View>
      );
    });
  }
  render() {
    // console.log('render');
    return (
      <View>
        <Button onPress={this.scan} title="Scan"/>
        <Button onPress={this.stopScan} title="Stop Scan"/>
        <Button onPress={this.getState} title="Get State"/>
        <View>{this.renderDevices()}</View>
      </View>
    );
  }

  
}