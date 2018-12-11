/*jslint node: true */
/*jshint esversion: 6 */


//
//

var config = require('./config/config')
const XLSX = require('xlsx');
const toCSV = require('array-to-csv');

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


//Defining key files for read and or write
const xlsxFile = (config.exporter.excelFileName || argv.xlsx);
const csvFile = (config.exporter.csvFileName || argv.csv)

//Reading config parameters
const eventSheetName = (config.excel.eventSheetName || "Events");
const eventRange = (config.excel.eventRange || "A2:F100")
const eventColCheck = (config.excel.eventColCheck || 2);
const eventStartDateCol = (config.excel.eventStartDateCol || 0);
const eventStartTimeCol = (config.excel.eventStartTimeCol || 1);
const eventNameCol = (config.excel.eventNameCol || 2);
const eventDescCol = (config.excel.eventDescCol || 3);
const eventLocationCol = (config.excel.eventLocationCol || 4);
const eventShowMapLinkCol = (config.excel.eventShowMapLinkCol || 5);
const eventTimeZone = (config.excel.eventTimeZone || "");

//Starting conversion process
try {
    var workbook = XLSX.readFile(xlsxFile,{dateNF:false});
 } catch(err) {
     console.log('Error reading Excel file %s (%s)',xlsxFile,err.message);
     process.exit(1);
 }


var worksheet = workbook.Sheets[eventSheetName];
worksheet['!ref'] = eventRange;

function sheet2arr(sheet) {
    var result = [];
    var row;
    var rowNum;
    var colNum;
    var range = XLSX.utils.decode_range(sheet['!ref']);
    for(rowNum = range.s.r; rowNum <= range.e.r; rowNum++){
       row = [];

        var colCheck = sheet[
            XLSX.utils.encode_cell({r: rowNum, c: eventColCheck})
        ];
        // console.log('ColCheck col 5 : ' + typeof(colCheck) + ' - ' + rowNum);
        
        if ( typeof colCheck === 'undefined') {
        //    console.log('Skipping ' + rowNum);
        } else {

                for(colNum=range.s.c; colNum<=range.e.c; colNum++){

                var nextCell = {};
                nextCell = sheet[
                    XLSX.utils.encode_cell({r: rowNum, c: colNum})
                ];
                if( typeof nextCell === 'undefined' ){
                    row.push(void 0);
                } else {
                    // console.log('ColNum:RowNum:Cell:', colNum,rowNum, nextCell);
                    row.push(nextCell.w);
                    }
                }


                result.push(row);
            }
    }
    return result;
 };


var sheetArray = sheet2arr(worksheet);

var eventArray = [];

var headerRow = [];
headerRow.push('EVENT START DATE')
headerRow.push('EVENT START TIME')
headerRow.push('EVENT TIME ZONE')
headerRow.push('EVENT NAME')
headerRow.push('EVENT DESCRIPTION')
headerRow.push('VENUE NAME')
headerRow.push('EVENT SHOW MAP LINK')
eventArray.push(headerRow);

for (rowNum = 0; rowNum < sheetArray.length; rowNum++) {
    // console.log(sheetArray[rowNum]);
    var newRow = [];

    newRow.push(sheetArray[rowNum][eventStartDateCol]);     //Start date
    newRow.push(sheetArray[rowNum][eventStartTimeCol]);     //Start time
    newRow.push(eventTimeZone);                             //Time Zone
    newRow.push(sheetArray[rowNum][eventNameCol]);          //Event name
    newRow.push(sheetArray[rowNum][eventDescCol]);          //Event description
    newRow.push(sheetArray[rowNum][eventLocationCol]);      //Event location
    newRow.push(sheetArray[rowNum][eventShowMapLinkCol]);   //Show map link
    
    eventArray.push(newRow);
};

console.log(toCSV(eventArray));

if (csvFile) {
    const fs = require('fs')

    fs.writeFile(csvFile, toCSV(eventArray), (err) => {
        if (err) {
            console.error('Error writing to CSV file %s (%s)', csvFile,err.message)
            process.exit(1);
        }
   
        console.log('CSV file written to %s',csvFile);
    })
};

