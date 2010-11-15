Client-Server Communication
===========================

Protocols
---------
EtherPad uses what appears to be an implementation of Comet communication when
sending communication from the server to the client application. This appears as
a single http GET request that never closes, but simply recieves data payloads
as they are pushed by the server.

Communications from the client to the server, however, occur as standard http
POST actions, sending a single instance of a data payload to the server.

Both the server-to-client and client-to-server payloads are JSON data and take a
similar form, which is described below

Payloads
--------
Each data payload has a top-level form that includes a single string denoted by
the ``type`` attribute describing the general category the payload falls under, as
well as a ``data`` attribute that contains the actual payload data. Thus, each
payload follows the form:: 

 {
     "type": "COLLABROOM",
     "data": {...}
 }

In this example, the type is ``COLLABROOM``. This is the standard type used for
sending information about changes to the document. There are several variations
of this type of payload, which are described below.

Standard Changeset from Server
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
A simple changeset set from the server to the client may take the following
form:: 

 {
     "type":"COLLABROOM",
     "data": {
                 "changeset": "Z:53>1|3=n=44*0+1$f",
                 "newRev": 5,
                 "type": "NEW_CHANGES",
                 "author": "g.cchcrhyw49vxvseg",
                 "apool": {
                              "getAttrib": { "prototype":{} },
                              "getAttribKey": { "prototype":{} },
                              "putAttrib": { "prototype":{} },
                              "fromJsonable": { "prototype":{} },
                              "eachAttrib": { "prototype":{} },
                              "getAttribValue": { "prototype":{} },
                              "toJsonable": { "prototype":{} },
                              "nextNum": 1,
                              "attribToNum": { "author,g.cchcrhyw49vxvseg": 0},
                              "numToAttrib": {"0": ["author", "g.cchcrhyw49vxvseg"]
                          }
             }
 }

This payload includes the following attributes:

``changeset``
    The actual changeset data to be applied to the current document.

``newRev``
    The current revision number (to be updated on the client document to assure
    synchronization).

``type``
    A string denoting the type of the changeset.

``author``
    The EtherPad internal representation of an author (not the author's display
    name).

``apool``
    The attribute pool to be used by the changeset. This includes both rich text
    and authorship attributes.

Standard Changeset from Client
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
A simple changeset from the client to server is very similar to the
server-client changeset, but does contain a few differences. Take the following
simple changeset as an example:: 

 {
     "type": "COLLABROOM",
     "data": {
                 "type": "USER_CHANGES",
                 "baseRev": 15,
                 "changeset": "Z:5g>1|a=5f*0+1$f",
                 "apool": {
                              "numToAttrib": {"0": ["author","g.h6y05mkauwxotsvx"]},
                              "nextNum":1
                          }
              }
 }

This set of changes is obviously smaller than the one sent by the server, as it
doesn't contain nearly as many attribues inside ``apool``. There are a few key
changes that differentiate also differentiate a client-sent changeset from a
server-sent one:

``type``
    The type of a client-sent changeset is ``USER_CHANGES`` instead of
    ``NEW_CHANGES``.

``baseRev``
    Instead of containing a ``newRev`` attribute denoting the version number to
    increment the document to, the client-sent changeset contains a base
    revision from which to apply the change to.

The ``author`` attribute is also missing entirely from the client-sent
changeset. It should be noted that authorship information is still included
within the changeset and the attribute pool.
