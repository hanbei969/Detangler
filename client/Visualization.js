/************************************************************************
 * This module manipulates the svg representation of the graphs
 * (e.g it can rearrange layouts, hide labels ...)
 * @authors Benjamin Renoust, Guy Melancon
 * @created May 2012
 ***********************************************************************/

var TP = TP || {};
(function () {

    var Visualization = function () {
        var __g__ = this;
        var contxt = TP.Context();
        var objectReferences = TP.ObjectReferences();


        this.showhideLinks = function (_event) {

            var target = _event.associatedData.source;

            if (!target) return;

            var svg = null;
            svg = TP.Context().view[target].getSvg();

            TP.Context().view[target].setShowLinks(!TP.Context().view[target].getShowLinks());

            if (TP.Context().view[target].getShowLinks()) {
                var sel=svg.selectAll('g.link').attr("visibility", "visible");
                if(sel.data().length == 0)
                {
                    //graph_drawing.move(TP.Context().view[target].getGraph(), 0)
                    TP.Context().view[target].getGraphDrawing().clear();
                    TP.Context().view[target].getGraphDrawing().draw(true);
                }
                $('li.form > a').each(function () {
                    if ($(this).text() === 'Show links') {
                        $(this).text('Hide links');
                    }
                });
            } else {
                $('li.form > a').each(function () {
                    if ($(this).text() === 'Hide links') {
                        $(this).text('Show links');
                    }
                });
                var sel = svg.selectAll('g.link').attr("visibility", "hidden");


            }

        };

        // This function updates the entanglement values displayed in the 
        //entanglement frame of the substrate view
        // The entanglement intensity drives the color of the frame 
        //following a Brewer's scale (www.colorbrewer2.org).
        this.entanglementCaught = function (CurrentViewID, nothing, multiplex_property) {

            //console.log("entering 'entanglement caught function'", nothing);
            // WARNING THIS EVENT IS CALLED TWICE?????
            if (multiplex_property == undefined)
                multiplex_property = ""

            $("#entanglement>p")[0].innerHTML = "ENTANGLEMENT ("+multiplex_property+")"

            var brewerSeq = ['#FEEDDE', '#FDD0A2', '#FDAE6B', '#FD8D3C', '#E6550D', '#A63603'];
            var zeroColor = d3.rgb("white");
            var oneColor = d3.rgb("purple");
            //var inter = ['#FFFF00','#00FF00','#0000FF']
            var inter = ['yellow','green','steelblue'];
            var currentIntensityColor = d3.rgb("white");
            var currentHomogeneityColor = d3.rgb("black");

            //var target_source = CurrentViewID;

            if (nothing == null) {
                
                //TP.Context().entanglement_intensity = TP.Context().entanglement_homogeneity;//1 - Math.acos(TP.Context().entanglement_intensity)/(Math.PI/2);
                //TP.Context().entanglement_homogeneity = 1 - Math.acos(TP.Context().entanglement_homogeneity)/(Math.PI/2);
                
                $('#homogeneity')[0].innerHTML = objectReferences.ToolObject.round(TP.Context().entanglement_homogeneity, TP.Context().digitPrecision);
                $('#intensity')[0].innerHTML = objectReferences.ToolObject.round(TP.Context().entanglement_intensity, TP.Context().digitPrecision);

                //var indexI = Math.round(TP.Context().entanglement_intensity * 5) % 6
                //var indexH = Math.round(TP.Context().entanglement_homogeneity * 5) % 6
                //$("#bg").css("background-color",brewerSeq[indexI]);
                //$("#entanglement-cont").css("border-color",brewerSeq[indexH]);


                if (TP.Context().entanglement_intensity < 1/3){ currentIntensityColor = inter[0];}
                else if (TP.Context().entanglement_intensity < 2/3){ currentIntensityColor = inter[1];}
                else { currentIntensityColor = inter[2];}

                currentIntensityColor = d3.hcl(currentIntensityColor);
                currentIntensityColor.l = 99 *(1- TP.Context().entanglement_intensity);
                //currentIntensityColor.r = Math.round(currentIntensityColor.r * (1-TP.Context().entanglement_intensity))
                //currentIntensityColor.g = Math.round(currentIntensityColor.g * (1-TP.Context().entanglement_intensity))
                //currentIntensityColor.b = Math.round(currentIntensityColor.b * (1-TP.Context().entanglement_intensity))


                if (TP.Context().entanglement_intensity == 0){ currentIntensityColor = zeroColor; }
                else if (TP.Context().entanglement_intensity == 1){ currentIntensityColor = oneColor;}
                else if (TP.Context().entanglement_homogeneity < 1/3){ currentHomogeneityColor = inter[0];}
                else if (TP.Context().entanglement_homogeneity < 2/3){ currentHomogeneityColor = inter[1];}
                else { currentHomogeneityColor = inter[2];}

                currentHomogeneityColor = d3.hcl(currentHomogeneityColor);
                currentHomogeneityColor.l = 99 * (1- TP.Context().entanglement_homogeneity);
                //currentHomogeneityColor.r = Math.round(currentHomogeneityColor.r * (1-TP.Context().entanglement_homogeneity))
                //currentHomogeneityColor.g = Math.round(currentHomogeneityColor.g * (1-TP.Context().entanglement_homogeneity))
                //currentHomogeneityColor.b = Math.round(currentHomogeneityColor.b * (1-TP.Context().entanglement_homogeneity))

                if (TP.Context().entanglement_homogeneity == 0){ currentHomogeneityColor = oneColor; }
                if (TP.Context().entanglement_homogeneity == 1){ currentHomogeneityColor = oneColor;}
                //$("#bg").css("background-color",d3.rgb(currentIntensityColor));
                if(TP.Context().currentEntanglementInner == "intensity")
                {
                    d3.selectAll('#bg').style("background-color",currentIntensityColor);
                    $("#bg").css("border-color",d3.rgb(currentHomogeneityColor));
                }else{
                    d3.selectAll('#bg').style("background-color",currentHomogeneityColor);
                    $("#bg").css("border-color",d3.rgb(currentIntensityColor));                    
                }
                                //$("#bg").css("opacity",1)
                //$("#entanglement-cont").css("opacity",.5);

            }
            else {
                
                
                TP.Context().entanglement_homogeneity = 0;
                TP.Context().entanglement_intensity = 0;

                $('#homogeneity')[0].innerHTML = objectReferences.ToolObject.round("0", 5);
                $('#intensity')[0].innerHTML = objectReferences.ToolObject.round("0", 5);

                $("#bg").css("background-color", "white");
                $("#bg").css("border-color","black");
                currentIntensityColor = "white";
                currentHomogeneityColor = "black";
            }
            
            /*TP.Context().svg_substrate.selectAll("rect.entanglementframe")

             .transition()
             .style('fill-opacity', .5)
             .style("fill", brewerSeq[index])*/
            //d3.selectAll("rect.view").style("fill", brewerSeq[indexI])
            //                         .style("stroke", brewerSeq[indexH]);
            //d3.selectAll("rect.brush").style("fill", brewerSeq[indexI])
            //                          .style("stroke", brewerSeq[indexH]);


    
            if(TP.Context().currentEntanglementInner == "intensity")
            {
                    d3.selectAll("rect.view").style("fill", currentIntensityColor)
                        .style("stroke", currentHomogeneityColor);
                    d3.selectAll("rect.brush").style("fill", currentIntensityColor)
                        .style("stroke", currentHomogeneityColor)*TP.Context();
            }
            else
            {
                d3.selectAll("rect.view").style("fill", currentHomogeneityColor)
                        .style("stroke", currentIntensityColor);
                    d3.selectAll("rect.brush").style("fill", currentHomogeneityColor)
                        .style("stroke", currentIntensityColor)*TP.Context();
            }

            //d3.selectAll("polygon.brush").style("fill", brewerSeq[index])

            //if (TP.Context().view[target_source].getLasso())
            //    TP.Context().view[target_source].getLasso().fillColor = brewerSeq[index]

            Object.keys(TP.Context().view).forEach(function(k)
            {
                //console.log("view: ",k, TP.Context().view[k].getType(), TP.Context().view[k].getType() in ["substrate", "catalyst"])

                if (TP.Context().view[k].getType() in {"substrate":0, "catalyst":0})
                {
                    if(TP.Context().currentEntanglementInner == "intensity")
                    {
                        //console.log("svg found: ", TP.Context().view[k].getSvg())
                        TP.Context().view[k].getSvg()
                            .selectAll(".lasso")
                                //.style('fill',brewerSeq[indexI])
                                //.style('stroke', brewerSeq[indexH]);
                                .style('fill', currentIntensityColor)
                                .style('stroke', currentHomogeneityColor);
                    }else{
                        TP.Context().view[k].getSvg()
                            .selectAll(".lasso")
                                .style('fill', currentHomogeneityColor)
                                .style('stroke', currentIntensityColor);
                        
                    }

                }
            });


        };
        /*
         this.buildEdgeMatrices = function (target) { //catalyst at bingin of project, whithout generic code
         var matrixData = [];
         nbNodes = TP.Context().view[target].getGraph().nodes().length;
         for (i = 0; i < nbNodes; i++) {
         matrixData[i] = [];
         for (j = 0; j < nbNodes; j++)
         matrixData[i][j] = [-1, 0.0];
         }

         var catalystToInd = {};
         TP.Context().view[target].getGraph().nodes().forEach(function (d, i) {
         catalystToInd[d.label] = i;
         matrixData[i][i] = [d.baseID, d.frequency];
         });
         TP.Context().view[target].getGraph().links().forEach(function (d) {
         var freq = JSON.parse(d.conditionalFrequency);
         i = catalystToInd[freq['order'][0]]
         j = catalystToInd[freq['order'][1]]
         matrixData[i][j] = [d.baseID, freq['values'][0]]
         matrixData[j][i] = [d.baseID, freq['values'][1]]
         });



         var overallSize = 200.0;
         var indSize = overallSize / nbNodes;
         overallSize = indSize * nbNodes + 1;



         function move() {

         //assert(true, "toto = titi")

         objectReferences.VisualizationObject.parentNode.appendChild(this);
         var dragTarget = d3.select(this);
         var currentPanel = dragTarget
         panelPos = currentPanel.attr("transform")
         .replace("translate(", "")
         .replace(")", "")
         .split(',');
         var posX = d3.event.dx
         var posY = d3.event.dy
         var newX = parseInt(panelPos[0]) + posX
         var newY = parseInt(panelPos[1]) + posY

         dragTarget.attr("transform", function (d) {
         d.panelPosX = newX;
         d.panelPosY = newY;
         return "translate(" + newX + "," + newY + ")"
         });
         };



         var mat = TP.Context().view[target].getSvg().selectAll("g.matrixInfo")
         .data(["matrix"])
         .enter()
         .append("g")
         .classed("matrixInfo", true)
         .attr("transform", function (d) {
         return "translate(" + 500 + "," + 10 + ")";
         })
         .call(d3.behavior.drag()
         .on("drag", move))

         mat.append("rect")
         .classed("matrixInfo", true)
         .attr("width", overallSize + 20)
         .attr("height", overallSize + 30)
         .style("fill", TP.Context().defaultFillColor)
         .style("stroke-width", TP.Context().defaultBorderWidth)
         .style("stroke", TP.Context().defaultBorderColor)



         mat.append("text")
         .classed("matrixInfo", true)
         .text("X")
         .attr("dx", 208)
         .attr("dy", 18)
         .style("fill", "lightgray")
         .style("font-family", "EntypoRegular")
         .style("font-size", 30)
         .on("click", function (d) {
         TP.Context().view[target].getSvg().selectAll("g.matrixInfo")
         .data([])
         .exit()
         .remove();
         gD = TP.Context().view[target].getGraphDrawing().draw()
         })
         .on("mouseover", function () {
         d3.select(this).style("fill", "black")
         })
         .on("mouseout", function () {
         d3.select(this).style("fill", "lightgray")
         })



         var brewerSeq = ['#FEEDDE', '#FDD0A2', '#FDAE6B', '#FD8D3C','#E6550D', '#A63603'];
         var index = function (x) {
         return Math.round(x * 5) % 6;
         };
         matrixData.forEach(function (d1, i) {
         d1.forEach(function (d2, j) {
         piece = mat.append("rect")
         piece.data(d2).enter()

         piece.attr("class", "matrixUnit")
         .classed("matrixInfo", true)
         .attr("x", i * indSize + 10)
         .attr("y", j * indSize + 18)
         .attr("width", indSize)
         .attr("height", indSize)
         .style("fill", function () {
         if (d2[0] == -1) {
         return "lightgray";
         } else {
         return brewerSeq[index(d2[1])];
         }
         })
         .style("fill-opacity", 1)
         .style("stroke", "black")
         .style("stroke-width", 0)
         .on("mouseover", function () {
         if (d2[0] != -1) {
         d3.select(this).style("stroke-width", 1);
         };
         objectReferences.InteractionObject.highlight(d2[0], i, j, target);
         })
         .on("mouseout", function () {
         d3.select(this).style("stroke-width", 0);
         })

         })
         })
         }
         */


        this.resetView = function (_event) {

            var target = _event.associatedData.source;

            var cGraph = null;
            var svg = null;


            svg = TP.Context().view[target].getSvg();
            cGraph = TP.Context().view[target].getGraph();
            /*
             nodeDatum = svg.selectAll("g.node").data()
             // strangely the matrix that should be applied by transform is
             //squared?! so we adapt the nodes values
             nodeDatum.forEach(function (d) {
             d._currentX = d.x;
             d._currentY = d.y;
             });

             svg.selectAll(".node,.link")
             .attr("transform", "translate(" + 0 + "," + 0 + ") scale(" + 1 + ")")
             svg.selectAll("text.node").style("font-size", function () {
             return 12;
             });*/

            var cView =TP.Context().view[target]; 
            cView.getGraphDrawing().rescaleGraph(cGraph, cView.dialog.dialog().width(), cView.dialog.dialog().height());


            TP.Context().view[target].getGraphDrawing().changeLayout(cGraph, 0);


            objectReferences.VisualizationObject.entanglementCaught(target);
        };


        this.resetSize = function (_event) {

            var target = _event.associatedData.source;

            var cGraph = null;
            var svg = null;

            svg = TP.Context().view[target].getSvg();
            cGraph = TP.Context().view[target].getGraph();

            cGraph.nodes().forEach(function (d) {
                d.viewMetric = 3;
            });

            TP.Context().view[target].getGraphDrawing().resize(cGraph, 0);
        };


        this.rotateGraph = function (_event) {

            var target = _event.associatedData.source;
            var angle = _event.associatedData.angle;
            
            if(angle === undefined || angle == null)
                angle = 5;

            var cGraph = null;
            var svg = null;

            svg = TP.Context().view[target].getSvg();
            cGraph = TP.Context().view[target].getGraph();
            //console.log("angle", angle)

            TP.Context().view[target].getGraphDrawing().rotate(target, angle);
        };

        this.arrangeLabels = function (_event) {
            
            var target = _event.associatedData.source;

            var cGraph = null;
            var svg = null;

            svg = TP.Context().view[target].getSvg();
            cGraph = TP.Context().view[target].getGraph();
            TP.Context().view[target].getGraphDrawing().arrangeLabels();
        };

        this.bringLabelsForward = function (target) {
            if (!target)
                return;

            var svg = null;
            var cGraph = null;

            svg = TP.Context().view[target].getSvg();
            cGraph = TP.Context().view[target].getGraph();

            TP.Context().view[target].getGraphDrawing().bringLabelsForward();
        };


        this.showhideLabels = function (_event) {

            var target = _event.associatedData.source;

            if (!target)
                return;

            var svg = null;
            svg = TP.Context().view[target].getSvg();

            //eval("TP.Context().show_labels_" + target + " = ! TP.Context().show_labels_" + target);
            //TP.Context().tabShowLabels[target] = !TP.Context().tabShowLabels[target]
            TP.Context().view[target].setShowLabels(!TP.Context().view[target].getShowLabels());

            if (TP.Context().view[target].getShowLabels()) {
                svg.selectAll('text.node').attr("visibility", function (d) {
                    return "visible";
                });
                $('li.form > a').each(function () {
                    if ($(this).text() === 'Show labels') {
                        $(this).text('Hide labels');
                    }
                });
            } else {
                svg.selectAll('text.node').attr("visibility", function (d) {

                    d.labelVisibility = false;
                    return "hidden";

                });
                $('li.form > a').each(function () {
                    if ($(this).text() === 'Hide labels') {
                        $(this).text('Show labels');
                    }
                });
            }
        };


        // This function rescales the graph data in order to fit the svg window
        // data, the graph data (modified during the function)
        this.rescaleGraph = function (data) {

            // these should be set as globale variables
            var buttonWidth = 0;//130.0
            var frame = 10.0;
            var w = TP.Context().width - (buttonWidth + 2 * frame);
            var h = TP.Context().height - (2 * frame);
            if (data.nodes.length <= 0) return;

            var minX = data.nodes[0].x;
            var maxX = data.nodes[0].x;
            var minY = data.nodes[0].y;
            var maxY = data.nodes[0].y;


            data.nodes.forEach(function (d) {
                if (d.x < minX) {
                    minX = d.x;
                }
                ;
                if (d.x > maxX) {
                    maxX = d.x;
                }
                ;
                if (d.y < minY) {
                    minY = d.y;
                }
                ;
                if (d.y > maxY) {
                    maxY = d.y;
                }
                ;
            });

            //var sizeScale = d3.scale.linear();
            //sizeScale.range([minX, maxX])


            var delta = 0.00000000000000000001; //to avoid division by 0
            scale = Math.min.apply(null, [w / (maxX - minX + delta), h / (maxY - minY + delta)]);

            data.nodes.forEach(function (d) {
                d.x = (d.x - minX) * scale + buttonWidth + frame;
                d.y = (d.y - minY) * scale + frame;
                d._currentX = d.x;
                d._currentY = d.y;
            });
        };


        this.sizeMapping = function (_event) {

            var parameter = _event.associatedData.parameter;
            var idView = _event.associatedData.idView;
            var scales = _event.associatedData.scales;
            //console.log('associated scales: ', scales)

            this.nodeSizeMapping(parameter, idView, scales);

        };


        this.nodeSizeMapping = function (parameter, idView, scales) {

            var cGraph = null;
            var svg = null;
            var scaleMin = null;
            var scaleMax = null;

            //console.log('scales: ', scales)

            if (scales != null) {
                scaleMin = scales.sizemap.val1;
                scaleMax = scales.sizemap.val2;
            }


            svg = TP.Context().view[idView].getSvg();
            cGraph = TP.Context().view[idView].getGraph();

            TP.Context().view[idView].getGraphDrawing().nodeSizeMap(cGraph, 0, {metric: parameter, scaleMin: scaleMin, scaleMax: scaleMax });
            
        };



        this.colorMapping = function (parameter, graphName) {

            var cGraph = null;
            var svg = null;

            svg = TP.Context().view[graphName].getSvg();
            cGraph = TP.Context().view[graphName].getGraph();

            TP.Context().view[graphName].getGraphDrawing().nodeColorMap(cGraph, 0, parameter);

        };


        this.drawDataBase = function (_event) {
            var target = _event.associatedData.source;
            
            var svg = TP.Context().view[target].getSvg();
            var nodes = svg.selectAll('g.node').data();

            var id = "" + TP.Context().getIndiceView();
            
            //TP.Context().view[id] = new TP.View(id, null,
                 //"DataBase" + TP.view[target].getName(), null, null, null, null, null, "DataBase", target);
            TP.Context().view[id] = new TP.ViewData({id:id, name:"DataBase " + TP.view[target].getName(), type:"data", idSourceAssociatedView:target});
            TP.Context().view[id].addView();

            var sort_asc = true;
            drawTable('#zone'+id, nodes);
            var table;

            function drawTable(zone, nodes){
                table = $('<table/>', {id: 'table' + id, class:'dataTable'}).appendTo('#zone' + id);
                var thead = $('<thead/>').appendTo(table);
                var tbody = $('<tbody/>').appendTo(table);
                var head = $('<tr/>').appendTo(thead);
                var fields = getFields(nodes);

                for (var f in fields){
                    var th = $('<th/>').appendTo(head);
                    
                    th.html(fields[f]);
                    th.click(function(){
                        nodes.sort(sortByColumn(this.innerHTML,sort_asc));
                        sort_asc = !sort_asc;
                        table.remove();
                        drawTable(zone, nodes);
                    });
                }

                for (var n in nodes){
                    var tr = $('<tr/>',{id: "TR"+n}).appendTo(tbody);
                    for (var f in fields){
                        var td = $("<td/>").appendTo(tr);
                        td.html(nodes[n][fields[f]]);
                        td.click(function(a,b){
                            return function () {
                                if (table[0].rows[0].cells[b].innerHTML!=='baseID'){
                                    toggleInput($(this));
                                }
                            };
                        }(n,f));
                    }
                }
            }

            function getFields(nodes){
                var fields = [];
                for(var n in nodes){
                    for (var f in nodes[n]) {

                        if (fields.indexOf(f) === -1) {  //a key is unique
                            fields.push(f);
                        }
                    }
                }
                return fields;
            }

            function toggleInput(cell){
                if(cell.hasClass('editData')) {
                    return;
                }else{
                    var width = cell.innerWidth();
                    var height = cell.innerHeight();
                    var text = cell.text();
                  
                    cell.css('height',height);
                    cell.width(width);
                    cell.text("");

                    var input = $("<input/>").appendTo(cell);
                    $(input).height(height-5);
                    $(input).width($(cell).width()-4);
                    input.attr("value",text);

                    input.focus();
                    input.blur(function(){
                        updateData($(this));
                    });
                    input.keyup(function (e) {
                        if (e.keyCode === 13) { //enter key
                            updateData($(this));
                        }
                    });
                    cell.addClass('editData');
                }
            }

            function updateData(input){
                var cell = input.parent();
                var col = cell.index();
                var hcol = table[0].rows[0].cells[col].innerHTML;
                var row = cell.parent().index('tr');

                cell.text(input.val());
                cell.removeClass('editData');
                input.remove();

                var bID = eval(table[0].rows[row].cells[0].innerHTML);
                for (var n in nodes){
                    if (nodes[n].baseID===bID){
                        nodes[n][hcol] = cell.text();
                    }
                TP.Context().view[target].getGraphDrawing().arrangeLabels();;
                }
            }

            function sortByColumn(field, reverse){
                var key = function (x) {return x[field];};
                return function (a,b) {
                    var A = key(a), B = key(b);
                    return ( (A < B) ? -1 : ((A > B) ? 1 : 0) ) * [-1,1][+!!reverse];                  
                };
            }
        };



        this.rotateView = function(angle)
        {
            var IDView = TP.Context().activeView;
            var view = TP.Context().view[IDView];
            var typeGraph = view.getType();
            var currentViewRotation = view.viewRotation;

            if (currentViewRotation == NaN || currentViewRotation == undefined)
                currentViewRotation = 0;

            if (angle == NaN || angle == undefined)
                angle = 0;
            
            var delta = angle - currentViewRotation;
                
            if (delta == 0) return;
            if ($('#bothViews_cb').is(":checked")) {
                var targetView = null;
                if (typeGraph == 'substrate' && view.getAssociatedView("catalyst") != null){
                    targetView = TP.Context().view[IDView].getAssociatedView("catalyst")[0];
                    //console.log("catalyst found: ", targetView)
                }

                if (typeGraph == 'catalyst' && view.getAssociatedView("substrate") != null){
                    targetView = TP.Context().view[IDView].getAssociatedView("substrate")[0];
                    //console.log("substrate found: ", targetView)
                }
                
                if (targetView != null)
                {    
                    //targetView.viewRotation = angle;
                    targetView.getController().sendMessage("rotateGraph", {angle: delta});
                    if (targetView.getType() == "catalyst")
                        TP.ObjectReferences().ClientObject.updateLayout(targetView.getID());
                }                  
            }
            
            view.viewRotation = angle; 
            view.getController().sendMessage("rotateGraph", {angle: delta});
            if (typeGraph == "catalyst")
                        TP.ObjectReferences().ClientObject.updateLayout(view.getID());
            
            
        };


        this.changeColor = function () {
            var IDView = TP.Context().activeView;
            var view = TP.Context().view[IDView];
            var cGraph = view.getGraph();
            //console.log($('#picker'))
            var f = $.farbtastic('#picker');

            if ($('#cnodes').hasClass('colorwell') && $('#cnodes').is(":checked")) {
                view.setNodesColor(f.color);
                view.getGraphDrawing().changeColor(IDView, cGraph, "node", view.getNodesColor());
            } else if ($('#clinks').hasClass('colorwell') && $('#clinks').is(":checked")) {
                view.setLinksColor(f.color);
                view.getGraphDrawing().changeColor(IDView, cGraph, "link", view.getLinksColor());
            } else if ($('#cbg').hasClass('colorwell') && $('#cbg').is(":checked")) {
                view.setBgColor(f.color);
                view.getGraphDrawing().changeColor(IDView, cGraph, "bg", view.getBgColor());
            } else if ($('#clabels').hasClass('colorwell') && $('#clabels').is(":checked")) {
                view.setLabelsColor(f.color);
                view.getGraphDrawing().changeColor(IDView, cGraph, "label", view.getLabelsColor());
            }
        };

        this.tulipLayout = function (_event) {
            var id = TP.Context().activeView;
            var view = TP.Context().view[id];
            var cGraph = view.getGraph();
            TP.Context().Client().callLayout(_event);

        };

        /*this.changeNodesSettings = function(_event) {
            var id = TP.Context().activeView;
            var view = TP.Context().view[id];
            var cGraph = view.getGraph();
            console.log("data: ",_event.associatedData)
            //console.log($('#npicker'))
            var f = $.farbtastic('#npicker');

            if (_event.associatedData) {
                view.getGraphDrawing().changeSettingsLabels(id, cGraph, "font-size", _event.associatedData.value.fontsize.val1)
            }

            view.setNodesColor(f.color);
            view.getGraphDrawing().changeColor(id, cGraph, "node", view.getNodesColor());
        }*/

        

        return __g__;
    };
    TP.Visualization = Visualization;
})(TP);
