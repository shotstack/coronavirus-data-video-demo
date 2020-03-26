const Shotstack = require('shotstack-sdk');
const Soundtrack = require('./soundtrack');

module.exports = (tracks) => {
    const color = '#000000';
    const soundtrack = Soundtrack('https://shotstack-assets.s3-ap-southeast-2.amazonaws.com/private/bad-news.mp3', 'fadeInFadeOut');

    let timeline = new Shotstack.Timeline;
    timeline
        .setBackground(color)
        .setSoundtrack(soundtrack)
        .setTracks(tracks);

    return timeline;
}