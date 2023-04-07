; MvC2_DM00_POL.asm
BEG:
    #data ModelTable 0x00000082 TextureTable TextureEnd
ModelTable:
    #data Model_000 Model_001 Model_002 Model_003 
    #data Model_004 Model_005 Model_006 Model_007 
    #data Model_008 Model_009 Model_010 Model_011 
    #data Model_012 Model_013 Model_014 Model_015 
    #data Model_016 Model_017 Model_018 Model_019 
    #data Model_020 Model_021 Model_022 Model_023 
    #data Model_024 Model_025 Model_026 Model_027 
    #data Model_028 Model_029 Model_030 Model_031 
    #data Model_032 Model_033 Model_034 Model_035 
    #data Model_036 Model_037 Model_038 Model_039 
    #data Model_040 Model_041 Model_042 Model_043 
    #data Model_044 Model_045 Model_046 Model_047 
    #data Model_048 Model_049 Model_050 Model_051 
    #data Model_052 Model_053 Model_054 Model_055 
    #data Model_056 Model_057 Model_058 Model_059 
    #data Model_060 Model_061 Model_062 Model_063 
    #data Model_064 Model_065 Model_066 Model_067 
    #data Model_068 Model_069 Model_070 Model_071 
    #data Model_072 Model_073 Model_074 Model_075 
    #data Model_076 Model_077 Model_078 Model_079 
    #data Model_080 Model_081 Model_082 Model_083 
    #data Model_084 Model_085 Model_086 Model_087 
    #data Model_088 Model_089 Model_090 Model_091 
    #data Model_092 Model_093 Model_094 Model_095 
    #data Model_096 Model_097 Model_098 Model_099 
    #data Model_100 Model_101 Model_102 Model_103 
    #data Model_104 Model_105 Model_106 Model_107 
    #data Model_108 Model_109 Model_110 Model_111 
    #data Model_112 Model_113 Model_114 Model_115 
    #data Model_116 Model_117 Model_118 Model_119 
    #data Model_120 Model_121 Model_122 Model_123 
    #data Model_124 Model_125 Model_126 Model_127 
    #data Model_128 Model_129 
    #data 0x00000000 ; EndModelTable
    #align16

TextureTable:
    #data 0x0080 0x0080 0x01 0x01 0x0000 0x0CC00000 0x00000000 ; 0x00, Ends @ 0x0CC08000
    #data 0x0080 0x0080 0x02 0x01 0x0000 0x0CC08000 0x00000000 ; 0x01, Ends @ 0x0CC10000
    #data 0x0040 0x0040 0x01 0x01 0x0000 0x0CC10000 0x00000000 ; 0x02, Ends @ 0x0CC12000
    #data 0x0040 0x0040 0x01 0x01 0x0000 0x0CC12000 0x00000000 ; 0x03, Ends @ 0x0CC14000
    #data 0x0040 0x0040 0x01 0x01 0x0000 0x0CC14000 0x00000000 ; 0x04, Ends @ 0x0CC16000
    #data 0x0040 0x0040 0x01 0x01 0x0000 0x0CC16000 0x00000000 ; 0x05, Ends @ 0x0CC18000
    #data 0x0040 0x0040 0x01 0x01 0x0000 0x0CC18000 0x00000000 ; 0x06, Ends @ 0x0CC1A000
    #data 0x0040 0x0040 0x02 0x01 0x0000 0x0CC1A000 0x00000000 ; 0x07, Ends @ 0x0CC1C000
    #data 0x0040 0x0040 0x02 0x01 0x0000 0x0CC1C000 0x00000000 ; 0x08, Ends @ 0x0CC1E000
    #data 0x0100 0x0100 0x01 0x03 0x0000 0x0CC1E000 0x00000000 ; 0x09, Ends @ 0x0CC3E000
    #data 0x0020 0x0020 0x01 0x01 0x0000 0x0CC22800 0x00000000 ; 0x0A, Ends @ 0x0CC23000
    #data 0x0020 0x0020 0x01 0x01 0x0000 0x0CC23000 0x00000000 ; 0x0B, Ends @ 0x0CC23800
    #data 0x0020 0x0020 0x01 0x01 0x0000 0x0CC23800 0x00000000 ; 0x0C, Ends @ 0x0CC24000
    #data 0x0020 0x0020 0x01 0x01 0x0000 0x0CC24000 0x00000000 ; 0x0D, Ends @ 0x0CC24800
    #data 0x0020 0x0020 0x01 0x01 0x0000 0x0CC24800 0x00000000 ; 0x0E, Ends @ 0x0CC25000
    #data 0x0020 0x0020 0x01 0x01 0x0000 0x0CC25000 0x00000000 ; 0x0F, Ends @ 0x0CC25800
    #data 0x0020 0x0020 0x01 0x01 0x0000 0x0CC25800 0x00000000 ; 0x10, Ends @ 0x0CC26000
    #data 0x0020 0x0020 0x01 0x01 0x0000 0x0CC26000 0x00000000 ; 0x11, Ends @ 0x0CC26800
    #data 0x0020 0x0020 0x01 0x01 0x0000 0x0CC26800 0x00000000 ; 0x12, Ends @ 0x0CC27000
    #data 0x0020 0x0020 0x01 0x01 0x0000 0x0CC27000 0x00000000 ; 0x13, Ends @ 0x0CC27800
    #data 0x0020 0x0020 0x01 0x01 0x0000 0x0CC27800 0x00000000 ; 0x14, Ends @ 0x0CC28000
    #data 0x0020 0x0020 0x01 0x01 0x0000 0x0CC28000 0x00000000 ; 0x15, Ends @ 0x0CC28800
    #data 0x0080 0x0080 0x01 0x03 0x0000 0x0CC28800 0x00000000 ; 0x16, Ends @ 0x0CC30800
    #data 0x0080 0x0080 0x01 0x03 0x0000 0x0CC2A000 0x00000000 ; 0x17, Ends @ 0x0CC32000
    #data 0x0080 0x0080 0x01 0x03 0x0000 0x0CC2B800 0x00000000 ; 0x18, Ends @ 0x0CC33800
    #data 0x0000 0x0000 0x00 0x00 0x0000 0x00000000 0x00000000 ; END

TextureEnd:
Model_000:
    #import_raw_data "soloModelBins/MvC2_DM00_Model_000.bin"
Model_001:
    #import_raw_data "soloModelBins/MvC2_DM00_Model_001.bin"
Model_002:
    #import_raw_data "soloModelBins/MvC2_DM00_Model_002.bin"
Model_003:
    #import_raw_data "soloModelBins/MvC2_DM00_Model_003.bin"
Model_004:
    #import_raw_data "soloModelBins/MvC2_DM00_Model_004.bin"
Model_005:
    #import_raw_data "soloModelBins/MvC2_DM00_Model_005.bin"
Model_006:
    #import_raw_data "soloModelBins/MvC2_DM00_Model_006.bin"
Model_007:
    #import_raw_data "soloModelBins/MvC2_DM00_Model_007.bin"
Model_008:
    #import_raw_data "soloModelBins/MvC2_DM00_Model_008.bin"
Model_009:
    #import_raw_data "soloModelBins/MvC2_DM00_Model_009.bin"
Model_010:
    #import_raw_data "soloModelBins/MvC2_DM00_Model_010.bin"
Model_011:
    #import_raw_data "soloModelBins/MvC2_DM00_Model_011.bin"
Model_012:
    #import_raw_data "soloModelBins/MvC2_DM00_Model_012.bin"
Model_013:
    #import_raw_data "soloModelBins/MvC2_DM00_Model_013.bin"
Model_014:
    #import_raw_data "soloModelBins/MvC2_DM00_Model_014.bin"
Model_015:
    #import_raw_data "soloModelBins/MvC2_DM00_Model_015.bin"
Model_016:
    #import_raw_data "soloModelBins/MvC2_DM00_Model_016.bin"
Model_017:
    #import_raw_data "soloModelBins/MvC2_DM00_Model_017.bin"
Model_018:
    #import_raw_data "soloModelBins/MvC2_DM00_Model_018.bin"
Model_019:
    #import_raw_data "soloModelBins/MvC2_DM00_Model_019.bin"
Model_020:
    #import_raw_data "soloModelBins/MvC2_DM00_Model_020.bin"
Model_021:
    #import_raw_data "soloModelBins/MvC2_DM00_Model_021.bin"
Model_022:
    #import_raw_data "soloModelBins/MvC2_DM00_Model_022.bin"
Model_023:
    #import_raw_data "soloModelBins/MvC2_DM00_Model_023.bin"
Model_024:
    #import_raw_data "soloModelBins/MvC2_DM00_Model_024.bin"
Model_025:
    #import_raw_data "soloModelBins/MvC2_DM00_Model_025.bin"
Model_026:
    #import_raw_data "soloModelBins/MvC2_DM00_Model_026.bin"
Model_027:
    #import_raw_data "soloModelBins/MvC2_DM00_Model_027.bin"
Model_028:
    #import_raw_data "soloModelBins/MvC2_DM00_Model_028.bin"
Model_029:
    #import_raw_data "soloModelBins/MvC2_DM00_Model_029.bin"
Model_030:
    #import_raw_data "soloModelBins/MvC2_DM00_Model_030.bin"
Model_031:
    #import_raw_data "soloModelBins/MvC2_DM00_Model_031.bin"
Model_032:
    #import_raw_data "soloModelBins/MvC2_DM00_Model_032.bin"
Model_033:
    #import_raw_data "soloModelBins/MvC2_DM00_Model_033.bin"
Model_034:
    #import_raw_data "soloModelBins/MvC2_DM00_Model_034.bin"
Model_035:
    #import_raw_data "soloModelBins/MvC2_DM00_Model_035.bin"
Model_036:
    #import_raw_data "soloModelBins/MvC2_DM00_Model_036.bin"
Model_037:
    #import_raw_data "soloModelBins/MvC2_DM00_Model_037.bin"
Model_038:
    #import_raw_data "soloModelBins/MvC2_DM00_Model_038.bin"
Model_039:
    #import_raw_data "soloModelBins/MvC2_DM00_Model_039.bin"
Model_040:
    #import_raw_data "soloModelBins/MvC2_DM00_Model_040.bin"
Model_041:
    #import_raw_data "soloModelBins/MvC2_DM00_Model_041.bin"
Model_042:
    #import_raw_data "soloModelBins/MvC2_DM00_Model_042.bin"
Model_043:
    #import_raw_data "soloModelBins/MvC2_DM00_Model_043.bin"
Model_044:
    #import_raw_data "soloModelBins/MvC2_DM00_Model_044.bin"
Model_045:
    #import_raw_data "soloModelBins/MvC2_DM00_Model_045.bin"
Model_046:
    #import_raw_data "soloModelBins/MvC2_DM00_Model_046.bin"
Model_047:
    #import_raw_data "soloModelBins/MvC2_DM00_Model_047.bin"
Model_048:
    #import_raw_data "soloModelBins/MvC2_DM00_Model_048.bin"
Model_049:
    #import_raw_data "soloModelBins/MvC2_DM00_Model_049.bin"
Model_050:
    #import_raw_data "soloModelBins/MvC2_DM00_Model_050.bin"
Model_051:
    #import_raw_data "soloModelBins/MvC2_DM00_Model_051.bin"
Model_052:
    #import_raw_data "soloModelBins/MvC2_DM00_Model_052.bin"
Model_053:
    #import_raw_data "soloModelBins/MvC2_DM00_Model_053.bin"
Model_054:
    #import_raw_data "soloModelBins/MvC2_DM00_Model_054.bin"
Model_055:
    #import_raw_data "soloModelBins/MvC2_DM00_Model_055.bin"
Model_056:
    #import_raw_data "soloModelBins/MvC2_DM00_Model_056.bin"
Model_057:
    #import_raw_data "soloModelBins/MvC2_DM00_Model_057.bin"
Model_058:
    #import_raw_data "soloModelBins/MvC2_DM00_Model_058.bin"
Model_059:
    #import_raw_data "soloModelBins/MvC2_DM00_Model_059.bin"
Model_060:
    #import_raw_data "soloModelBins/MvC2_DM00_Model_060.bin"
Model_061:
    #import_raw_data "soloModelBins/MvC2_DM00_Model_061.bin"
Model_062:
    #import_raw_data "soloModelBins/MvC2_DM00_Model_062.bin"
Model_063:
    #import_raw_data "soloModelBins/MvC2_DM00_Model_063.bin"
Model_064:
    #import_raw_data "soloModelBins/MvC2_DM00_Model_064.bin"
Model_065:
    #import_raw_data "soloModelBins/MvC2_DM00_Model_065.bin"
Model_066:
    #import_raw_data "soloModelBins/MvC2_DM00_Model_066.bin"
Model_067:
    #import_raw_data "soloModelBins/MvC2_DM00_Model_067.bin"
Model_068:
    #import_raw_data "soloModelBins/MvC2_DM00_Model_068.bin"
Model_069:
    #import_raw_data "soloModelBins/MvC2_DM00_Model_069.bin"
Model_070:
    #import_raw_data "soloModelBins/MvC2_DM00_Model_070.bin"
Model_071:
    #import_raw_data "soloModelBins/MvC2_DM00_Model_071.bin"
Model_072:
    #import_raw_data "soloModelBins/MvC2_DM00_Model_072.bin"
Model_073:
    #import_raw_data "soloModelBins/MvC2_DM00_Model_073.bin"
Model_074:
    #import_raw_data "soloModelBins/MvC2_DM00_Model_074.bin"
Model_075:
    #import_raw_data "soloModelBins/MvC2_DM00_Model_075.bin"
Model_076:
    #import_raw_data "soloModelBins/MvC2_DM00_Model_076.bin"
Model_077:
    #import_raw_data "soloModelBins/MvC2_DM00_Model_077.bin"
Model_078:
    #import_raw_data "soloModelBins/MvC2_DM00_Model_078.bin"
Model_079:
    #import_raw_data "soloModelBins/MvC2_DM00_Model_079.bin"
Model_080:
    #import_raw_data "soloModelBins/MvC2_DM00_Model_080.bin"
Model_081:
    #import_raw_data "soloModelBins/MvC2_DM00_Model_081.bin"
Model_082:
    #import_raw_data "soloModelBins/MvC2_DM00_Model_082.bin"
Model_083:
    #import_raw_data "soloModelBins/MvC2_DM00_Model_083.bin"
Model_084:
    #import_raw_data "soloModelBins/MvC2_DM00_Model_084.bin"
Model_085:
    #import_raw_data "soloModelBins/MvC2_DM00_Model_085.bin"
Model_086:
    #import_raw_data "soloModelBins/MvC2_DM00_Model_086.bin"
Model_087:
    #import_raw_data "soloModelBins/MvC2_DM00_Model_087.bin"
Model_088:
    #import_raw_data "soloModelBins/MvC2_DM00_Model_088.bin"
Model_089:
    #import_raw_data "soloModelBins/MvC2_DM00_Model_089.bin"
Model_090:
    #import_raw_data "soloModelBins/MvC2_DM00_Model_090.bin"
Model_091:
    #import_raw_data "soloModelBins/MvC2_DM00_Model_091.bin"
Model_092:
    #import_raw_data "soloModelBins/MvC2_DM00_Model_092.bin"
Model_093:
    #import_raw_data "soloModelBins/MvC2_DM00_Model_093.bin"
Model_094:
    #import_raw_data "soloModelBins/MvC2_DM00_Model_094.bin"
Model_095:
    #import_raw_data "soloModelBins/MvC2_DM00_Model_095.bin"
Model_096:
    #import_raw_data "soloModelBins/MvC2_DM00_Model_096.bin"
Model_097:
    #import_raw_data "soloModelBins/MvC2_DM00_Model_097.bin"
Model_098:
    #import_raw_data "soloModelBins/MvC2_DM00_Model_098.bin"
Model_099:
    #import_raw_data "soloModelBins/MvC2_DM00_Model_099.bin"
Model_100:
    #import_raw_data "soloModelBins/MvC2_DM00_Model_100.bin"
Model_101:
    #import_raw_data "soloModelBins/MvC2_DM00_Model_101.bin"
Model_102:
    #import_raw_data "soloModelBins/MvC2_DM00_Model_102.bin"
Model_103:
    #import_raw_data "soloModelBins/MvC2_DM00_Model_103.bin"
Model_104:
    #import_raw_data "soloModelBins/MvC2_DM00_Model_104.bin"
Model_105:
    #import_raw_data "soloModelBins/MvC2_DM00_Model_105.bin"
Model_106:
    #import_raw_data "soloModelBins/MvC2_DM00_Model_106.bin"
Model_107:
    #import_raw_data "soloModelBins/MvC2_DM00_Model_107.bin"
Model_108:
    #import_raw_data "soloModelBins/MvC2_DM00_Model_108.bin"
Model_109:
    #import_raw_data "soloModelBins/MvC2_DM00_Model_109.bin"
Model_110:
    #import_raw_data "soloModelBins/MvC2_DM00_Model_110.bin"
Model_111:
    #import_raw_data "soloModelBins/MvC2_DM00_Model_111.bin"
Model_112:
    #import_raw_data "soloModelBins/MvC2_DM00_Model_112.bin"
Model_113:
    #import_raw_data "soloModelBins/MvC2_DM00_Model_113.bin"
Model_114:
    #import_raw_data "soloModelBins/MvC2_DM00_Model_114.bin"
Model_115:
    #import_raw_data "soloModelBins/MvC2_DM00_Model_115.bin"
Model_116:
    #import_raw_data "soloModelBins/MvC2_DM00_Model_116.bin"
Model_117:
    #import_raw_data "soloModelBins/MvC2_DM00_Model_117.bin"
Model_118:
    #import_raw_data "soloModelBins/MvC2_DM00_Model_118.bin"
Model_119:
    #import_raw_data "soloModelBins/MvC2_DM00_Model_119.bin"
Model_120:
    #import_raw_data "soloModelBins/MvC2_DM00_Model_120.bin"
Model_121:
    #import_raw_data "soloModelBins/MvC2_DM00_Model_121.bin"
Model_122:
    #import_raw_data "soloModelBins/MvC2_DM00_Model_122.bin"
Model_123:
    #import_raw_data "soloModelBins/MvC2_DM00_Model_123.bin"
Model_124:
    #import_raw_data "soloModelBins/MvC2_DM00_Model_124.bin"
Model_125:
    #import_raw_data "soloModelBins/MvC2_DM00_Model_125.bin"
Model_126:
    #import_raw_data "soloModelBins/MvC2_DM00_Model_126.bin"
Model_127:
    #import_raw_data "soloModelBins/MvC2_DM00_Model_127.bin"
Model_128:
    #import_raw_data "soloModelBins/MvC2_DM00_Model_128.bin"
Model_129:
    #import_raw_data "soloModelBins/MvC2_DM00_Model_129.bin"
STG_END:
    #data 0x00000000
    #align16