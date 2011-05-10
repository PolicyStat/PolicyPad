
function WymEtherpadGUI(guioptions, options, wym) {
  this._wym = wym
  var etherpad = new WymEtherpad(options, this);
  this._etherpad = etherpad;
  this._sel = null;
  //funcStatus: function(msg) { return wym.status(msg); },
  //create the GUI
  var initial_options = {
    doStatus: true
  };
  this._options = jQuery.extend(initial_options, guioptions);

  var handleUIEvent = function() {
    etherpad.submitChanges();
  };

  // Automatically send changes
  // WymEtherpad should check to see if there are actually changes
  setInterval(handleUIEvent, 250);
  setInterval(handleUIEvent, 2000);

  //register keyup handler
  //jQuery(this._doc).bind("keyup", handleUIEvent("keyup"));

  etherpad.init();
}

//BEGIN WymEtherpadCallbacks interface
// status(msg, persistent)
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

WymEtherpadGUI.prototype.xhtml = function() {
  return this._wym.xhtml().replace(/\r/g, "");
}

WymEtherpadGUI.prototype.html = function(val) {
  //either return the document's current html
  if (val === undefined)
    return this._wym.html().replace(/\r/g, "");

  //or set the value of the field, keeping the same selection
  this._wym.html(val);
}

WymEtherpadGUI.prototype.saveSelection = function() {
  var sel = this._wym.selection();
  this._selection = rangy.serializeSelection(sel, true);
  //this.status('selection: ' + this._selection);

}

WymEtherpadGUI.prototype.restoreSelection = function() {
  wym_window = function(wym) {
    var iframe = wym._iframe;
    var win = (iframe.contentDocument && iframe.contentDocument.defaultView) ?
      iframe.contentDocument.defaultView : iframe.contentWindow;
    return win;
  }

  var win = wym_window(this._wym);

  try {
    rangy.deserializeSelection(this._selection, undefined, win);
  } catch (e) {
    this.status("Failed to restore selection");
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
