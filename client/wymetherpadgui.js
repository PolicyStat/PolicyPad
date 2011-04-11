
function WymEtherpadGUI(guioptions, options, wym) {
  this._wym = wym
  var etherpad = new WymEtherpad(options, this);
  this._etherpad = etherpad;
  this._sel = null;
  //funcStatus: function(msg) { return wym.status(msg); },
  //create the GUI
  var initial_options = {
    //sUrl:          wym._options.basePath + "plugins/tidy/tidy.php",
    sButtonHtml:     "<li class='wym_tools_strong'>"
                     + "<a name='AboutEtherpad' href='#'"
                     //+ " style='background-image:"
                     //+ " url(" + wym._options.basePath + "plugins/tidy/wand.png)'>"
                     + ">"
                     + "About Etherpad"
                     + "</a></li>",
    sButtonSelector: "li.wym_tools_strong a",
    doStatus: true
  };
  this._options = jQuery.extend(initial_options, guioptions);

  var handleUIEvent = function() {
    etherpad.submitChanges();
  };

  // Automatically send changes
  // WymEtherpad should check to see if there are actually changes
  setInterval(handleUIEvent, 250);

  //register keyup handler
  //jQuery(this._doc).bind("keyup", handleUIEvent("keyup"));

  //Add button to toolbar
  jQuery(wym._box).find(wym._options.toolsSelector + wym._options.toolsListSelector).append(this._options.sButtonHtml);

  //handle click event
  jQuery(wym._box).find(this._options.sButtonSelector).click(function() {
    etherpad.testGuiEvent();
    return(false);
  });
  
  
  //example code
  // jQuery(this._box).find(this._options.toolSelector).hover(
  //     function() { wym.status('hover'); },
  //     function() { wym.status('hi'); }
  // );
  etherpad.init();
}

//BEGIN WymEtherpadCallbacks interface

WymEtherpadGUI.prototype.status = function(msg, persistent) {
  var etherpadgui = this;

  if (!this._options.doStatus)
    return;

  this._wym.status(msg);
  if (msg == '')
    return;

  getStatus = function() {
    return jQuery(etherpadgui._wym._box).find(etherpadgui._wym._options.statusSelector).html();
  }
  if (persistent === undefined || persistent == false) {
    setTimeout(function() {
      if (getStatus() == msg)
        etherpadgui._wym.status('');
    }, 5000);
  }
}

WymEtherpadGUI.prototype.setTextEnabled = function(enabled) {
  //TODO: implement
}

function wym_window(wym) {
  var iframe = wym._iframe;
  var win = (iframe.contentDocument && iframe.contentDocument.defaultView) ?
    iframe.contentDocument.defaultView : iframe.contentWindow;
  return win;
}

WymEtherpadGUI.prototype.html = function(val) {
  if (val === undefined) {
    return this._wym.xhtml().replace(/\r/g, "");
  }

  sel = this._wym.selection();
  win = wym_window(this._wym);
  serialized = rangy.serializeSelection(sel, true);
  this.status('selection: ' + serialized);
  this._wym.html(val);
  if (sel)
    try {
      rangy.deserializeSelection(serialized, undefined, win);
      //rangy.restoreSelection(sel, true);
    } catch (e) {
      //this.status("Failed to restore selection");
    }

/*
  var sel = rangy.saveSelection();
  //var root = jQuery(this._wym._doc.body)[0];
  var root = null;
  //var serialized = rangy.serializeSelection(null, true, root);
  var serialized = rangy.serializeSelection(sel, true);
  this.status(serialized);
  this._wym.html(val);
  try {
    sel = rangy.deserializeSelection(serialized, root);
  } catch (e) {
    //this.status("selection broke: " + serialized);
  }
  //rangy.restoreSelection(sel, true);
  */
}

WymEtherpadGUI.prototype.refreshUsers = function() {
    var msg = "";
    var i;
    var users = this._etherpad.getUserList();
    for (i=0; i<users.length; i++) {
    	msg = msg + users[i].name + '\r\n';
    }
    $('#userlist').text(msg);
}

//END WymEtherpadCallbacks interface

WymEtherpadGUI.prototype.submitChanges = function() {
  this._etherpad.submitChanges();
}
