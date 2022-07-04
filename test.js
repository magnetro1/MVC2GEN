import * as fs from 'fs';
import * as path from 'path';
import * as data from './main_files/SpiralUnblockable_node.js'; // TODO figure out how to make this dynamic
// import * as data from "./main_files/Shuma47_node.js";
const clipLength = data.A_2D_Game_Timer.split(',').length; // Used as clip-length frame tracker; address doesn't matter
// Objects with the player slots as keys, and their values (0/1/2) as object-values. Ex: 'P1_A_ : 0'
const POINT_OBJ_P1 =
{
    P1_A_: data.P1_A_Is_Point.split(","),
    P1_B_: data.P1_B_Is_Point.split(","),
    P1_C_: data.P1_C_Is_Point.split(","),
};
const POINT_OBJ_P2 =
{
    P2_A_: data.P2_A_Is_Point.split(","),
    P2_B_: data.P2_B_Is_Point.split(","),
    P2_C_: data.P2_C_Is_Point.split(","),
};

var pointArray = [];


for (let clipLen = 0; clipLen < clipLength; clipLen++) // length of clip
{
    // 1-Point 
    // A == 0 && B != 0 && C != 0
    // A != 0 && B == 0 && C != 0
    // A != 0 && B != 0 && C == 0
    // 2-Character Bug Logic
    // A == 0 && B == 0 && C != 0
    // A == 0 && B != 0 && C == 0
    // A != 0 && B == 0 && C == 0
    // 3-Character Bug Logic
    // A == 0 && B == 0 && C == 0

    //P1

    //3-Character Bug Logic
    if ((Object.values(POINT_OBJ_P1)[ 0 ][ clipLen ] == 0) && (Object.values(POINT_OBJ_P1)[ 1 ][ clipLen ] == 0) && (Object.values(POINT_OBJ_P1)[ 2 ][ clipLen ] == 0))
    {
        // console.log("P1: 3-Character Bug Logic: A == 0 && B == 0 && C == 0    P1: ABC");
    }
    //2-Character Bug Logic
    else if ((Object.values(POINT_OBJ_P1)[ 0 ][ clipLen ] == 0) && (Object.values(POINT_OBJ_P1)[ 1 ][ clipLen ] == 0) && (Object.values(POINT_OBJ_P1)[ 2 ][ clipLen ] != 0))
    {
        // console.log("P1: 2-Character Bug Logic: A == 0 && B == 0 && C != 0    P1: AB");
    }
    else if ((Object.values(POINT_OBJ_P1)[ 0 ][ clipLen ] == 0) && (Object.values(POINT_OBJ_P1)[ 1 ][ clipLen ] != 0) && (Object.values(POINT_OBJ_P1)[ 2 ][ clipLen ] == 0))
    {
        // console.log("P1: 2-Character Bug Logic: A == 0 && B != 0 && C == 0    P1: AC");
    }
    else if ((Object.values(POINT_OBJ_P1)[ 0 ][ clipLen ] != 0) && (Object.values(POINT_OBJ_P1)[ 1 ][ clipLen ] == 0) && (Object.values(POINT_OBJ_P1)[ 2 ][ clipLen ] == 0))
    {
        // console.log("P1: 2-Character Bug Logic: A != 0 && B == 0 && C == 0    P1: BC");
    }
    //1-Character Logic
    else if ((Object.values(POINT_OBJ_P1)[ 0 ][ clipLen ] == 0) && (Object.values(POINT_OBJ_P1)[ 1 ][ clipLen ] != 0) && (Object.values(POINT_OBJ_P1)[ 2 ][ clipLen ] != 0))
    {
        // console.log("P1: 1-Character Logic: A == 0 && B != 0 && C != 0        P1: A");
    }
    else if ((Object.values(POINT_OBJ_P1)[ 0 ][ clipLen ] != 0) && (Object.values(POINT_OBJ_P1)[ 1 ][ clipLen ] == 0) && (Object.values(POINT_OBJ_P1)[ 2 ][ clipLen ] != 0))
    {
        // console.log("P1: 1-Character Logic: A != 0 && B == 0 && C != 0        P1: B");
    }
    else if ((Object.values(POINT_OBJ_P1)[ 0 ][ clipLen ] != 0) && (Object.values(POINT_OBJ_P1)[ 1 ][ clipLen ] != 0) && (Object.values(POINT_OBJ_P1)[ 2 ][ clipLen ] == 0))
    {
        // console.log("P1: 1-Character Logic: A != 0 && B != 0 && C == 0        P1: C");
    }

    // P2

    //3-Character Bug Logic
    if ((Object.values(POINT_OBJ_P2)[ 0 ][ clipLen ] == 0) && (Object.values(POINT_OBJ_P2)[ 1 ][ clipLen ] == 0) && (Object.values(POINT_OBJ_P2)[ 2 ][ clipLen ] == 0))
    {
        // console.log("P2: 3-Character Bug Logic: A == 0 && B == 0 && C == 0    P2: ABC");
    }
    //2-Character Bug Logic
    else if ((Object.values(POINT_OBJ_P2)[ 0 ][ clipLen ] == 0) && (Object.values(POINT_OBJ_P2)[ 1 ][ clipLen ] == 0) && (Object.values(POINT_OBJ_P2)[ 2 ][ clipLen ] != 0))
    {
        // console.log("P2: 2-Character Bug Logic: A == 0 && B == 0 && C != 0    P2: AB");
    }
    else if ((Object.values(POINT_OBJ_P2)[ 0 ][ clipLen ] == 0) && (Object.values(POINT_OBJ_P2)[ 1 ][ clipLen ] != 0) && (Object.values(POINT_OBJ_P2)[ 2 ][ clipLen ] == 0))
    {
        // console.log("P2: 2-Character Bug Logic: A == 0 && B != 0 && C == 0    P2: AC");
    }
    else if ((Object.values(POINT_OBJ_P2)[ 0 ][ clipLen ] != 0) && (Object.values(POINT_OBJ_P2)[ 1 ][ clipLen ] == 0) && (Object.values(POINT_OBJ_P2)[ 2 ][ clipLen ] == 0))
    {
        // console.log("P2: 2-Character Bug Logic: A != 0 && B == 0 && C == 0    P2: BC");
    }
    //1-Character Logic
    else if ((Object.values(POINT_OBJ_P2)[ 0 ][ clipLen ] == 0) && (Object.values(POINT_OBJ_P2)[ 1 ][ clipLen ] != 0) && (Object.values(POINT_OBJ_P2)[ 2 ][ clipLen ] != 0))
    {
        // console.log("P2: 1-Character Logic: A == 0 && B != 0 && C != 0        P2: A");
    }
    else if ((Object.values(POINT_OBJ_P2)[ 0 ][ clipLen ] != 0) && (Object.values(POINT_OBJ_P2)[ 1 ][ clipLen ] == 0) && (Object.values(POINT_OBJ_P2)[ 2 ][ clipLen ] != 0))
    {
        // console.log("P2: 1-Character Logic: A != 0 && B == 0 && C != 0        P2: B");
    }
    else if ((Object.values(POINT_OBJ_P2)[ 0 ][ clipLen ] != 0) && (Object.values(POINT_OBJ_P2)[ 1 ][ clipLen ] != 0) && (Object.values(POINT_OBJ_P2)[ 2 ][ clipLen ] == 0))
    {
        // console.log("P2: 1-Character Logic: A != 0 && B != 0 && C == 0        P2: C");
    }

}

console.log(...pointArray)