/***************************************************************
*
*  PMK I hate IE
*
*  Copyright notice
*
*  (c) 2009 Peter Klein  (pmk@io.dk)
*  All rights reserved
*
*  Released under the GNU General Public License as published by
*  the Free Software Foundation; either version 2 of the License, or
*  (at your option) any later version.
*
*  The GNU General Public License can be found at
*  http://www.gnu.org/copyleft/gpl.html.
*
*  This script is distributed in the hope that it will be useful,
*  but WITHOUT ANY WARRANTY; without even the implied warranty of
*  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
*
*  This copyright notice MUST APPEAR in all copies of this script
*
***************************************************************
* Displays a fake IE "infobar" on Internet Explorer browsers
* (Similar to the annoying ActiveX infobar) with user defined text and link.
* Can be used to try persuading IE6 users to upgrade.
* Customizable "Hate level", so you can decide which IE versions
* should display the infobar.
*
* Tested in IE5.5, IE6, IE7 & IE8 with both Strict and Quirks mode
*
* Differences between this and a real infobar:
* The real infobar attaches itself to a new viewport, making it 
* appear at the top of the browser window until the user closes it.
* The fake infobar is attached to the current viewport, so when you
* scroll the page, the infobar scrolls too.
***************************************************************/

function ihateie(options) {
	// Versions of IE below or equal to this value, triggers the hatebar
	var hatelevel = options.hatelevel || 6;

	var resizehandler = function() {
		var width = document.documentElement.clientWidth || document.body.clientWidth;
		// This is a perefect example of why IE SUCKS!!
		// The resize event is attached to the window object, so you would assume that the event fires
		// when the browserwindow is resized. It does, but it also fires the event on ALL elements
		// on the page, making it running an endless loop which crashes the browser.
		// To fix that, you need to check if it's really the browserwindow width/height that have changed.
		if(this.curwidth != width) {
			document.getElementById("iehatebar").style.width = width;
		}
		this.curwidth = width;
	}

	var closebar = function() {
		window.detachEvent('onresize',resizehandler);
		window.detachEvent('onclick',closebar);
		document.body.removeChild(document.getElementById("iehatebar"))
	}
		
	// Find IE Browser version
	var bv = (navigator.appVersion.indexOf("MSIE") != -1) ? parseFloat(navigator.appVersion.split("MSIE")[1]): 999;

	if (bv<=hatelevel) {
		if (bv<=6) {
			// Really old crap
			var msg = options.ie6text || "Your web browser is outdated! Click here for information on upgrading to a better browser."
			var href = options.ie6link || "http://www.mozilla.com/firefox/";
			var title = options.ie6title || "Your web browser is outdated!"
			var image = options.ie6icon || "typo3conf/ext/pmkihateie/res/warning.gif";
		};
		else if (bv==7) {
			// Old crap
			var msg = options.ie7text || "You are using an inferior browser. You should consider changing to a better browser, such as: Firefox, Safari, Opera or Chrome."
			var href = options.ie7link || "http://www.mozilla.com/firefox/";
			var title = options.ie7title || "You are using an inferior browser."
			var image = options.ie7icon || "typo3conf/ext/pmkihateie/res/warning.gif";
		}
		else if (bv>7) {
			// New crap
			var msg = options.ie8text || "You are using an inferior browser. You should consider changing to a better browser, such as: Firefox, Safari, Opera or Chrome."
			var href = options.ie8link || "http://mashable.com/2009/07/16/ie6-must-die/";
			var title = options.ie8title || "You are using an inferior browser."
			var image = options.ie8icon || "typo3conf/ext/pmkihateie/res/warning.gif";
		}

		// Create DIV container for the bar
    	var iehatebar = document.createElement("div");
		iehatebar.id ="iehatebar";
		iehatebar.style.width = (document.documentElement.clientWidth || document.body.clientWidth);
		iehatebar.style.marginTop = -parseInt(document.body.currentStyle.marginTop)-parseInt(document.body.currentStyle.paddingTop);
		iehatebar.style.marginRight = -parseInt(document.body.currentStyle.marginRight)-parseInt(document.body.currentStyle.paddingRight);
		iehatebar.style.marginBottom = parseInt(document.body.currentStyle.marginBottom)+parseInt(document.body.currentStyle.paddingBottom);
		iehatebar.style.marginLeft = -parseInt(document.body.currentStyle.marginLeft)-parseInt(document.body.currentStyle.paddingLeft);
		document.body.insertBefore(iehatebar,document.body.firstChild);
		
		// Create A tag for the infotext in the bar
		var iehatebartext = document.createElement("a");
		iehatebartext.appendChild(document.createTextNode(msg));
		iehatebartext.id ="iehatebartext";
		iehatebartext.href = href;
		iehatebartext.target = "_blank";
		iehatebartext.title = title;
		iehatebartext.style.backgroundImage = "url("+image+")";
		iehatebar.appendChild(iehatebartext);
		
		// Create A tag for the closebutton in the bar
		var iehatebarclose = document.createElement("a");
		iehatebarclose.id ="iehatebarclose";
		iehatebarclose.title = options.closetitle || "Click to close infobar";
		iehatebarclose.attachEvent('onclick',closebar);
		iehatebar.appendChild(iehatebarclose);
		
		// Attach Resizehandler
		window.attachEvent('onresize',resizehandler);

		// Cleanup to prevent memory leaks
		iehatebarclose.attachEvent('onunload',closebar);

		// Simple animation using IE filter transition.
		// Unfortunatly there's no filter for pushing down content.
		iehatebar.filters.item(0).Apply();
		iehatebar.style.display="block";
		iehatebar.filters.item(0).Play();
	}
}

