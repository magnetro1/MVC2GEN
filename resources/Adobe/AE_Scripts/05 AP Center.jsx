app.project.activeItem.selectedLayers[0].property("ADBE Transform Group").property("ADBE Anchor Point").expression = "var a = thisLayer;" + "\n" + 
				"var txtWidth = a.sourceRectAtTime().width;" + "\n" + 
				"var left = a.sourceRectAtTime().left;" + "\n" + 
				"var txtHeight = a.sourceRectAtTime().height;" + "\n" + 
				"var top = a.sourceRectAtTime().top;" + "\n" + 
				"[left+txtWidth/2,txtHeight/2+top]";