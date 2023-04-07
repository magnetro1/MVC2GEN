; MvC2_DM0E_POL.asm
BEG:
    #data ModelTable 0x00000001 TextureTable TextureEnd
ModelTable:
    #data Model_000 
    #data 0x00000000 ; EndModelTable
    #align16

TextureTable:
    #data 0x0200 0x0200 0x01 0x01 0x0000 0x0CC00000 0x00000000 ; 0x00, Ends @ 0x0CC80000
    #data 0x0000 0x0000 0x00 0x00 0x0000 0x00000000 0x00000000 ; END

TextureEnd:
Model_000:
    #import_raw_data "soloModelBins/MvC2_DM0E_Model_000.bin"
STG_END:
    #data 0x00000000
    #align16