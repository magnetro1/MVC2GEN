import * as fs from 'fs';
import * as path from 'path';
import * as data from './main_files/SpiralUnblockable_node.js'; // TODO figure out how to make this dynamic
import { Knockdown_State_Static, Prox_Block_Static, namesTable_Static } from './main_files/staticData.js' //eval(testPath);
// console.log(data.FileName);
// import * as data from "./main_files/Shuma47_node.js";
// import * as data from "./main_files/CaptainCommandoRogueCable8_node.js";

const dirOutPath = path.join(process.cwd(), `/exportToAE/SpiralUnblockable/`); // File Directory to write to; needs to match the clip name to make sense TODO fix this

const clipLength = data.A_2D_Game_Timer.split(',').length; // Used as clip-length frame tracker; address doesn't matter
// console.log(clipLength)
// Objects with the player slots as keys, and their values (0/1/2) as object-values. Ex: 'P1_A_ : 0'
const pointTableP1 =
{
    P1_A_: data.P1_A_Is_Point.split(","),
    P1_B_: data.P1_B_Is_Point.split(","),
    P1_C_: data.P1_C_Is_Point.split(","),
};
const pointTableP2 =
{
    P2_A_: data.P2_A_Is_Point.split(","),
    P2_B_: data.P2_B_Is_Point.split(","),
    P2_C_: data.P2_C_Is_Point.split(","),
};

/****** Functions ******/

//01
// Fetches usable node-js files exported using Powershell script from a pre-set directory
const dirMainFiles = path.join(process.cwd(), `/main_files/`);
var fileNames = [];
function getNodeJSFiles() // uses dirMainFiles to fetch usable files; returns array of file names
{
    fs.readdirSync(dirMainFiles, 'utf8').toString().split(',').forEach(function (file)
    {
        let _nodeJSRegex = /\w+_node.js/g;
        if (file.match(_nodeJSRegex))
        {
            fileNames.push(file);
        }
    })
    return fileNames;
}
// console.log(getNodeJSFiles());

//02
// Get unique-list of player memory addresses per clip to feed into main function
var playerDataAll = [];
function getLabelsfromJS(pathToFile)
{
    var getFile = fs.readFileSync(pathToFile, 'utf8',);
    getFile.toString().split(';').forEach(function (line) //Split each block of text by semi-colon
    {
        let playerMemoryRegex = /(P[1-2]_[A-C]_)(\w+)\s/g; // regex to find all player memory addresses; want capture group 2.
        let tempRegexVar; // Temporary variable to run the exec method
        while (tempRegexVar = playerMemoryRegex.exec(line)) // Exec needs to match true or false
        {
            playerDataAll.push(tempRegexVar[ 2 ]); // regex.exec returns array of all matches; item[2] is the address; has many duplicates
            playerDataAll.join(','); // Converts array to string
        };
    });
    var removeDuplicates = [ ...new Set(playerDataAll) ];

    return removeDuplicates
}

//03
// Main function to write data to files OR return finalValues array
// Appends array if 2-character+ bug is on
// Writes files to dirOutPath
function PointCharacterDataWriter(Player1OrPlayer2, PlayerMemoryAddress, Write) // 'P1'/'P2', 'PlayerMemoryAddress' = address from data-object, write = 1/0
{
    var pointArray = []; // contains string prefixes for point-character-slot; ex 'P1_A_'. CAN BE LONGER THAN CLIP-LENGTH if 2-character bug is on
    var finalValue = []; // contains array with final numbers pertaining to the quieried address. Ex: [0,0,0...]
    //Find P1/P2 point characters
    if (Player1OrPlayer2 == "P1")
    {
        for (let slotsPerSide = 0; slotsPerSide < Object.values(pointTableP1).length; slotsPerSide++) // 3
        {
            for (let clipLen = 0; clipLen < clipLength; clipLen++) // length of clip
            {
                if (Object.values(pointTableP1)[ slotsPerSide ][ clipLen ] == 0) // is this slot the point character? 
                {
                    pointArray.push(Object.keys(pointTableP1)[ slotsPerSide ]);
                }
            }
        }
    } else if (Player1OrPlayer2 == "P2")
    {
        for (let slotsPerSide = 0; slotsPerSide < Object.values(pointTableP2).length; slotsPerSide++) //3
        {
            for (let clipLen = 0; clipLen < clipLength; clipLen++) // length of clip
            {
                if (Object.values(pointTableP2)[ slotsPerSide ][ clipLen ] == 0)
                {
                    pointArray.push(Object.keys(pointTableP2)[ slotsPerSide ]); // ex: ['P1_A_', 'P1_A_'...]
                }
            }
        }
    }
    else
    {
        return `Arguments need to be strings!`;
    }
    // Break out without writing files!
    if (Write == 0) //Used to break out before writing to file; returns finalValue array without writing it to file
    {
        for (let clipLen = 0; clipLen < clipLength; clipLen++)
        {
            finalValue += eval(`data.${pointArray[ clipLen ]}${PlayerMemoryAddress}.split(',')`)[ clipLen ] + ','; //ex: data.P1_A_[0]ID_2.split(',')[0] => returns a number pertaining to the point character's ID_2
            console.log(finalValue)
        }
        //2-character Bug Logic:
        if (pointArray.length >= (clipLength * 2))
        {
            for (let clipLenSlotB = clipLength, clipLen = 0; clipLenSlotB < clipLength * 2; clipLenSlotB++, clipLen++)
            {
                finalValue += eval(`data.${pointArray[ clipLenSlotB ]}${PlayerMemoryAddress}.split(',')`)[ clipLen ] + ',';
            }
            console.log(`2-Character Bug Active on ${Player1OrPlayer2} side!`);
        }
        //3-Character Bug Logic:
        else if (pointArray.length >= (clipLength * 3))
        {
            for (let clipLenSlotC = clipLength * 2, clipLen = 0; clipLenSlotC < clipLength * 3; clipLenSlotC++, clipLen++)
            {
                finalValue += eval(`data.${pointArray[ clipLenSlotC ]}${PlayerMemoryAddress}.split(',')`)[ clipLen ] + ',';
            }
            console.log(`3-Character Bug Active on ${Player1OrPlayer2} side!`);
        }
        return finalValue //contains array with point-character slot values for the queried address. [0,0,0...]
    }
    // Write to files
    // //Make Directories if they don't exist
    if (!fs.existsSync(dirOutPath))
    {
        fs.mkdirSync(dirOutPath);
    }
    //Write base file
    fs.writeFileSync(`${dirOutPath}/${Player1OrPlayer2}_${PlayerMemoryAddress}.js`, `var result = [];` + '\r', { flag: 'a+', encoding: 'utf8' }, (err => { }));
    //Append data-values for first-point
    for (let clipLen = 0; clipLen < clipLength; clipLen++)
    {
        finalValue += eval(`data.${pointArray[ clipLen ]}${PlayerMemoryAddress}.split(',')`)[ clipLen ] + ',';
    }
    //Append main data-values to file
    fs.appendFile(`${dirOutPath}/${Player1OrPlayer2}_${PlayerMemoryAddress}.js`, `result[0] = [${finalValue.toString()}],`.replace(',]', ']').replace('],', '];') + '\n', { flag: 'a+', encoding: 'utf8' }, (err => { }));
    finalValue = [];
    //2-Character Bug-Logic:
    if (pointArray.length >= (clipLength * 2))
    {
        for (let clipLenSlotB = clipLength, clipLen = 0; clipLenSlotB < clipLength * 2; clipLenSlotB++, clipLen++)
        {
            finalValue += eval(`data.${pointArray[ clipLenSlotB ]}${PlayerMemoryAddress}.split(',')`)[ clipLen ] + ',';
        }
        fs.appendFile(`${dirOutPath}/${Player1OrPlayer2}_${PlayerMemoryAddress}.js`, `result[1] = [${finalValue.toString()}],`.replace(',]', ']').replace('],', '];') + '\n', { flag: 'a+', encoding: 'utf8' }, (err => { }));
        console.log(`2-Character Bug Active on ${Player1OrPlayer2} side!`);
    }
    //3-Character Bug Logic:
    else if (pointArray.length >= (clipLength * 3))
    {
        for (let clipLenSlotC = clipLength * 2, clipLen = 0; clipLenSlotC < clipLength * 3; clipLenSlotC++, clipLen++)
        {
            finalValue += eval(`data.${pointArray[ clipLenSlotC ]}${PlayerMemoryAddress}.split(',')`)[ clipLen ] + ',';
        }
        fs.appendFile(`${dirOutPath}/${Player1OrPlayer2}_${PlayerMemoryAddress}.js`, `result[2] = [${finalValue.toString()}],`.replace(',]', ']').replace('],', '];') + '\n', { flag: 'a+', encoding: 'utf8' }, (err => { }));
        console.log(`3-Character Bug Active on ${Player1OrPlayer2} side!`);
    }
    // No 2- or 3-Character Bug
    else
    {
        console.log(`Only 1 Point Character on ${Player1OrPlayer2} side.`);
    }
} // End of Mainfunction()

//Independent file-writer
function IndependentFileWriter(Pw, FileName, address) // P1/P2, Title of file, address name from data-object
{
    //Write base file
    fs.writeFileSync(`${Pw}_${FileName}.js`, `var result = [];` + '\r', { flag: 'a+', encoding: 'utf8' }, (err => { }));
    //Append data for first-point
    fs.appendFile(`${Pw}_${FileName}.js`, `result[0] = [${address.toString()}],`.replace(',]', ']').replace('],', '];') + '\n', { flag: 'a+', encoding: 'utf8' }, (err => { }));
    address = [];
}

//Write Static Data Conversion Function
const staticDataTable = [ Knockdown_State_Static, Prox_Block_Static, namesTable_Static ]
const staticDataFiles = [ 'Knockdown_State', 'Is_Prox_Block', 'ID_2' ]
var StaticValuesArr = [];
function writeStaticDataCnv()
{
    for (let PlayersLen = 2; PlayersLen < 3; PlayersLen++)
    {
        for (let staticTableLen = 0; staticTableLen < staticDataTable.length; staticTableLen++)
        {
            fs.writeFileSync(`P${[ PlayersLen ]}_${staticDataFiles[ staticTableLen ]}_CNV.js`, `var result = [];` + '\r', { flag: 'a+', encoding: 'utf8' }, (err => { }));
            var getPointData = PointCharacterDataWriter(`P${[ PlayersLen ]}`, staticDataFiles[ staticTableLen ], 0).split(',');
            for (let clipLen = 0; clipLen < clipLength; clipLen++)
            {
                StaticValuesArr.push(`'${Object.values(staticDataTable[ staticTableLen ])[ getPointData[ clipLen ] ]}'`); //converts number to string
            }
            fs.appendFile(`P${[ PlayersLen ]}_${staticDataFiles[ staticTableLen ]}_CNV.js`, `result[0] = [${StaticValuesArr},']`.replace(/',']/, '\'];') + '\n', { flag: 'a+', encoding: 'utf8' }, (err => { }));
            StaticValuesArr = [];
            // 2-Character Bug Logic:
            if (getPointData.length - 1 >= (clipLength * 2))
            {
                for (let clipLenSlotB = clipLength; clipLenSlotB < clipLength * 2; clipLenSlotB++)
                {
                    StaticValuesArr.push(`'${Object.values(staticDataTable[ staticTableLen ])[ getPointData[ clipLenSlotB ] ]}'`); //converts number to string
                }
                fs.appendFile(`P${[ PlayersLen ]}_${staticDataFiles[ staticTableLen ]}_CNV.js`, `result[1] = [${StaticValuesArr},']`.replace(/',']/, '\'];') + '\n', { flag: 'a+', encoding: 'utf8' }, (err => { }));
                StaticValuesArr = [];
            }
        }
    }
}

// writeStaticDataCnv();

// EXECUTE MAIN FUNCTIONS
// var playerMemoryAddresses = getLabelsfromJS("./main_files/SpiralUnblockable_node.js");
// for (let i = 0; i < playerMemoryAddresses.length; i++) //returns array of addresses that are written to dirOutPath
// {
//     PointCharacterDataWriter('P1', playerMemoryAddresses[ i ].toString(), 1);
//     PointCharacterDataWriter('P2', playerMemoryAddresses[ i ].toString(), 1);
// }


/*List of States I'm going to export data for:
  I was thinking of adding a table of states and their corresponding logics...
  It would be cool if the MVC2GEN could iterate through this table automatically
  to pick out which key and value pairs to use for each character.

const newDataToWrite = {
    "Being_Hit": Animation_Timer_Main > 0 && Knockdown_State == 32 ? 1 : 0,
    "Flying_Screen_Air": FlyingScreen == 1 && Knockdown_State == 32 && Airborne == 2 ? 1 : 0,
    "FlyingScreen_OTG": FlyingScreen == 1 && Knockdown_State == 32 && Airborne == 3 ? 1 : 0,
    "FS_Install_1": FSI_Points == 8 || FSI_Points == 9  ? 1 : 0,
    "FS_Install_2": FSI_Points > 9 ? 1 : 0,
    "NJ_Air": Airborne == 2 && Knockdown_State == 3 && SJ_Counter == 0 ? 1 : 0,
    "NJ_Rising": Airborne == 0 && Knockdown_State == 2 && SJ_Counter == 0 ? 1 : 0,
    "OTG_Extra_Stun": Knockdown_State == 23 && Airborne == 3 ? 1 : 0,
    "OTG_Forced_Stun": Knockdown_State == 32 && Airborne == 3 ? 1 : 0,
    "OTG_Hit": Action_Flags == 0 && Airborne == 3 && Knockdown_State == 32 ? 1 : 0,
    "OTG_Roll_Invincible": Action_Flags == 2 && Airborne == 1 && Attack_Immune == 1 && Knockdown_State == 17 ? 1 : 0,
    "OTG_Roll_Stunned": Action_Flags == 1 && Airborne == 3 && Knockdown_State == 32 ? 1 : 0,
    "ProxBlock_Air": Is_Prox_Block == 6 && Knockdown_State == 19 ? 1 : 0,
    "ProxBlock_Ground": Is_Prox_Block == 5 && Knockdown_State == 18 ? 1 : 0,
    "Pushblock_Air": Block_Meter > 0 && Animation_Timer_Main < 28 && Is_Prox_Block == 6 && Action_Flags == 2 ? 1 : 0,
    "Pushblock_Ground": Block_Meter > 0 && Animation_Timer_Main < 28 && Is_Prox_Block == 5 && Action_Flags == 3 ? 1 : 0,
    "Rising_Invincibility": Airborne == 0 && Attack_Immune == 1 && Knockdown_State == 17 ? 1 : 0,
    "SJ_Air": Airborne == 2 && Knockdown_State == 14 && SJ_Counter == 1 ? 1 : 0,
    "SJ_Counter": SJ_Counter == 2 ? 1 : 0,
    "Stun": Knockdown_State == 32 && Is_Prox_Block == 13 ? 1 : 0,
    "Tech_Hit": Knockdown_State == 27 ? 1 : 0,
    "Thrown_Air": Airborne == 2 && Knockdown_State == 31 && Is_Prox_Block == 16 ? 1 : 0,
    "Thrown_Ground": Airborne == 0 && Knockdown_State == 31 && Is_Prox_Block == 16 ? 1 : 0,
}


/*Instead for now, there's these arrays corresponding to each character.
I have to create a set of Arrays for each character for now.
*/
// var BeingHitArray = [];
// 	BeingHitArray[0] = '';
// 	BeingHitArray[1] = '';
// 	BeingHitArray[2] = '';
// 	BeingHitArray[3] = '';
// 	BeingHitArray[4] = '';
// 	BeingHitArray[5] = '';

// var FlyingScreenAirArray = [];
// 	FlyingScreenAirArray[0] = '';
// 	FlyingScreenAirArray[1] = '';
// 	FlyingScreenAirArray[2] = '';
// 	FlyingScreenAirArray[3] = '';
// 	FlyingScreenAirArray[4] = '';
// 	FlyingScreenAirArray[5] = '';

// for ( let sixCharsI in slots )
// {
// 	let tempTxt = '';
// 	for ( let frame in clipLength )
// 	{
// 		tempTxt += ( eval(`data.${slots[sixCharsI]}FlyingScreen.split(',')`)[frame] == 1
// 			&& eval(`data.${slots[sixCharsI]}Knockdown_State.split(',')`)[frame] == 32
// 			&& eval(`data.${slots[sixCharsI]}Airborne.split(',')`)[frame] == 2)
// 			? 1 + ',' : 0 + ',';
// 		FlyingScreenAirArray[sixCharsI] = `export var ${slots[sixCharsI]}FlyingScreenAir = "${tempTxt}";`;
// 	}
// 	tempTxt = '';
// 	FlyingScreenAirArray[sixCharsI] = FlyingScreenAirArray[sixCharsI].replace(`,"` , `"`);
// }

/*Old method of doing the loops; I'm keeping it here to update it later.
I'd like to figure out an efficient way to do these loops before propagating it to the other files.

for (let  m = 0 ; m < slots.length ; m++ )
{
    for ( let i = 0; i < data.A_2D_Game_Timer.split(',').length ; i++ )
    {
        // console.log(slots[m]+"Knockdown_State: "+(eval(`data.${slots[m]}Knockdown_State.split(',')`)[i]))
        // console.log(slots[m]+"Animation_Timer_Main: "+(eval(`data.${slots[m]}Animation_Timer_Main.split(',')`)[i]))
        BeingHitArray[m] += ( eval(`data.${slots[m]}Animation_Timer_Main.split(',')`)[i] > 0
            && eval(`data.${slots[m]}Knockdown_State.split(',')`)[i] == 32 )
            ? 1 + ',' : 0 + ','
    }
    // console.log(slots[m]+"BeingHit: " + BeingHitArray[m]);
}
console.log(BeingHitArray);
*/
