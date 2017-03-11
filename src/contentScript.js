
var XPathObj = (function (document, undefined) {


    /**
      * @desc - Returns XPath of given DOM element
      * @param string elem - DOM element
      * @returns string - XPath of DOM element
    */
    var elementXPath = function (elem) {
        var allNodes;
        if (document.all !== undefined) {
            allNodes = document.all;
        } else {
            allNodes = document.getElementsByTagName('*');
        }
        for (var segs = []; elem && elem.nodeType == 1; elem = elem.parentNode) {       //Bubbles up
            if (elem.hasAttribute('id')) {
                var uniqueIdCount = 0;
                for (var n = 0; n < allNodes.length; n++) {
                    if (allNodes[n].hasAttribute('id') && allNodes[n].id == elem.id) uniqueIdCount++;
                    if (uniqueIdCount > 1) break;
                };
                if (uniqueIdCount == 1) {
                    segs.unshift('id("' + elem.getAttribute('id') + '")');
                    return segs.join('/');
                } else {
                    segs.unshift(elem.localName.toLowerCase() + '[@id="' + elem.getAttribute('id') + '"]');
                }
            } else if (elem.hasAttribute('class')) {
                segs.unshift(elem.localName.toLowerCase() + '[@class="' + elem.getAttribute('class') + '"]');
            } else {
                for (i = 1, sib = elem.previousSibling; sib; sib = sib.previousSibling) {
                    if (sib.localName == elem.localName) i++;
                };
                segs.unshift(elem.localName.toLowerCase() + '[' + i + ']');
            };
        };
        return segs.length ? '/' + segs.join('/') : null;
    }

    //Public
    return {
        getXPath: elementXPath
    };

})(document);

var _clickedElem;

/**
* Event Listener for mouse down event
**/
document.addEventListener("mousedown", function (event) {
    //right click
    if (event.button == 2) {
        _clickedElem = event.target;
    }
}, true);



/**
* Listener to receive message
**/
chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
      if (request.getXPath === true)
          if (_clickedElem) {
              var _xpath;
              _xpath = XPathObj.getXPath(_clickedElem);
              sendResponse({ xpath: _xpath });
          }

  });