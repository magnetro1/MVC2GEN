import csv from "csv-parser";
import * as fs from "fs";
// import * as path from "path";

var results = [];


async function processStreams()
{
    fs.createReadStream( 'Shuma47_Original.csv' )
        .pipe( csv() )
        .on( 'data', ( data ) => results.push( data ) )
        .on( 'end', () =>
        {
            console.log( 'Done' );
        } );
    console.log( results )
}
processStreams();