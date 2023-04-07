; MvC2_DM0C_POL.asm
BEG:
    #data ModelTable 0x00000157 TextureTable TextureEnd
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
    #data Model_128 Model_129 Model_130 Model_131 
    #data Model_132 Model_133 Model_134 Model_135 
    #data Model_136 Model_137 Model_138 Model_139 
    #data Model_140 Model_141 Model_142 Model_143 
    #data Model_144 Model_145 Model_146 Model_147 
    #data Model_148 Model_149 Model_150 Model_151 
    #data Model_152 Model_153 Model_154 Model_155 
    #data Model_156 Model_157 Model_158 Model_159 
    #data Model_160 Model_161 Model_162 Model_163 
    #data Model_164 Model_165 Model_166 Model_167 
    #data Model_168 Model_169 Model_170 Model_171 
    #data Model_172 Model_173 Model_174 Model_175 
    #data Model_176 Model_177 Model_178 Model_179 
    #data Model_180 Model_181 Model_182 Model_183 
    #data Model_184 Model_185 Model_186 Model_187 
    #data Model_188 Model_189 Model_190 Model_191 
    #data Model_192 Model_193 Model_194 Model_195 
    #data Model_196 Model_197 Model_198 Model_199 
    #data Model_200 Model_201 Model_202 Model_203 
    #data Model_204 Model_205 Model_206 Model_207 
    #data Model_208 Model_209 Model_210 Model_211 
    #data Model_212 Model_213 Model_214 Model_215 
    #data Model_216 Model_217 Model_218 Model_219 
    #data Model_220 Model_221 Model_222 Model_223 
    #data Model_224 Model_225 Model_226 Model_227 
    #data Model_228 Model_229 Model_230 Model_231 
    #data Model_232 Model_233 Model_234 Model_235 
    #data Model_236 Model_237 Model_238 Model_239 
    #data Model_240 Model_241 Model_242 Model_243 
    #data Model_244 Model_245 Model_246 Model_247 
    #data Model_248 Model_249 Model_250 Model_251 
    #data Model_252 Model_253 Model_254 Model_255 
    #data Model_256 Model_257 Model_258 Model_259 
    #data Model_260 Model_261 Model_262 Model_263 
    #data Model_264 Model_265 Model_266 Model_267 
    #data Model_268 Model_269 Model_270 Model_271 
    #data Model_272 Model_273 Model_274 Model_275 
    #data Model_276 Model_277 Model_278 Model_279 
    #data Model_280 Model_281 Model_282 Model_283 
    #data Model_284 Model_285 Model_286 Model_287 
    #data Model_288 Model_289 Model_290 Model_291 
    #data Model_292 Model_293 Model_294 Model_295 
    #data Model_296 Model_297 Model_298 Model_299 
    #data Model_300 Model_301 Model_302 Model_303 
    #data Model_304 Model_305 Model_306 Model_307 
    #data Model_308 Model_309 Model_310 Model_311 
    #data Model_312 Model_313 Model_314 Model_315 
    #data Model_316 Model_317 Model_318 Model_319 
    #data Model_320 Model_321 Model_322 Model_323 
    #data Model_324 Model_325 Model_326 Model_327 
    #data Model_328 Model_329 Model_330 Model_331 
    #data Model_332 Model_333 Model_334 Model_335 
    #data Model_336 Model_337 Model_338 Model_339 
    #data Model_340 Model_341 Model_342 
    #data 0x00000000 ; EndModelTable
    #align16

TextureTable:
    #data 0x0100 0x0100 0x02 0x01 0x0000 0x0CC00000 0x00000000 ; 0x00, Ends @ 0x0CC20000
    #data 0x0040 0x0040 0x01 0x01 0x0000 0x0CC20000 0x00000000 ; 0x01, Ends @ 0x0CC22000
    #data 0x0040 0x0040 0x01 0x01 0x0000 0x0CC22000 0x00000000 ; 0x02, Ends @ 0x0CC24000
    #data 0x0080 0x0080 0x02 0x01 0x0000 0x0CC24000 0x00000000 ; 0x03, Ends @ 0x0CC2C000
    #data 0x0080 0x0080 0x01 0x03 0x0000 0x0CC2C000 0x00000000 ; 0x04, Ends @ 0x0CC34000
    #data 0x0100 0x0100 0x01 0x01 0x0000 0x0CC2D800 0x00000000 ; 0x05, Ends @ 0x0CC4D800
    #data 0x0100 0x0100 0x02 0x01 0x0000 0x0CC4D800 0x00000000 ; 0x06, Ends @ 0x0CC6D800
    #data 0x0100 0x0100 0x02 0x01 0x0000 0x0CC6D800 0x00000000 ; 0x07, Ends @ 0x0CC8D800
    #data 0x0100 0x0100 0x02 0x01 0x0000 0x0CC8D800 0x00000000 ; 0x08, Ends @ 0x0CCAD800
    #data 0x0100 0x0100 0x02 0x01 0x0000 0x0CCAD800 0x00000000 ; 0x09, Ends @ 0x0CCCD800
    #data 0x0100 0x0100 0x02 0x01 0x0000 0x0CCCD800 0x00000000 ; 0x0A, Ends @ 0x0CCED800
    #data 0x0040 0x0040 0x02 0x01 0x0000 0x0CCED800 0x00000000 ; 0x0B, Ends @ 0x0CCEF800
    #data 0x0100 0x0100 0x02 0x01 0x0000 0x0CCEF800 0x00000000 ; 0x0C, Ends @ 0x0CD0F800
    #data 0x0100 0x0100 0x02 0x01 0x0000 0x0CD0F800 0x00000000 ; 0x0D, Ends @ 0x0CD2F800
    #data 0x0100 0x0100 0x02 0x01 0x0000 0x0CD2F800 0x00000000 ; 0x0E, Ends @ 0x0CD4F800
    #data 0x0100 0x0100 0x02 0x01 0x0000 0x0CD4F800 0x00000000 ; 0x0F, Ends @ 0x0CD6F800
    #data 0x0100 0x0100 0x01 0x01 0x0000 0x0CD6F800 0x00000000 ; 0x10, Ends @ 0x0CD8F800
    #data 0x0080 0x0080 0x01 0x01 0x0000 0x0CD8F800 0x00000000 ; 0x11, Ends @ 0x0CD97800
    #data 0x0000 0x0000 0x00 0x00 0x0000 0x00000000 0x00000000 ; END

TextureEnd:
Model_000:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_000.bin"
Model_001:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_001.bin"
Model_002:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_002.bin"
Model_003:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_003.bin"
Model_004:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_004.bin"
Model_005:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_005.bin"
Model_006:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_006.bin"
Model_007:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_007.bin"
Model_008:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_008.bin"
Model_009:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_009.bin"
Model_010:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_010.bin"
Model_011:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_011.bin"
Model_012:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_012.bin"
Model_013:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_013.bin"
Model_014:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_014.bin"
Model_015:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_015.bin"
Model_016:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_016.bin"
Model_017:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_017.bin"
Model_018:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_018.bin"
Model_019:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_019.bin"
Model_020:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_020.bin"
Model_021:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_021.bin"
Model_022:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_022.bin"
Model_023:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_023.bin"
Model_024:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_024.bin"
Model_025:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_025.bin"
Model_026:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_026.bin"
Model_027:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_027.bin"
Model_028:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_028.bin"
Model_029:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_029.bin"
Model_030:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_030.bin"
Model_031:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_031.bin"
Model_032:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_032.bin"
Model_033:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_033.bin"
Model_034:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_034.bin"
Model_035:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_035.bin"
Model_036:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_036.bin"
Model_037:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_037.bin"
Model_038:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_038.bin"
Model_039:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_039.bin"
Model_040:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_040.bin"
Model_041:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_041.bin"
Model_042:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_042.bin"
Model_043:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_043.bin"
Model_044:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_044.bin"
Model_045:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_045.bin"
Model_046:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_046.bin"
Model_047:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_047.bin"
Model_048:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_048.bin"
Model_049:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_049.bin"
Model_050:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_050.bin"
Model_051:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_051.bin"
Model_052:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_052.bin"
Model_053:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_053.bin"
Model_054:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_054.bin"
Model_055:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_055.bin"
Model_056:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_056.bin"
Model_057:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_057.bin"
Model_058:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_058.bin"
Model_059:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_059.bin"
Model_060:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_060.bin"
Model_061:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_061.bin"
Model_062:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_062.bin"
Model_063:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_063.bin"
Model_064:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_064.bin"
Model_065:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_065.bin"
Model_066:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_066.bin"
Model_067:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_067.bin"
Model_068:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_068.bin"
Model_069:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_069.bin"
Model_070:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_070.bin"
Model_071:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_071.bin"
Model_072:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_072.bin"
Model_073:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_073.bin"
Model_074:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_074.bin"
Model_075:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_075.bin"
Model_076:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_076.bin"
Model_077:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_077.bin"
Model_078:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_078.bin"
Model_079:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_079.bin"
Model_080:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_080.bin"
Model_081:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_081.bin"
Model_082:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_082.bin"
Model_083:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_083.bin"
Model_084:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_084.bin"
Model_085:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_085.bin"
Model_086:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_086.bin"
Model_087:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_087.bin"
Model_088:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_088.bin"
Model_089:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_089.bin"
Model_090:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_090.bin"
Model_091:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_091.bin"
Model_092:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_092.bin"
Model_093:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_093.bin"
Model_094:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_094.bin"
Model_095:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_095.bin"
Model_096:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_096.bin"
Model_097:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_097.bin"
Model_098:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_098.bin"
Model_099:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_099.bin"
Model_100:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_100.bin"
Model_101:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_101.bin"
Model_102:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_102.bin"
Model_103:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_103.bin"
Model_104:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_104.bin"
Model_105:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_105.bin"
Model_106:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_106.bin"
Model_107:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_107.bin"
Model_108:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_108.bin"
Model_109:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_109.bin"
Model_110:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_110.bin"
Model_111:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_111.bin"
Model_112:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_112.bin"
Model_113:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_113.bin"
Model_114:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_114.bin"
Model_115:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_115.bin"
Model_116:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_116.bin"
Model_117:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_117.bin"
Model_118:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_118.bin"
Model_119:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_119.bin"
Model_120:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_120.bin"
Model_121:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_121.bin"
Model_122:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_122.bin"
Model_123:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_123.bin"
Model_124:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_124.bin"
Model_125:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_125.bin"
Model_126:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_126.bin"
Model_127:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_127.bin"
Model_128:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_128.bin"
Model_129:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_129.bin"
Model_130:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_130.bin"
Model_131:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_131.bin"
Model_132:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_132.bin"
Model_133:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_133.bin"
Model_134:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_134.bin"
Model_135:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_135.bin"
Model_136:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_136.bin"
Model_137:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_137.bin"
Model_138:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_138.bin"
Model_139:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_139.bin"
Model_140:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_140.bin"
Model_141:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_141.bin"
Model_142:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_142.bin"
Model_143:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_143.bin"
Model_144:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_144.bin"
Model_145:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_145.bin"
Model_146:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_146.bin"
Model_147:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_147.bin"
Model_148:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_148.bin"
Model_149:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_149.bin"
Model_150:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_150.bin"
Model_151:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_151.bin"
Model_152:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_152.bin"
Model_153:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_153.bin"
Model_154:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_154.bin"
Model_155:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_155.bin"
Model_156:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_156.bin"
Model_157:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_157.bin"
Model_158:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_158.bin"
Model_159:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_159.bin"
Model_160:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_160.bin"
Model_161:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_161.bin"
Model_162:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_162.bin"
Model_163:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_163.bin"
Model_164:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_164.bin"
Model_165:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_165.bin"
Model_166:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_166.bin"
Model_167:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_167.bin"
Model_168:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_168.bin"
Model_169:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_169.bin"
Model_170:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_170.bin"
Model_171:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_171.bin"
Model_172:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_172.bin"
Model_173:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_173.bin"
Model_174:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_174.bin"
Model_175:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_175.bin"
Model_176:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_176.bin"
Model_177:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_177.bin"
Model_178:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_178.bin"
Model_179:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_179.bin"
Model_180:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_180.bin"
Model_181:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_181.bin"
Model_182:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_182.bin"
Model_183:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_183.bin"
Model_184:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_184.bin"
Model_185:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_185.bin"
Model_186:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_186.bin"
Model_187:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_187.bin"
Model_188:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_188.bin"
Model_189:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_189.bin"
Model_190:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_190.bin"
Model_191:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_191.bin"
Model_192:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_192.bin"
Model_193:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_193.bin"
Model_194:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_194.bin"
Model_195:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_195.bin"
Model_196:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_196.bin"
Model_197:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_197.bin"
Model_198:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_198.bin"
Model_199:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_199.bin"
Model_200:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_200.bin"
Model_201:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_201.bin"
Model_202:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_202.bin"
Model_203:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_203.bin"
Model_204:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_204.bin"
Model_205:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_205.bin"
Model_206:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_206.bin"
Model_207:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_207.bin"
Model_208:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_208.bin"
Model_209:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_209.bin"
Model_210:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_210.bin"
Model_211:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_211.bin"
Model_212:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_212.bin"
Model_213:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_213.bin"
Model_214:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_214.bin"
Model_215:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_215.bin"
Model_216:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_216.bin"
Model_217:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_217.bin"
Model_218:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_218.bin"
Model_219:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_219.bin"
Model_220:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_220.bin"
Model_221:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_221.bin"
Model_222:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_222.bin"
Model_223:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_223.bin"
Model_224:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_224.bin"
Model_225:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_225.bin"
Model_226:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_226.bin"
Model_227:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_227.bin"
Model_228:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_228.bin"
Model_229:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_229.bin"
Model_230:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_230.bin"
Model_231:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_231.bin"
Model_232:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_232.bin"
Model_233:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_233.bin"
Model_234:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_234.bin"
Model_235:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_235.bin"
Model_236:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_236.bin"
Model_237:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_237.bin"
Model_238:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_238.bin"
Model_239:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_239.bin"
Model_240:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_240.bin"
Model_241:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_241.bin"
Model_242:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_242.bin"
Model_243:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_243.bin"
Model_244:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_244.bin"
Model_245:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_245.bin"
Model_246:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_246.bin"
Model_247:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_247.bin"
Model_248:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_248.bin"
Model_249:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_249.bin"
Model_250:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_250.bin"
Model_251:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_251.bin"
Model_252:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_252.bin"
Model_253:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_253.bin"
Model_254:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_254.bin"
Model_255:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_255.bin"
Model_256:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_256.bin"
Model_257:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_257.bin"
Model_258:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_258.bin"
Model_259:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_259.bin"
Model_260:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_260.bin"
Model_261:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_261.bin"
Model_262:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_262.bin"
Model_263:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_263.bin"
Model_264:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_264.bin"
Model_265:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_265.bin"
Model_266:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_266.bin"
Model_267:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_267.bin"
Model_268:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_268.bin"
Model_269:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_269.bin"
Model_270:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_270.bin"
Model_271:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_271.bin"
Model_272:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_272.bin"
Model_273:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_273.bin"
Model_274:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_274.bin"
Model_275:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_275.bin"
Model_276:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_276.bin"
Model_277:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_277.bin"
Model_278:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_278.bin"
Model_279:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_279.bin"
Model_280:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_280.bin"
Model_281:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_281.bin"
Model_282:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_282.bin"
Model_283:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_283.bin"
Model_284:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_284.bin"
Model_285:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_285.bin"
Model_286:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_286.bin"
Model_287:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_287.bin"
Model_288:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_288.bin"
Model_289:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_289.bin"
Model_290:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_290.bin"
Model_291:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_291.bin"
Model_292:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_292.bin"
Model_293:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_293.bin"
Model_294:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_294.bin"
Model_295:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_295.bin"
Model_296:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_296.bin"
Model_297:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_297.bin"
Model_298:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_298.bin"
Model_299:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_299.bin"
Model_300:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_300.bin"
Model_301:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_301.bin"
Model_302:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_302.bin"
Model_303:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_303.bin"
Model_304:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_304.bin"
Model_305:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_305.bin"
Model_306:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_306.bin"
Model_307:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_307.bin"
Model_308:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_308.bin"
Model_309:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_309.bin"
Model_310:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_310.bin"
Model_311:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_311.bin"
Model_312:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_312.bin"
Model_313:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_313.bin"
Model_314:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_314.bin"
Model_315:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_315.bin"
Model_316:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_316.bin"
Model_317:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_317.bin"
Model_318:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_318.bin"
Model_319:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_319.bin"
Model_320:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_320.bin"
Model_321:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_321.bin"
Model_322:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_322.bin"
Model_323:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_323.bin"
Model_324:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_324.bin"
Model_325:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_325.bin"
Model_326:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_326.bin"
Model_327:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_327.bin"
Model_328:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_328.bin"
Model_329:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_329.bin"
Model_330:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_330.bin"
Model_331:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_331.bin"
Model_332:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_332.bin"
Model_333:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_333.bin"
Model_334:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_334.bin"
Model_335:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_335.bin"
Model_336:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_336.bin"
Model_337:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_337.bin"
Model_338:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_338.bin"
Model_339:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_339.bin"
Model_340:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_340.bin"
Model_341:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_341.bin"
Model_342:
    #import_raw_data "soloModelBins/MvC2_DM0C_Model_342.bin"
STG_END:
    #data 0x00000000
    #align16