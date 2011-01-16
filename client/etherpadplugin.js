/**
* Copyright 2010 PolicyPad 
* 
* Licensed under the Apache License, Version 2.0 (the "License"); 
* you may not use this file except in compliance with the License. 
* You may obtain a copy of the License at 
*
*     http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software 
* distributed under the License is distributed on an "AS IS" BASIS, 
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. 
* See the License for the specific language governing permissions and 
* limitations under the License.
*/

/* Useful methods in wymeditor
insert(string) -> void - insert text at current cursor position
html([string]) -> [string] - get/set html content
xhtml() -> string - get xhtml content
status(string) => void - display text in editor's status bar

*/


//Extend WYMeditor
WYMeditor.editor.prototype.etherpad = function(options) {
  var etherpad = new WymEtherpad(options, this);
  this._etherpad = etherpad;
  //FIXME: MAKE THE GUI HERE
  return(etherpad);
};

// constructor
function WymEtherpad(options, wym) {
    
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

    funcLog: null,
    host: ''
  };
  
  this._options = jQuery.extend(initial_options, options);
  this._wym = wym;
};

//WymEtherpad initialization
WymEtherpad.prototype.init = function() {

  var etherpad = this;

  jQuery(this._wym._box).find(this._wym._options.toolsSelector + this._wym._options.toolsListSelector).append(this._options.sButtonHtml);

  //handle click event
  jQuery(this._wym._box).find(this._options.sButtonSelector).click(function() {
    etherpad.toolbaritem_clicked();
    return(false);
  });
  
  //register keyup handler
  jQuery(this._wym._doc).bind("keyup", function(evt) { etherpad.on_keyup(evt); });

  this.getPadValues(this._options.host || window.location.host, this._options.padId, function(clientVars) {
    //Create our client, using the data from clientVars
    etherpad._clientVars = clientVars;
    userInfo = {
      userId:    clientVars.userId,
      name:      clientVars.userName,
      ip:        clientVars.clientIp,
      colorId:   clientVars.userColor,
      userAgent: padutils.uaDisplay(clientVars.userAgent)
    };
    etherpad._client = getCollabClient(etherpad, clientVars.collab_client_vars, userInfo, { colorPalette: clientVars.colorPalette });
    etherpad._client.setOnUserJoin(          function(userInfo)               {etherpad.onUserJoin(userInfo);});
    etherpad._client.setOnUserLeave(         function(userInfo)               {etherpad.onUserLeave(userInfo);});
    etherpad._client.setOnUpdateUserInfo(    function(userInfo)               {etherpad.onUpdateUserInfo(userInfo);});
    etherpad._client.setOnChannelStateChange(function(channelState,	moreInfo) {etherpad.onChannelStateChange(channelState,	moreInfo);});
    etherpad._client.setOnClientMessage(     function(payload)                {etherpad.onClientMessage(payload);});
    etherpad._client.setOnInternalAction(    function(str)                    {etherpad.onInternalAction(str);});
    etherpad._client.setOnConnectionTrouble( function(str)                    {etherpad.onConnectionTrouble(str);});
    etherpad._client.setOnServerMessage(     function(payload)                {etherpad.onServerMessage(payload);});
  });
  
  //example code
  // jQuery(this._box).find(this._options.toolSelector).hover(
  //     function() { wym.status('hover'); },
  //     function() { wym.status('hi'); }
  // );

};

WymEtherpad.prototype.on_keyup = function(evt) {
  this.log("Key event");
  if (!this._changecb)
    return;
  this._changecb();
}

WymEtherpad.prototype.toolbaritem_clicked = function() {
  var wym = this._wym;

  this.log("You clicked on the toolbar");

};

WymEtherpad.prototype.log = function(msg) {
  var funcLog = this._options.funcLog;
  if (funcLog)
    funcLog(msg);
}

WymEtherpad.prototype.getPadValues = function(host, padName, callback) {
  var etherpad = this;

  var url = 'http://' + host + '/' + padName;
  $.get(url, function(data) {
    var clientJson = data.match(/var clientVars = (.*);/)[1];
    etherpad.log("Retrieved data: " + clientJson);
    var clientVars = JSON.parse(clientJson);
    callback(clientVars);
  });
}

WymEtherpad.prototype.manualPushChanges = function() {
  this._changecb();
}

//BEGIN Ace2Editor interface

WymEtherpad.prototype.setProperty = function(key, val)
{
    this.log("Setting property (" + key + "): " + val);
}

WymEtherpad.prototype.setBaseAttributedText = function(initialText, apool)
{
    this.log("setBaseAttributedText(" + JSON.stringify(initialText) + ", " + JSON.stringify(apool) + ")");
    this._wym.html(initialText.text);
    this._last = initialText.text; //TODO: manage revisions a bit better
}

WymEtherpad.prototype.setUserChangeNotificationCallback = function(cb)
{
    this.log("setUserChangeNotificationCallback(cb)");
    this._changecb = cb;
}

WymEtherpad.prototype.prepareUserChangeset = function()
{
    this.log("E: prepareUserChangeset()");
    payload = {
      //changeset: generateChangeset(this._last, this._wym.html()),
      changeset: "Z:d>1=1*0+1$a",//TODO: Use real changset: generateChangeset(this._last, this._wym.html()),
      apool: {
              numToAttrib: {0: ["author", this._clientVars.userId]},
              nextNum: 1} //TODO: populate with real data
    };
    this.log(JSON.stringify(payload))
    return payload;
}

WymEtherpad.prototype.applyChangesToBase = function(changeset, author, apool)
{
    this.log("applyChangesToBase(" + changeset + ", " + author + ", " + JSON.stringify(apool) + ")");
}

WymEtherpad.prototype.applyPreparedChangesetToBase = function()
{
    this.log("applyPreparedChangesetToBase()");
}

WymEtherpad.prototype.setAuthorInfo = function(userId, userInfo)
{
    this.log("setAuthorInfo(" + userId + ", " + JSON.stringify(userInfo) + ")");
}

WymEtherpad.prototype.getUnhandledErrors = function()
{
    this.log("E: getUnhandledErrors()");
    return [];
}
//END Ace2Editor interface

//BEGIN CollabClient callbacks

WymEtherpad.prototype.onUserJoin = function(userInfo)
{
    this.log("onUserJoin(" + JSON.stringify(userInfo) + ")"); }

WymEtherpad.prototype.onUserLeave = function(userInfo)
{
    this.log("onUserLeave(" + JSON.stringify(userInfo) + ")");
}

WymEtherpad.prototype.onUpdateUserInfo = function(userInfo)
{
    this.log("onUpdateUserInfo(" + JSON.stringify(userInfo) + ")");
}

WymEtherpad.prototype.onChannelStateChange = function(channelState,	moreInfo)
{
    this.log("onChannelStateChange(" + channelState + ", " + moreInfo + ")");
}

WymEtherpad.prototype.onClientMessage = function(payload)
{
    this.log("onClientMessage(" + JSON.stringify(payload) + ")");
}

WymEtherpad.prototype.onInternalAction = function(str)
{
    this.log("onInternalAction(" + str + ")");
}

WymEtherpad.prototype.onConnectionTrouble = function(str)
{
    this.log("onConnectionTrouble(" + str + ")");
}

WymEtherpad.prototype.onServerMessage = function(payload)
{
    this.log("onServerMessage(" + JSON.stringify(payload) + ")");
}
