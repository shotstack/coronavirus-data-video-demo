const Shotstack = require('shotstack-sdk');

module.exports = (videoLength) => {
    let fadeIn = new Shotstack.Transition;
    fadeIn.setIn('fade');

    let backgroundVideo = new Shotstack.VideoAsset;
    backgroundVideo
        .setSrc('https://shotstack-assets.s3-ap-southeast-2.amazonaws.com/footage/virus.mp4');

    let backgroundClip = new Shotstack.Clip;
    backgroundClip
        .setAsset(backgroundVideo)
        .setStart(0.5)
        .setLength(videoLength - 0.5)
        .setTransition(fadeIn);

    return backgroundClip;
}
