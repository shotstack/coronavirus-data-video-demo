const Shotstack = require('shotstack-sdk');
const backgroundClip = require('./clips/background');

module.exports = (videoLength) => {
    const clip = backgroundClip(videoLength);

    let backgroundTrack = new Shotstack.Track;
    backgroundTrack
        .setClips([clip]);

    return backgroundTrack;
}
