; MvC2_DM14_POL.asm
BEG:
    #data ModelTable 0x0000001D TextureTable TextureEnd
ModelTable:
    #data Model_000 Model_001 Model_002 Model_003 
    #data Model_004 Model_005 Model_006 Model_007 
    #data Model_008 Model_009 Model_010 Model_011 
    #data Model_012 Model_013 Model_014 Model_015 
    #data Model_016 Model_017 Model_018 Model_019 
    #data Model_020 Model_021 Model_022 Model_023 
    #data Model_024 Model_025 Model_026 Model_027 
    #data Model_028 
    #data 0x00000000 ; EndModelTable
    #align16

TextureTable:
    #data 0x0080 0x0080 0x02 0x01 0x0000 0x0CC00000 0x00000000 ; 0x00, Ends @ 0x0CC08000
    #data 0x0080 0x0080 0x02 0x01 0x0000 0x0CC08000 0x00000000 ; 0x01, Ends @ 0x0CC10000
    #data 0x0040 0x0040 0x01 0x01 0x0000 0x0CC10000 0x00000000 ; 0x02, Ends @ 0x0CC12000
    #data 0x0040 0x0040 0x02 0x01 0x0000 0x0CC12000 0x00000000 ; 0x03, Ends @ 0x0CC14000
    #data 0x0080 0x0080 0x02 0x01 0x0000 0x0CC14000 0x00000000 ; 0x04, Ends @ 0x0CC1C000
    #data 0x0080 0x0080 0x02 0x01 0x0000 0x0CC1C000 0x00000000 ; 0x05, Ends @ 0x0CC24000
    #data 0x0100 0x0080 0x00 0x0D 0x0000 0x0CC24000 0x00000000 ; 0x06, Ends @ 0x0CC34000
    #data 0x0100 0x0080 0x00 0x0D 0x0000 0x0CC34000 0x00000000 ; 0x07, Ends @ 0x0CC44000
    #data 0x0040 0x0040 0x00 0x01 0x0000 0x0CC44000 0x00000000 ; 0x08, Ends @ 0x0CC46000
    #data 0x0100 0x0100 0x02 0x01 0x0000 0x0CC46000 0x00000000 ; 0x09, Ends @ 0x0CC66000
    #data 0x0100 0x0100 0x02 0x01 0x0000 0x0CC66000 0x00000000 ; 0x0A, Ends @ 0x0CC86000
    #data 0x0100 0x0100 0x02 0x01 0x0000 0x0CC86000 0x00000000 ; 0x0B, Ends @ 0x0CCA6000
    #data 0x0000 0x0000 0x00 0x00 0x0000 0x00000000 0x00000000 ; END

TextureEnd:
Model_000:
    #import_raw_data "soloModelBins/MvC2_DM14_Model_000.bin"
Model_001:
    #import_raw_data "soloModelBins/MvC2_DM14_Model_001.bin"
Model_002:
    #import_raw_data "soloModelBins/MvC2_DM14_Model_002.bin"
Model_003:
    #import_raw_data "soloModelBins/MvC2_DM14_Model_003.bin"
Model_004:
    #import_raw_data "soloModelBins/MvC2_DM14_Model_004.bin"
Model_005:
    #import_raw_data "soloModelBins/MvC2_DM14_Model_005.bin"
Model_006:
    #import_raw_data "soloModelBins/MvC2_DM14_Model_006.bin"
Model_007:
    #import_raw_data "soloModelBins/MvC2_DM14_Model_007.bin"
Model_008:
    #import_raw_data "soloModelBins/MvC2_DM14_Model_008.bin"
Model_009:
    #import_raw_data "soloModelBins/MvC2_DM14_Model_009.bin"
Model_010:
    #import_raw_data "soloModelBins/MvC2_DM14_Model_010.bin"
Model_011:
    #import_raw_data "soloModelBins/MvC2_DM14_Model_011.bin"
Model_012:
    #import_raw_data "soloModelBins/MvC2_DM14_Model_012.bin"
Model_013:
    #import_raw_data "soloModelBins/MvC2_DM14_Model_013.bin"
Model_014:
    #import_raw_data "soloModelBins/MvC2_DM14_Model_014.bin"
Model_015:
    #import_raw_data "soloModelBins/MvC2_DM14_Model_015.bin"
Model_016:
    #import_raw_data "soloModelBins/MvC2_DM14_Model_016.bin"
Model_017:
    #import_raw_data "soloModelBins/MvC2_DM14_Model_017.bin"
Model_018:
    #import_raw_data "soloModelBins/MvC2_DM14_Model_018.bin"
Model_019:
    #import_raw_data "soloModelBins/MvC2_DM14_Model_019.bin"
Model_020:
    #import_raw_data "soloModelBins/MvC2_DM14_Model_020.bin"
Model_021:
    #import_raw_data "soloModelBins/MvC2_DM14_Model_021.bin"
Model_022:
    #import_raw_data "soloModelBins/MvC2_DM14_Model_022.bin"
Model_023:
    #import_raw_data "soloModelBins/MvC2_DM14_Model_023.bin"
Model_024:
    #import_raw_data "soloModelBins/MvC2_DM14_Model_024.bin"
Model_025:
    #import_raw_data "soloModelBins/MvC2_DM14_Model_025.bin"
Model_026:
    #import_raw_data "soloModelBins/MvC2_DM14_Model_026.bin"
Model_027:
    #import_raw_data "soloModelBins/MvC2_DM14_Model_027.bin"
Model_028:
    #import_raw_data "soloModelBins/MvC2_DM14_Model_028.bin"
STG_END:
    #data 0x00000000
    #align16