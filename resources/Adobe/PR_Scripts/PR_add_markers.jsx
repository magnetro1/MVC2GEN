//#target premierepro;
// app.enableQE();
// $.level = 0;
// $.writeln();
// var methodRef = app.project.activeSequence.reflect.methods;

// void function ()
// {
//   UndoPR = {
//     _groups: [],
//     _currentIndex: null,
//     _currentProjPath: null,
//     _currentQEProj: null,
//     _tempBin: null
//   };
//   var self = UndoPR;
//   self.start = function ()
//   {
//     var tempBinName = "PRFXUNDO_" + +new Date();
//     self._tempBin = app.project.rootItem.createBin(tempBinName);
//     qe.project.undo();
//     qe.project.init();
//     self._currentQEProj = qe.project;
//     self._currentProjPath = app.project.path;
//     self._currentIndex = qe.project.undoStackIndex();
//   };
//   self.end = function ()
//   {
//     if (self._currentIndex === null)
//     {
//       return false;
//     }

//     if (app.project.path != self._currentProjPath)
//     {
//       self._currentIndex = null;
//       self._tempBin.deleteBin();
//       return false;
//     }
//     var endIndex = self._currentQEProj.undoStackIndex();
//     self._groups.push([self._currentIndex, endIndex, self._currentProjPath]);
//     if (self._groups.length > 32)
//     {
//       self._groups = self._groups.slice(-32);
//     }
//     self._tempBin.deleteBin();
//     self._currentIndex = null;
//     self._currentQEProj = null;
//   };
//   self.onProjectChanged = function (projectId)
//   {
//     // alert("here");
//     if (self._currentIndex !== null)
//     {
//       return;
//     }
//     self._currentIndex = -1;
//     var projectPath = app.project.path;
//     var failSafeCounter = 0;
//     var stackIndex = qe.project.undoStackIndex();

//     for (var i = 0; i < self._groups.length; i += 1)
//     {
//       var group = self._groups[i];
//       if (stackIndex >= group[0] && stackIndex <= group[1] && group[2] == projectPath)
//       {
//         if ((stackIndex - group[0]) < (group[1] - stackIndex))
//         {
//           while (qe.project.undoStackIndex() <= group[1])
//           {
//             qe.project.redo();
//             if (++failSafeCounter > 32)
//             {
//               break;
//             }
//           }
//         } else
//         {
//           while (qe.project.undoStackIndex() >= group[0])
//           {
//             qe.project.undo();
//             if (++failSafeCounter > 32)
//             {
//               break;
//             }
//           }
//         }
//       }
//       if (failSafeCounter > 32)
//       {
//         break;
//       }

//       if (failSafeCounter > 32)
//       {
//         break;
//       }
//     }
//     if (failSafeCounter > 32)
//     {
//       self._groups = [];
//       self._currentIndex = null;
//       return false;
//     }
//     self._currentIndex = null;
//   };
// }();
// UndoPR.start();

// app.bind("onProjectChanged", UndoPR.onProjectChanged);
// UndoPR.end();

var activeSequence = app.project.activeSequence;
var activeSequenceName = activeSequence.name;
var allSequences = app.project.sequences;

// find active sequence's index value inside of allSequences
// because indexOf() doesn't work in ExtendScript
getActiveSequenceIndexFn = function ()
{
  for (var sequencesIdx = 0; sequencesIdx < allSequences.length; sequencesIdx++)
  {
    if (allSequences[sequencesIdx].name == activeSequenceName)
    {
      return parseInt(sequencesIdx);
    }
  }
};
// add markers to active sequence
for (var markerIdx = 0; markerIdx <= 600; markerIdx += 60)
{
  app.project.sequences[0].markers.createMarker(markerIdx);
};
