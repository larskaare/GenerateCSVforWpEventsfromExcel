/*jslint node: true */
/*jshint esversion: 6 */

// Application which on a good day can read your EXCEL file containing events in rows and converte
// these into a CSV file than can be imported into WordPress Events.


var configFile = require('./config/config');
const toCSV = require('array-to-csv');
var converter = require('./src/converter');

//Handling command line arguments
var argv = require('yargs')
    .usage('Usage: node $0 [options]')
    //.command('count', 'Count the lines in a file')
    .example('node $0 --xlsx ./work/example1.xls  --csv ./work/example.csv', '')
    .alias('xlsx', 'x')
    .nargs('xlsx', 1)
    .describe('xlsx', 'Xlsx file with events')
    .demandOption(['xlsx'])
    .alias('csv', 'c')
    .nargs('csv', 1)
    .describe('csv', 'Write to csv file')
    // .demandOption(['csv'])
    .help('h')
    .alias('h', 'help')
    .epilog('Happy importing')
    .argv;


//Reading and defining object to hold config

var config = {};

config.xlsxFile = (configFile.exporter.excelFileName || argv.xlsx);
config.csvFile = (configFile.exporter.csvFileName || argv.csv);

config.eventSheetName = (configFile.excel.eventSheetName || 'Events');
config.eventRange = (configFile.excel.eventRange || 'A2:F100');
config.eventColCheck = (configFile.excel.eventColCheck || 2);
config.eventStartDateCol = (configFile.excel.eventStartDateCol || 0);
config.eventStartTimeCol = (configFile.excel.eventStartTimeCol || 1);
config.eventNameCol = (configFile.excel.eventNameCol || 2);
config.eventDescCol = (configFile.excel.eventDescCol || 3);
config.eventLocationCol = (configFile.excel.eventLocationCol || 4);
config.eventShowMapLinkCol = (configFile.excel.eventShowMapLinkCol || 5);
config.eventTimeZone = (configFile.excel.eventTimeZone || '');

// Triggering the conversion - returning an array of events
var eventArray = converter(config);

console.log(toCSV(eventArray));

//Saving to csv file if the user have requested this on the command line
if (argv.csv) {
    const fs = require('fs');

    fs.writeFile(config.csvFile, toCSV(eventArray), (err) => {
        if (err) {
            console.error('Error writing to CSV file %s (%s)', config.csvFile,err.message);
            process.exit(1);
        }
   
        console.log('CSV file written to %s',config.csvFile);
    });
}
