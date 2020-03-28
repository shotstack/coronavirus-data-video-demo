const Shotstack = require('shotstack-sdk');

module.exports = (value, clipStart, clipLength, xOffset = 0, yOffset = 0) => {
    let dateText = new Shotstack.TitleAsset;
    dateText
        .setStyle('future')
        .setText(value)
        .setSize('small')
        .setPosition('bottom')
        .setOffset({
            x: xOffset,
            y: yOffset
        });

    let dateClip = new Shotstack.Clip;
    dateClip
        .setAsset(dateText)
        .setStart(Number(clipStart))
        .setLength(Number(clipLength));

    return dateClip;
}
