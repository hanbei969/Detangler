/************************************************************************
 * This class is the core of our visualization system. It manages both
 * the visualization through svg objects and communication with the
 * tulip python server. It displays 2 graphs, one corresponding to the
 * substrate graph and the other to the catalyst graph, and manages the
 * interactions between them. 
 * @requires d3.js, jQuery, graph.js, lasso.js
 * @authors Benjamin Renoust, Guy Melancon
 * @created May 2012
 ***********************************************************************/

// This class must be called like any function passing the well formated JSON object.
// originalJSON: a json object with an acceptable format
//
// We need to document the acceptable JSON format, and the communication protocol with
// tulip. This class also might be divided into classes, at least one should deal only
// with the communication, the other with the interaction, another for the overall
// interface...

import_class('context.js', 'TP');
import_class('objectReferences.js', 'TP');
import_class('View.js', 'TP');

var TulipPosy = function (originalJSON) {
    var objectReferences = TP.ObjectReferences();
    var contxt = TP.Context();


    //assert(new testView(5, 3), "test réusssie"); //test nombre view

	var target = 'toto';
	var target1 = 'tutu';
	var target2 = 'titi';
	objectReferences.InterfaceObject.createMenu(3);
    objectReferences.InterfaceObject.apiVisu("menu-3");
	
	var tabCatalyst = new Array();
	
    // list of buttons of the left menu
    var s1 = new Array(0,"induced subgraph",function(){objectReferences.ClientObject.sendSelection(objectReferences.ClientObject.getSelection(target), target)});
    var s2 = new Array(1,"force layout",function(){objectReferences.ClientObject.callLayout("FM^3 (OGDF)", target)});
    //var s3 = new Array(2,"circular layout",/*function(){objectReferences.ClientObject.callLayout("Circular", target)});
    var s3 = new Array(2,"delete selection",function(){objectReferences.InteractionObject.delSelection(target)});
    //var s4 = new Array(3,"random layout",function(){objectReferences.ClientObject.callLayout("Random", target)});
    var s5 = new Array(4,"reset view",function(){objectReferences.VisualizationObject.resetView(target)});
    //var s6 = new Array(5,"degree metric",function(){objectReferences.ClientObject.callLayout("LinLog Layout (Noack)",target)});
    var s7 = new Array(6,"btw. centrality",function(){objectReferences.ClientObject.callFloatAlgorithm("Betweenness Centrality",target)});
    var s8 = new Array(7,"analyse",function(){objectReferences.ClientObject.analyseGraph(target, tabCatalyst)});
    var s9 = new Array(8,"reset size",function(){objectReferences.VisualizationObject.resetSize(target)});
    var s10 = new Array(9,"hide labels",function(){objectReferences.VisualizationObject.showhideLabels(target)});
    var s11 = new Array(10,"hide links",function(){objectReferences.VisualizationObject.showhideLinks(target)});
    var s12 = new Array(11,"node information",function(){objectReferences.InterfaceObject.attachInfoBox(target)});
    var s13 = new Array(12,"sync layouts",function(){objectReferences.ClientObject.syncLayouts()});
    var s14 = new Array(13,"arrange labels",function(){objectReferences.VisualizationObject.arrangeLabels(target)});
    //var s15 = new Array(14,"labels foward",function(){objectReferences.VisualizationObject.bringLabelsForward(target);});
    var s16 = new Array(15,"rotation",function(){objectReferences.VisualizationObject.rotateGraph(target);});
    var s17 = new Array(16,"BarChart",function(){objectReferences.VisualizationObject.drawBarChart(target, "base");});
    var s18 = new Array(17,"BarChart_rotate",function(){objectReferences.VisualizationObject.drawBarChart(target, "rotate");});
    var s19 = new Array(18,"ScatterPlot",function(){objectReferences.VisualizationObject.drawScatterPlot(target);});
    
    var subarray = new Array(s1, s2, s3, s5, s7, s8, s9, s10, s11, s12, s13, s14, s16, s17, s18, s19);
    

    TP.Context().view[target] = new TP.View(subarray, new Array("svg", "graph", 960, 500, "svg_"+target), target, "#a0522d", "#808080", "#FFFFFF", "rect", "substrate", null);
    TP.Context().view[target].addView();
    TP.Context().view[target].buildLinks();

    var ca1 = new Array(0,"force layout",function(){objectReferences.ClientObject.callLayout("FM^3 (OGDF)"/*"LinLog"*/,target1)});
    var ca2 = new Array(1,"update layout",function(){objectReferences.ClientObject.updateLayout(target1)});

    //var ca3 = new Array(2,"random layout",function(){objectReferences.ClientObject.callLayout("Random",target1)});
    //var ca4 = new Array(3,"reset view",function () {objectReferences.VisualizationObject.resetView(target1)});
    //var ca5 = new Array(4, "degree metric", function () {objectReferences.ClientObject.callLayout("FM^3 (OGDF)", target1)});
    //var ca6 = new Array(5, "btw. centrality", function () {objectReferences.ClientObject.callFloatAlgorithm("Betweenness Centrality", target1)});
    var ca7 = new Array(6, "reset size", function () {objectReferences.VisualizationObject.resetSize(target1)});
    var ca8 = new Array(7, "hide labels", function () {objectReferences.VisualizationObject.showhideLabels(target1)});
    var ca9 = new Array(8, "hide links", function () {objectReferences.VisualizationObject.showhideLinks(target1)});
    var ca10 = new Array(9, "node information",function () {objectReferences.InterfaceObject.attachInfoBox(target1)});
    var ca11 = new Array(10, "operator " + TP.Context().tabOperator["catalyst"], function () {objectReferences.InteractionObject.toggleCatalystSyncOperator(target1)});
    var ca12 = new Array(11, "weight mapping",function () {objectReferences.VisualizationObject.sizeMapping("weight", target1)});
    var ca13 = new Array(12, "ent. mapping",function () {objectReferences.VisualizationObject.sizeMapping("entanglementIndice", target1)});
    var ca14 = new Array(13, "ent. color", function () {objectReferences.VisualizationObject.colorMapping("entanglementIndice", target1)});
    var ca15 = new Array(14, "computeMatrix", function () {objectReferences.VisualizationObject.buildEdgeMatrices(target1)});
    var ca16 = new Array(15, "arrange labels", function () {objectReferences.VisualizationObject.arrangeLabels(target1)}); 

    var catalystarray = new Array(ca1, ca2, ca7, ca8, ca9, ca10, ca11, ca12, ca13, ca14, ca15, ca16);

    //TP.Context().view[target1] = new TP.View(catalystarray, new Array("svg", "graph", 960, 500, "svg_"+target1), target1, "#4682b4", "#808080", "#FFFFFF", "circle", "catalyst", target);
	//TP.Context().view[target1].addView();
	//TP.Context().view[target1].buildLinks();
	tabCatalyst = new Array(catalystarray, new Array("svg", "graph", 960, 500, "svg_"+target1), target1, "#4682b4", "#808080", "#FFFFFF", "circle", "catalyst", target);
	
    var co1 = new Array(2, "fg " + TP.Context().combined_foreground, function () {objectReferences.InterfaceObject.toggleCombinedForeground(target2)});
    var co2 = new Array(3, "arrange labels", function () {objectReferences.VisualizationObject.arrangeLabels(target2)});

    var combinedarray = new Array(co1, co2);
/*
    TP.Context().view[target2] = new TP.View(combinedarray, new Array("svg", "graph", 960, 500, "svg_"+target2), target2, "#121212", "#808080", "#FFFFFF", "rect", "combined", [target, target1]);
	TP.Context().view[target2].addView();
	TP.Context().view[target2].buildLinks();*/
	
	assert(true, "tabType");
	console.log(TP.Context().tabType);
	//assert(true, "tabAssociation");
	//console.log(TP.Context().tabAssociation);
	/*
	assert(true, "tabAssociation de "+target);
	console.log(TP.Context().tabAssociation[target]);
	assert(true, "tabAssociation de "+target1);
	console.log(TP.Context().tabAssociation[target1]);
	assert(true, "tabAssociation de "+target2);
	console.log(TP.Context().tabAssociation[target2]);	
	
	assert(true, "tabAssociationInverted de "+target);
	console.log(TP.Context().tabAssociationInverted[target]);
	assert(true, "tabAssociationInverted de "+target1);
	console.log(TP.Context().tabAssociationInverted[target1]);	
	assert(true, "tabAssociationInverted de "+target2);
	console.log(TP.Context().tabAssociationInverted[target2]);*/	
	

    $('#undo').click(function(){TP.Context().changeStack.undo();});
    $('#redo').click(function(){TP.Context().changeStack.redo();});     

    var wrap = $('#wrap')[0];

    // Variables
    var objMain = $('#wrap');

    // Show sidebar
    function showSidebar(menuNum){
        objMain[0].className="sidebar-"+menuNum;
        $('#menu-'+menuNum)[0].style.cssText='z-index:101;'; 
    }

    // Hide sidebar
    function hideSidebar(menuNum){
        objMain[0].className="nosidebar";
        $('#menu-'+menuNum)[0].style.cssText='left:-231; z-index:0;'; 
    }

    $('span.toggleButton').click(function(e){
        var menu = event.srcElement.parentNode;
        var menuNum = menu.id.split('-')[1];
        if(menu.parentNode.className==='nosidebar'){
            showSidebar(menuNum);
        } else {hideSidebar(menuNum)}
    });


     $("#zonetoto").parent().appendTo("#container")
     $("#zonetutu").parent().appendTo("#container")
     $("#zonetiti").parent().appendTo("#container")
     


    // This is the tricky part, because the json given to the function can be of many shapes.
    // If it is a query, we call tulip to perform the search
    // if it is a given file we load it normally
    // other wise we load the default function

       //objectReferences.InterfaceObject.toggleSelectMove('substrate');
       //objectReferences.InterfaceObject.toggleSelectMove('catalyst'); 
	
    if (originalJSON != null && originalJSON != "") {
        console.log('originalJSON not null', originalJSON)
        if ('query' in originalJSON) {
            console.log('query is in json', originalJSON)
            var recievedGraph = objectReferences.ClientObject.callSearchQuery(originalJSON)
            objectReferences.ClientObject.loadData(recievedGraph, target);
        } else if ('file' in originalJSON) {
            objectReferences.ClientObject.loadData(originalJSON.file, target);
        } else objectReferences.ClientObject.loadData(null, target);
    }

};