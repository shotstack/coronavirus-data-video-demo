const Shotstack = require('shotstack-sdk');

module.exports = (format, resolution) => {
    let output = new Shotstack.Output;
    output
        .setFormat(format)
        .setResolution(resolution);

    return output;
}