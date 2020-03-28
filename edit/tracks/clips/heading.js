const Shotstack = require('shotstack-sdk');

module.exports = (text, videoLength, fontSize = 'medium', position = 'middle', xOffset = 0, yOffset = 0) => {
    let fadeIn = new Shotstack.Transition;
    fadeIn.setIn('fade');

    let headingText = new Shotstack.TitleAsset;
    headingText
        .setStyle('chunkLight')
        .setText(text.toUpperCase())
        .setSize(fontSize)
        .setPosition(position)
        .setOffset({
            x: xOffset,
            y: yOffset
        });

    let headingClip = new Shotstack.Clip;
    headingClip
        .setAsset(headingText)
        .setStart(0.5)
        .setLength(videoLength - 0.5)
        .setTransition(fadeIn);

    return headingClip;
}
