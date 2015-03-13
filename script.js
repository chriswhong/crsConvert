// This is a sample script to convert coordinates from one CRS 
// to another using the proj4 node package.  Source is Web Mercator,
// output is WGS84.


var csv = require("fast-csv"),
    fs = require("fs"),
    proj4 = require("proj4");

//create read stream from source csv
var stream = fs.createReadStream('source.csv');

//write header row for output
fs.writeFile('output.csv', 'x,y,lon,lat\n', function(err) {});

//EPSG 3857, Web Mercator
var projection1 =
    "+proj=merc +lon_0=0 +k=1 +x_0=0 +y_0=0 +a=6378137 +b=6378137 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs";
//EPSG 4326, WGS84
var projection2 = "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs";

csv
    .fromStream(stream, {
        headers: true
    })
    .on("data", function(data) {
        //for each row in the source CSV,
        //convert the coordinates from projection1
        //to projection2

        var coord = [
            data.x,
            data.y
        ];

        var newCoord = proj4(projection1, projection2, coord);
        console.log("Converted " + coord + " to " + newCoord);

        //Write source and converted coordinates to a row in output.csv
        var outputString = data.x + ',' + data.y + ',' + newCoord[0] + ',' +
            newCoord[1] + '\n';
        fs.appendFile('output.csv', outputString, function(err) {

        });
    })