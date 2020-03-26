const Shotstack = require('shotstack-sdk');

module.exports = (src, effect) => {
    let soundtrack = new Shotstack.Soundtrack;
    soundtrack
        .setSrc(src)
        .setEffect(effect);

    return soundtrack;
}