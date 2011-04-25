
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
// status(msg, persistent)
// setTextEnabled(enabled)
// html([val])
// refreshUsers()

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

WymEtherpadGUI.prototype.xhtml = function() {
  return this._wym.xhtml().replace(/\r/g, "");
}

WymEtherpadGUI.prototype.html = function(val) {
  //either return the document's current html
  if (val === undefined)
    return this._wym.html();

  //or set the value of the field, keeping the same selection
  wym_window = function(wym) {
    var iframe = wym._iframe;
    var win = (iframe.contentDocument && iframe.contentDocument.defaultView) ?
      iframe.contentDocument.defaultView : iframe.contentWindow;
    return win;
  }

  var sel = this._wym.selection();
  var win = wym_window(this._wym);
  serialized = rangy.serializeSelection(sel, true);
  //this.status('selection: ' + serialized);
  this._wym.html(val);
  if (sel) {
    try {
      rangy.deserializeSelection(serialized, undefined, win);
    } catch (e) {
      this.status("Failed to restore selection");
    }
  }
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
