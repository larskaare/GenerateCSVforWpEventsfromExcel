/*jslint node: true */
/*jshint esversion: 6 */

/**
 */

'use strict';

exports.exporter = {
    excelFileName : "",
    csvFileName: ""
};

exports.excel = {
    eventSheetName : "Events",
    eventRange : "A5:F100",
    eventColCheck: 2,
    eventStartDateCol: 0,
    eventStartTimeCol: 1,
    eventNameCol: 2,
    eventDescCol: 3,
    eventLocationCol: 4,
    eventShowMapLinkCol: 5,
    eventTimeZone: "Europe/Oslo"
};
