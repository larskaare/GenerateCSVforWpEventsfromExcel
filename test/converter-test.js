/*jslint node: true */
/*jshint esversion: 6 */
/*jshint mocha:true */

'use strict';

var converter = require('../src/converter');
var expect = require('chai').expect;

// Testing 2 things for now
// - The basic config against the Excample XLS file in ./test/files/example1.xlsx)
// - That the converter returns an expected array based on the example file

describe('Converting Testfile with standard config', function () {

    var configFile = require('../config/config');
    var config = {};

    config.xlsxFile = ('./test/files/example1.xlsx');
    config.eventSheetName = (configFile.excel.eventSheetName);
    config.eventRange = (configFile.excel.eventRange);
    config.eventColCheck = (configFile.excel.eventColCheck);
    config.eventStartDateCol = (configFile.excel.eventStartDateCol);
    config.eventStartTimeCol = (configFile.excel.eventStartTimeCol);
    config.eventNameCol = (configFile.excel.eventNameCol);
    config.eventDescCol = (configFile.excel.eventDescCol);
    config.eventLocationCol = (configFile.excel.eventLocationCol);
    config.eventShowMapLinkCol = (configFile.excel.eventShowMapLinkCol);
    config.eventTimeZone = (configFile.excel.eventTimeZone);
        
    var eventArray = converter(config);

    it('first row shouled be a proper header row', function () {
        expect(eventArray[0][0]).to.be.equal('EVENT START DATE');
        expect(eventArray[0][1]).to.be.equal('EVENT START TIME');
        expect(eventArray[0][2]).to.be.equal('EVENT TIME ZONE');
        expect(eventArray[0][3]).to.be.equal('EVENT NAME');
        expect(eventArray[0][4]).to.be.equal('EVENT DESCRIPTION');
        expect(eventArray[0][5]).to.be.equal('VENUE NAME');
        expect(eventArray[0][6]).to.be.equal('EVENT SHOW MAP LINK');
    });
    
    it('second row shound be a kick-off event on Jan 1st 2019', function () {
        expect(eventArray[1][0]).to.be.equal('01.01.2019');
        expect(eventArray[1][1]).to.be.equal('12:00');
        expect(eventArray[1][2]).to.be.equal('Europe/Oslo');
        expect(eventArray[1][3]).to.be.equal('Kick-Off');
        expect(eventArray[1][4]).to.be.equal('Starting the new year');
        expect(eventArray[1][5]).to.be.equal('Main building');
        expect(eventArray[1][6]).to.be.equal('TRUE');
    });

    it('last event residing on row 4 should be a celebration on April 21th', function () {
        expect(eventArray[3][0]).to.be.equal('21.04.2019');
        expect(eventArray[3][1]).to.be.equal('18:00');
        expect(eventArray[3][2]).to.be.equal('Europe/Oslo');
        expect(eventArray[3][3]).to.be.equal('Celebration');
        expect(eventArray[3][4]).to.be.equal('Lets celebrate mr l');
        expect(eventArray[3][5]).to.be.equal('Town Hall');
        expect(eventArray[3][6]).to.be.equal('TRUE');
    });

});