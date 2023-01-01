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

public class FileF
{
	public static boolean readFile( String pFilePath, ArrayList<String> pRet )
	{
		boolean bRet = readFile( pFilePath, pRet, "Shift-JIS" );
		return bRet;
	}
	public static boolean readFile( String pFilePath, ArrayList<String> pRet , String pCodePage )
	{
		BufferedReader br = null;
		try
		{
			File file = new File( pFilePath );
			if( !file.exists() )
			{
				return false;
			}
			br = new BufferedReader( new InputStreamReader( new FileInputStream( file ), pCodePage ) );

			String line;
			while( ( line = br.readLine() ) != null )
			{
				pRet.add( line );
			}
			br.close();
		}
		catch( Exception e )
		{
			e.printStackTrace();
			return false;
		}

		return true;
	}

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
