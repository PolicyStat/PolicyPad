
function WymEtherpadGUI(guioptions, options, wym) {
  this._wym = wym
  var etherpad = new WymEtherpad(options, this);
  this._etherpad = etherpad;
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

  //TODO: finish handling user changes
  // //check when certain events happen in wymeditor 
  // var waitSubmit = function() {
  //   setTimeout(function() {
  //     etherpad.submitChanges();
  //   }, 250);
  // };
  // var wrapSubmit = function(msg, func) {
  //   return function() {
  //     var res = func.apply(this, arguments);
  //     options.funcLog(msg);
  //     //etherpad.submitChanges();
  //     return res;
  //   };
  // };
  // var wrapSubmitOnNoReturn = function(msg, func) {
  //   return function() {
  //     var res = func.apply(this, arguments);
  //     if (!res) {
  //       options.funcLog(msg);
  //       //etherpad.submitChanges();
  //     }
  //     return res;
  //   };
  // };

  var handleUIEvent = function(msg) {
    return function() {
      options.funcLog(msg);
      etherpad.submitChanges();
    };
  }

  // Automatically send changes
  // WymEtherpad should check to see if there are actually changes
  var 
  setInterval(function() {
     handleUIEvent("timer tick");
  }, 250);

  // wym.html = wrapSubmitOnNoReturn("html edit", wym.html);
  // wym.exec = wrapSubmit("exec", wym.exec);
  // wym.paste = wrapSubmit("paste", wym.paste);
  // wym.insert = wrapSubmit("insert", wym.insert);
  // wym.wrap = wrapSubmit("wrap", wym.wrap);
  // wym.unwrap = wrapSubmit("unwrap", wym.unwrap);
  // wym.toggleClass = wrapSubmit("toggleClass", wym.toggleClass);
  // wym.dialog = wrapSubmit("dialog", wym.dialog);
  // //not useful: wym.replaceStrings = wrapSubmit("replaceStrings", wym.replaceStrings);
  // wym.encloseStrings = wrapSubmit("encloseStrings", wym.encloseStrings);
  
  //register keyup handler
  //jQuery(this._doc).bind("keyup", handleUIEvent("keyup"));
  //TODO: finish implementing these
  //jQuery(this._wym.box).find(this._wym._options.iframeSelector).bind("mouseup", handleUIEvent("mouseup"));
  //jQuery(this._doc).bind("focus", handleUIEvent("focus"));

  // var wrapMsg = function(msg, func) {
  //   return function() {
  //     alert(msg);
  //     return func.apply(this, arguments);
  //   };
  // };
  // wym.update = wrapMsg("update accessed", wym.update);
  // wym.wrap = wrapMsg("Wrap accessed", wym.wrap);
  // wym.unwrap = wrapMsg("unwrap accessed", wym.unwrap);
  // jQuery(this._wym._box).find(this._wym._options.toolSelector).click(waitSubmit);

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

WymEtherpadGUI.prototype.status = function(msg) {
  var etherpadgui = this;

  if (!this._options.doStatus)
    return;

  this._wym.status(msg);
  getStatus = function() {
    return jQuery(etherpadgui._wym._box).find(etherpadgui._wym._options.statusSelector).html();
  }
  setTimeout(function() {
    if (getStatus() == msg)
      etherpadgui._wym.status('');
  }, 5000);
}

WymEtherpadGUI.prototype.setTextEnabled = function(enabled) {
  //TODO: implement
}

WymEtherpadGUI.prototype.html = function(val) {
  return this._wym.html(val)
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
