'use strict';
function inherits(target, source) {
    for (var k in source.prototype) target.prototype[k] = source.prototype[k];
    return target;
}
exports.DeviceINQ = inherits(require('bindings')('BluetoothSerialPort.node').DeviceINQ, require('events').EventEmitter);
