const Shotstack = require('shotstack-sdk');
const soundtrack = require('./soundtrack');
const backgroundVideo = require('./tracks/background');
const fixedText = require('./tracks/fixed');
const dataAnimation = require('./tracks/data');

module.exports = (country, cases) => {
    const color = '#000000';
    const soundtrackSrc = soundtrack('https://shotstack-assets.s3-ap-southeast-2.amazonaws.com/private/bad-news.mp3', 'fadeInFadeOut');
    const [dataTrack, videoLength] = dataAnimation(cases);
    const backgroundTrack = backgroundVideo(videoLength);
    const fixedTextTrack = fixedText(country, videoLength);

    let timeline = new Shotstack.Timeline;
    timeline
        .setBackground(color)
        .setSoundtrack(soundtrackSrc)
        .setTracks([dataTrack, fixedTextTrack, backgroundTrack]);

    return timeline;
}