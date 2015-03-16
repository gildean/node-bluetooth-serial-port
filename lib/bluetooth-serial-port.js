'use strict';

var util = require('util');
var Duplex = require('stream').Duplex;
var btSerial = require('bindings')('BluetoothSerialPort.node');
var DeviceINQ = require('./deviceinq').DeviceINQ;

util.inherits(BluetoothSerialPort, Duplex);
function BluetoothSerialPort() {
    if (!(this instanceof BluetoothSerialPort)) return new BluetoothSerialPort();
    Duplex.call(this);
    this.inq = new DeviceINQ();
    var self = this;
    this.inq.on('found', function (address, name) {
        self.emit('found', address, name);
    });
    this.inq.on('finished', function () {
        self.emit('finished');
    });
    return this;
}

BluetoothSerialPort.prototype.connect = function connect(address, channel, callback) {
    var self = this;
    this.address = address;
    this.connection = new btSerial.BTSerialPortBinding(address, channel, function (err) {
        if (err) {
            self.disconnect();
            return callback(err);
        }
        setImmediate(function () { self.read(0) });
        return callback();
    });
    return this;
};

BluetoothSerialPort.prototype.disconnect = function disconnect() {
    if (this.connection) {
        this.connection.disconnect();
        this.connection = undefined;
    }
    this.push(null);
    this.end();
    return this;
};

BluetoothSerialPort.prototype.listPairedDevices = function listPairedDevices(callback) {
    this.inq.listPairedDevices(callback);
    return this;
};

BluetoothSerialPort.prototype.inquire = function inquire() {
    this.inq.inquire();
    return this;
};

BluetoothSerialPort.prototype.findSerialPortChannel = function findSerialPortChannel(address, callback) {
    this.inq.findSerialPortChannel(address, function (channel) {
        var err = (channel >= 0) ? null : new Error('no valid channel for ' + address);
        return callback(err, channel);
    });
    return this;
};

BluetoothSerialPort.prototype._read = function _read(n) {
    if (!this.connection) return this.push('');
    var self = this;
    var callback = function callback(err, buffer) {
        if (err) {
            self.emit('error', err);
            return self.disconnect();
        }
        return self.push(buffer || '');
    };
    this.connection.read(callback);
};

BluetoothSerialPort.prototype._write = function _write(buffer, enc, cb) {
    if (!this.connection) return cb(new Error("Not connected"));
    var self = this;
    this.connection.write(buffer, function (err) {
        if (err) return cb(err);
        setImmediate(function () { self.read(0); });
        return cb();
    });
};

module.exports = BluetoothSerialPort;
