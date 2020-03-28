const Shotstack = require('shotstack-sdk');

module.exports = (value, topLength, frameLength, xOffset = 0, yOffset = 0) => {
    let fadeIn = new Shotstack.Transition;
    fadeIn.setIn('fade');

    let placeholderText = new Shotstack.TitleAsset;
    placeholderText
        .setStyle('future')
        .setText(value)
        .setSize('xx-large')
        .setOffset({
            x: xOffset,
            y: yOffset
        });

    let placeholderClip = new Shotstack.Clip;
    placeholderClip
        .setAsset(placeholderText)
        .setStart(Number(topLength - 1 - frameLength))
        .setLength(1)
        .setTransition(fadeIn);

    return placeholderClip;
}
