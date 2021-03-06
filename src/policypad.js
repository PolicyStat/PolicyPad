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
function PolicyPad(options, callbacks) {
    
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
  this._ace2editor = null;
};

//PolicyPad initialization
PolicyPad.prototype.init = function() {

  var etherpad = this;

  //connect to EtherPad
  this._connectAttempts = 0;
  this.connect();
};

//BEGIN public interface

PolicyPad.prototype.submitChanges = function() {
  if (!this._changecb || this._doc.hasPendingChangeset() || !this._doc.isModified()) {
    //this.log("Key event ignored");
    return;
  }
  //this.log("Key event");
  this._changecb();
}

PolicyPad.prototype.getUserList = function() {
  return this._client.getConnectedUsers();
};

//BEGIN 'private' methods

PolicyPad.prototype.log = function(msg) {
  var funcLog = this._options.funcLog;
  if (funcLog)
    funcLog(msg);
}

PolicyPad.prototype.status = function(msg, persistent) {
  this._callbacks.status(msg, persistent);
}

PolicyPad.prototype.connect = function() {
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
    if (etherpad._ace2editor) {
      etherpad._ace2editor.enabled = false;
      do_nothing = function() {};
      etherpad._client.setOnUserJoin(do_nothing);
      etherpad._client.setOnUserLeave(do_nothing);
      etherpad._client.setOnUpdateUserInfo(do_nothing);
      etherpad._client.setOnChannelStateChange(do_nothing);
      etherpad._client.setOnClientMessage(do_nothing);
      etherpad._client.setOnInternalAction(do_nothing);
      etherpad._client.setOnConnectionTrouble(do_nothing);
      etherpad._client.setOnServerMessage(do_nothing);
    }
    etherpad._ace2editor = (function() {
      var callbacks = this;
      this.enabled = true;
      var wrap_call = function(func) {
        return function() {
          if (callbacks.enabled)
            return func.apply(etherpad, arguments);
        };
      };
      this.setProperty = wrap_call(etherpad.setProperty);
      this.setBaseAttributedText = wrap_call(etherpad.setBaseAttributedText);
      this.setUserChangeNotificationCallback = wrap_call(etherpad.setUserChangeNotificationCallback);
      this.prepareUserChangeset = wrap_call(etherpad.prepareUserChangeset);
      this.applyChangesToBase = wrap_call(etherpad.applyChangesToBase);
      this.applyPreparedChangesetToBase = wrap_call(etherpad.applyPreparedChangesetToBase);
      this.setAuthorInfo = wrap_call(etherpad.setAuthorInfo);
      this.getUnhandledErrors = wrap_call(etherpad.getUnhandledErrors);
      return this;
    })();
    etherpad._client = getCollabClient(etherpad._ace2editor, clientVars.collab_client_vars, userInfo, { colorPalette: clientVars.colorPalette });
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

PolicyPad.prototype.getPadValues = function(host, padId, cb) {
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

PolicyPad.prototype.setProperty = function(key, val) {
  this.log("Setting property (" + key + "): " + val);
}

PolicyPad.prototype.setBaseAttributedText = function(initialText, apool) {
  var etherpad = this;

  this.log("setBaseAttributedText(" + JSON.stringify(initialText) + ", " + JSON.stringify(apool) + ")");

  //Create our document wrapper around this._etherpad.html to track changes
  this._doc = new EtherpadDocument(function(val){ return etherpad._callbacks.html(val) },
                                   function()   { return etherpad._callbacks.xhtml()   },
                                   initialText);
}

PolicyPad.prototype.setUserChangeNotificationCallback = function(cb) {
  this.log("setUserChangeNotificationCallback(cb)");
  this._changecb = cb;
}

PolicyPad.prototype.prepareUserChangeset = function() {
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

PolicyPad.prototype.applyChangesToBase = function(changeset, author, apool) {
  this.log("applyChangesToBase(" + changeset + ", " + author + ", " + JSON.stringify(apool) + ")");
  this._callbacks.saveSelection();
  this._doc.applyChangeset(changeset, apool);
  this._callbacks.restoreSelection();
}

PolicyPad.prototype.applyPreparedChangesetToBase = function() {
  this.log("applyPreparedChangesetToBase()");
  this._doc.changesetAccepted();
}

PolicyPad.prototype.setAuthorInfo = function(userId, userInfo) {
  this.log("setAuthorInfo(" + userId + ", " + JSON.stringify(userInfo) + ")");
}

PolicyPad.prototype.getUnhandledErrors = function() {
  this.log("E: getUnhandledErrors()");
  return [];
}
//END Ace2Editor interface

//BEGIN CollabClient callbacks

PolicyPad.prototype.onUserJoin = function(userInfo) {
  this.log("onUserJoin(" + JSON.stringify(userInfo) + ")"); 
    this._callbacks.refreshUsers();
}

PolicyPad.prototype.onUserLeave = function(userInfo) {
  this.log("onUserLeave(" + JSON.stringify(userInfo) + ")");
  this._callbacks.refreshUsers();
}

PolicyPad.prototype.onUpdateUserInfo = function(userInfo) {
  this.log("onUpdateUserInfo(" + JSON.stringify(userInfo) + ")");
  this._callbacks.refreshUsers();
}

PolicyPad.prototype.onChannelStateChange = function(channelState,	moreInfo) {
  this.log("onChannelStateChange(" + channelState + ", " + moreInfo + ")");
  if (channelState == "DISCONNECTED") {
    this.connect();
  }
}

PolicyPad.prototype.onClientMessage = function(payload) {
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

PolicyPad.prototype.onInternalAction = function(str) {
  this.log("onInternalAction(" + str + ")");
}

PolicyPad.prototype.onConnectionTrouble = function(str) {
  this.log("onConnectionTrouble(" + str + ")");
  if (str == "OK") {
    this.status('');
  } else if (str == "SLOW") {
    this.connect();
  }
}

PolicyPad.prototype.onServerMessage = function(payload) {
  this.log("onServerMessage(" + JSON.stringify(payload) + ")");
  this.status("Broadcast message from server: " + payload.text);
  //onServerMessage({"type":"NOTICE","js":"","text":"I am you administrator!"})
  //server wants us to eval js, HAH!
}

