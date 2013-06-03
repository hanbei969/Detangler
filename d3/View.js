/************************************************************************
 * This module implements the concept of "View". It associates the svg
 * graphs with their corresponding html elements.
 * @authors Fabien Gelibert, Anne Laure Mesure, Guillaume Guerin
 * @created March 2013
 ***********************************************************************/

(function () {

import_class('context.js', 'TP');
import_class("objectReferences.js", "TP");
import_class('stateSelect.js','TP');

var View = function (bouton, svgs, target, nodesC, linksC, bgC, view_nodes, type, association) {

	//assert(bouton != null && svgs != null && target != null && application != null, "parametres ok!");
    var __g__ = this;


    var tabDataSvg = svgs;
    
    //TP.Context().view[target] = __g__;
    
    var controller = null;
    var svg = null;
    var nodesColor = nodesC;
    var linksColor = linksC;
    var bgColor = bgC;
    var viewNodes = null;
    var lasso = null;
    var DataTranslation = null;
    
	var selectMode = null;
	var moveMode = null;
	var showLabels = null;
	var showLinks = null;
	var nodeInformation = null; 
    
    var metric_BC = null;
    var metric_SP = null;
    
    var typeView = type;
    
    
    this.getType = function()
    {
    	return typeView;
    }
            
    
    this.getDataTranslation = function(){    	
    	return DataTranslation;    	
    }
    
    this.setDataTranslation = function(value){    	
    	DataTranslation = value;    	
    }
    
    
    this.setMetric_BC = function(value){    	
    	metric_BC = value;    	
    }
    
    this.getMetric_BC = function(){    	
    	return metric_BC;    	
    }
    
    this.setMetric_SP = function(value){    	
    	metric_SP = value;    	
    }
    
    this.getMetric_SP = function(){    	
    	return metric_SP;    	
    }
    
    this.setLasso = function(value){	
		lasso = value;    	
    }
    
    this.getLasso = function(value){    	
    	return lasso;    	
    }
    
    this.getController = function(){    	
    	return controller;    	
    }

	this.getSvg = function(){		
		return svg;		
	}
	
	this.getNodesColor = function(){		
		return nodesColor;		
	}

	this.getLinksColor = function(){		
		return linksColor;		
	}
	
	this.getBgColor = function(){		
		return bgColor;		
	}
	
	this.getViewNodes = function(){		
		return viewNodes;		
	}
	
	this.getSelectMode = function(){		
		return selectMode;		
	}
	
	this.setSelectMode = function(value){		
		selectMode = value;		
	}
	
	this.getMoveMode = function(){		
		return moveMode;		
	}
	
	this.setMoveMode = function(value){		
		moveMode = value;		
	}
	
	this.getShowLabels = function(){		
		return showLabels;		
	}
	
	this.setShowLabels = function(value){		
		showLabels = value;		
	}
	
	
	this.getShowLinks = function(){		
		return showLinks;		
	}
	
	this.setShowLinks = function(value){		
		showLinks = value;		
	}	
	
	this.getNodeInformation = function(){		
		return nodeInformation;		
	}
	
	this.setNodeInformation= function(value){		
		nodeInformation = value;		
	}		

	this.addView = function() {
		
	    elem = document.getElementById("bouton" + target);
	    if (elem) elem.parentNode.removeChild(elem);
	    elem = $("div[aria-describedby='zone" + target + "']");
	     console.log(elem)
	    if (elem!=[])elem.remove();
	
	    
	    console.log($("div[aria-describedby='zone"+target+"']"))
	    //console.log($("div[aria-describedby='zoneBarChart_substrate']"))
	   
	    //if (elem!=[])elem.remove();
	
		//$("#container").empty();
	
	    /**************************
	     * Application
	     **************************/
	    controller = Em.Application.create();
	
	    /**************************
	     * Models
	     **************************/
	
	    controller.Boutton = Em.Object.extend({
	        idButton: '',
	        fonction: ''
	    });
	
	
	    /**************************
	     * Controllers
	     **************************/
	
	    controller.testArrayController = Em.ArrayController.create({
	        content: [],
	
	        loadFunction: function (propName, value) {
	            var obj = this.findProperty(propName, value);
	            obj.fonction();
	        },
	
	        addFunction: function (object) {
	            var obj = this.findProperty("idButton", object.idButton);
	            if (obj == null) {
	                this.pushObject(object);
	                //console.log("ajout bouton");
	            }
	        }
	    });
	
	
	    /**************************
	     * Views
	     **************************/
	
	    TP.Context().activeView = target;
	    //console.log('-->'+target);
	
	    if(target==="substrate")    { TP.Context().dialogTop=0;  TP.Context().dialogRight=600; }
	    else if(target==="catalyst"){ TP.Context().dialogTop=0;  TP.Context().dialogRight=100; }
	    else                        { TP.Context().dialogTop=235; TP.Context().dialogRight=260; }
	
	
	    /****  création du dialog ****/
	    //document.getElementById("container").innerHTML += "<div id='zone" + target + "' title='" + target + "' ></div>";
	
	     $("<div/>", {id: "zone"+target, title: target}).appendTo("#container");
	
	    var dialog = $("[id=zone" + target + "]");
	    //console.log(dialog);
	
	    dialog.dialog({
	        height: TP.Context().dialogHeight,
	        width: TP.Context().dialogWidth,
	        minWidth:185,
	        position: "right-"+ TP.Context().dialogRight + " top+" + TP.Context().dialogTop ,/*{my: "center", at: "center", of: "#container"}*/
	    }).parent().resizable({
	        containment: "#container"
	    }).draggable({
	        containment: "#container",
	        opacity: 0.70
	    });
	
	    /****   en-tête du dialog   ****/
	
	    var titlebar = dialog.parents('.ui-dialog').find('.ui-dialog-titlebar');
	    $("<button/>", {text:"-"}).appendTo(titlebar).button().click(function() {dialog.toggle();});        
	    $("<button/>", {id: "toggle"+target, text:"Move"}).appendTo(titlebar); 
	
	    $('#toggle' + target).button().click (function(event){
	        var interact = $(this).button("option","label");
	        if (interact=="Move")   { $(this).button("option", "label", "Select");}
	        else                    { $(this).button("option", "label", "Move");}
	        TP.Context().stateStack[target].executeCurrentState();
	    });
		        
	    dialog.parent().click(function(){ 
	        TP.Context().activeView = target;
	        console.log(TP.Context().activeView);
	        var num = 0;
	        $(".arrayButtons").remove();
	
	        var pane = d3.select('#menu-1').append("div")
	            .attr("id", "button" + target)
	            .attr('class','arrayButtons');
	
	        while (num < bouton.length) {
	            var i = num;
	            var j = 0 + i;
	            var bout = TP.Context().view[target].getController().Boutton.create({
	                idButton: bouton[i][0],
	                fonction: bouton[i][2]
	            });
	            TP.Context().view[target].getController().testArrayController.addFunction(bout);
	            (function (i) {
	
	                var paneB = pane.append("div");
	                paneB.append("input")
	                    .attr("type", "button")
	                    .attr("class", "button")
	                    .attr("value", bouton[i][1])
	                    .on("click", function () {
	                    TP.Context().view[target].getController().testArrayController.loadFunction("idButton", bouton[i][0]);
	                });
	            })(i);
	            num++;
	        }
	 		
	 		//var colorNode = TP.Context().tabNodeColor[target];
	 		//var colorLink = TP.Context().tabLinkColor[target];
	 		//var colorBg = TP.Context().tabBgColor[target];
	 		//console.log(colorNode);
	 		//console.log(colorLink);
	 		//console.log(colorBg);       
	        
	        $.jPicker.List[0].color.active.val('hex', nodesColor);
	        $.jPicker.List[1].color.active.val('hex', linksColor);
	        $.jPicker.List[2].color.active.val('hex', bgColor);
			
	        var cGraph = TP.Context().getViewGraph(target);
	        TP.ObjectReferences().Interface().addInfoButton(target);
	    });
	
	    titlebar.dblclick(function() {
	        if(target==="substrate")    { TP.Context().dialogTop=26;  TP.Context().dialogRight=600; }
	        else if(target==="catalyst"){ TP.Context().dialogTop=26;  TP.Context().dialogRight=100; }
	        else                        { TP.Context().dialogTop=240; TP.Context().dialogRight=260; }
	
	        var fullheight = $('#container').height()-10;
	        var fullwidth = $('#container').width()-10;
	        console.log(dialog.parent().width() + " - " + fullwidth);
	        console.log(dialog.parent());
	        if(dialog.parent().width()!=fullwidth){
	            console.log(1);
	            dialog.dialog({
	                width:fullwidth, 
	                height:fullheight,
	                position: ["left+"+15, "top+"+27] ,
	            });
	        }
	        else{
	            console.log(2);
	            dialog.dialog({
	                width:TP.Context().dialogWidth, 
	                height:TP.Context().dialogHeight,
	                position: "right-"+ TP.Context().dialogRight + " top+" + TP.Context().dialogTop ,
	            });
	        }
	        console.log(TP.Context().dialogTop);
	
	            //$(this).height()=fullheight;
	    });
	    
	   function add() {
	        if(target != null){
	           
	            if(view_nodes != null)
	            	viewNodes = view_nodes;
	            else
	            	viewNodes = "rect";
	            				
				DataTranslation = [0,0];            
	    	    //TP.Context().tabNodeColor[target] = nodesC;
		        //TP.Context().tabLinkColor[target] = linksC;
		        //TP.Context().tabBgColor[target] = bgC;
			    
		        selectMode = false;
		        moveMode = true;
		        showLabels = true;
		        showLinks = true;
		        nodeInformation = false;           
	           
	            TP.Interaction().createLasso(target);
	            TP.Interaction().addZoom(target);
	            if(target == "substrate"){
	           		//objectReferences.InteractionObject.addZoom(target);
	                TP.Interface().addEntanglementFeedback(target);
	           }
	            TP.Context().stateStack[target] = new TP.States();
	            TP.Context().stateStack[target].addState('select', new TP.stateSelect(target));
	            TP.Context().stateStack[target].executeCurrentState();             
	        }
	    }    
	    
	    if (tabDataSvg[0] == "svg" && tabDataSvg[1] == "graph") {
	
	            //TP.Context().tabSvg["svg_"+target] = d3.select("#zone" + target)            
	            svg = d3.select("#zone" + target)
	                .append("svg")
	                .attr("width", "100%")
	                .attr("height", "100%")
	                .attr("id", tabDataSvg[3]);
	                //.attr("viewBox", "0 0 500 600");
	                
	            TP.Context().tabGraph["graph_"+target] = new TP.Graph();
	
	            add();
	            
	            TP.Context().tabType[target] = typeView;
	            
	            if(typeView == "substrate"){
	            	TP.Context().tabAssociation[target] = new Array();
	            }
	            else{
	            	if(association != null)
	            		TP.Context().tabAssociation[association].push(target);           	
	            }
	            	
	     }
		
	     $("#zone"+target).parent().appendTo("#container")
     
	}
		

//utilisé pour test nombre View
	


    return __g__;

}
return {View: View};
})()
