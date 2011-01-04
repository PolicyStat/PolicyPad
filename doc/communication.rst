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

Connecting
----------
Based on some test code from Joe Cornelli and the Rudel team, here is a simple
look at the steps that establish a working connection with a pad:

Verify Pad Existence
^^^^^^^^^^^^^^^^^^^^
By making a single ``GET`` request to the pad's URL, we can determine whether or
not the pad already exists. A status of 200 (OK) on the request means that the
pad exists and can be accessed, while a redirect means that the pad has yet to
be created. At this point, if we wish to continue and the pad does not exist, we
must create the pad.

Get Initial User Variables
^^^^^^^^^^^^^^^^^^^^^^^^^^
Once our initial request to the pad is successful, we can save the page data
that it sends back to parse out our initial session variables. The following is
a list of the useful attributes in this step:

* ``userId``
* ``clientIp``
* ``collab_client_vars``
* ``rev``
* ``initialAttributedText``
* ``attribs``
* ``text``
* ``initialRevisionList``

Define Connection ID
^^^^^^^^^^^^^^^^^^^^
At this point we define an ``id`` and ``key`` value for our session. These are
both random integers in the range [0, 1e12].

Open Comet Channel
^^^^^^^^^^^^^^^^^^
For this request and all of the requests following it, you may notice that the
communication is happening not with the pad URL, but with a universal comet URL
on the server. Because of this, and because the pad ID is not passed to the
server via the URL, for these requests to work the ``Referer`` header of the
request must be the URL of the pad.

Here we make a ``GET`` request to open the initial comet channel. This request
will have the same protocol, host, and port, as the pad, but will have a url
of::

 /comet/channel?v=2&r=<R>&id=<ID>&channel=shortpolling&seq=0

Where ``<ID>`` is the random integer generated in the previous step and ``<R>``
is another randomly generated number unique to each request between 0 and 1e12.
This is followed by a second request, similar to the first, but without the
``create`` URL parameter.  This ``GET`` request is made to the following URL:: 

 /comet/channel?v=2&r=<R>&id=<ID>&channel=shortpolling&seq=0


Set Channel Parameters
^^^^^^^^^^^^^^^^^^^^^^
This is the first ``POST`` request made, and also the first request with a body.
To set the channel parameters, we post the following data::

 oob=useChannel%3A1%3Ashortpolling

to this URL::

 /comet/post?v=2&r=<R>&id=<ID>&seq=0

First Streaming Channel
^^^^^^^^^^^^^^^^^^^^^^^
At this point we make our first streaming channel connection. This is not the
connection that will remain open and receive the data, however, but rather an
intermediate step. To open the channel, we make a ``POST`` request to this
URL:: 

 /comet/channel?v=2&r=<R>&id=<ID>&channel=streaming&new=yes&create=yes&seq=0

Announce Client
^^^^^^^^^^^^^^^
Here we send our first changeset, which announces our name, registering our user
on the pad. This changeset is wrapped up in the format described above, and is
posted to the following URL::

 /comet/post?v=2&r=<R>&id=<ID>&seq=0

Ask for xhrXdFrame
^^^^^^^^^^^^^^^^^^
This is a somewhat mysterious step, and also the first one to use the key value
generated earlier. In this step we make a ``GET`` request to a somewhat strange
URL:: 

 http://<KEY>.comet.<HOST>:<PORT>/comet/xhrXdFrame

This url is similar to previous ones, except that prepended to the standard host
and port combinations is the ``<KEY>.comet`` subdomain (where ``<KEY>`` is the
integer key generated previously).

Set Up Streaming Channel
^^^^^^^^^^^^^^^^^^^^^^^^
Here we finally set up the longpolling streaming channel that will receive
changesets from the server. To do this we must make two requests. The first is a
``POST`` to this URL::

 /post?v=2&r=<R>&id=<ID>&seq=0

with the following body::

 oob=useChannel%3A2%3Astreaming

and the second (the one that will actually remain open and receive data) is a
``GET`` request made to the following URL::

 /comet/channel?v=2&r=%%s&id=%s&channel=streaming&new=yes&create=yes&seq=0

Once this connection is open, the client should receive changesets of the form
described above as changes are made to the pad.
