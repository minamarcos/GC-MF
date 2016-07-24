/* 
*   For Hotpatches 
*   Never commit to this file without first testing on the qa version!!! 
************************************************************* */

//fired within this file, before any body markup loads -  NOTE, JQUERY NOT AVAILABLE YET WITHIN THIS FUNCTION!!!
function preloadHotpatchCallback() { 

 	//temporarily hide paypal credit option within payment page for GCSTORE-4238 8-19-15 Tony
	//second JS part is below
	if ( readCookie("paypalCreditEnabled")!="true" ) {
		var cssRulesHidePaypalCredit = " \n .payment-method-container .payPalCredit { display:none; } \n"; 
		addStyleSheetContent(cssRulesHidePaypalCredit); 
	}
	
	
	//Show the chat button in the header.  - Tony 1/11/16 
	//can be removed after GCCOM20 goes to prod (end of january)
	var cssRuleChatButton = " \n #contactGC .unbold, section#header_valueProps ul li .chatButton { display: inline-block !important; } \n"; 
	addStyleSheetContent(cssRuleChatButton); 
	
}


//fired after body markup loads -  NOTE, JQUERY NOT AVAILABLE YET WITHIN THIS FUNCTION (moving to after jquery is included within 3.2)!!! 
function preGlobalHotpatchCallback(){
	
	var queryStr = window.location.search.toLowerCase();
	//TCM 30032 - Allowing QA to test turning off adobe recs 
	if( queryStr.indexOf('adoberecsdisabled=')>-1 ){ 
		$('body').append('<var id="adobeRecsDisabled" class="hidden">true</var>');  
	}
	
	//generic test and target function call if it exists - possible since only 1 T&T test can be run
	if(typeof(testAndTargetToggle) === "function") {
		testAndTargetToggle();
	}
	
	//track youtube player clicks with omniture pings
	if ($('.youTubeVideo iframe').length) {
		var youTubePlayed = 0; 
		 var tag = document.createElement('script');
	      tag.src = "http://www.youtube.com/iframe_api";
	      var firstScriptTag = document.getElementsByTagName('script')[0];
	      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
	      var player;
		$('.youTubeVideo iframe').attr( 'id', 'ytplayer' );
			window.onYouTubeIframeAPIReady = function() {
			  player = new YT.Player('ytplayer', {
			    events: {
			      'onReady': function(){},
			      'onStateChange': function(youtubeInteraction){
			    	 youTubePlayerState = player.getPlayerState();
			    	 if(youTubePlayerState == 1 && !youTubePlayed ) {
			    		 youTubePlayed = 1; 
			    		 youTubeVideoUrl = player.getVideoUrl();
			    		 youTubeVideoId = getQueryStringParam('v', youTubeVideoUrl);
			    		 youTubeVideoUrl = 'http://www.youtube.com/watch?v='+youTubeVideoId+''; 
			    		 $(document).trigger('omnitureEvent', ['Youtube Tracking', true, { 
			    				linkTrackVars: 'events,eVar60,products', 
			    				linkTrackEvents:"event61", 
			    				events:"event61",
			    				eVar60:youTubeVideoUrl, 
			    				products:';'+ siteVars.product_id +';;;;'
			    				
			    			}, false]);
			    	 }
			    	  
			      }
			    }
			  });
			}
		
		}
		
		//adds css specific to the dailyDealsMarkup cartridge markup on the homepage and cart pages
		if((window.location.pathname === "/" || window.location.pathname === "/cart")){	
			$('head').append('<link rel="stylesheet" href="http://static.guitarcenter.com/static/gc/css/gcDesktopDailyDeal.css" type="text/css" />');
		}
		
}

//fired after global javascript 
function postGlobalHotpatchCallback(){
	
 	//temporarily hide paypal credit option within payment page 8-19-15 Tony
	//second JS part is above
	if ( readCookie("paypalCreditEnabled")!="true" ) {
		$('#paymentTypeSelect option[value="payPalCredit"]').remove();
	}
	
}

//fired after 3rd party global postload, last in the process 
function postThirdPartyHotpatchCallback(){ }


function readCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return unescape(c.substring(nameEQ.length,c.length));
	}
	return null;
}


//trigger javascript hotpatch 
if( typeof(preloadHotpatchCallback)=='function' )
    preloadHotpatchCallback();



var pageData = (function() {
	var pageDataVar = document.getElementById('pageData');
	if(!pageDataVar) return  {};
	var str = pageDataVar.innerHTML; 
	if(!str) return  {};
	if (typeof(JSON) != 'undefined') {
		return JSON.parse(str);
	} else { 
		return (new Function('return ' + str) )();
	}
})();


function addStyleSheetContent(styles) {
	if(typeof styles === 'undefined') { return; }
	
	var css = document.createElement("style");
	document.getElementsByTagName('head')[0].appendChild(css);
	css.setAttribute('type', 'text/css');
	//IN IE the style tag innerHTML is readonly so use styleSheet.cssText instead
	if(css.styleSheet) {
		css.styleSheet.cssText = styles;
	} else {
		css.innerHTML = styles;
	}
}


/* ************************************************************
*   Test & Target Mbox, copied from /productionJs/mbox.js
************************************************************* */

var mboxCopyright = "Copyright 1996-2011. Adobe Systems Incorporated. All rights reserved.";mboxUrlBuilder = function(a, b) { this.a = a; this.b = b; this.c = new Array(); this.d = function(e) { return e; }; this.f = null;};mboxUrlBuilder.prototype.addParameter = function(g, h) { var i = new RegExp('(\'|")'); if (i.exec(g)) { throw "Parameter '" + g + "' contains invalid characters"; } for (var j = 0; j < this.c.length; j++) { var k = this.c[j]; if (k.name == g) { k.value = h; return this; } } var l = new Object(); l.name = g; l.value = h; this.c[this.c.length] = l; return this;};mboxUrlBuilder.prototype.addParameters = function(c) { if (!c) { return this; } for (var j = 0; j < c.length; j++) { var m = c[j].indexOf('='); if (m == -1 || m == 0) { continue; } this.addParameter(c[j].substring(0, m), c[j].substring(m + 1, c[j].length)); } return this;};mboxUrlBuilder.prototype.setServerType = function(n) { this.o = n;};mboxUrlBuilder.prototype.setBasePath = function(f) { this.f = f;};mboxUrlBuilder.prototype.setUrlProcessAction = function(p) { this.d = p;};mboxUrlBuilder.prototype.buildUrl = function() { var q = this.f ? this.f : '/m2/' + this.b + '/mbox/' + this.o; var r = document.location.protocol == 'file:' ? 'http:' : document.location.protocol; var e = r + "//" + this.a + q; var s = e.indexOf('?') != -1 ? '&' : '?'; for (var j = 0; j < this.c.length; j++) { var k = this.c[j]; e += s + encodeURIComponent(k.name) + '=' + encodeURIComponent(k.value); s = '&'; } return this.t(this.d(e));};mboxUrlBuilder.prototype.getParameters = function() { return this.c;};mboxUrlBuilder.prototype.setParameters = function(c) { this.c = c;};mboxUrlBuilder.prototype.clone = function() { var u = new mboxUrlBuilder(this.a, this.b); u.setServerType(this.o); u.setBasePath(this.f); u.setUrlProcessAction(this.d); for (var j = 0; j < this.c.length; j++) { u.addParameter(this.c[j].name, this.c[j].value); } return u;};mboxUrlBuilder.prototype.t = function(v) { return v.replace(/\"/g, '&quot;').replace(/>/g, '&gt;');};mboxStandardFetcher = function() { };mboxStandardFetcher.prototype.getType = function() { return 'standard';};mboxStandardFetcher.prototype.fetch = function(w) { w.setServerType(this.getType()); document.write('<' + 'scr' + 'ipt src="' + w.buildUrl() + '" language="JavaScript"><' + '\/scr' + 'ipt>');};mboxStandardFetcher.prototype.cancel = function() { };mboxAjaxFetcher = function() { };mboxAjaxFetcher.prototype.getType = function() { return 'ajax';};mboxAjaxFetcher.prototype.fetch = function(w) { w.setServerType(this.getType()); var e = w.buildUrl(); this.x = document.createElement('script'); this.x.src = e; document.body.appendChild(this.x);};mboxAjaxFetcher.prototype.cancel = function() { };mboxMap = function() { this.y = new Object(); this.z = new Array();};mboxMap.prototype.put = function(A, h) { if (!this.y[A]) { this.z[this.z.length] = A; } this.y[A] = h;};mboxMap.prototype.get = function(A) { return this.y[A];};mboxMap.prototype.remove = function(A) { this.y[A] = undefined;};mboxMap.prototype.each = function(p) { for (var j = 0; j < this.z.length; j++ ) { var A = this.z[j]; var h = this.y[A]; if (h) { var B = p(A, h); if (B === false) { break; } } }};mboxFactory = function(C, b, D) { this.E = false; this.C = C; this.D = D; this.F = new mboxList(); mboxFactories.put(D, this); this.G = typeof document.createElement('div').replaceChild != 'undefined' && (function() { return true; })() && typeof document.getElementById != 'undefined' && typeof (window.attachEvent || document.addEventListener || window.addEventListener) != 'undefined' && typeof encodeURIComponent != 'undefined'; this.H = this.G && mboxGetPageParameter('mboxDisable') == null; var I = D == 'default'; this.J = new mboxCookieManager( 'mbox' + (I ? '' : ('-' + D)), (function() { return mboxCookiePageDomain(); })()); this.H = this.H && this.J.isEnabled() && (this.J.getCookie('disable') == null); if (this.isAdmin()) { this.enable(); } this.K(); this.L = mboxGenerateId(); this.M = mboxScreenHeight(); this.N = mboxScreenWidth(); this.O = mboxBrowserWidth(); this.P = mboxBrowserHeight(); this.Q = mboxScreenColorDepth(); this.R = mboxBrowserTimeOffset(); this.S = new mboxSession(this.L, 'mboxSession', 'session', 31 * 60, this.J); this.T = new mboxPC('PC', 2592000, this.J); this.w = new mboxUrlBuilder(C, b); this.U(this.w, I); this.V = new Date().getTime(); this.W = this.V; var X = this; this.addOnLoad(function() { X.W = new Date().getTime(); }); if (this.G) { this.addOnLoad(function() { X.E = true; X.getMboxes().each(function(Y) { Y.setFetcher(new mboxAjaxFetcher()); Y.finalize(); }); }); this.limitTraffic(100, 10368000); if (this.H) { this.Z(); this._ = new mboxSignaler(function(ab, c) { return X.create(ab, c); }, this.J); } }};mboxFactory.prototype.forcePCId = function(bb) { if (this.T.forceId(bb)) { this.S.forceId(mboxGenerateId()); }};mboxFactory.prototype.forceSessionId = function(bb) { this.S.forceId(bb);};mboxFactory.prototype.isEnabled = function() { return this.H;};mboxFactory.prototype.getDisableReason = function() { return this.J.getCookie('disable');};mboxFactory.prototype.isSupported = function() { return this.G;};mboxFactory.prototype.disable = function(cb, db) { if (typeof cb == 'undefined') { cb = 60 * 60; } if (typeof db == 'undefined') { db = 'unspecified'; } if (!this.isAdmin()) { this.H = false; this.J.setCookie('disable', db, cb); }};mboxFactory.prototype.enable = function() { this.H = true; this.J.deleteCookie('disable');};mboxFactory.prototype.isAdmin = function() { return document.location.href.indexOf('mboxEnv') != -1;};mboxFactory.prototype.limitTraffic = function(eb, cb) {};mboxFactory.prototype.addOnLoad = function(fb) { if (this.isDomLoaded()) { fb(); } else { var gb = false; var hb = function() { if (gb) { return; } gb = true; fb(); }; this.ib.push(hb); if (this.isDomLoaded() && !gb) { hb(); } }};mboxFactory.prototype.getEllapsedTime = function() { return this.W - this.V;};mboxFactory.prototype.getEllapsedTimeUntil = function(jb) { return jb - this.V;};mboxFactory.prototype.getMboxes = function() { return this.F;};mboxFactory.prototype.get = function(ab, kb) { return this.F.get(ab).getById(kb || 0);};mboxFactory.prototype.update = function(ab, c) { if (!this.isEnabled()) { return; } if (!this.isDomLoaded()) { var X = this; this.addOnLoad(function() { X.update(ab, c); }); return; } if (this.F.get(ab).length() == 0) { throw "Mbox " + ab + " is not defined"; } this.F.get(ab).each(function(Y) { Y.getUrlBuilder() .addParameter('mboxPage', mboxGenerateId()); Y.load(c); });};mboxFactory.prototype.create = function( ab, c, lb) { if (!this.isSupported()) { return null; } var e = this.w.clone(); e.addParameter('mboxCount', this.F.length() + 1); e.addParameters(c); var kb = this.F.get(ab).length(); var mb = this.D + '-' + ab + '-' + kb; var nb; if (lb) { nb = new mboxLocatorNode(lb); } else { if (this.E) { throw 'The page has already been loaded, can\'t write marker'; } nb = new mboxLocatorDefault(mb); } try { var X = this; var ob = 'mboxImported-' + mb; var Y = new mbox(ab, kb, e, nb, ob); if (this.H) { Y.setFetcher( this.E ? new mboxAjaxFetcher() : new mboxStandardFetcher()); } Y.setOnError(function(pb, n) { Y.setMessage(pb); Y.activate(); if (!Y.isActivated()) { X.disable(60 * 60, pb); window.location.reload(false); } }); this.F.add(Y); } catch (qb) { this.disable(); throw 'Failed creating mbox "' + ab + '", the error was: ' + qb; } var rb = new Date(); e.addParameter('mboxTime', rb.getTime() - (rb.getTimezoneOffset() * 60000)); return Y;};mboxFactory.prototype.getCookieManager = function() { return this.J;};mboxFactory.prototype.getPageId = function() { return this.L;};mboxFactory.prototype.getPCId = function() { return this.T;};mboxFactory.prototype.getSessionId = function() { return this.S;};mboxFactory.prototype.getSignaler = function() { return this._;};mboxFactory.prototype.getUrlBuilder = function() { return this.w;};mboxFactory.prototype.U = function(e, I) { e.addParameter('mboxHost', document.location.hostname) .addParameter('mboxSession', this.S.getId()); if (!I) { e.addParameter('mboxFactoryId', this.D); } if (this.T.getId() != null) { e.addParameter('mboxPC', this.T.getId()); } e.addParameter('mboxPage', this.L); e.addParameter('screenHeight', this.M); e.addParameter('screenWidth', this.N); e.addParameter('browserWidth', this.O); e.addParameter('browserHeight', this.P); e.addParameter('browserTimeOffset', this.R); e.addParameter('colorDepth', this.Q); e.addParameters(this.sb().split('&')); e.setUrlProcessAction(function(e) { e += '&mboxURL=' + encodeURIComponent(document.location); var tb = encodeURIComponent(document.referrer); if (e.length + tb.length < 2000) { e += '&mboxReferrer=' + tb; } e += '&mboxVersion=' + mboxVersion; return e; });};mboxFactory.prototype.sb = function() { 
var getCookieVal=function(o){var dc=document.cookie;return(dc.indexOf(o)!=-1)?(dc.split(o)[1].split(';')[0].charAt(0)=='=')?dc.split(o+'=')[1].split(';')[0]:dc.split(o)[1].split(';')[0]:''},sendCookie=function(o){var dc=document.cookie;return(dc.indexOf(o)!=-1)?o+dc.split(o)[1].split(';')[0]:''},ub=getCookieVal('mboxDP'),vb='',wb;if(location.search.length>0){wb=unescape(location.search.substr(1)).split(';')[0].split('&'),xb=wb.length;for(i=0;i<xb;i++){if(wb[i].indexOf('mbxp.')!=-1&&wb[i].indexOf('mbxp._')==-1&&wb[i].indexOf('=')!=-1&&wb[i].split('=')[1].length>0){vb+='&'+(wb[i]).replace(/mbxp/gi,'profile')}}}mboxUrlBuilder.prototype.oldURL=mboxUrlBuilder.prototype.buildUrl;mboxUrlBuilder.prototype.buildUrl=function(){var URL=this.oldURL();if(URL.indexOf('/sc/')!=-1){var _prA=ub.split('&'),_pr=_prA.length,_paA=vb.substr(1).split('&'),_pa=_paA.length;for(i=0;i<_pr;i++){URL=URL.replace(_prA[i]+'&','').replace(_prA[i],'')}for(i=0;i<_pa;i++){URL=URL.replace(_paA[i]+'&','').replace(_paA[i],'')}}return URL};if(ub!=''){ub='profile.'+ub.replace(/\:/g,'=').replace(/\|/g,'&profile.')}else{vb=vb.substr(1)};return ub+vb;

	};mboxFactory.prototype.Z = function() { document.write('<style>.' + 'mboxDefault' + ' { visibility:hidden; }</style>');};mboxFactory.prototype.isDomLoaded = function() { return this.E;};mboxFactory.prototype.K = function() { if (this.ib != null) { return; } this.ib = new Array(); var X = this; (function() { var yb = document.addEventListener ? "DOMContentLoaded" : "onreadystatechange"; var zb = false; var Ab = function() { if (zb) { return; } zb = true; for (var i = 0; i < X.ib.length; ++i) { X.ib[i](); } }; if (document.addEventListener) { document.addEventListener(yb, function() { document.removeEventListener(yb, arguments.callee, false); Ab(); }, false); window.addEventListener("load", function(){ document.removeEventListener("load", arguments.callee, false); Ab(); }, false); } else if (document.attachEvent) { if (self !== self.top) { document.attachEvent(yb, function() { if (document.readyState === 'complete') { document.detachEvent(yb, arguments.callee); Ab(); } }); } else { var Bb = function() { try { document.documentElement.doScroll('left'); Ab(); } catch (Cb) { setTimeout(Bb, 13); } }; Bb(); } } if (document.readyState === "complete") { Ab(); } })();};mboxSignaler = function(Db, J) { this.J = J; var Eb = J.getCookieNames('signal-'); for (var j = 0; j < Eb.length; j++) { var Fb = Eb[j]; var Gb = J.getCookie(Fb).split('&'); var Y = Db(Gb[0], Gb); Y.load(); J.deleteCookie(Fb); }};mboxSignaler.prototype.signal = function(Hb, ab ) { this.J.setCookie('signal-' + Hb, mboxShiftArray(arguments).join('&'), 45 * 60);};mboxList = function() { this.F = new Array();};mboxList.prototype.add = function(Y) { if (Y != null) { this.F[this.F.length] = Y; }};mboxList.prototype.get = function(ab) { var B = new mboxList(); for (var j = 0; j < this.F.length; j++) { var Y = this.F[j]; if (Y.getName() == ab) { B.add(Y); } } return B;};mboxList.prototype.getById = function(Ib) { return this.F[Ib];};mboxList.prototype.length = function() { return this.F.length;};mboxList.prototype.each = function(p) { if (typeof p != 'function') { throw 'Action must be a function, was: ' + typeof(p); } for (var j = 0; j < this.F.length; j++) { p(this.F[j]); }};mboxLocatorDefault = function(g) { this.g = 'mboxMarker-' + g; document.write('<div id="' + this.g + '" style="visibility:hidden;display:none">&nbsp;</div>');};mboxLocatorDefault.prototype.locate = function() { var Jb = document.getElementById(this.g); while (Jb != null) { if (Jb.nodeType == 1) { if (Jb.className == 'mboxDefault') { return Jb; } } Jb = Jb.previousSibling; } return null;};mboxLocatorDefault.prototype.force = function() { var Kb = document.createElement('div'); Kb.className = 'mboxDefault'; var Lb = document.getElementById(this.g); Lb.parentNode.insertBefore(Kb, Lb); return Kb;};mboxLocatorNode = function(Mb) { this.Jb = Mb;};mboxLocatorNode.prototype.locate = function() { return typeof this.Jb == 'string' ? document.getElementById(this.Jb) : this.Jb;};mboxLocatorNode.prototype.force = function() { return null;};mboxCreate = function(ab ) { var Y = mboxFactoryDefault.create( ab, mboxShiftArray(arguments)); if (Y) { Y.load(); } return Y;};mboxDefine = function(lb, ab ) { var Y = mboxFactoryDefault.create(ab, mboxShiftArray(mboxShiftArray(arguments)), lb); return Y;};mboxUpdate = function(ab ) { mboxFactoryDefault.update(ab, mboxShiftArray(arguments));};mbox = function(g, Nb, w, Ob, ob) { this.Pb = null; this.Qb = 0; this.nb = Ob; this.ob = ob; this.Rb = null; this.Sb = new mboxOfferContent(); this.Kb = null; this.w = w; this.message = ''; this.Tb = new Object(); this.Ub = 0; this.Nb = Nb; this.g = g; this.Vb(); w.addParameter('mbox', g) .addParameter('mboxId', Nb); this.Wb = function() {}; this.Xb = function() {}; this.Yb = null;};mbox.prototype.getId = function() { return this.Nb;};mbox.prototype.Vb = function() { if (this.g.length > 250) { throw "Mbox Name " + this.g + " exceeds max length of " + "250 characters."; } else if (this.g.match(/^\s+|\s+$/g)) { throw "Mbox Name " + this.g + " has leading/trailing whitespace(s)."; }};mbox.prototype.getName = function() { return this.g;};mbox.prototype.getParameters = function() { var c = this.w.getParameters(); var B = new Array(); for (var j = 0; j < c.length; j++) { if (c[j].name.indexOf('mbox') != 0) { B[B.length] = c[j].name + '=' + c[j].value; } } return B;};mbox.prototype.setOnLoad = function(p) { this.Xb = p; return this;};mbox.prototype.setMessage = function(pb) { this.message = pb; return this;};mbox.prototype.setOnError = function(Wb) { this.Wb = Wb; return this;};mbox.prototype.setFetcher = function(Zb) { if (this.Rb) { this.Rb.cancel(); } this.Rb = Zb; return this;};mbox.prototype.getFetcher = function() { return this.Rb;};mbox.prototype.load = function(c) { if (this.Rb == null) { return this; } this.setEventTime("load.start"); this.cancelTimeout(); this.Qb = 0; var w = (c && c.length > 0) ? this.w.clone().addParameters(c) : this.w; this.Rb.fetch(w); var X = this; this._b = setTimeout(function() { X.Wb('browser timeout', X.Rb.getType()); }, 15000); this.setEventTime("load.end"); return this;};mbox.prototype.loaded = function() { this.cancelTimeout(); if (!this.activate()) { var X = this; setTimeout(function() { X.loaded(); }, 100); }};mbox.prototype.activate = function() { if (this.Qb) { return this.Qb; } this.setEventTime('activate' + ++this.Ub + '.start'); if (this.show()) { this.cancelTimeout(); this.Qb = 1; } this.setEventTime('activate' + this.Ub + '.end'); return this.Qb;};mbox.prototype.isActivated = function() { return this.Qb;};mbox.prototype.setOffer = function(Sb) { if (Sb && Sb.show && Sb.setOnLoad) { this.Sb = Sb; } else { throw 'Invalid offer'; } return this;};mbox.prototype.getOffer = function() { return this.Sb;};mbox.prototype.show = function() { this.setEventTime('show.start'); var B = this.Sb.show(this); this.setEventTime(B == 1 ? "show.end.ok" : "show.end"); return B;};mbox.prototype.showContent = function(ac) { if (ac == null) { return 0; } if (this.Kb == null || !this.Kb.parentNode) { this.Kb = this.getDefaultDiv(); if (this.Kb == null) { return 0; } } if (this.Kb != ac) { this.bc(this.Kb); this.Kb.parentNode.replaceChild(ac, this.Kb); this.Kb = ac; } this.cc(ac); this.Xb(); return 1;};mbox.prototype.hide = function() { this.setEventTime('hide.start'); var B = this.showContent(this.getDefaultDiv()); this.setEventTime(B == 1 ? 'hide.end.ok' : 'hide.end.fail'); return B;};mbox.prototype.finalize = function() { this.setEventTime('finalize.start'); this.cancelTimeout(); if (this.getDefaultDiv() == null) { if (this.nb.force() != null) { this.setMessage('No default content, an empty one has been added'); } else { this.setMessage('Unable to locate mbox'); } } if (!this.activate()) { this.hide(); this.setEventTime('finalize.end.hide'); } this.setEventTime('finalize.end.ok');};mbox.prototype.cancelTimeout = function() { if (this._b) { clearTimeout(this._b); } if (this.Rb != null) { this.Rb.cancel(); }};mbox.prototype.getDiv = function() { return this.Kb;};mbox.prototype.getDefaultDiv = function() { if (this.Yb == null) { this.Yb = this.nb.locate(); } return this.Yb;};mbox.prototype.setEventTime = function(dc) { this.Tb[dc] = (new Date()).getTime();};mbox.prototype.getEventTimes = function() { return this.Tb;};mbox.prototype.getImportName = function() { return this.ob;};mbox.prototype.getURL = function() { return this.w.buildUrl();};mbox.prototype.getUrlBuilder = function() { return this.w;};mbox.prototype.ec = function(Kb) { return Kb.style.display != 'none';};mbox.prototype.cc = function(Kb) { this.fc(Kb, true);};mbox.prototype.bc = function(Kb) { this.fc(Kb, false);};mbox.prototype.fc = function(Kb, gc) { Kb.style.visibility = gc ? "visible" : "hidden"; Kb.style.display = gc ? "block" : "none";};mboxOfferContent = function() { this.Xb = function() {};};mboxOfferContent.prototype.show = function(Y) { var B = Y.showContent(document.getElementById(Y.getImportName())); if (B == 1) { this.Xb(); } return B;};mboxOfferContent.prototype.setOnLoad = function(Xb) { this.Xb = Xb;};mboxOfferAjax = function(ac) { this.ac = ac; this.Xb = function() {};};mboxOfferAjax.prototype.setOnLoad = function(Xb) { this.Xb = Xb;};mboxOfferAjax.prototype.show = function(Y) { var hc = document.createElement('div'); hc.id = Y.getImportName(); hc.innerHTML = this.ac; var B = Y.showContent(hc); if (B == 1) { this.Xb(); } return B;};mboxOfferDefault = function() { this.Xb = function() {};};mboxOfferDefault.prototype.setOnLoad = function(Xb) { this.Xb = Xb;};mboxOfferDefault.prototype.show = function(Y) { var B = Y.hide(); if (B == 1) { this.Xb(); } return B;};mboxCookieManager = function mboxCookieManager(g, ic) { this.g = g; this.ic = ic == '' || ic.indexOf('.') == -1 ? '' : '; domain=' + ic; this.jc = new mboxMap(); this.loadCookies();};mboxCookieManager.prototype.isEnabled = function() { this.setCookie('check', 'true', 60); this.loadCookies(); return this.getCookie('check') == 'true';};mboxCookieManager.prototype.setCookie = function(g, h, cb) { if (typeof g != 'undefined' && typeof h != 'undefined' && typeof cb != 'undefined') { var kc = new Object(); kc.name = g; kc.value = escape(h); kc.expireOn = Math.ceil(cb + new Date().getTime() / 1000); this.jc.put(g, kc); this.saveCookies(); }};mboxCookieManager.prototype.getCookie = function(g) { var kc = this.jc.get(g); return kc ? unescape(kc.value) : null;};mboxCookieManager.prototype.deleteCookie = function(g) { this.jc.remove(g); this.saveCookies();};mboxCookieManager.prototype.getCookieNames = function(lc) { var mc = new Array(); this.jc.each(function(g, kc) { if (g.indexOf(lc) == 0) { mc[mc.length] = g; } }); return mc;};mboxCookieManager.prototype.saveCookies = function() { var nc = new Array(); var oc = 0; this.jc.each(function(g, kc) { nc[nc.length] = g + '#' + kc.value + '#' + kc.expireOn; if (oc < kc.expireOn) { oc = kc.expireOn; } }); var pc = new Date(oc * 1000); document.cookie = this.g + '=' + nc.join('|') + '; expires=' + pc.toGMTString() + '; path=/' + this.ic;};mboxCookieManager.prototype.loadCookies = function() { this.jc = new mboxMap(); var qc = document.cookie.indexOf(this.g + '='); if (qc != -1) { var rc = document.cookie.indexOf(';', qc); if (rc == -1) { rc = document.cookie.indexOf(',', qc); if (rc == -1) { rc = document.cookie.length; } } var sc = document.cookie.substring( qc + this.g.length + 1, rc).split('|'); var tc = Math.ceil(new Date().getTime() / 1000); for (var j = 0; j < sc.length; j++) { var kc = sc[j].split('#'); if (tc <= kc[2]) { var uc = new Object(); uc.name = kc[0]; uc.value = kc[1]; uc.expireOn = kc[2]; this.jc.put(uc.name, uc); } } }};mboxSession = function(vc, wc, Fb, xc, J) { this.wc = wc; this.Fb = Fb; this.xc = xc; this.J = J; this.yc = false; this.Nb = typeof mboxForceSessionId != 'undefined' ? mboxForceSessionId : mboxGetPageParameter(this.wc); if (this.Nb == null || this.Nb.length == 0) { this.Nb = J.getCookie(Fb); if (this.Nb == null || this.Nb.length == 0) { this.Nb = vc; this.yc = true; } } J.setCookie(Fb, this.Nb, xc);};mboxSession.prototype.getId = function() { return this.Nb;};mboxSession.prototype.forceId = function(bb) { this.Nb = bb; this.J.setCookie(this.Fb, this.Nb, this.xc);};mboxPC = function(Fb, xc, J) { this.Fb = Fb; this.xc = xc; this.J = J; this.Nb = typeof mboxForcePCId != 'undefined' ? mboxForcePCId : J.getCookie(Fb); if (this.Nb != null) { J.setCookie(Fb, this.Nb, xc); }};mboxPC.prototype.getId = function() { return this.Nb;};mboxPC.prototype.forceId = function(bb) { if (this.Nb != bb) { this.Nb = bb; this.J.setCookie(this.Fb, this.Nb, this.xc); return true; } return false;};mboxGetPageParameter = function(g) { var B = null; var zc = new RegExp(g + "=([^\&]*)"); var Ac = zc.exec(document.location); if (Ac != null && Ac.length >= 2) { B = Ac[1]; } return B;};mboxSetCookie = function(g, h, cb) { return mboxFactoryDefault.getCookieManager().setCookie(g, h, cb);};mboxGetCookie = function(g) { return mboxFactoryDefault.getCookieManager().getCookie(g);};mboxCookiePageDomain = function() { var ic = (/([^:]*)(:[0-9]{0,5})?/).exec(document.location.host)[1]; var Bc = /[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}/; if (!Bc.exec(ic)) { var Cc = (/([^\.]+\.[^\.]{3}|[^\.]+\.[^\.]+\.[^\.]{2})$/).exec(ic); if (Cc) { ic = Cc[0]; } } return ic ? ic: "";};mboxShiftArray = function(Dc) { var B = new Array(); for (var j = 1; j < Dc.length; j++) { B[B.length] = Dc[j]; } return B;};mboxGenerateId = function() { return (new Date()).getTime() + "-" + Math.floor(Math.random() * 999999);};mboxScreenHeight = function() { return screen.height;};mboxScreenWidth = function() { return screen.width;};mboxBrowserWidth = function() { return (window.innerWidth) ? window.innerWidth : document.documentElement ? document.documentElement.clientWidth : document.body.clientWidth;};mboxBrowserHeight = function() { return (window.innerHeight) ? window.innerHeight : document.documentElement ? document.documentElement.clientHeight : document.body.clientHeight;};mboxBrowserTimeOffset = function() { return -new Date().getTimezoneOffset();};mboxScreenColorDepth = function() { return screen.pixelDepth;};if (typeof mboxVersion == 'undefined') { var mboxVersion = 40; var mboxFactories = new mboxMap(); var mboxFactoryDefault = new mboxFactory('guitarcenter.tt.omtrdc.net', 'guitarcenter', 'default');};if (mboxGetPageParameter("mboxDebug") != null || mboxFactoryDefault.getCookieManager() .getCookie("debug") != null) { setTimeout(function() { if (typeof mboxDebugLoaded == 'undefined') { alert('Could not load the remote debug.\nPlease check your connection' + ' to Test&amp;Target servers'); } }, 60*60); document.write('<' + 'scr' + 'ipt language="Javascript1.2" src=' + '"http://admin12.testandtarget.omniture.com/admin/mbox/mbox_debug.jsp?mboxServerHost=guitarcenter.tt.omtrdc.net' + '&clientCode=guitarcenter"><' + '\/scr' + 'ipt>');};
/*function tnt_fireSCIntegration(){ s.tl('TnT','o','TnT'); } function addLoadEvent(func) { var oldonload = window.onload; if (typeof oldonload != 'function') { window.onload = func; } else { window.onload = function() { oldonload(); func(); } } } addLoadEvent(tnt_fireSCIntegration);*/

var monthsPersistent=12;
eval(function(p,a,c,k,e,r){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('4 6=8(a,b,c,d,e){3.j=a;3.y=(b)?m v(b):P;3.n=(c)?c:\'/\';3.k=(d)?d:P;3.12=(e)?e:G};6.F=":";6.C="|";6.B.R=8(){4 a=m 1h();l(4 b 1a 3){5(b.w(0)!="o"&&13 3[b]!="8"){a.14(b+6.F+18(3[b]))}}4 c=3.j+"="+a.I(6.C);5(3.y){c+=";K="+3.y.L()}5(3.n){c+=";Q="+3.n}5(3.k){c+=";10="+3.k}5(3.12){c+=";17"}t.u=c};6.B.J=8(){4 a=t.u;5(a!=""&&a.g(3.j)!=-1){4 b=a.g(3.j)+(3.j.f+1);4 c=(a.g(";",b)!=-1)?a.g(";",b):a.f;4 d=a.16(b,c);4 e=d.7(6.C);l(4 i=0;i<e.f;i++){e[i]=e[i].7(6.F);3[e[i][0]]=S(e[i][1])}V 11}1l{V G}};6.B.1m=8(){4 a=m v("1/1/1o");4 b=3.j+"=;K="+a.L();5(3.n){b+=";Q="+3.n}5(3.k){b+=";10="+3.k}t.u=b};4 p=8(x){4 a=x.15().7(\',\'),H=a.f,z=G;l(i=0;i<H;i++){5(a[i].g(\'q.\')!=-1&&a[i].g(\'q.o\')==-1&&a[i].g(\'=\')!=-1&&a[i].7(\'=\')[1].f>0){z=11;A(\'r.\'+a[i].7(\'q.\')[1].7(\'=\')[0]+\'="\'+a[i].7(\'=\')[1]+\'"\')}}5(z)r.R()};4 M=N,N=8(){4 a=O,s=a.f,h=\'\',9=\'\';l(i=0;i<s;i++){9+=",\'"+a[i]+"\'";h+=a[i]+\',\'}5(9.w(2)!=\'o\'){p(h)};A(\'M(\'+(9).D(1)+\')\')};4 T=U,U=8(){4 a=O,s=a.f,h=\'\',9=\'\';l(i=0;i<s;i++){9+=",\'"+a[i]+"\'";h+=a[i]+\',\'}5(9.w(2)!=\'o\'){p(h)};A(\'T(\'+(9).D(1)+\')\')};4 E=m v(),W=E.1b(E.1c()+(1d(1e)*1f*1g*X*X*1i)),r=m 6(\'1j\',W,\'/\',1k());r.J();5(Y.Z.f>0){p(S(Y.Z.D(1)).7(\';\')[0].7(\'&\').I(\',\').1n(/19/1p,\'q\'))}',62,88,'|||this|var|if|Cookie|split|function|_argStr||||||length|indexOf|_params||_name|_domain|for|new|_path|_|updateProfile|profile|mboxProfile|_arlen|document|cookie|Date|charAt||_expiration|_update|eval|prototype|and|substr|_dateDP|equals|false|_plen|join|load|expires|toGMTString|xCr|mboxCreate|arguments|null|path|save|unescape|xUp|mboxUpdate|return|_expireDP|60|location|search|domain|true|_secure|typeof|push|toString|substring|secure|escape|mbxp|in|setTime|getTime|parseInt|monthsPersistent|30|24|Array|1000|mboxDP|mboxCookiePageDomain|else|remove|replace|1970|gi'.split('|'),0,{}));

/* -----------------------------------------------------------------
Since MBox is reliant on Omniture vars and needed to be pre-loaded
and not post loaded, we moved the function "getOmnitureDataObj"
from the omniture.js file to this file
------------------------------------------------------------------*/

var omnitureDebug=false; 

function getOmnitureDataObj(el) {
	//var str = $(el).text();
	var el = typeof(el)=='object' ? el : document.getElementById(el); 
	var str = el.innerHTML;
	
	// Use native JSON parsing if available otherwise
	// eval the object which should only fall to users of
	// IE < 8
	try{
		if (typeof(JSON) != 'undefined') {
			return JSON.parse(str);
		} else {
		// borrowed from jQuery source as an alternative
		// method of evaluating JSON in non supported browsers
			return ( new Function('return ' + str) )();
		}
	}catch(e){
		if(omnitureDebug && window.console && console.log && typeof(console.log) === "function") 
			console.log('Invalid Omniture JSON response! '+e.message); 
			
		return {}; 
	}
}

/* -----------------------------------------------------------------
Start Custom GC ATG JavaScript for MBox
Required parameters which is data off Omniture:
------------------------------------------------------------------*/
function testAndTarget() {
	
	var objOmniture=getOmnitureDataObj('omnitureReportData');

	var site_global = '';
	//var site_section = omniturePageName;
	var site_section = objOmniture.channel || '';
	//var page_name = omniturePageType;
	var page_name = objOmniture.pageName || '';
	//var productId = $('#ent_product_id').text();
	var site_category = objOmniture.prop2 || '';
	
	var productId = '';
	if (document.getElementById('ent_product_id')) {
		var productId = document.getElementById('ent_product_id').innerHTML;
	}
		
	var pageData=getOmnitureDataObj('pageData');
		
		site_global = 'GC_global';		
	
	//var testAndTarget = document.getElementById('mboxJS')
	 
	var isInternational = pageData.isInternational && pageData.isInternational.toLowerCase()=="true" ? "true" : "false",  
			checkoutVersion = pageData.checkoutVersion && parseInt(pageData.checkoutVersion) ? parseInt(pageData.checkoutVersion) : 1, 
			sourceNameValue = pageData.sourceName ? pageData.sourceName : '', 
			sourceNameValuePair = 'sourceName='+sourceNameValue; 
	
	if (!productId) { 
		//var strMbox = 'mboxCreate(\''+ site_global +'\', \'site_section='+ site_section +'\', \'page_name='+ page_name +'\');';
		mboxCreate(site_global, 'site_section=' + site_section, 'page_name=' + page_name,'site_category=' +site_category, 'checkoutVersion='+checkoutVersion, 'isInternational='+isInternational, sourceNameValuePair);
	}else{
		//var strMbox = 'mboxCreate(\''+ site_global +'\', \'site_section='+ site_section +'\', \'page_name='+ page_name +'\', \'productId='+ productId +'\');';
		mboxCreate(site_global, 'site_section=' + site_section, 'page_name=' + page_name, 'productId=' + productId,'site_category=' +site_category, 'checkoutVersion='+checkoutVersion, 'isInternational='+isInternational, sourceNameValuePair);
	}	
		
	if(page_name.indexOf('order confirmation')!=-1){
		
		var productString = objOmniture.products || "";
		var products = productString.split(",");
		var orderTotal=0;
		var productIDs="";
		
		// split the product string in to an array and split each product into an array to access the price and id
		for(i=0; i<products.length; i++){
			products[i]= products[i].split(";");
			orderTotal += parseFloat(products[i][3]);
			var sku = products[i][5].replace(/^(.*)(eVar11=)/gi , '');
			productIDs+=sku;
			
			if(i<products.length-1){
				productIDs += ',';
			}
		}
		
		mboxCreate('orderConfirmPage', 'orderId='+ objOmniture.purchaseID, 'orderTotal=' + orderTotal, 'productPurchasedId='+ productIDs, 'checkoutVersion='+checkoutVersion, 'isInternational='+isInternational, sourceNameValuePair);		
	}	
	
}
