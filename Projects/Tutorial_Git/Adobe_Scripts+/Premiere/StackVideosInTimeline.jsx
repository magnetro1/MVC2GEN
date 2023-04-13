var viewIDs = app.getProjectViewIDs();
app.enableQE();
var QEseq = qe.project.getActiveSequence();

for (var i = 0; i < app.projects.numProjects; i++)
{
  var currentProject = app.getProjectFromViewID(viewIDs[i]);
  if (currentProject)
  {
    if (currentProject.documentID === app.project.documentID)
    {
      var selectedItems = app.getProjectViewSelection(viewIDs[i]);
      var activeSequence = app.project.activeSequence;
      for (var i = activeSequence.videoTracks.length; i < selectedItems.length; i++)
      {
        QEseq.addTracks(1, i)
      }
      // Set the starting track number to 1
      var currentTrack = 0;
      // Loop through the selected items
      for (var i = 0; i < selectedItems.length; i++)
      {
        // Insert the item into the active sequence
        var newClip = activeSequence.videoTracks[currentTrack].insertClip(selectedItems[i], activeSequence.getPlayerPosition());
        // Move to the next track
        currentTrack++;
      }
    }
  }
}