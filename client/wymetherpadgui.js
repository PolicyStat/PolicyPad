
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

  //check when certain events happen in wymeditor 
  // var wrapMsg = function(msg, func) {
  //   return function() {
  //     alert(msg);
  //     return func.apply(this, arguments);
  //   };
  // };
  // wym.update = wrapMsg("update accessed", wym.update);
  // wym.wrap = wrapMsg("Wrap accessed", wym.wrap);
  // wym.unwrap = wrapMsg("unwrap accessed", wym.unwrap);

  //Add button to toolbar
  jQuery(wym._box).find(wym._options.toolsSelector + wym._options.toolsListSelector).append(this._options.sButtonHtml);

  //handle click event
  jQuery(wym._box).find(this._options.sButtonSelector).click(function() {
    etherpad.testGuiEvent();
    return(false);
  });
  
  //register keyup handler
  jQuery(this._doc).bind("keyup", function(evt) { etherpad.submitChanges(); });
  
  //example code
  // jQuery(this._box).find(this._options.toolSelector).hover(
  //     function() { wym.status('hover'); },
  //     function() { wym.status('hi'); }
  // );
  etherpad.init();
}

//BEGIN WymEtherpadCallbacks interface

WymEtherpadGUI.prototype.status = function(msg) {
  if (!this._options.doStatus)
    return;

  this._wym.status(msg);
  // setTimeout(function() {
  //   //FIXME: this did not work as intended (funcStatus will not return the
  //   //current value?)
  //   if (funcStatus() == msg)
  //     funcStatus('');
  // }, 5000);
}

WymEtherpadGUI.prototype.setTextEnabled = function(enabled) {
  //TODO: implement
}

WymEtherpadGUI.prototype.html = function(val) {
  return this._wym.html(val)
}

WymEtherpadGUI.prototype.refreshUsers = function() {
  //TODO: implement
}

//END WymEtherpadCallbacks interface

WymEtherpadGUI.prototype.submitChanges = function() {
  this._etherpad.submitChanges();
}
