var TP = TP || {};
(function () {





    var Controller = function () {


        var __g__ = this;

        var nameC = null;
        var listenerState = null;
        var typeC = null;

        var StateTree = null;
        var eventHandlerObject = null;

        var currentState = null;
		
		
		__g__.getElem = function()
		{
			console.log("curent view's listener : ", eventHandlerObject.getElem(listenerState));
		}
		
		__g__.getStateTree = function()
		{
			return StateTree;
		}
		
		__g__.getListenerState = function()
		{
			return listenerState;
		}
		
        __g__.addEvent = function (type, fn) {
            eventHandlerObject.addEvent(listenerState, type, fn);
        }

        __g__.removeEvent = function (type) {
            eventHandlerObject.removeEvent(listenerState, type);
        }
		
		__g__.goBackEvent = function(nameEvent)
		{
			eventHandlerObject.goBackEvent(listenerState, nameEvent)
		}
		
        __g__.addStates = function () {

            if (typeC === "view") {
                TP.Context().view[nameC].initStates();
            }
            else if (typeC == "principal")
                TP.Context().initStates();
            else
                assert(false, "type of controller isn't supported");
        }


        __g__.addState = function (node, nodeRoot, useless, activate, targetView) {
        	
        	var sGraph = null;
        	var listenerName = null;
        	
        	if(targetView != null){
        		var view = TP.Context().view[targetView];
        		if(view != null){
        			sGraph = view.getController().getStateTree();
        			listenerName = view.getController().getListenerState();
        		}
        		else{
        			assert(false, "targetView does'nt exist !!");
        			return;
        		}
        	}
        	else{
        		sGraph = StateTree;
        		listenerName = listenerState;
        	}
        	
        	if(sGraph != null && listenerName != null){
        	
	            console.log("node : ", node, "nodeRoot : ", nodeRoot, "useless : ", useless, "activate : ", activate)
	            sGraph.addState(node, nodeRoot, useless, activate);
	            
	            if(targetView != null)
	            	TP.Context().view[targetView].getController().addEvent(node.name, node.func);
	            else
	               	__g__.addEvent(node.name, node.func);

           	}
           	else{
           		assert(false, "sGraph or/and listenerName isn't defined !!")
           		return;
           	}
           	
            //we can call addEvent after addState to simplifie Event insersion
        }

		
		__g__.deleteState = function(nameState)
		{
			StateTree.deleteState(nameState);			
		}
		
		__g__.goBackState = function(nameState){
			StateTree.goBackState(nameState);
		}
		

        __g__.getInfoState = function (name) {
            return StateTree.getInfoState(name);
        }

        __g__.isActivate = function (name) {
            return __g__.getInfoState(name).activate === true;
        }

        __g__.enableState = function (state) {
            StateTree.enableState(state);
        }

        __g__.disableState = function (state) {
            StateTree.disableState(state);
        }

        __g__.setCurrentState = function (name) {
            currentState = name;
        }

        __g__.initListener = function (ID, typeController) {
            if (ID == null || typeController == null) {
                assert(false, "error !!! ID or typeCotroller is not defined")
                return;
            }

            nameC = ID;
            listenerState = "handlerState" + nameC;
            typeC = typeController;

            StateTree = new TP.StateTree();
            eventHandlerObject = new TP.eventHandler();
            currentState = null;


            $("#Controller").append('<div id=' + listenerState + '></div>');

            //StateTree.initStateTree(typeC);
            __g__.addStates(); //init state of the current view
            console.log(listenerState);
            eventHandlerObject.addElement(listenerState, $("[id=" + listenerState + "]")[0]);

            var tabInit = StateTree.getStateTree();

            console.log("tabInit : ");
            console.log(tabInit);

            for (var key in tabInit) {
                console.log(key);
                console.log(tabInit[key]);
                __g__.addEvent(tabInit[key].name, tabInit[key].func);
            }
            /*
             var tmp = StateTree.getRoot();

             if((tmp != null) && (Object.getPrototypeOf(tmp) == Object.getPrototypeOf({})))
             if(tmp.hasOwnProperty("name"))
             currentState = StateTree.getRoot().name;*/

            if (typeC = "view")
                currentState = "select"
        }

        __g__.getStateAccess = function (cState) {

            //console.log("currentState : "+currentState)

            var State = StateTree.getInfoState(cState);
			
            if (State == null)
                return false;

            if (currentState == null) {
                return true;
            }

            if (State.activate == false) {
                return false;
            }
            else {
                if (State.specialRoot === true) {
                    if (State.root["all"] !== undefined)
                        return true;
                }
                else if (State.root[currentState] !== undefined) {
                    return true;
                }
                else
                    return __g__.isBindingToAll(currentState);	//if state's bindings has "all" occurence, the state doesn't modifie currentState.
            }
        }

        __g__.isBindingToAll = function (cState) {
            var State = StateTree.getInfoState(cState);
            return State.bindings["all"] !== undefined;
        }

        __g__.transitionState = function (cState) {
            var State = StateTree.getInfoState(cState);

            if (State.useless !== true)
                currentState = cState;
        }

        __g__.getTree = function () {
            return StateTree.getStateTree();
        }

        __g__.sendMessage = function (messageName, object, targetController, source) //targetController : for example, even if div's id of principal controller is handlerStateprincipal, type "principale"
            //same thing for view, type just the view ID("0", "1", "2")
        {

            if (source != null && targetController == null) {
                assert(false, "error !!!! source is specified, but not targetController");
                return;
            }

            var access = null;
            var tmpController = null;

            if (targetController != null) {
                if (targetController === "principal") {
                    tmpController = TP.Context().getController();
                    access = tmpController.getStateAccess(messageName);
                }
                else {
                    tmpController = TP.Context().view[targetController].getController();
                    access = tmpController.getStateAccess(messageName);
                }
            }
            else {
                tmpController = __g__;
                access = tmpController.getStateAccess(messageName);
            }

            if (access === false) {
                console.log("currentState : "+currentState)
                assert(false, "access denied : " + messageName);
                return;
            }


            tmpController.transitionState(messageName);

            var event = new CustomEvent(messageName);
            if (object != null) {
                event.associatedData = object;
            }
            else
                event.associatedData = {};


            if (source != null)
                event.associatedData.source = source;
            else
                event.associatedData.source = nameC;

            if (targetController != null)
                event.associatedData.target = targetController;
            else
                event.associatedData.target = nameC;


            if (targetController == null)
                document.getElementById(listenerState).dispatchEvent(event);
            else
                document.getElementById("handlerState" + targetController).dispatchEvent(event);

        }

/*
        __g__.modifyFunc = function(name, func)
        {
        	var oldFunc = StateTree.modifyFunc(name, func); //we modify 
        	eventHandlerObject.modifyFunc(listenerState, name, func);
        	eventHandlerObject.setMessAvailable(listenerState, name); //we put available the added function 
        	
        	return oldFunc;
        }
        
        
       	__g__.getFuncEvent = function(name)
       	{
       		return eventHandlerObject.getFuncEvent(listenerState, name);
       	}
*/

        __g__.remove = function () {
            d3.select("#" + listenerState + "").remove();
            nameC = null;
            listenerState = null;
            typeC = null;

            StateTree = null;
            eventHandlerObject = null;

            currentState = null;
        }


        return __g__;
    }

    TP.Controller = Controller;
})(TP);