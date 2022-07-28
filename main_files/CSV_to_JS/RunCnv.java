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

		String fileName = args[0];
//		String fileName = "Combo_Anakaris_Magneto77_F.csv";
//		String fileName = "Situation_Gambit-Psylocke_Dan_Original.csv";
//		String fileName = "Combo_Ryu30_Original.csv";
//		String fileName = "Combo_Storm70_Original.csv";
//		String fileName = "Combo_Magneto32_Original.csv";
				
		
		ArrayList<String> data =  new ArrayList<String>(); 
		ArrayList<String> cnvTable =  new ArrayList<String>(); 
		if( !FileF.readFile( fileName, data ) )
		{
			System.out.println("Error readFile:" + fileName);
			return ;
		}
		
		if( !FileF.readFile( "input converter.csv", cnvTable ) )
		{
			System.out.println("Error readFile:" + "input converter.csv");
			return ;
		}
		
		String head = data.get(0);
		head = head + ",P1_Input_T3,P2_Input_T3";
		data.remove(0);
		// 空行削除？
		for(int i = 0; i < data.size(); i++ )
		{
			if( data.get(i).substring( 1, 2 ).equals(",") )
			{
				data.remove(i);
				i--;
				continue;
			}
		}

//		for( int i = 0; i < data.size() - 1; i++ )
//		{
//			int a = Integer.parseInt( data.get(i).split(",")[0] );
//			for( int k = i + 1; k < data.size(); k++ )
//			{
//				int b = Integer.parseInt( data.get(k).split(",")[0] );
//				if( a == b )
//				{
//					data.remove(k);
//					k--;
//					continue;
//				}
//			}
//		}

//		for( int i = 0; i < data.size() - 1; i++ )
//		{
//			String a = data.get(i).split(",")[0];
//			for( int k = i + 1; k < data.size(); k++ )
//			{
//				String  b = data.get(k).split(",")[0];
//				if( a.equals(b) )
//				{
//					data.remove(k);
//					k--;
//					continue;
//				}
//			}
//		}


//		for( int i = 0; i < data.size() - 1; i++ )
//		{
//			String g = data.get(i).replace( "0000000000000000","0");
//			data.set( i, g );
//		}

		
		// search index
		String[] s = head.split(",");
		int p1 = 0;
		int p2 = 0;
		for( int i = 0; i < s.length; i++ )
		{
			if( s[i].equals("P1_Input_DEC") )
			{
				p1 = i;
			}
			else if( s[i].equals("P2_Input_DEC") )
			{
				p2 = i;
			}
		}		
		
		// sort by total frame
		Collections.sort( data, new ComparatorB() );

		//　重複削除してデータ空白行などの補完
//		int nowFrame = Integer.parseInt( data.get(0).split(",")[0] );
//		int nowFrameIndex = 0;
//		for( int i = 1; i < data.size(); i++ )
//		{
//			int b = Integer.parseInt( data.get(i).split(",")[0] );
//			if( b == nowFrame )
//			{
//				if( !data.get(i).equals( data.get(nowFrameIndex) ) )
//				{
//					if( !data.get(i).split(",")[p1].equals( "0" ) || !data.get(i).split(",")[p2].equals( "0" ))
//					{
//						data.set(nowFrameIndex,data.get(i));
//					}
//				}
//				data.remove(i);
//				i--;
//				continue;
//			}
//			nowFrame = Integer.parseInt( data.get(i).split(",")[0] );
//			nowFrameIndex = i;
//		}
	

		int nowFrame = Integer.parseInt( data.get(0).split(",")[0] );
		int nowFrameIndex = 0;
		ArrayList<String> tmp =  new ArrayList<String>(); 
		for( int i = 1; i < data.size(); i++ )
		{
			int b = Integer.parseInt( data.get(i).split(",")[0] );
			if( b == nowFrame )
			{
				tmp.add( data.get(i) );
				data.remove(i);
				i--;
				continue;
			}
			String ret = getDuplicateData( tmp );
			data.set(nowFrameIndex,ret);
			tmp.clear();
			tmp.add( data.get(i) );
			nowFrame = Integer.parseInt( data.get(i).split(",")[0] );
			nowFrameIndex = i;

		}

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

	private static String getDuplicateData( ArrayList<String> tmp )
	{
		String ret = getDuplicateData2(tmp);
		if( ret == "" )
		{
			return "";
		}
		return ret;
	}
	private static String getDuplicateData2( ArrayList<String> tmp )
	{
		String ret = "";
		for( int i = 0; i < tmp.size(); i++ )
		{
			ret = tmp.get(i);
			for( int j = i + 1; j < tmp.size(); j++ )
			{
				if( ret.equals( tmp.get(j) ) )
				{
					return ret;
				}
			}
		}
		return ret;
	}
}
