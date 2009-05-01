YUI.add("node-focusmanager",function(B){var J="activeDescendant",L="id",H="disabled",M="tabIndex",D="hasFocus",A="focusClass",Q="circular",C="UI",E="key",F=J+"Change",P="focusManager",N="host",O={37:true,38:true,39:true,40:true},G=B.Lang,K=B.UA;var I=function(){I.superclass.constructor.apply(this,arguments);};I.ATTRS={hasFocus:{value:false,readOnly:true},descendants:{getter:function(R){return this.get(N).queryAll(R);}},activeDescendant:{setter:function(V){var T=G.isNumber,S=B.Attribute.INVALID_VALUE,R=this._descendantsMap,Y=this._descendants,X,U,W;if(T(V)){X=V;U=X;}else{if((V instanceof B.Node)&&R){X=R[V.get(L)];if(T(X)){U=X;}else{U=S;}}else{U=S;}}if(Y){W=Y.item(X);if(W&&W.get("disabled")){U=S;}}return U;}},keys:{value:{next:null,previous:null}},focusClass:{},circular:{value:true}};B.extend(I,B.Plugin.Base,{_stopped:true,_descendants:null,_descendantsMap:null,_focusedNode:null,_lastNodeIndex:0,_eventHandlers:null,_initDescendants:function(){var Y=this.get("descendants"),R={},W=-1,V,U=this.get(J),X,S,T=0;if(G.isUndefined(U)){U=-1;}if(Y){V=Y.size();if(V>1){for(T=0;T<V;T++){X=Y.item(T);if(W===-1&&!X.get(H)){W=T;}if(U<0&&X.getAttribute(M)==="0"){U=T;}X.set(M,-1);S=X.get(L);if(!S){S=B.guid();X.set(L,S);}R[S]=T;}if(U<0){U=0;}X=Y.item(U);if(!X||X.get(H)){X=Y.item(W);U=W;}this._lastNodeIndex=V-1;this._descendants=Y;this._descendantsMap=R;this.set(J,U);X.set(M,0);}}},_isDescendant:function(R){return(R.get(L) in this._descendantsMap);},_removeFocusClass:function(){var S=this._focusedNode,R=this.get(A);if(S&&R){S.removeClass(R);}},_detachKeyHandler:function(){var T=this._prevKeyHandler,R=this._nextKeyHandler,S=this._keyPressHandler;if(T){T.detach();}if(R){R.detach();}if(S){S.detach();}},_preventScroll:function(R){if(O[R.keyCode]){R.preventDefault();}},_attachKeyHandler:function(){this._detachKeyHandler();var T=this.get("keys.next"),R=this.get("keys.previous"),S=this.get(N);if(R){this._prevKeyHandler=B.on(E,B.bind(this._focusPrevious,this),S,R);}if(T){this._nextKeyHandler=B.on(E,B.bind(this._focusNext,this),S,T);}if(K.opera||(K.gecko&&K.gecko<1.9)){this._keyPressHandler=S.on("keypress",B.bind(this._preventScroll,this));}},_detachEventHandlers:function(){this._detachKeyHandler();var R=this._eventHandlers;if(R){B.Array.each(R,function(S){S.detach();});this._eventHandlers=null;}},_attachEventHandlers:function(){var T=this._descendants,R,S;if(T&&T.size()>1){R=this._eventHandlers||[];S=this.get(N).get("ownerDocument");if(R.length===0){R.push(B.on("focus",B.bind(this._onDocFocus,this),S));R.push(B.on("mousedown",B.bind(this._onDocMouseDown,this),S));R.push(this.after("keysChange",this._attachKeyHandler));R.push(this.after("descendantsChange",this._initDescendants));R.push(this.after(F,this._afterActiveDescendantChange));}else{this._attachKeyHandler();}this._eventHandlers=R;}},_onDocMouseDown:function(S){var R=S.target,T=this.get(N).contains(R);if(T&&this._isDescendant(R)){this.focus(R);}else{if(K.webkit&&this.get(D)&&(!T||(T&&!this._isDescendant(R)))){this._set(D,false);this._onDocFocus(S);}}},_onDocFocus:function(V){var U=this._focusTarget||V.target,W=this.get(D),S=this.get(A),T=this._focusedNode,R;if(this._focusTarget){this._focusTarget=null;}if(this.get(N).contains(U)){R=this._isDescendant(U);if(!W&&R){W=true;}else{if(W&&!R){W=false;}}}else{W=false;}if(S){if(T&&(T!==U||!W)){this._removeFocusClass();}if(R&&W){U.addClass(S);this._focusedNode=U;}}if(W&&this._eventHandlers.length===5){this._attachEventHandlers();}this._set(D,W);},_focusNext:function(S,T){var R=T||this.get(J),U;if(this._isDescendant(S.target)&&(R<=this._lastNodeIndex)){R=R+1;if(R===(this._lastNodeIndex+1)&&this.get(Q)){R=0;}U=this._descendants.item(R);if(U.get(H)){this._focusNext(S,R);}else{this.focus(R);}}this._preventScroll(S);},_focusPrevious:function(S,T){var R=T||this.get(J),U;if(this._isDescendant(S.target)&&R>=0){R=R-1;if(R===-1&&this.get(Q)){R=this._lastNodeIndex;}U=this._descendants.item(R);if(U.get(H)){this._focusPrevious(S,R);}else{this.focus(R);}}this._preventScroll(S);},_afterActiveDescendantChange:function(R){var S=this._descendants.item(R.prevVal);if(S){S.set(M,-1);}S=this._descendants.item(R.newVal);if(S){S.set(M,0);}},initializer:function(R){this.start();},destructor:function(){this.stop();this.get(N).focusManager=null;},focus:function(R){if(G.isUndefined(R)){R=this.get(J);}this.set(J,R,{src:C});var S=this._descendants.item(this.get(J));if(S){if(K.opera&&S.get("nodeName").toLowerCase()==="button"){this._focusTarget=S;}S.focus();}},blur:function(){var R;if(this.get(D)){R=this._descendants.item(this.get(J));if(R){R.blur();this._removeFocusClass();}this._set(D,false,{src:C});}},start:function(){if(this._stopped){this._initDescendants();this._attachEventHandlers();this._stopped=false;}},stop:function(){if(!this._stopped){this._detachEventHandlers();this._descendants=null;this._focusedNode=null;this._lastNodeIndex=0;this._stopped=true;}},refresh:function(){this._initDescendants();}});I.NAME=P;I.NS=P;B.namespace("Plugin");B.Plugin.FocusManager=I;},"@VERSION@",{requires:["node","plugin"]});