const Shotstack = require('shotstack-sdk');
const soundtrack = require('./soundtrack');
const backgroundVideo = require('./tracks/background');
const fixedText = require('./tracks/fixed');

module.exports = (tracks, videoLength, country) => {
    const color = '#000000';
    const soundtrackSrc = soundtrack('https://shotstack-assets.s3-ap-southeast-2.amazonaws.com/private/bad-news.mp3', 'fadeInFadeOut');
    const backgroundTrack = backgroundVideo(videoLength);
    const fixedTextTrack = fixedText(country, videoLength);

    tracks.push(fixedTextTrack);
    tracks.push(backgroundTrack);

    let timeline = new Shotstack.Timeline;
    timeline
        .setBackground(color)
        .setSoundtrack(soundtrackSrc)
        .setTracks(tracks);

    return timeline;
}