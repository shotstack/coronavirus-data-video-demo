'use strict'

require('dotenv').config();

const fs = require('fs');
const csv = require('fast-csv');
const argv = require('yargs').argv;
const Shotstack = require('shotstack-sdk');
const edit = require('./edit');

const API_KEY = process.env.SHOTSTACK_KEY;
const ENDPOINT = process.env.SHOTSTACK_ENDPOINT;
const DATASET = './full_data.csv';
const POLL_INTERVAL_SECONDS = 5;
const country = argv.country;
let countries = [];

if (!country) {
    console.log('No country selected. Please pass a country using --country.\n');
    process.exit(1);
}

const defaultClient = Shotstack.ApiClient.instance;
const DeveloperKey = defaultClient.authentications['DeveloperKey'];
const api = new Shotstack.EndpointsApi();
defaultClient.basePath = ENDPOINT;
DeveloperKey.apiKey = API_KEY;

/**
 * Prepare the edit and POST to the Shotstack API
 *
 * @param {String} country  The country name
 * @param {Array} cases  THe array of cases for each day
 */
const generateVideo = (country, cases) => {
    const request = edit(country, cases);

    if (argv.debug) {
        console.log(JSON.stringify(request, null, 2));
        return;
    }

    return new Promise((resolve, reject) => {
        api.postRender(request).then((data) => {
            let message = data.response.message;
            let id = data.response.id
    
            console.log(message);
            return resolve(id);
        }, (error) => {
            console.error('Request failed: ', error);
            return reject();
        })
    });
}

/**
 * Poll the Shotstack API to fetch the video render status
 * 
 * @param {String} id  The render ID to check
 */
const pollRenderStatus = (id) => {
    return new Promise((resolve, reject) => {
        (function poll(id){
            api.getRender(id).then((data) => {
                const status = data.response.status;
                
                if (status === 'failed') {
                    return reject('Video render failed');
                }
                
                if (status === 'done') {
                    return resolve(data.response.url);
                }

                process.stdout.write('.');
                setTimeout(poll, POLL_INTERVAL_SECONDS * 1000, id);
            }, (error) => {
                console.error('Request failed: ', error);
                reject();
            });
        })(id);
    });
}

/**
 * - Read the dataset
 * - Loop through the data and prepare the countries and cases
 * - Send a request to the API with the chosen country
 * - Poll for a response
 * - Output the final video URL
 */
fs.createReadStream(DATASET)
    .pipe(csv.parse({ headers: true }))
    .on('data', row => {
        const location = row['location'];

        countries[location] = countries[location] || [];
        countries[location].push({
            date: new Date(row['date']),
            new_cases: row['new_cases'],
            new_deaths: row['new_deaths'],
            total_cases: row['total_cases'],
            total_deaths: row['total_deaths']
        });
    })
    .on('finish', () => {
        try {
            const cases = countries[country].sort((a, b) => a.date - b.date);

            generateVideo(country, cases).then(id => {
                pollRenderStatus(id).then(url => {
                    console.log('\nRender Complete\nYour video is now available at the following URL:');
                    console.log(url);
                });
            });
        } catch (err) {
            console.log('Country could not be found. Check the `full_data.csv` file for correct spelling.\n');
            process.exit(1);
        }
    });
