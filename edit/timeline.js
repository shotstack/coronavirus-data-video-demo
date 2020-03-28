const Shotstack = require('shotstack-sdk');
const soundtrack = require('./soundtrack');
const background = require('./tracks/background');
const fixed = require('./tracks/fixed');
const data = require('./tracks/data');

module.exports = (country, cases) => {
    const VIDEO_TOP_LENGTH = 2;
    const VIDEO_TAIL_LENGTH = 4;
    const FRAME_LENGTH = 0.04;

    const color = '#000000';
    const audio = soundtrack('https://shotstack-assets.s3-ap-southeast-2.amazonaws.com/music/freepd/asking-questions.mp3', 'fadeInFadeOut');
    const [dataTrack, videoLength] = data(cases, VIDEO_TOP_LENGTH, VIDEO_TAIL_LENGTH, FRAME_LENGTH);
    const backgroundTrack = background(videoLength);
    const fixedTextTrack = fixed(country, videoLength, VIDEO_TOP_LENGTH, FRAME_LENGTH);

    let timeline = new Shotstack.Timeline;
    timeline
        .setBackground(color)
        .setSoundtrack(audio)
        .setTracks([
            dataTrack,
            fixedTextTrack,
            backgroundTrack
        ]);

    return timeline;
}