package run;

import java.util.ArrayList;
import java.util.Collections;

import analyze.ComparatorB;
import cmn.FileF;


public class RunCnv 
{
	public RunCnv()
	{
	}
	public static void main( String[] args )
	{
		System.out.println("Program Start");
//		for( int i = 0; i < args.length; i++ )
//		{
//			System.out.println(args[i]);
//		}

		String fileName = args[0]; // ano - okay so i can see that the filename came in as a command line argument
//		String fileName = "Combo_Anakaris_Magneto77_F.csv";
//		String fileName = "Situation_Gambit-Psylocke_Dan_Original.csv";
//		String fileName = "Combo_Ryu30_Original.csv";
//		String fileName = "Combo_Storm70_Original.csv";
//		String fileName = "Combo_Magneto32_Original.csv";
    // ano - based on the previous lines i can guess the expecetd input is a csv file
		// ano - and i roughly know what those look like
		
		ArrayList<String> data =  new ArrayList<String>(); // ano - data isnt a very clear variable name, so i have to guess what this means
		ArrayList<String> cnvTable =  new ArrayList<String>(); // cnv might mean "convert" if i have to guess
		if( !FileF.readFile( fileName, data ) ) // okay so, this is in that FileF class, which i think as in the other file, so i will go down there
		{ // im looking at line 266 for a sec now
			System.out.println("Error readFile:" + fileName);
			return ;
		} // okay we are back, we see that data is now = to the contents of args[0], or the first commandline argument
		// ok so we have the same process to fill in cnvTable
		if( !FileF.readFile( "input converter.csv", cnvTable ) )
		{
			System.out.println("Error readFile:" + "input converter.csv");
			return ;
		}
		// okay so, data.get(0) is the same as data[0], it will be the first line
		String head = data.get(0);
		head = head + ",P1_Input_T3,P2_Input_T3";
		data.remove(0); // okay so the first line is removed from data, and set aside in "head". "head" implies header. i'm familiar with csv files so this makes sense
		// 空行削除？
		for(int i = 0; i < data.size(); i++ ) // for each line in the file
		{
			if( data.get(i).substring( 1, 2 ).equals(",") ) // check if the 2nd char in the line is ","
			{ // probably implying that this is a line to be ignored i guess, because the first and 2nd values were empty?
				data.remove(i); // therefore remove it
				i--; // we need to adjust our position in the array, because removing that element is going to move everything after it down
				continue; // im not sure why this is here, it does nothing here. "continue" makes the array go to the next cycle and skips anything after it, so here it just does nothing because theres nothing after it
			}
		}
		
		// search index
		String[] s = head.split(","); // so, turns head into an array of strings called s.... i am very not sure why he didnt just append the strings to an array earlier instead of the thing on line 47
		int p1 = 0; // okay, so, uh, p1 and p2 are not very clear variable names so im gonna search the file for p1/p2 and see where all they are used without looking too close
		int p2 = 0;
		for( int i = 0; i < s.length; i++ ) // for every single comma separated element of the header line
		{
			if( s[i].equals("P1_Input_DEC") )
			{
				p1 = i; // p1 = the index of "P1_Input_DEC"
			}
			else if( s[i].equals("P2_Input_DEC") )
			{
				p2 = i; // p2 = the index of "P2_Input_DEC"
			}
		}		// okay so this loop is what is called a "linear search", as in, you search over an array in a "line", 1-by-1
    // okay so p1 / p2 arent used past this loop. i will point out that this is why shorter functions are easier to understand usually
		// actually theres a huge problem here, since p1/p2 arent used elsewhere, this previous loop basically did nothing
		// sort by total frame
		Collections.sort( data, new ComparatorB() ); // im going to go look down at ComparatorB on line 232
		int nowFrame = Integer.parseInt( data.get(0).split(",")[0] );// get the first column's cell in row 0, and turn it into an int called nowFrame
		int nowFrameIndex = 0; // i notice nowframe and nowframeindex wont be used after this loop
		ArrayList<String> tmp =  new ArrayList<String>(); // and neither will tmp, so my *assumption* at this point is that this loop will probably be about changing "data" or "cnvTable" somehow
		for( int i = 1; i < data.size(); i++ ) // this loop is starting at 1st row, i'm assuming because we already grabbed the 0th row for "nowFrame"
		{
			int b = Integer.parseInt( data.get(i).split(",")[0] ); // grab the i-th row's first column value
			if( b == nowFrame ) // if we run into a duplicate in column 0 compared to the previous
			{
				tmp.add( data.get(i) ); // append the duplicate to tmp
				data.remove(i); // and remove it from data
				i--;
				continue; // and if we did that, ignore the rest of the loop
			} // in practice, the "continue" was the same as putting an "else" here, in this particular case
			String ret = getDuplicateData( tmp ); // ok now i will look for what "getDuplicateData" is on line 200
			data.set(nowFrameIndex,ret); // so, let's set the row #nowFrameIndex = to one that's a duplicate
			tmp.clear(); // empty out tmp
			tmp.add( data.get(i) ); // add row #i to tmp without removing it from the data
			nowFrame = Integer.parseInt( data.get(i).split(",")[0] ); // set the nowframe to be the total frames from the i-th row
			nowFrameIndex = i; // and the index to i of course

		} // okay so what did that complicated ass loop do? i'm going to try to reword it down below at the end of the file at line 333 because there isnt space up here

		for( int i = 0; i < data.size(); i++ )
		{
			String[] ss = data.get(i).split(",");
	
			String p1Str = "";
			String p2Str = "";
			for( int k = 0; k < cnvTable.size(); k++ )
			{
				String[] cnv = cnvTable.get(k).split(",");
				if( ss[p1].equals( cnv[0] ) )
				{
					p1Str = cnv[1];
				}
				if( ss[p2].equals( cnv[0] ) )
				{
					p2Str = cnv[1];
				}
				if( !p1Str.equals("") && !p2Str.equals("") )
				{
					break;
				}
			}
			String newStr = data.get(i) + "," + p1Str + "," + p2Str;
			data.set( i, newStr );
		}
		data.add( 0, head );
		
		data.remove( data.size() - 1 );
		
//		String fileNameOut = fileName.replace( ".csv", "_F.csv" );
		String fileNameOut = fileName.replace( "_Original.csv", "_F.csv" );
		FileF.writeFile( fileNameOut, data, false );
		System.out.println("Program End");
		System.exit(0);
	}

	private static String getDuplicateData( ArrayList<String> tmp ) // came here from line 155
	{
		String ret = getDuplicateData2(tmp); // line 209
		if( ret == "" )
		{
			return "";
		}
		return ret;
	}
	private static String getDuplicateData2( ArrayList<String> tmp ) // came from line 202
	{
		String ret = "";
		for( int i = 0; i < tmp.size(); i++ ) // this loop compares the equality of every single pair of rows in 'tmp' up until it finds a pair that's equal and then returns the first one of the pair
		{
			ret = tmp.get(i);
			for( int j = i + 1; j < tmp.size(); j++ )
			{
				if( ret.equals( tmp.get(j) ) ) // if tmp.get(i) == tmp.get(j) then return tmp.get(i)
				{
					return ret;
				}
			}
		}
		return ret;
	}
}


// ComparatorB.java:

package analyze;
// came here from line 116
public class ComparatorB implements java.util.Comparator<String>
{ // ok so i guess i should explain Collections.Sort(). sorting is the process of putting things in an order, like say, alphabetical order, or 1 2 3 4, or whatever
	@Override // collections.sort takes something that "implements java.util.Comparator<String>" in order to determine the order
	public int compare( String s, String t ) // so it needs a Compare() function that takes two strings
	{
		String[] a = s.split(","); // so again, we split up the two input strings into a list of strings based on comma separation
		String[] b = t.split(",");
		int cmp1 = Integer.parseInt( a[0] ); // and then compare the first columns in both rows
		int cmp2 = Integer.parseInt( b[0] );
		if( cmp1 < cmp2 )
		{
			return -1; // so if the first column in 's' is less than the first column in 't', row 's' should be earlier in the resulting sorted array
		} // collections.sort runs the compare function on each pair of 2 elements in the array, and to know their order, it expects a positive number, a negative number, or 0 if they are equal
		else if( cmp1 > cmp2 ) // positive number means the 2nd one ('t') comes first, and negative means the 1st one ('s') comes first
		{
			return 1; 
		}
		return 0; // and with 0 they should just be beside each other and the order doesnt matter
	} // so lets go back to up where the sort is
}

// FileF.java:

package cmn;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;
import java.util.ArrayList;

public class FileF // here
{ 
	public static boolean readFile( String pFilePath, ArrayList<String> pRet )
	{ // okay so this is the one that's called from main. i can gather that "pRet" is actually where the input file will be loaded into memory
		boolean bRet = readFile( pFilePath, pRet, "Shift-JIS" ); // Shift-JS is like unicode or ascii, it's the text encoding, just it's used on a lot of old japanese websites
		return bRet; // im guessing based on the context in the main function that bRet is like success/failure
	}
	public static boolean readFile( String pFilePath, ArrayList<String> pRet , String pCodePage )
	{ // so the function above called this, and it's going to read in the file with a BufferedReader. im not directly familiar with BufferedReader, but I assume it's a builtin java class, and i've used things like this before in other languages
		BufferedReader br = null; // im not sure why it is initialized to null here, instead of just, down on line 283
		try // this is a try {} catch {} block, it's a Java feature to catch ex -- ah ok
		{
			File file = new File( pFilePath ); // probably builtin Java functionality, i feel like this and the !file.exists() are explanatory
			if( !file.exists() )
			{
				return false;
			}// i'm not sure of the exact behavior of this, so i will go look it up real quick
			br = new BufferedReader( new InputStreamReader( new FileInputStream( file ), pCodePage ) );
      // https://docs.oracle.com/javase/7/docs/api/java/io/FileInputStream.html i briefly read like a tiny bit of that
      // https://docs.oracle.com/javase/7/docs/api/java/io/InputStreamReader.html and this
      // https://docs.oracle.com/javase/8/docs/api/java/io/BufferedReader.html also this
      // i found them by googling "java fileinputstream" and so on. i will keep the tabs open because i may need to refer to them

			String line; // ok so this loop is self-explanatory if you have seen similar constructs in other languages
			while( ( line = br.readLine() ) != null ) // this sets "line" to the next line read from the file, until it fails to read a line
			{
				pRet.add( line ); // adds to the output ArrayList
			}
			br.close(); // closes the filehandle, letting other programs access it and etc
		}
		catch( Exception e )
		{
			e.printStackTrace(); // just some error handling, the stack trace is like a default error message internal to java that shows the exact line numbers of the code where things went wrong.
			return false; // stack traces are useful for writing code but you dont want users to see them because they are kind of confusing
		}

		return true; // success
	}
// ok we will come back to this one later probably?, lets go back up top
	public static boolean writeFile(	String pFilePath,
										ArrayList<String> pStr,
										boolean pAppend )
	{
		try
		{
			File file = new File( pFilePath );
			PrintWriter pw = new PrintWriter( new BufferedWriter( new OutputStreamWriter( new FileOutputStream( file, pAppend ), "Shift-JIS" ) ) );
			for( int i = 0; i < pStr.size(); i++ )
			{
				pw.println( pStr.get(i) );
			}
			pw.close();
		}
		catch( Exception e )
		{
			e.printStackTrace();
			return false;
		}
		return true;
	}



	
}

//////////////////////////////////
// ano - notes for stuff

// from line 141
		int nowFrame = Integer.parseInt( data.get(0).split(",")[0] );
		int nowFrameIndex = 0; // i notice nowframe and nowframeindex wont be used after this loop
		ArrayList<String> tmp =  new ArrayList<String>();
		for( int i = 1; i < data.size(); i++ ) // this loop is starting at 1st row, i'm assuming because we already grabbed the 0th row for "nowFrame"
		{
			int b = Integer.parseInt( data.get(i).split(",")[0] ); // grab the i-th row's first column value
			if( b == nowFrame ) // if we run into a duplicate in column 0 compared to the previous
			{
				tmp.add( data.get(i) ); // append the duplicate to tmp
				data.remove(i); // and remove it from data
				i--;
			} else {
				String ret = getDuplicateData( tmp );
				data.set(nowFrameIndex,ret); // so, let's set the row #nowFrameIndex = to one that's a duplicate
				tmp.clear(); // empty out tmp
				tmp.add( data.get(i) ); // add row #i to tmp without removing it from the data
				nowFrame = Integer.parseInt( data.get(i).split(",")[0] ); // set the nowframe to be the total frames from the i-th row
				nowFrameIndex = i; // and the index to i of course
    	}
		}

// so the loop gobbles up sequential rows that have the same TotalFrames as it runs into them and puts them into "tmp"
//