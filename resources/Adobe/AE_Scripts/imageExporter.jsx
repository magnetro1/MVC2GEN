/* eslint-disable */
var list = ["", "Akuma", "Amingo", "Anakaris", "BB Hood", "Blackheart", "Cable", "Cammy", "Captain America", "Captain Commando", "Charlie", "Chun-Li", "Colossus", "Cyclops", "Dan", "Dhalsim", "Doctor Doom", "Felicia", "Gambit", "Guile", "Hayato", "Hulk", "Iceman", "Iron Man", "Jill", "Jin", "Juggernaut", "Ken", "M Bison", "Magneto", "Marrow", "Megaman", "Morrigan", "Omega Red", "Psylocke", "Rogue", "Roll", "Ruby Heart", "Ryu", "Sabretooth", "Sakura", "Sentinel", "Servbot", "Shuma-Gorath", "Silver Samurai", "Sonson", "Spider-Man", "Spiral", "Storm", "Strider", "Thanos", "Tron Bonne", "Venom", "War Machine", "Wolverine", "WolverineA", "Zangief"];

for (m = 1; m < app.project.numItems; m++) {
  if ((app.project.item(m) instanceof CompItem) && (app.project.item(m).name == "Characters")) // finds the right composition
  {
    var myComp = app.project.item(m);
    for (i = 1; i < 57; i++) {
      myComp.openInViewer();
      myComp.layer("Controller").property("Effects").property("charList").property("Menu").setValue([i]);
      var RQItem = app.project.renderQueue.items.add(myComp);
      var outputModule = RQItem.outputModule(1);
      outputModule.file = File("G:\\" + list[i]);
      outputModule.applyTemplate("PNG");
      app.project.renderQueue.render();
      var outputWriter = File("G:\\" + list[i] + "_00000.png");
      outputWriter.rename(list[i] + ".png");
      myComp.openInViewer();
    }
  }
  break;
}
