var result = [];
 result[0] = [177,178,179,180,181,182,183,184,186,186,188,189,190,190,192,192,195,195,196,198,198,199,201,200,201,204,203,204,205,207,207,208,209,210,212,212,213,214,215,216,217,218,219,220,221,222,223,224,225,226,227,228,229,230,231,232,233,234,235,236,238,238,239,241,241,242,243,244,245,246,247,248,249,250,251,252,253,254,255,256,257,258,259,260,261,262,263,264,265,266,267,268,270,271,272,272,273,274,275,276,277,278,279,280,281,282,283,284,285,286,287,288,289,290,291,292,293,294,295,296,297,298,299,300,301,302,303,304,305,306,307,308,309,310,311,312,315,314,316,316,317,318,319,320,321,322,323,324,325,326,327,328,329,331,332,332,335,334,335,338,337,338,340,340,343,342,343,345,345,346,347,348,350,350,351,352,353,354,355,356,358,358,359,360,361,362,363,364,365,366,367,368,369,370,372,372,373,374,375,376,377,378,379,380,381,382,383,384,386,386,387,388,389,390,391,392,393,394,395,396,397,398,399,400,401,402,404,404,405,406,407,408,409,410,411,412,413,414,415,416,417,418,419,420,421,422,423,424,425,426,427,428,430,430,432,432,433,434,435,436,437,438,439,440,441,442,443,444,445,446,448,448,449,450,451,452,453,454,455,456,457,458,459,460,461,462,463,464,465,466,467,468,469,470,472,472,474,475,475,478,477,478,481,480,481,484,483,484,485,486,487,488,489,490,491,492,493,494,495,496,497,498,499,500,501,502,503,505,505,506,507,508,509,510,511,512,513,514,515,516,518,518,519,520,521,522,523,524,525,526,527,528,529,530,531,532,533,534,535,536,537,538,539,540,541,542,543,544,545,547,547,548,549,550,551,552,553,554,555,556,557,558,560,560,561,562,563,564,565,566,567,568,569,570,571,572,573,574,575,577,577,578,579,580,581,582,583,584,585,586,587,588,589,590,591,592,593,594,595,596,597,598,599,600,601,602,603,604,605,606,607,609,609,610,611,612,615,614,615,618,617,618,621,620,621,624,623,624,626,626,628,628,629,630,631,632,633,635,635,636,637,638,639,641,641,642,643,644,645,646,647,648,649,650,651,652,654,654,655,656,657,658,659,660,661,662,663,665,665,667,667,668,669,670,671,672,673,674,675,676,677,678,679,680,681,683,683,684,685,686,687,689,689,690,691,692,693,694,695,696,697,698,699,700,701,702,703,704,705,706,707,708,709,710,711,712,713,714,715,717,717,718,719,720,721,722,723,724,725,726,727,728,729,730,731,732,733,734,735,736,737,738,740,740,741,742,743,744,745,746,747,748,749,750,751,752,753,754,756,756,759,758,759,762,761,762,764,764,766,766,767,768,769,770,771,772,773,774,775,776,777,778,779,780,782,782,783,784,785,786,787,788,789,790,791,792,793,794,795,796,797,798,799,801,801,802,803,804,805,806,807,808,809,810,811,813,813,814,815,816,817,818,819,820,821,822,823,824,825,826,827,828,829,830,831,832,833,834,835,836,837,838,839,841,841,842,843,844,845,846,847,848,849,850,851,852,853,855,856,856,857,858,860,860,861,862,863,864,865,866,867,868,869,870,871,872,873,874,875,876,877,878,879,880,881,882,883,884,885,886,887,888,889,890,891,892,893,894,895,896,898,898,901,901,901,903,903,905,905,906,909,908,909,910,911,912,913,914,915,917,917,919,919,920,921,922,923,924,925,926,927,928,929,930,931,932,933,934,935,936,937,938,939,940,941,942,943,944,945,946,947,948,949,950,951,952,953,954,955,956,957,958,959,960,961,963,963,964,965,966,968,969,969,970,971,972,973,974,975,976,977,978,979,980,981,982,983,984,985,986,987,988,989,990,991,992,993,994,995,996,997,998,999,1000,1001,1002,1003,1004,1005,1006,1007,1008,1009,1010,1011,1012,1013,1014,1015,1016,1018,1018,1019,1020,1022,1022,1023,1024,1025,1026,1027,1028,1029,1030,1031,1032,1033,1034,1035,1036,1037,1039,1039,1041,1041,1043,1043,1045,1045,1046,1048,1048,1049,1050,1051,1052,1053,1054,1055,1056,1057,1058,1060,1061,1061,1062,1063,1064,1065,1066,1067,1068,1069,1070,1071,1072,1074,1074,1075,1076,1077,1078,1079,1080,1082,1082,1083,1084,1085,1087,1087,1088,1089,1090,1091,1093,1093,1094,1095,1096,1097,1098,1099,1100,1101,1102,1103,1104,1105,1106,1107,1108,1109,1110,1111,1112,1113,1114,1115,1116,1117,1118,1119,1120,1122,1122,1124,1124,1125,1126,1127,1128,1129,1130,1131,1132,1134,1135,1135,1136,1137,1138,1139,1140,1141,1142,1143,1144,1145,1146,1147,1148,1149,1150,1151,1153,1153,1154,1155,1156,1157,1158,1159,1160,1161,1162,1163,1164,1165,1166,1167,1168,1169,1170,1171,1172,1173,1174,1175,1176,1178,1178,1181,1180,1181,1184,1184,1184,1187,1186,1187,1190,1190,1190,1192,1192,1193,1195,1195,1196,1197,1198,1199,1200,1201,1202,1203,1204,1205,1206,1207,1208,1209,1210,1212,1212,1213,1214,1215,1216,1217,1218,1219,1220,1221,1222,1223,1224,1225,1226,1227,1228,1229,1230,1231,1232,1233,1234,1235,1236,1237,1238,1239,1240,1241,1242,1243,1244,1245,1246,1247,1248,1249,1250,1251,1252,1254,1254,1255,1256,1257,1258,1259,1260,1261,1262,1263,1264,1265,1266,1267,1268,1269,1270,1272,1272,1273,1274,1275,1276,1277,1278,1279,1280,1281,1282,1283,1284,1285,1286,1287,1288,1289,1290,1291,1292,1294,1295,1295,1296,1297,1298,1299,1301,1301,1303,1304,1304,1306,1306,1308,1308,1309,1310,1312,1312,1314,1315,1316,1316,1318,1318,1319,1320,1321,1322,1323,1324,1325,1326,1328,1328,1330,1331,1331,1332,1333,1334,1335,1336,1337,1338,1339,1340,1342,1343,1344,1345,1345,1346,1347,1348,1349,1350,1351,1352,1353,1354,1355,1357,1358,1358,1360,1360,1361,1362,1363,1364,1365,1366,1367,1369,1370,1370,1371,1372,1374,1374,1375,1376,1377,1378,1379,1380,1381,1382,1383,1384,1386,1386,1388,1388,1389,1390,1391,1392,1393,1394,1396,1396,1397,1398,1399,1401,1401,1402,1404,1405,1407,1407,1407,1410,1409,1411,1413,1412,1415,1415,1416,1417,1418,1419,1419,1421,1421,1423,1424,1425,1426,1426,1428,1428,1429,1430,1431,1432,1433,1434,1436,1437,1438,1438,1439,1441,1442,1442,1443,1444,1445,1446,1447,1448,1450,1451,1452,1453,1454,1455,1455,1456,1457,1458,1459,1460,1461,1462,1464,1465,1466,1467,1468,1468,1469,1471,1472,1472,1474,1475,1476,1477,1478,1478,1480,1481,1482,1483,1484,1484,1485,1486,1488,1488,1489,1490,1491,1493,1494,1495,1496,1497,1497,1499,1499,1501,1502,1503,1504,1505,1506,1507,1508,1508,1510,1511,1512,1513,1514,1515,1515,1516,1517,1519,1520,1520,1521,1523,1523,1525,1525,1526,1528,1528,1529,1530,1531,1533,1534,1535,1536,1537,1538,1539,1539,1540,1541,1542,1543,1544,1546,1546,1548,1549,1550,1550,1552,1553,1553,1555,1555,1557,1557,1559,1559,1561,1562,1563,1564,1565,1565,1567,1568,1569,1569,1570,1571,1572,1574,1574,1576,1577,1579,1579,1581,1580,1583,1582,1585,1585,1585,1586,1587,1588,1589,1590,1592,1593,1593,1595,1595,1597,1598,1598,1599,1600,1601,1602,1603,1605,1605,1607,1608,1609,1610,1611,1612,1612,1613,1614,1615,1617,1617,1620,1620,1621,1622,1623,1624,1625,1625,1627,1628,1629,1629,1630,1631,1632,1634,1634,1636,1637,1638,1639,1640,1641,1641,1642,1643,1644,1645,1646,1647,1649,1650,1651,1652,1653,1653,1655,1655,1657,1657,1658,1659,1660,1661,1663,1664,1665,1666,1667,1668,1668,1670,1670,1672,1672,1673,1674,1675,1677,1678,1679,1679,1681,1682,1683,1684,1685,1686,1686,1688,1689,1690,1691,1692,1693,1694,1694,1696,1697,1698,1699,1700,1701,1702,1702,1704,1704,1705,1706,1707,1708];