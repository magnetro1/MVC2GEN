package analyze;

public class ComparatorB implements java.util.Comparator<String>
{
	@Override
	public int compare( String s, String t )
	{
		String[] a = s.split(",");
		String[] b = t.split(",");
		int cmp1 = Integer.parseInt( a[0] );
		int cmp2 = Integer.parseInt( b[0] );
		if( cmp1 < cmp2 )
		{
			return -1;
		}
		else if( cmp1 > cmp2 )
		{
			return 1;
		}
		return 0;
	}
}


