; MvC2_DM11_POL.asm
BEG:
    #data ModelTable 0x0000001B TextureTable TextureEnd
ModelTable:
    #data Model_000 Model_001 Model_002 Model_003 
    #data Model_004 Model_005 Model_006 Model_007 
    #data Model_008 Model_009 Model_010 Model_011 
    #data Model_012 Model_013 Model_014 Model_015 
    #data Model_016 Model_017 Model_018 Model_019 
    #data Model_020 Model_021 Model_022 Model_023 
    #data Model_024 Model_025 Model_026 
    #data 0x00000000 ; EndModelTable
    #align16

TextureTable:
    #data 0x0100 0x0100 0x02 0x01 0x0000 0x0CC00000 0x00000000 ; 0x00, Ends @ 0x0CC20000
    #data 0x0100 0x0100 0x02 0x01 0x0000 0x0CC20000 0x00000000 ; 0x01, Ends @ 0x0CC40000
    #data 0x0000 0x0000 0x00 0x00 0x0000 0x00000000 0x00000000 ; END

TextureEnd:
Model_000:
    #import_raw_data "soloModelBins/MvC2_DM11_Model_000.bin"
Model_001:
    #import_raw_data "soloModelBins/MvC2_DM11_Model_001.bin"
Model_002:
    #import_raw_data "soloModelBins/MvC2_DM11_Model_002.bin"
Model_003:
    #import_raw_data "soloModelBins/MvC2_DM11_Model_003.bin"
Model_004:
    #import_raw_data "soloModelBins/MvC2_DM11_Model_004.bin"
Model_005:
    #import_raw_data "soloModelBins/MvC2_DM11_Model_005.bin"
Model_006:
    #import_raw_data "soloModelBins/MvC2_DM11_Model_006.bin"
Model_007:
    #import_raw_data "soloModelBins/MvC2_DM11_Model_007.bin"
Model_008:
    #import_raw_data "soloModelBins/MvC2_DM11_Model_008.bin"
Model_009:
    #import_raw_data "soloModelBins/MvC2_DM11_Model_009.bin"
Model_010:
    #import_raw_data "soloModelBins/MvC2_DM11_Model_010.bin"
Model_011:
    #import_raw_data "soloModelBins/MvC2_DM11_Model_011.bin"
Model_012:
    #import_raw_data "soloModelBins/MvC2_DM11_Model_012.bin"
Model_013:
    #import_raw_data "soloModelBins/MvC2_DM11_Model_013.bin"
Model_014:
    #import_raw_data "soloModelBins/MvC2_DM11_Model_014.bin"
Model_015:
    #import_raw_data "soloModelBins/MvC2_DM11_Model_015.bin"
Model_016:
    #import_raw_data "soloModelBins/MvC2_DM11_Model_016.bin"
Model_017:
    #import_raw_data "soloModelBins/MvC2_DM11_Model_017.bin"
Model_018:
    #import_raw_data "soloModelBins/MvC2_DM11_Model_018.bin"
Model_019:
    #import_raw_data "soloModelBins/MvC2_DM11_Model_019.bin"
Model_020:
    #import_raw_data "soloModelBins/MvC2_DM11_Model_020.bin"
Model_021:
    #import_raw_data "soloModelBins/MvC2_DM11_Model_021.bin"
Model_022:
    #import_raw_data "soloModelBins/MvC2_DM11_Model_022.bin"
Model_023:
    #import_raw_data "soloModelBins/MvC2_DM11_Model_023.bin"
Model_024:
    #import_raw_data "soloModelBins/MvC2_DM11_Model_024.bin"
Model_025:
    #import_raw_data "soloModelBins/MvC2_DM11_Model_025.bin"
Model_026:
    #import_raw_data "soloModelBins/MvC2_DM11_Model_026.bin"
STG_END:
    #data 0x00000000
    #align16