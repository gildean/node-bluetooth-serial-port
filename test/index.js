var BluetoothSerialPort = require('../lib/bluetooth-serial-port.js');
var Bt = new BluetoothSerialPort();

[
    'inquire', 'findSerialPortChannel', 'connect', 'write', 'on', 'disconnect'
].forEach(function(fun) {
    if (typeof Bt[fun] !== 'function')
        throw new Error("Assert failed: " + fun +
                        "should be a function but is " + (typeof Bt[fun]));
});

process.exit(0);

