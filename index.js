'use strict';

// DEBUG VARIABLE
const debug = false;
const tweetInterval = 21600 * 1000;
// const tweetInterval = 5 * 1000;

require('dotenv').config()
const fsp = require('fs-promise');
const twit = require('twit');

const TWIT_CONFIG = {
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token: process.env.ACCESS_TOKEN,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET
}

const T = new twit(TWIT_CONFIG);

function tweetLyric() {
  console.log("Tweeting...");
  fsp.readFile('./lyrics.txt')
  .then(contents => {
    const lyricsRaw = contents.toString('utf-8');
    const lyrics = lyricsRaw.split("\n");
    lyrics.filter(item => item != "");
    return randomChoice(lyrics).toLowerCase();
  })
  .then(tweet => {
    if (!debug) {
      T.post('statuses/update', {
        status: tweet
      }, (err, data, response) => {
        if (!err) {
          console.log(`Tweeted: ${tweet}.`);
        }
        else {
          console.log(`There was an error tweeting: ${tweet}.`);
        }
      });
    } else {
      console.log(tweet);
    }
  })
}

tweetLyric();
setInterval(tweetLyric, tweetInterval);

function randomChoice(array) {
  return array[Math.floor(Math.random() * array.length)]
}
