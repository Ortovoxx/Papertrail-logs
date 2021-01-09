const fs = require('fs');
const axios = require('axios');
const zlib = require("zlib");
require('dotenv').config();

const tokenHeader = {
    'X-Papertrail-Token': process.env.PAPERTRAIL_API_TOKEN,
}

/**
 * Fetches an entire array of the most recent logs stored on papertrail
 * For free users this is usually 7 days worth
 * @returns array of downloads
 */
const fetchAllLogs = async () => {
    const response = await axios.get('https://papertrailapp.com/api/v1/archives.json', {
        headers: tokenHeader,
    });

    if (response.status != 200) throw new Error(`HTTP ${response.status} ${response.statusText}`)

    return response.data;
}

/**
 * Downloads a single file to a byte array buffer
 * @returns byte array buffer
 */
const downloadLog = async ({ url }) => {
    const response = await axios.get(url, {
        headers: tokenHeader,
        responseType: 'arraybuffer',
    });

    if (response.status != 200) throw new Error(`HTTP ${response.status} ${response.statusText}`)

    return response.data
}

/**
 * Fetches and extracts all logs
 */
const getLogs = async () => {
    const allLogEntries = await fetchAllLogs();

    console.log(`Fetched ${allLogEntries.length} log files from ${allLogEntries[allLogEntries.length - 1].start_formatted} to ${allLogEntries[0].start_formatted}`);

    // Makes the log dir
    if (!fs.existsSync('./logs')) {
        fs.mkdirSync('./logs');
    }

    // Loops over all the logs to download then and extract from the .tsv.gz format to the .tsv format
    for (const log of allLogEntries) {
        // Downloads the log
        const bufferToExtract = await downloadLog({ url: log._links.download.href });
        const filename = log.filename;
        console.log(`Downloaded ${filename} with a size of ${log.filesize} bytes from logs spanning over ${log.duration_formatted}`);

        // Extracts the log
        zlib.gunzip(bufferToExtract, (err, buffer) => {
            if (err) throw new Error(err)

            // Writes the file to disk
            const tsvname = filename.split('.gz').join('');
            fs.writeFileSync(`./logs/${tsvname}`, buffer.toString('utf8'));
            console.log(`Extracted to ${tsvname}`);
        });
    }
}

getLogs();