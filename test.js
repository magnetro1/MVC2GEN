import { Console } from 'console';
import * as fs from 'fs';
import * as path from 'path';
import * as data from './main_files/SpiralUnblockable_node.js'; // TODO figure out how to make this dynamic
// import * as data from "./main_files/Shuma47_node.js";
const clipLength = data.A_2D_Game_Timer.split( ',' ).length; // Used as clip-length frame tracker; address doesn't matter
// Objects with the player slots as keys, and their values (0/1/2) as object-values. Ex: 'P1_A_ : 0'
const POINT_OBJ_P1 =
{
    P1_A_: data.P1_A_Is_Point.split( "," ),
    P1_B_: data.P1_B_Is_Point.split( "," ),
    P1_C_: data.P1_C_Is_Point.split( "," ),
};
const POINT_OBJ_P2 =
{
    P2_A_: data.P2_A_Is_Point.split( "," ),
    P2_B_: data.P2_B_Is_Point.split( "," ),
    P2_C_: data.P2_C_Is_Point.split( "," ),
};

var playerObject = '';
for ( let playerIterator = 1; playerIterator < 3; playerIterator++ )
{
    if ( playerIterator == 1 )
    {
        playerObject = POINT_OBJ_P1;
    }
    else if ( playerIterator == 2 )
    {
        playerObject = POINT_OBJ_P2;
    }
    console.log( Object.values( playerObject ) )
    // console.log( playerObject )
    // console.log( playerIterator )
}
console.log( "finish" )


// expected result: "12345"


// var finalValuesArray = [];
// finalValuesArray[0] = [];
// finalValuesArray[1] = [];
// finalValuesArray[2] = [];

// for ( let clipLen = 0; clipLen < clipLength; clipLen++ ) // length of clip
// {
//     //P1

//     // 3 - Character Bug Logic
//     if ( ( Object.values( POINT_OBJ_P1 )[0][clipLen] == 0 ) && ( Object.values( POINT_OBJ_P1 )[1][clipLen] == 0 ) && ( Object.values( POINT_OBJ_P1 )[2][clipLen] == 0 ) )
//     {
//         // console.log("P1: 3-Character Bug Logic: A == 0 && B == 0 && C == 0    P1: ABC");
//         finalValuesArray[0].push( eval( `data.${ Object.keys( POINT_OBJ_P1 )[0] }Y_Position_Arena.split(',')` )[clipLen] );
//         finalValuesArray[1].push( eval( `data.${ Object.keys( POINT_OBJ_P1 )[1] }Y_Position_Arena.split(',')` )[clipLen] );
//         finalValuesArray[2].push( eval( `data.${ Object.keys( POINT_OBJ_P1 )[2] }Y_Position_Arena.split(',')` )[clipLen] );
//     }
//     //2-Character Bug Logic
//     else if ( ( Object.values( POINT_OBJ_P1 )[0][clipLen] == 0 ) && ( Object.values( POINT_OBJ_P1 )[1][clipLen] == 0 ) && ( Object.values( POINT_OBJ_P1 )[2][clipLen] != 0 ) )
//     {
//         // console.log("P1: 2-Character Bug Logic: A == 0 && B == 0 && C != 0    P1: AB");
//         finalValuesArray[0].push( eval( `data.${ Object.keys( POINT_OBJ_P1 )[0] }Y_Position_Arena.split(',')` )[clipLen] );
//         finalValuesArray[1].push( eval( `data.${ Object.keys( POINT_OBJ_P1 )[1] }Y_Position_Arena.split(',')` )[clipLen] );

//     }
//     else if ( ( Object.values( POINT_OBJ_P1 )[0][clipLen] == 0 ) && ( Object.values( POINT_OBJ_P1 )[1][clipLen] != 0 ) && ( Object.values( POINT_OBJ_P1 )[2][clipLen] == 0 ) )
//     {
//         // console.log("P1: 2-Character Bug Logic: A == 0 && B != 0 && C == 0    P1: AC");
//         finalValuesArray[0].push( eval( `data.${ Object.keys( POINT_OBJ_P1 )[0] }Y_Position_Arena.split(',')` )[clipLen] );
//         finalValuesArray[1].push( eval( `data.${ Object.keys( POINT_OBJ_P1 )[2] }Y_Position_Arena.split(',')` )[clipLen] );
//     }
//     else if ( ( Object.values( POINT_OBJ_P1 )[0][clipLen] != 0 ) && ( Object.values( POINT_OBJ_P1 )[1][clipLen] == 0 ) && ( Object.values( POINT_OBJ_P1 )[2][clipLen] == 0 ) )
//     {
//         // console.log("P1: 2-Character Bug Logic: A != 0 && B == 0 && C == 0    P1: BC");
//         finalValuesArray[0].push( eval( `data.${ Object.keys( POINT_OBJ_P1 )[1] }Y_Position_Arena.split(',')` )[clipLen] );
//         finalValuesArray[1].push( eval( `data.${ Object.keys( POINT_OBJ_P1 )[2] }Y_Position_Arena.split(',')` )[clipLen] );
//     }
//     //1-Character Logic
//     else if ( ( Object.values( POINT_OBJ_P1 )[0][clipLen] == 0 ) && ( Object.values( POINT_OBJ_P1 )[1][clipLen] != 0 ) && ( Object.values( POINT_OBJ_P1 )[2][clipLen] != 0 ) )
//     {
//         // console.log("P1: 1-Character Logic: A == 0 && B != 0 && C != 0        P1: A");
//         finalValuesArray[0].push( eval( `data.${ Object.keys( POINT_OBJ_P1 )[0] }Y_Position_Arena.split(',')` )[clipLen] );
//     }
//     else if ( ( Object.values( POINT_OBJ_P1 )[0][clipLen] != 0 ) && ( Object.values( POINT_OBJ_P1 )[1][clipLen] == 0 ) && ( Object.values( POINT_OBJ_P1 )[2][clipLen] != 0 ) )
//     {
//         // console.log("P1: 1-Character Logic: A != 0 && B == 0 && C != 0        P1: B");
//         finalValuesArray[0].push( eval( `data.${ Object.keys( POINT_OBJ_P1 )[1] }Y_Position_Arena.split(',')` )[clipLen] );
//     }
//     else if ( ( Object.values( POINT_OBJ_P1 )[0][clipLen] != 0 ) && ( Object.values( POINT_OBJ_P1 )[1][clipLen] != 0 ) && ( Object.values( POINT_OBJ_P1 )[2][clipLen] == 0 ) )
//     {
//         // console.log("P1: 1-Character Logic: A != 0 && B != 0 && C == 0        P1: C");
//         finalValuesArray[0].push( eval( `data.${ Object.keys( POINT_OBJ_P1 )[2] }Y_Position_Arena.split(',')` )[clipLen] );
//     }

//     // P2

//     // 3 - Character Bug Logic
//     if ( ( Object.values( POINT_OBJ_P2 )[0][clipLen] == 0 ) && ( Object.values( POINT_OBJ_P2 )[1][clipLen] == 0 ) && ( Object.values( POINT_OBJ_P2 )[2][clipLen] == 0 ) )
//     {
//         // console.log("P2: 3-Character Bug Logic: A == 0 && B == 0 && C == 0    P2: ABC");
//         finalValuesArray[0].push( eval( `data.${ Object.keys( POINT_OBJ_P2 )[0] }Y_Position_Arena.split(',')` )[clipLen] );
//         finalValuesArray[1].push( eval( `data.${ Object.keys( POINT_OBJ_P2 )[1] }Y_Position_Arena.split(',')` )[clipLen] );
//         finalValuesArray[2].push( eval( `data.${ Object.keys( POINT_OBJ_P2 )[2] }Y_Position_Arena.split(',')` )[clipLen] );
//     }
//     //2-Character Bug Logic
//     else if ( ( Object.values( POINT_OBJ_P2 )[0][clipLen] == 0 ) && ( Object.values( POINT_OBJ_P2 )[1][clipLen] == 0 ) && ( Object.values( POINT_OBJ_P2 )[2][clipLen] != 0 ) )
//     {
//         // console.log("P2: 2-Character Bug Logic: A == 0 && B == 0 && C != 0    P2: AB");
//         finalValuesArray[0].push( eval( `data.${ Object.keys( POINT_OBJ_P2 )[0] }Y_Position_Arena.split(',')` )[clipLen] );
//         finalValuesArray[1].push( eval( `data.${ Object.keys( POINT_OBJ_P2 )[1] }Y_Position_Arena.split(',')` )[clipLen] );

//     }
//     else if ( ( Object.values( POINT_OBJ_P2 )[0][clipLen] == 0 ) && ( Object.values( POINT_OBJ_P2 )[1][clipLen] != 0 ) && ( Object.values( POINT_OBJ_P2 )[2][clipLen] == 0 ) )
//     {
//         // console.log("P2: 2-Character Bug Logic: A == 0 && B != 0 && C == 0    P2: AC");
//         finalValuesArray[0].push( eval( `data.${ Object.keys( POINT_OBJ_P2 )[0] }Y_Position_Arena.split(',')` )[clipLen] );
//         finalValuesArray[1].push( eval( `data.${ Object.keys( POINT_OBJ_P2 )[2] }Y_Position_Arena.split(',')` )[clipLen] );
//     }
//     else if ( ( Object.values( POINT_OBJ_P2 )[0][clipLen] != 0 ) && ( Object.values( POINT_OBJ_P2 )[1][clipLen] == 0 ) && ( Object.values( POINT_OBJ_P2 )[2][clipLen] == 0 ) )
//     {
//         // console.log("P2: 2-Character Bug Logic: A != 0 && B == 0 && C == 0    P2: BC");
//         finalValuesArray[0].push( eval( `data.${ Object.keys( POINT_OBJ_P2 )[1] }Y_Position_Arena.split(',')` )[clipLen] );
//         finalValuesArray[1].push( eval( `data.${ Object.keys( POINT_OBJ_P2 )[2] }Y_Position_Arena.split(',')` )[clipLen] );
//     }
//     //1-Character Logic
//     else if ( ( Object.values( POINT_OBJ_P2 )[0][clipLen] == 0 ) && ( Object.values( POINT_OBJ_P2 )[1][clipLen] != 0 ) && ( Object.values( POINT_OBJ_P2 )[2][clipLen] != 0 ) )
//     {
//         // console.log("P2: 1-Character Logic: A == 0 && B != 0 && C != 0        P2: A");
//         finalValuesArray[0].push( eval( `data.${ Object.keys( POINT_OBJ_P2 )[0] }Y_Position_Arena.split(',')` )[clipLen] );
//     }
//     else if ( ( Object.values( POINT_OBJ_P2 )[0][clipLen] != 0 ) && ( Object.values( POINT_OBJ_P2 )[1][clipLen] == 0 ) && ( Object.values( POINT_OBJ_P2 )[2][clipLen] != 0 ) )
//     {
//         // console.log("P2: 1-Character Logic: A != 0 && B == 0 && C != 0        P2: B");
//         finalValuesArray[0].push( eval( `data.${ Object.keys( POINT_OBJ_P2 )[1] }Y_Position_Arena.split(',')` )[clipLen] );
//     }
//     else if ( ( Object.values( POINT_OBJ_P2 )[0][clipLen] != 0 ) && ( Object.values( POINT_OBJ_P2 )[1][clipLen] != 0 ) && ( Object.values( POINT_OBJ_P2 )[2][clipLen] == 0 ) )
//     {
//         // console.log("P2: 1-Character Logic: A != 0 && B != 0 && C == 0        P2: C");
//         finalValuesArray[0].push( eval( `data.${ Object.keys( POINT_OBJ_P2 )[2] }Y_Position_Arena.split(',')` )[clipLen] );
//     }
// }
// console.log( ...finalValuesArray[0] )
// console.log(pointArray.length);
// for (let k = 0; k < pointArray.length; k++)
// {
//     fs.appendFileSync('Y_Position_Arena.js', `result[${k}] = [${pointArray[ k ].toString()}];\n`, { encoding: 'utf8' }, (err => { }));
// }
// console.log(data.P1_A_Health_Big.split(","));

// 1-Point
// A == 0 && B != 0 && C != 0 //A is the point
// A != 0 && B == 0 && C != 0 //B is the point
// A != 0 && B != 0 && C == 0 //C is the point
// 2-Character Bug Logic
// A == 0 && B == 0 && C != 0 //A and B are the points
// A == 0 && B != 0 && C == 0 //A and C are the points
// A != 0 && B == 0 && C == 0 //B and C are the points
// 3-Character Bug Logic
// A == 0 && B == 0 && C == 0 //A, B, and C are the points