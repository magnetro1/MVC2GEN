; MvC2_DM04_POL.asm
BEG:
    #data ModelTable 0x00000006 TextureTable TextureEnd
ModelTable:
    #data Model_000 Model_001 Model_002 Model_003 
    #data Model_004 Model_005 
    #data 0x00000000 ; EndModelTable
    #align16

TextureTable: