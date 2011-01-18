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

//constructor
function WymEtherpad(options, wym) {
    
  var initial_options = {
    funcLog: null,
    funcStatus: null,
    host: '',
    padId: ''
  };
  
  this._options = jQuery.extend(initial_options, options);
  this._wym = wym;
};

//WymEtherpad initialization
WymEtherpad.prototype.init = function() {

  var etherpad = this;

  //Get our initial data
  this.status("Connecting to server...");
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
  
};

//BEGIN public interface

WymEtherpad.prototype.submitChanges = function() {
  this.log("Key event");
  if (!this._changecb)
    return;
  this._changecb();
}

WymEtherpad.prototype.testGuiEvent = function() {
  var wym = this._wym;

  this.log("You clicked on the toolbar");
};

//BEGIN 'private' methods

WymEtherpad.prototype.log = function(msg) {
  var funcLog = this._options.funcLog;
  if (funcLog)
    funcLog(msg);
}

WymEtherpad.prototype.status = function(msg) {
  var funcStatus = this._options.funcStatus;
  if (funcStatus) {
    funcStatus(msg);
    setTimeout(function() {
      //FIXME: this did not work as intended (funcStatus will not return the
      //current value?)
      if (funcStatus() == msg)
        funcStatus('');
    }, 5000);
  }
}

WymEtherpad.prototype.getPadValues = function(host, padName, callback) {
  var etherpad = this;

  var url = 'http://' + host + '/' + padName;
  $.get(url, function(data) {
    var clientJson = data.match(/var (clientVars = .*;)/)[1];
    etherpad.log("Retrieved data: " + clientJson);
    //FIXME: using eval here is bad, but issues with JSON.parse prevent this
    //from working...
    eval(clientJson);
    callback(clientVars);
  });
}

//BEGIN Ace2Editor interface

WymEtherpad.prototype.setProperty = function(key, val)
{
    this.log("Setting property (" + key + "): " + val);
}

WymEtherpad.prototype.setBaseAttributedText = function(initialText, apool)
{
  var etherpad = this;

  this.log("setBaseAttributedText(" + JSON.stringify(initialText) + ", " + JSON.stringify(apool) + ")");
  this._wym.html(initialText.text);
  
  //Create our document wrapper around this._wym.html to track changes
  this._doc = new EtherpadDocument(function(val){ return etherpad._wym.html(val) });
  this.status("Connected");
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
      changeset: this._doc.generateChangeset(),
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
    this._doc.applyChangeset(changeset, apool);
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