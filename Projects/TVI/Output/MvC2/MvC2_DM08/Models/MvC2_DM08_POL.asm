; MvC2_DM08_POL.asm
BEG:
    #data ModelTable 0x0000003C TextureTable TextureEnd
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
    #data 0x00000000 ; EndModelTable
    #align16

TextureTable:
    #data 0x0100 0x0100 0x01 0x01 0x0000 0x0CC00000 0x00000000 ; 0x00, Ends @ 0x0CC20000
    #data 0x0100 0x0100 0x02 0x01 0x0000 0x0CC20000 0x00000000 ; 0x01, Ends @ 0x0CC40000
    #data 0x0040 0x0040 0x01 0x01 0x0000 0x0CC40000 0x00000000 ; 0x02, Ends @ 0x0CC42000
    #data 0x0040 0x0040 0x01 0x01 0x0000 0x0CC42000 0x00000000 ; 0x03, Ends @ 0x0CC44000
    #data 0x0100 0x0100 0x01 0x01 0x0000 0x0CC44000 0x00000000 ; 0x04, Ends @ 0x0CC64000
    #data 0x0080 0x0080 0x01 0x02 0x0000 0x0CC64000 0x00000000 ; 0x05, Ends @ 0x0CC6C000
    #data 0x0080 0x0080 0x02 0x01 0x0000 0x0CC6EAC0 0x00000000 ; 0x06, Ends @ 0x0CC76AC0
    #data 0x0100 0x0100 0x02 0x01 0x0000 0x0CC76AC0 0x00000000 ; 0x07, Ends @ 0x0CC96AC0
    #data 0x0080 0x0080 0x01 0x01 0x0000 0x0CC96AC0 0x00000000 ; 0x08, Ends @ 0x0CC9EAC0
    #data 0x0080 0x0080 0x02 0x01 0x0000 0x0CC9EAC0 0x00000000 ; 0x09, Ends @ 0x0CCA6AC0
    #data 0x0080 0x0080 0x02 0x01 0x0000 0x0CCA6AC0 0x00000000 ; 0x0A, Ends @ 0x0CCAEAC0
    #data 0x0080 0x0080 0x02 0x01 0x0000 0x0CCAEAC0 0x00000000 ; 0x0B, Ends @ 0x0CCB6AC0
    #data 0x0200 0x0200 0x00 0x01 0x0000 0x0CCB6AC0 0x00000000 ; 0x0C, Ends @ 0x0CD36AC0
    #data 0x0100 0x0100 0x02 0x01 0x0000 0x0CD36AC0 0x00000000 ; 0x0D, Ends @ 0x0CD56AC0
    #data 0x0100 0x0100 0x02 0x01 0x0000 0x0CD56AC0 0x00000000 ; 0x0E, Ends @ 0x0CD76AC0
    #data 0x0100 0x0100 0x02 0x01 0x0000 0x0CD76AC0 0x00000000 ; 0x0F, Ends @ 0x0CD96AC0
    #data 0x0100 0x0100 0x02 0x01 0x0000 0x0CD96AC0 0x00000000 ; 0x10, Ends @ 0x0CDB6AC0
    #data 0x0100 0x0100 0x02 0x01 0x0000 0x0CDB6AC0 0x00000000 ; 0x11, Ends @ 0x0CDD6AC0
    #data 0x0000 0x0000 0x00 0x00 0x0000 0x00000000 0x00000000 ; END

TextureEnd:
Model_000:
    #import_raw_data "soloModelBins/MvC2_DM08_Model_000.bin"
Model_001:
    #import_raw_data "soloModelBins/MvC2_DM08_Model_001.bin"
Model_002:
    #import_raw_data "soloModelBins/MvC2_DM08_Model_002.bin"
Model_003:
    #import_raw_data "soloModelBins/MvC2_DM08_Model_003.bin"
Model_004:
    #import_raw_data "soloModelBins/MvC2_DM08_Model_004.bin"
Model_005:
    #import_raw_data "soloModelBins/MvC2_DM08_Model_005.bin"
Model_006:
    #import_raw_data "soloModelBins/MvC2_DM08_Model_006.bin"
Model_007:
    #import_raw_data "soloModelBins/MvC2_DM08_Model_007.bin"
Model_008:
    #import_raw_data "soloModelBins/MvC2_DM08_Model_008.bin"
Model_009:
    #import_raw_data "soloModelBins/MvC2_DM08_Model_009.bin"
Model_010:
    #import_raw_data "soloModelBins/MvC2_DM08_Model_010.bin"
Model_011:
    #import_raw_data "soloModelBins/MvC2_DM08_Model_011.bin"
Model_012:
    #import_raw_data "soloModelBins/MvC2_DM08_Model_012.bin"
Model_013:
    #import_raw_data "soloModelBins/MvC2_DM08_Model_013.bin"
Model_014:
    #import_raw_data "soloModelBins/MvC2_DM08_Model_014.bin"
Model_015:
    #import_raw_data "soloModelBins/MvC2_DM08_Model_015.bin"
Model_016:
    #import_raw_data "soloModelBins/MvC2_DM08_Model_016.bin"
Model_017:
    #import_raw_data "soloModelBins/MvC2_DM08_Model_017.bin"
Model_018:
    #import_raw_data "soloModelBins/MvC2_DM08_Model_018.bin"
Model_019:
    #import_raw_data "soloModelBins/MvC2_DM08_Model_019.bin"
Model_020:
    #import_raw_data "soloModelBins/MvC2_DM08_Model_020.bin"
Model_021:
    #import_raw_data "soloModelBins/MvC2_DM08_Model_021.bin"
Model_022:
    #import_raw_data "soloModelBins/MvC2_DM08_Model_022.bin"
Model_023:
    #import_raw_data "soloModelBins/MvC2_DM08_Model_023.bin"
Model_024:
    #import_raw_data "soloModelBins/MvC2_DM08_Model_024.bin"
Model_025:
    #import_raw_data "soloModelBins/MvC2_DM08_Model_025.bin"
Model_026:
    #import_raw_data "soloModelBins/MvC2_DM08_Model_026.bin"
Model_027:
    #import_raw_data "soloModelBins/MvC2_DM08_Model_027.bin"
Model_028:
    #import_raw_data "soloModelBins/MvC2_DM08_Model_028.bin"
Model_029:
    #import_raw_data "soloModelBins/MvC2_DM08_Model_029.bin"
Model_030:
    #import_raw_data "soloModelBins/MvC2_DM08_Model_030.bin"
Model_031:
    #import_raw_data "soloModelBins/MvC2_DM08_Model_031.bin"
Model_032:
    #import_raw_data "soloModelBins/MvC2_DM08_Model_032.bin"
Model_033:
    #import_raw_data "soloModelBins/MvC2_DM08_Model_033.bin"
Model_034:
    #import_raw_data "soloModelBins/MvC2_DM08_Model_034.bin"
Model_035:
    #import_raw_data "soloModelBins/MvC2_DM08_Model_035.bin"
Model_036:
    #import_raw_data "soloModelBins/MvC2_DM08_Model_036.bin"
Model_037:
    #import_raw_data "soloModelBins/MvC2_DM08_Model_037.bin"
Model_038:
    #import_raw_data "soloModelBins/MvC2_DM08_Model_038.bin"
Model_039:
    #import_raw_data "soloModelBins/MvC2_DM08_Model_039.bin"
Model_040:
    #import_raw_data "soloModelBins/MvC2_DM08_Model_040.bin"
Model_041:
    #import_raw_data "soloModelBins/MvC2_DM08_Model_041.bin"
Model_042:
    #import_raw_data "soloModelBins/MvC2_DM08_Model_042.bin"
Model_043:
    #import_raw_data "soloModelBins/MvC2_DM08_Model_043.bin"
Model_044:
    #import_raw_data "soloModelBins/MvC2_DM08_Model_044.bin"
Model_045:
    #import_raw_data "soloModelBins/MvC2_DM08_Model_045.bin"
Model_046:
    #import_raw_data "soloModelBins/MvC2_DM08_Model_046.bin"
Model_047:
    #import_raw_data "soloModelBins/MvC2_DM08_Model_047.bin"
Model_048:
    #import_raw_data "soloModelBins/MvC2_DM08_Model_048.bin"
Model_049:
    #import_raw_data "soloModelBins/MvC2_DM08_Model_049.bin"
Model_050:
    #import_raw_data "soloModelBins/MvC2_DM08_Model_050.bin"
Model_051:
    #import_raw_data "soloModelBins/MvC2_DM08_Model_051.bin"
Model_052:
    #import_raw_data "soloModelBins/MvC2_DM08_Model_052.bin"
Model_053:
    #import_raw_data "soloModelBins/MvC2_DM08_Model_053.bin"
Model_054:
    #import_raw_data "soloModelBins/MvC2_DM08_Model_054.bin"
Model_055:
    #import_raw_data "soloModelBins/MvC2_DM08_Model_055.bin"
Model_056:
    #import_raw_data "soloModelBins/MvC2_DM08_Model_056.bin"
Model_057:
    #import_raw_data "soloModelBins/MvC2_DM08_Model_057.bin"
Model_058:
    #import_raw_data "soloModelBins/MvC2_DM08_Model_058.bin"
Model_059:
    #import_raw_data "soloModelBins/MvC2_DM08_Model_059.bin"
STG_END:
    #data 0x00000000
    #align16