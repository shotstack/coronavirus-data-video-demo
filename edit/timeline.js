const Shotstack = require('shotstack-sdk');
const Soundtrack = require('./soundtrack');
const Background = require('./tracks/background');

module.exports = (tracks, videoLength) => {
    const color = '#000000';
    const soundtrack = Soundtrack('https://shotstack-assets.s3-ap-southeast-2.amazonaws.com/private/bad-news.mp3', 'fadeInFadeOut');
    const backgroundTrack = Background(videoLength);

    tracks.push(backgroundTrack);

    let timeline = new Shotstack.Timeline;
    timeline
        .setBackground(color)
        .setSoundtrack(soundtrack)
        .setTracks(tracks);

    return timeline;
}