const Shotstack = require('shotstack-sdk');

module.exports = (topLength, frameLength, yOffset) => {
    let fadeIn = new Shotstack.Transition;
    fadeIn.setIn('fade');

    let placeholderText = new Shotstack.TitleAsset;
    placeholderText
        .setStyle('future')
        .setText('0')
        .setSize('xx-large')
        .setOffset({ y: yOffset });

    let placeholderClip = new Shotstack.Clip;
    placeholderClip
        .setAsset(placeholderText)
        .setStart(Number(topLength - 1 - frameLength))
        .setLength(1)
        .setTransition(fadeIn);

    return placeholderClip;
}
