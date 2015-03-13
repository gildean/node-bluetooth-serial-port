(function() {
    "use strict";

    var util = require('util');
    var BluetoothSerialPort = require("../lib/bluetooth-serial-port.js");
    var serial = new BluetoothSerialPort();

    serial.listPairedDevices(function(pairedDevices) {
        pairedDevices.forEach(function(device) {
            console.log(device);
        });
    })
})();
