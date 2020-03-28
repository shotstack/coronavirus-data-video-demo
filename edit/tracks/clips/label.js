const Shotstack = require('shotstack-sdk');

module.exports = (videoLength, topLength, frameLength, label, xOffset = 0, yOffset = 0) => {
    let fadeIn = new Shotstack.Transition;
    fadeIn.setIn('fade');

    let labelText = new Shotstack.TitleAsset;
    labelText
        .setStyle('chunkLight')
        .setText(label)
        .setSize('x-small')
        .setOffset({
            x: xOffset,
            y: yOffset
        });

    let labelClip = new Shotstack.Clip;
    labelClip
        .setAsset(labelText)
        .setStart(Number(topLength - 1 - frameLength))
        .setLength(videoLength - Number(topLength - 1 - frameLength))
        .setTransition(fadeIn);

    return labelClip;
}
