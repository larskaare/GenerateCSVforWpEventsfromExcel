/*jslint node: true */
/*jshint esversion: 6 */
/*jshint mocha:true */

'use strict';


const { test } = require('tap');
var converter = require('../src/converter');
var expect = require('chai').expect;
var sinon = require('sinon');

// Testing 2 things for now
// - The basic config against the Excample XLS file in ./test/files/example1.xlsx)
// - That the converter returns an expected array based on the example file


test('Converting Testfile with standard config', t => {
   
    var configFile = require('../config/config').excelTest;
    var config = {};

    config.xlsxFile = './test/files/example1.xlsx';
    config.eventSheetName = configFile.eventSheetName;
    config.eventRange = configFile.eventRange;
    config.eventColCheck = configFile.eventColCheck;
    config.eventStartDateCol = configFile.eventStartDateCol;
    config.eventStartTimeCol = configFile.eventStartTimeCol;
    config.eventNameCol = configFile.eventNameCol;
    config.eventDescCol = configFile.eventDescCol;
    config.eventLocationCol = configFile.eventLocationCol;
    config.eventShowMapLinkCol = configFile.eventShowMapLinkCol;
    config.eventTimeZone = configFile.eventTimeZone;

    const eventArray = converter(config);

    t.test('first row shouled be a proper header row', t =>  {
        expect(eventArray[0][0]).to.be.equal('EVENT START DATE');
        expect(eventArray[0][1]).to.be.equal('EVENT START TIME');
        expect(eventArray[0][2]).to.be.equal('EVENT TIME ZONE');
        expect(eventArray[0][3]).to.be.equal('EVENT NAME');
        expect(eventArray[0][4]).to.be.equal('EVENT DESCRIPTION');
        expect(eventArray[0][5]).to.be.equal('VENUE NAME');
        expect(eventArray[0][6]).to.be.equal('EVENT SHOW MAP LINK');

        t.end();
    });

    t.test('second row shound be a kick-off event on Jan 1st 2019', t =>  {
        expect(eventArray[1][0]).to.be.equal('01.01.2019');
        expect(eventArray[1][1]).to.be.equal('12:00');
        expect(eventArray[1][2]).to.be.equal('Europe/Oslo');
        expect(eventArray[1][3]).to.be.equal('Kick-Off');
        expect(eventArray[1][4]).to.be.equal('Starting the new year');
        expect(eventArray[1][5]).to.be.equal('Main building');
        expect(eventArray[1][6]).to.be.equal('TRUE');

        t.end();

    });

    t.test('last event residing on row 4 should be a celebration on April 21th', t => {
        expect(eventArray[3][0]).to.be.equal('21.04.2019');
        expect(eventArray[3][1]).to.be.equal('18:00');
        expect(eventArray[3][2]).to.be.equal('Europe/Oslo');
        expect(eventArray[3][3]).to.be.equal('Celebration');
        expect(eventArray[3][4]).to.be.equal('Lets celebrate mr l');
        expect(eventArray[3][5]).to.be.equal('Town Hall');
        expect(eventArray[3][6]).to.be.equal('TRUE');

        t.end();

    });


    t.end();

});


test('Converting Testfile with undefined cells', (t) => {
    var configFile = require('../config/config').excelTest;
    var config = {};

    config.xlsxFile = './test/files/example2.xlsx';
    config.eventSheetName = configFile.eventSheetName;
    config.eventRange = configFile.eventRange;
    config.eventColCheck = configFile.eventColCheck;
    config.eventStartDateCol = configFile.eventStartDateCol;
    config.eventStartTimeCol = configFile.eventStartTimeCol;
    config.eventNameCol = configFile.eventNameCol;
    config.eventDescCol = configFile.eventDescCol;
    config.eventLocationCol = configFile.eventLocationCol;
    config.eventShowMapLinkCol = configFile.eventShowMapLinkCol;
    config.eventTimeZone = configFile.eventTimeZone;

    const eventArray = converter(config);

    t.test('first row shouled be a proper header row', (t) => {
        expect(eventArray[0][0]).to.be.equal('EVENT START DATE');
        expect(eventArray[0][1]).to.be.equal('EVENT START TIME');
        expect(eventArray[0][2]).to.be.equal('EVENT TIME ZONE');
        expect(eventArray[0][3]).to.be.equal('EVENT NAME');
        expect(eventArray[0][4]).to.be.equal('EVENT DESCRIPTION');
        expect(eventArray[0][5]).to.be.equal('VENUE NAME');
        expect(eventArray[0][6]).to.be.equal('EVENT SHOW MAP LINK');

        t.end();
    });

    t.test('second row shound be a kick-off event on Jan 1st 2019 and contain void for undefined cells.', (t) => {
        expect(eventArray[1][0]).to.be.equal('01.01.2019');
        expect(eventArray[1][1]).to.be.equal('12:00');
        expect(eventArray[1][2]).to.be.equal('Europe/Oslo');
        expect(eventArray[1][3]).to.be.equal('Kick-Off');
        expect(eventArray[1][4]).to.be.equal(void 0);
        expect(eventArray[1][5]).to.be.equal(void 0);
        expect(eventArray[1][6]).to.be.equal('TRUE');

        t.end();
    });

   
    t.end();
});

test('Passing a xlsx file that does not exist', (t) => {

    var configFile = require('../config/config').excelTest;
    var config = {};

    config.xlsxFile = '';
    config.eventSheetName = configFile.eventSheetName;
    config.eventRange = configFile.eventRange;
    config.eventColCheck = configFile.eventColCheck;
    config.eventStartDateCol = configFile.eventStartDateCol;
    config.eventStartTimeCol = configFile.eventStartTimeCol;
    config.eventNameCol = configFile.eventNameCol;
    config.eventDescCol = configFile.eventDescCol;
    config.eventLocationCol = configFile.eventLocationCol;
    config.eventShowMapLinkCol = configFile.eventShowMapLinkCol;
    config.eventTimeZone = configFile.eventTimeZone;

    sinon.stub(process, 'exit');
    process.exit.callsFake(() => {
        console.log('Test triggered process.exit');
        return true;
    }); 

    converter(config);

    t.ok(process.exit.called, 'Process exit called');

    process.exit.restore();

    t.end();
});


