/*jslint node: true */
/*jshint esversion: 6 */

const XLSX = require('xlsx');

//Decoder function that reads sheets and build event array
function sheet2arr(eventColCheck,sheet) {
    var result = [];
    var row;
    var rowNum;
    var colNum;
    var range = XLSX.utils.decode_range(sheet['!ref']);
    for(rowNum = range.s.r; rowNum <= range.e.r; rowNum++){
        row = [];

        var colCheck = sheet[
            XLSX.utils.encode_cell({r: rowNum, c:eventColCheck})
        ];
        
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
                    row.push(nextCell.w);
                }
            }

            result.push(row);
        }
    }
    return result;
}

function converter(config) {


    //Checking if the Excelfile exists
    try {
        var workbook = XLSX.readFile(config.xlsxFile,{dateNF:false});
    } catch(err) {
        console.log('Error reading Excel file %s (%s)',config.xlsxFile,err.message);
        process.exit(1);
    }

    var worksheet = workbook.Sheets[config.eventSheetName];
    worksheet['!ref'] = config.eventRange;
    
    var sheetArray = sheet2arr(config.eventColCheck,worksheet);

    var eventArray = [];
    
    var headerRow = [];
    headerRow.push('EVENT START DATE');
    headerRow.push('EVENT START TIME');
    headerRow.push('EVENT TIME ZONE');
    headerRow.push('EVENT NAME');
    headerRow.push('EVENT DESCRIPTION');
    headerRow.push('VENUE NAME');
    headerRow.push('EVENT SHOW MAP LINK');
    eventArray.push(headerRow);
    
    for (var rowNum = 0; rowNum < sheetArray.length; rowNum++) {
        // console.log(sheetArray[rowNum]);
        var newRow = [];
    
        newRow.push(sheetArray[rowNum][config.eventStartDateCol]);     //Start date
        newRow.push(sheetArray[rowNum][config.eventStartTimeCol]);     //Start time
        newRow.push(config.eventTimeZone);                             //Time Zone
        newRow.push(sheetArray[rowNum][config.eventNameCol]);          //Event name
        newRow.push(sheetArray[rowNum][config.eventDescCol]);          //Event description
        newRow.push(sheetArray[rowNum][config.eventLocationCol]);      //Event location
        newRow.push(sheetArray[rowNum][config.eventShowMapLinkCol]);   //Show map link
        
        eventArray.push(newRow);
    }

    return eventArray;

}

module.exports = converter;
