const Shotstack = require('shotstack-sdk');

module.exports = (value, clipStart, clipLength, xOffset = 0, yOffset = 0) => {
    let counterText = new Shotstack.TitleAsset;
    counterText
        .setStyle('future')
        .setText(value)
        .setSize('xx-large')
        .setOffset({
            x: xOffset,
            y: yOffset
        });

    let counterClip = new Shotstack.Clip;
    counterClip
        .setAsset(counterText)
        .setStart(Number(clipStart))
        .setLength(Number(clipLength));

    return counterClip;
}
