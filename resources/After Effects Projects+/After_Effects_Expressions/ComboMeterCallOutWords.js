/*
3:	Yes
4-5:	Good
6-7:	Great
8-9:	Very Good
10-29:	Wonderful
30-49:	Fantastic
50-99:	Monster
100+:	Marvelous
*/
s = thisComp.layer("P1_Combo Meter Value").text.sourceText
if (s <= 2) {""}
else if (s == 03) {style.setFauxItalic(1).setAllCaps(1).setFauxBold(1).setText("Yes")}
else if (s == 04 || s == 5) {style.setFauxItalic(1).setAllCaps(1).setFauxBold(1).setText("Good")}
else if (s == 06 || s == 7) {style.setFauxItalic(1).setAllCaps(1).setFauxBold(1).setText("Great")}
else if (s == 08 || s == 9) {style.setFauxItalic(1).setAllCaps(1).setFauxBold(1).setText("Very Good")}
else if (s >= 10 && s <= 30) {style.setFauxItalic(1).setAllCaps(1).setFauxBold(1).setText("Wonderful")}
else if (s >= 30 && s <= 49) {style.setFauxItalic(1).setAllCaps(1).setFauxBold(1).setText("Fantastic")}
else if (s >= 50 && s <= 99) {style.setFauxItalic(1).setAllCaps(1).setFauxBold(1).setText("Monster")}
else if (s >= 100) {style.setFauxItalic(1).setAllCaps(1).setFauxBold(1).setText("Marvelous")}
else {""}