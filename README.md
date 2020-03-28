# Coronavirus (COVID-19) Data Generated Videos

This is a demo to showcase using a data source to generate videos using the Shotstack API.

A NodeJS script loops through a data set of Coronavirus (Covid-19) global pandemic cases and deaths 
soured from [Our World In Data](https://ourworldindata.org/coronavirus-source-data) and generates a 
video for the selected country.

---

## Installation

Install dependencies using the following: 

```
npm install
```

---

## Usage

### Fetch/Update Data

Fetch the latest Coronavirus dataset:

```
npm run dataset
```

A CSV file `full_data.csv` is downloaded and saved in the project root directory.

### Generate Video

Run the following command with the country you wish to generate a video for:

```
npm run generate -- --country [Country]
```

Replace [Country] with the country, i.e.

```
npm run generate -- --country 'Australia'
```

Note: the country value is case sensitive and must be entered exactly as it is stored in
the `Location` column in the CSV file. i.e. 'United States' - alternatives like 'US', 'USA' 
or lowercase  'united states' will not work.