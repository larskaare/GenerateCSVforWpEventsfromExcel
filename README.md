[![Known Vulnerabilities](https://snyk.io/test/github/larskaare/GenerateCSVforWpEventsfromExcel/badge.svg?targetFile=package.json)](https://snyk.io/test/github/larskaare/GenerateCSVforWpEventsfromExcel?targetFile=package.json)

# Generate CSV for WP-Events from Excel

```Problem```: We are using Excel to coordinate and plan a list of events. When the planning is done we would like to move these events into Events in WordPress.

```Solution```: Plan in excel, run this application and generate a CVS file that can be important into the WordPress Events module (quite easily)

## Preconditions

* The Excel file need to be using XLSX format

## Install the application

* Clone this repository
* Do ```npm install```
* Read the [configuration section in this document](#Configuration)
* Update the configuration file in ```./config/config.js```
* Do ```node app --help``` to get started

## Run the application

Getting help
```node
node app --help
```
Running a basic conversion
```node
node app --xlsx <excelfilename.xlsx> 
```

### Command line options

* --help ```gives help``` 
* --xlsx xlsxfilname ```specify which Excelfile to read. Overrides whats defined in the configuration file```
* --csv csvfilename ```If used, file to save csv export. If not used, csv is not written to file. Overrides whats defined in configuration file```

## Configuration

Configuration is stored in the ```./config.config.js``` file in two sections

## exporter

* ```excelFileName```, filename for excelfile to be converted
* ```csvFileName```, filename for csv to be written with converted results

Using the --xlsx and --csv command line options will override any settings in the exporter section.

## excel

* ```eventSheetName```, name of the sheet containing events
* ```eventRange```, the range in which to search for events
* ```eventColCheck```: the column to check for an event. If this column is empty for a row, the event is not included.
* ```eventStartDateCol```, the column holding event start date
* ```eventStartTimeCol```, the column holding event start time
* ```eventNameCol```, the column holding event name
* ```eventDescCol```, the column holding event description
* ```eventLocationCol```, the column holding event location. Must be a valid existing event location in WordPress.
* ```eventShowMapLinkCol```, the column holding  show link to map on event (TRUE, FALSE)
* ```eventTimeZone```, A valid time zone for all events.

Default values are defined in the configuration file  as well as in the app code. Columns, and rows, start on 0.

## Development

* Linting of code: ```npm run lint```
* Running tests: ```npm test```


## Docker

### Build a local image

Image name we give is **gwpcsv**. Remember to update the [config file](#Configuration) according to your Excel file definition prior to building.

```node
docker build -t gwpcsv .
```

### Run the local image

Example:

Notice the volume where the app expects to read xlsx files

```node
docker run --rm --name gwpcsv -v $PWD:/usr/src/app gwpcsv --xlsx ./(xlsx file)
```

Using the --csv (filename) to export will work fine. Provide a filename relative to the volume you mounted to Docker run.