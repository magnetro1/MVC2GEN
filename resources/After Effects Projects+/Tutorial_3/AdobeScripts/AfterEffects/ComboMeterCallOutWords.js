/*
03:     Yes
04-05:  Good
06-07:  Great
08-09:  Very Good
10-29:  Wonderful
30-49:  Fantastic
50-99:  Monster
100+:   Marvelous
*/
comboResult = thisComp.layer("P1_Combo Meter Value").text.sourceText
if (comboResult <= 02) {""}
else if (comboResult == 03) {style.setFauxItalic(1).setAllCaps(1).setFauxBold(1).setText("Yes")}
else if (comboResult == 04 || comboResult == 05) {style.setFauxItalic(1).setAllCaps(1).setFauxBold(1).setText("Good")}
else if (comboResult == 06 || comboResult == 07) {style.setFauxItalic(1).setAllCaps(1).setFauxBold(1).setText("Great")}
else if (comboResult == 08 || comboResult == 09) {style.setFauxItalic(1).setAllCaps(1).setFauxBold(1).setText("Very Good")}
else if (comboResult >= 10 && comboResult <= 30) {style.setFauxItalic(1).setAllCaps(1).setFauxBold(1).setText("Wonderful")}
else if (comboResult >= 30 && comboResult <= 49) {style.setFauxItalic(1).setAllCaps(1).setFauxBold(1).setText("Fantastic")}
else if (comboResult >= 50 && comboResult <= 99) {style.setFauxItalic(1).setAllCaps(1).setFauxBold(1).setText("Monster")}
else if (comboResult >= 100) {style.setFauxItalic(1).setAllCaps(1).setFauxBold(1).setText("Marvelous")}
else {""}