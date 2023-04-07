; MvC2_DM10_POL.asm
BEG:
    #data ModelTable 0x00000058 TextureTable TextureEnd
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
    #data 0x00000000 ; EndModelTable
    #align16

TextureTable:
    #data 0x0100 0x0100 0x02 0x01 0x0000 0x0CC00000 0x00000000 ; 0x00, Ends @ 0x0CC20000
    #data 0x0100 0x0100 0x01 0x01 0x0000 0x0CC20000 0x00000000 ; 0x01, Ends @ 0x0CC40000
    #data 0x0100 0x0100 0x02 0x01 0x0000 0x0CC40000 0x00000000 ; 0x02, Ends @ 0x0CC60000
    #data 0x0080 0x0080 0x02 0x01 0x0000 0x0CC60000 0x00000000 ; 0x03, Ends @ 0x0CC68000
    #data 0x0100 0x0100 0x01 0x01 0x0000 0x0CC68000 0x00000000 ; 0x04, Ends @ 0x0CC88000
    #data 0x0040 0x0040 0x02 0x01 0x0000 0x0CC88000 0x00000000 ; 0x05, Ends @ 0x0CC8A000
    #data 0x0000 0x0000 0x00 0x00 0x0000 0x00000000 0x00000000 ; END

TextureEnd:
Model_000:
    #import_raw_data "soloModelBins/MvC2_DM10_Model_000.bin"
Model_001:
    #import_raw_data "soloModelBins/MvC2_DM10_Model_001.bin"
Model_002:
    #import_raw_data "soloModelBins/MvC2_DM10_Model_002.bin"
Model_003:
    #import_raw_data "soloModelBins/MvC2_DM10_Model_003.bin"
Model_004:
    #import_raw_data "soloModelBins/MvC2_DM10_Model_004.bin"
Model_005:
    #import_raw_data "soloModelBins/MvC2_DM10_Model_005.bin"
Model_006:
    #import_raw_data "soloModelBins/MvC2_DM10_Model_006.bin"
Model_007:
    #import_raw_data "soloModelBins/MvC2_DM10_Model_007.bin"
Model_008:
    #import_raw_data "soloModelBins/MvC2_DM10_Model_008.bin"
Model_009:
    #import_raw_data "soloModelBins/MvC2_DM10_Model_009.bin"
Model_010:
    #import_raw_data "soloModelBins/MvC2_DM10_Model_010.bin"
Model_011:
    #import_raw_data "soloModelBins/MvC2_DM10_Model_011.bin"
Model_012:
    #import_raw_data "soloModelBins/MvC2_DM10_Model_012.bin"
Model_013:
    #import_raw_data "soloModelBins/MvC2_DM10_Model_013.bin"
Model_014:
    #import_raw_data "soloModelBins/MvC2_DM10_Model_014.bin"
Model_015:
    #import_raw_data "soloModelBins/MvC2_DM10_Model_015.bin"
Model_016:
    #import_raw_data "soloModelBins/MvC2_DM10_Model_016.bin"
Model_017:
    #import_raw_data "soloModelBins/MvC2_DM10_Model_017.bin"
Model_018:
    #import_raw_data "soloModelBins/MvC2_DM10_Model_018.bin"
Model_019:
    #import_raw_data "soloModelBins/MvC2_DM10_Model_019.bin"
Model_020:
    #import_raw_data "soloModelBins/MvC2_DM10_Model_020.bin"
Model_021:
    #import_raw_data "soloModelBins/MvC2_DM10_Model_021.bin"
Model_022:
    #import_raw_data "soloModelBins/MvC2_DM10_Model_022.bin"
Model_023:
    #import_raw_data "soloModelBins/MvC2_DM10_Model_023.bin"
Model_024:
    #import_raw_data "soloModelBins/MvC2_DM10_Model_024.bin"
Model_025:
    #import_raw_data "soloModelBins/MvC2_DM10_Model_025.bin"
Model_026:
    #import_raw_data "soloModelBins/MvC2_DM10_Model_026.bin"
Model_027:
    #import_raw_data "soloModelBins/MvC2_DM10_Model_027.bin"
Model_028:
    #import_raw_data "soloModelBins/MvC2_DM10_Model_028.bin"
Model_029:
    #import_raw_data "soloModelBins/MvC2_DM10_Model_029.bin"
Model_030:
    #import_raw_data "soloModelBins/MvC2_DM10_Model_030.bin"
Model_031:
    #import_raw_data "soloModelBins/MvC2_DM10_Model_031.bin"
Model_032:
    #import_raw_data "soloModelBins/MvC2_DM10_Model_032.bin"
Model_033:
    #import_raw_data "soloModelBins/MvC2_DM10_Model_033.bin"
Model_034:
    #import_raw_data "soloModelBins/MvC2_DM10_Model_034.bin"
Model_035:
    #import_raw_data "soloModelBins/MvC2_DM10_Model_035.bin"
Model_036:
    #import_raw_data "soloModelBins/MvC2_DM10_Model_036.bin"
Model_037:
    #import_raw_data "soloModelBins/MvC2_DM10_Model_037.bin"
Model_038:
    #import_raw_data "soloModelBins/MvC2_DM10_Model_038.bin"
Model_039:
    #import_raw_data "soloModelBins/MvC2_DM10_Model_039.bin"
Model_040:
    #import_raw_data "soloModelBins/MvC2_DM10_Model_040.bin"
Model_041:
    #import_raw_data "soloModelBins/MvC2_DM10_Model_041.bin"
Model_042:
    #import_raw_data "soloModelBins/MvC2_DM10_Model_042.bin"
Model_043:
    #import_raw_data "soloModelBins/MvC2_DM10_Model_043.bin"
Model_044:
    #import_raw_data "soloModelBins/MvC2_DM10_Model_044.bin"
Model_045:
    #import_raw_data "soloModelBins/MvC2_DM10_Model_045.bin"
Model_046:
    #import_raw_data "soloModelBins/MvC2_DM10_Model_046.bin"
Model_047:
    #import_raw_data "soloModelBins/MvC2_DM10_Model_047.bin"
Model_048:
    #import_raw_data "soloModelBins/MvC2_DM10_Model_048.bin"
Model_049:
    #import_raw_data "soloModelBins/MvC2_DM10_Model_049.bin"
Model_050:
    #import_raw_data "soloModelBins/MvC2_DM10_Model_050.bin"
Model_051:
    #import_raw_data "soloModelBins/MvC2_DM10_Model_051.bin"
Model_052:
    #import_raw_data "soloModelBins/MvC2_DM10_Model_052.bin"
Model_053:
    #import_raw_data "soloModelBins/MvC2_DM10_Model_053.bin"
Model_054:
    #import_raw_data "soloModelBins/MvC2_DM10_Model_054.bin"
Model_055:
    #import_raw_data "soloModelBins/MvC2_DM10_Model_055.bin"
Model_056:
    #import_raw_data "soloModelBins/MvC2_DM10_Model_056.bin"
Model_057:
    #import_raw_data "soloModelBins/MvC2_DM10_Model_057.bin"
Model_058:
    #import_raw_data "soloModelBins/MvC2_DM10_Model_058.bin"
Model_059:
    #import_raw_data "soloModelBins/MvC2_DM10_Model_059.bin"
Model_060:
    #import_raw_data "soloModelBins/MvC2_DM10_Model_060.bin"
Model_061:
    #import_raw_data "soloModelBins/MvC2_DM10_Model_061.bin"
Model_062:
    #import_raw_data "soloModelBins/MvC2_DM10_Model_062.bin"
Model_063:
    #import_raw_data "soloModelBins/MvC2_DM10_Model_063.bin"
Model_064:
    #import_raw_data "soloModelBins/MvC2_DM10_Model_064.bin"
Model_065:
    #import_raw_data "soloModelBins/MvC2_DM10_Model_065.bin"
Model_066:
    #import_raw_data "soloModelBins/MvC2_DM10_Model_066.bin"
Model_067:
    #import_raw_data "soloModelBins/MvC2_DM10_Model_067.bin"
Model_068:
    #import_raw_data "soloModelBins/MvC2_DM10_Model_068.bin"
Model_069:
    #import_raw_data "soloModelBins/MvC2_DM10_Model_069.bin"
Model_070:
    #import_raw_data "soloModelBins/MvC2_DM10_Model_070.bin"
Model_071:
    #import_raw_data "soloModelBins/MvC2_DM10_Model_071.bin"
Model_072:
    #import_raw_data "soloModelBins/MvC2_DM10_Model_072.bin"
Model_073:
    #import_raw_data "soloModelBins/MvC2_DM10_Model_073.bin"
Model_074:
    #import_raw_data "soloModelBins/MvC2_DM10_Model_074.bin"
Model_075:
    #import_raw_data "soloModelBins/MvC2_DM10_Model_075.bin"
Model_076:
    #import_raw_data "soloModelBins/MvC2_DM10_Model_076.bin"
Model_077:
    #import_raw_data "soloModelBins/MvC2_DM10_Model_077.bin"
Model_078:
    #import_raw_data "soloModelBins/MvC2_DM10_Model_078.bin"
Model_079:
    #import_raw_data "soloModelBins/MvC2_DM10_Model_079.bin"
Model_080:
    #import_raw_data "soloModelBins/MvC2_DM10_Model_080.bin"
Model_081:
    #import_raw_data "soloModelBins/MvC2_DM10_Model_081.bin"
Model_082:
    #import_raw_data "soloModelBins/MvC2_DM10_Model_082.bin"
Model_083:
    #import_raw_data "soloModelBins/MvC2_DM10_Model_083.bin"
Model_084:
    #import_raw_data "soloModelBins/MvC2_DM10_Model_084.bin"
Model_085:
    #import_raw_data "soloModelBins/MvC2_DM10_Model_085.bin"
Model_086:
    #import_raw_data "soloModelBins/MvC2_DM10_Model_086.bin"
Model_087:
    #import_raw_data "soloModelBins/MvC2_DM10_Model_087.bin"
STG_END:
    #data 0x00000000
    #align16