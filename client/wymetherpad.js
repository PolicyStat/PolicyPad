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
function WymEtherpad(options, callbacks) {
    
  var initial_options = {
    funcLog: null,
    funcStatus: null,
    host: '',
    padId: '',
    username: '',
    initialText: null
  };
  
  this._options = jQuery.extend(initial_options, options);
  this._callbacks = callbacks;
  this._initialized = false;
};

//WymEtherpad initialization
WymEtherpad.prototype.init = function() {

  var etherpad = this;

  //connect to EtherPad
  this._connectAttempts = 0;
  this.connect();
};

//BEGIN public interface

WymEtherpad.prototype.submitChanges = function() {
  if (!this._changecb || this._doc.hasPendingChangeset() || !this._doc.isModified()) {
    //this.log("Key event ignored");
    return;
  }
  //this.log("Key event");
  this._changecb();
}

WymEtherpad.prototype.getUserList = function() {
  return this._client.getConnectedUsers();
};

//BEGIN 'private' methods

WymEtherpad.prototype.log = function(msg) {
  var funcLog = this._options.funcLog;
  if (funcLog)
    funcLog(msg);
}

WymEtherpad.prototype.status = function(msg, persistent) {
  this._callbacks.status(msg, persistent);
}

WymEtherpad.prototype.connect = function() {
  var etherpad = this;

  //Get our initial data
  if (this._connectAttempts == 0) {
    this.status("Connecting to server...");
  } else {
    this.status("Reconnecting to server...");
  }

  this.getPadValues(this._options.host || window.location.host, this._options.padId, function(clientVars) {
    //Create our client, using the data from clientVars
    etherpad._clientVars = clientVars;
    userInfo = {
      userId:    clientVars.userId,
      name:      etherpad._options.username || clientVars.username,
      ip:        clientVars.clientIp,
      colorId:   clientVars.userColor,
      userAgent: padutils.uaDisplay(clientVars.userAgent)
    };
    //FIXME: unregister callbacks if etherpad._client already exists! 
    etherpad._client = getCollabClient(etherpad, clientVars.collab_client_vars, userInfo, { colorPalette: clientVars.colorPalette });
    etherpad._client.setOnUserJoin(          function(userInfo)               {etherpad.onUserJoin(userInfo);});
    etherpad._client.setOnUserLeave(         function(userInfo)               {etherpad.onUserLeave(userInfo);});
    etherpad._client.setOnUpdateUserInfo(    function(userInfo)               {etherpad.onUpdateUserInfo(userInfo);});
    etherpad._client.setOnChannelStateChange(function(channelState, moreInfo) {etherpad.onChannelStateChange(channelState,	moreInfo);});
    etherpad._client.setOnClientMessage(     function(payload)                {etherpad.onClientMessage(payload);});
    etherpad._client.setOnInternalAction(    function(str)                    {etherpad.onInternalAction(str);});
    etherpad._client.setOnConnectionTrouble( function(str)                    {etherpad.onConnectionTrouble(str);});
    etherpad._client.setOnServerMessage(     function(payload)                {etherpad.onServerMessage(payload);});

    etherpad._connectAttempts++;
  });
}

WymEtherpad.prototype.getPadValues = function(host, padId, cb) {
  var etherpad = this;

  var url = 'http://' + host + '/' + padId;

  parsePad = function(create) { 
    return function(data) {
      var clientJson = data.match(/var (clientVars = .*;)/)[1];
      etherpad.log("Retrieved data: " + clientJson);
      //FIXME: using eval here is bad, but issues with JSON.parse prevent this
      //from working...
      eval(clientJson);
      if (create && (!clientVars || !clientVars.collab_client_vars)) {
        var url = 'http://' + host + '/ep/pad/create';
        $.post(url, {'padId': padId}, parsePad(false));
      } else {
        cb(clientVars);
      }
    }
  }

  $.get(url, parsePad(true));
}

//BEGIN Ace2Editor interface

WymEtherpad.prototype.setProperty = function(key, val) {
  this.log("Setting property (" + key + "): " + val);
}

WymEtherpad.prototype.setBaseAttributedText = function(initialText, apool) {
  var etherpad = this;

  this.log("setBaseAttributedText(" + JSON.stringify(initialText) + ", " + JSON.stringify(apool) + ")");

  //Create our document wrapper around this._etherpad.html to track changes
  this._doc = new EtherpadDocument(function(val){ return etherpad._callbacks.html(val) },
                                   function()   { return etherpad._callbacks.xhtml()   },
                                   initialText);
}

WymEtherpad.prototype.setUserChangeNotificationCallback = function(cb) {
  this.log("setUserChangeNotificationCallback(cb)");
  this._changecb = cb;
}

WymEtherpad.prototype.prepareUserChangeset = function() {
  this.log("E: prepareUserChangeset()");
  this._callbacks.saveSelection();
  changeset = this._doc.generateChangeset();
  this._callbacks.restoreSelection();
  payload = {
    changeset: changeset,
    apool: {
            numToAttrib: {0: ["author", this._clientVars.userId]},
            nextNum: 1} 
  };
  this.log(JSON.stringify(payload))
  if (changeset != null)
    this.status("Sending changes...", true);
  return payload;
}

WymEtherpad.prototype.applyChangesToBase = function(changeset, author, apool) {
  this.log("applyChangesToBase(" + changeset + ", " + author + ", " + JSON.stringify(apool) + ")");
  this._callbacks.saveSelection();
  this._doc.applyChangeset(changeset, apool);
  this._callbacks.restoreSelection();
}

WymEtherpad.prototype.applyPreparedChangesetToBase = function() {
  this.log("applyPreparedChangesetToBase()");
  this._doc.changesetAccepted();
}

WymEtherpad.prototype.setAuthorInfo = function(userId, userInfo) {
  this.log("setAuthorInfo(" + userId + ", " + JSON.stringify(userInfo) + ")");
}

WymEtherpad.prototype.getUnhandledErrors = function() {
  this.log("E: getUnhandledErrors()");
  return [];
}
//END Ace2Editor interface

//BEGIN CollabClient callbacks

WymEtherpad.prototype.onUserJoin = function(userInfo) {
  this.log("onUserJoin(" + JSON.stringify(userInfo) + ")"); 
    this._callbacks.refreshUsers();
}

WymEtherpad.prototype.onUserLeave = function(userInfo) {
  this.log("onUserLeave(" + JSON.stringify(userInfo) + ")");
  this._callbacks.refreshUsers();
}

WymEtherpad.prototype.onUpdateUserInfo = function(userInfo) {
  this.log("onUpdateUserInfo(" + JSON.stringify(userInfo) + ")");
  this._callbacks.refreshUsers();
}

WymEtherpad.prototype.onChannelStateChange = function(channelState,	moreInfo) {
  this.log("onChannelStateChange(" + channelState + ", " + moreInfo + ")");
}

WymEtherpad.prototype.onClientMessage = function(payload) {
  this.log("onClientMessage(" + JSON.stringify(payload) + ")");

  if (payload.type == "padoptions") {
    if (!this._initialized && this._client.getConnectedUsers().length == 1 && this._options.initialText) {
      this._callbacks.html(this._options.initialText);
      this.submitChanges();
    } 
    this._initialized = true;
    this.status("Connected");
  }

}

WymEtherpad.prototype.onInternalAction = function(str) {
  this.log("onInternalAction(" + str + ")");
}

WymEtherpad.prototype.onConnectionTrouble = function(str) {
  this.log("onConnectionTrouble(" + str + ")");
  if (str == "OK") {
    this.status('');
  } else if (str == "SLOW") {
    this.connect();
  }
}

WymEtherpad.prototype.onServerMessage = function(payload) {
  this.log("onServerMessage(" + JSON.stringify(payload) + ")");
  this.status("Broadcast message from server: " + payload.text);
  //onServerMessage({"type":"NOTICE","js":"","text":"I am you administrator!"})
  //server wants us to eval js, HAH!
}

