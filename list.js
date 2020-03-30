'use strict'

require('dotenv').config();

const fs = require('fs');
const csv = require('fast-csv');

const DATASET = './full_data.csv';
let countries = [];

/**
 * Display a unique list of countries from CSV
 */
fs.createReadStream(DATASET)
    .pipe(csv.parse({ headers: true }))
    .on('data', row => {
        const location = row['location'];
        countries[location] = location;
    })
    .on('finish', () => {
        
        for (var key in countries) {
            console.log(key);
        }
    });
