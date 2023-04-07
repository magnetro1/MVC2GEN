; MvC2_DM0B_POL.asm
BEG:
    #data ModelTable 0x0000000A TextureTable TextureEnd
ModelTable:
    #data Model_000 Model_001 Model_002 Model_003 
    #data Model_004 Model_005 Model_006 Model_007 
    #data Model_008 Model_009 
    #data 0x00000000 ; EndModelTable
    #align16

TextureTable:
    #data 0x0000 0x0000 0x00 0x00 0x0000 0x00000000 0x00000000 ; END

TextureEnd:
Model_000:
    #import_raw_data "soloModelBins/MvC2_DM0B_Model_000.bin"
Model_001:
    #import_raw_data "soloModelBins/MvC2_DM0B_Model_001.bin"
Model_002:
    #import_raw_data "soloModelBins/MvC2_DM0B_Model_002.bin"
Model_003:
    #import_raw_data "soloModelBins/MvC2_DM0B_Model_003.bin"
Model_004:
    #import_raw_data "soloModelBins/MvC2_DM0B_Model_004.bin"
Model_005:
    #import_raw_data "soloModelBins/MvC2_DM0B_Model_005.bin"
Model_006:
    #import_raw_data "soloModelBins/MvC2_DM0B_Model_006.bin"
Model_007:
    #import_raw_data "soloModelBins/MvC2_DM0B_Model_007.bin"
Model_008:
    #import_raw_data "soloModelBins/MvC2_DM0B_Model_008.bin"
Model_009:
    #import_raw_data "soloModelBins/MvC2_DM0B_Model_009.bin"
STG_END:
    #data 0x00000000
    #align16