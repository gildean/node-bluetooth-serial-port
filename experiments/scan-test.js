"use strict";

var util = require('util');
var BluetoothSerialPort = require("../lib/bluetooth-serial-port.js");
var serial = new BluetoothSerialPort();
serial.on('found', function (address, name) {
    console.log('Found:', address, 'with name', name, 'connecting...');

    serial.findSerialPortChannel(address, function (err, channel) {
        if (err) return console.error(err);
        console.log('Found RFCOMM channel for serial port on ' + name + ': ' + channel);

        //if (name !== 'linvor') return;

        console.log('Attempting to connect...');
        serial.connect(address, channel, function (err) {
            if (err) return console.error(err);
            console.log('Connected. Sending data...');
            var buf = new Buffer('ATZ');
            console.log('Size of buf = ' + buf.length);

            serial.write(buf, function (err, count) {
                if (err) return serial.emit('error', err);
                console.log('Bytes writen is: ' + count);
            });
        });
    });
}).on('readable', function () {
    console.log('bluetooth-serial-port is now readable');
}).on('data', function (buffer) {
    console.log('Size of data buf = ' + buffer.length);
    console.log(buffer.toString('utf-8'));
}).once('end', function () {
    console.log('connection has been closed (remotely?)');
}).on('error', function (err) {
    console.log('there was an error with the serial', err);
}).once('finished', function () {
    console.log('scan finished');
    //setImmediate(function () { serial.disconnect() });
}).inquire();
