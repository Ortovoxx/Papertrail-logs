# Papertrail log downloader

Allows downloading and extraction of logs stored in the archives of Papertrail: https://papertrailapp.com/account/archives

This script downloads logs and then extracts them to the `./logs` folder

This directory wil be created for you if one does not already exist

Read more about [Papertrail logs](https://documentation.solarwinds.com/en/Success_Center/papertrail/Content/kb/how-it-works/permanent-log-archives.htm?cshid=pt-how-it-works-permanent-log-archives)

## Archived logs

For free accounts papertrail archives logs for 7 days.

These log files cover logs outputted from your application for 1 hour. All times are in UTC

## File format

All logs are in a `.tsv` (tab separate value) format 

Their names are the date `2021-01-01-18.tsv` in `YYYY-MM-DD-HH` format

The TSV Colums are as follows:

```
id
generated_at
received_at
source_id
source_name
source_ip
facility_name
severity_name
program
message
```

## Installation and usage

Clone the repo

Run `npm install`

Change the name of the [.env.example](.env.example) file to `.env` and insert your papertrail api key 

Run `npm start`

Wait for all your logs to download