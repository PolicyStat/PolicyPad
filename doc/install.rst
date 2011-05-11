Installation
============

There are two main ways to set up a locally hosted EtherPad environment: with
EtherPad being the root web server that actually interacts directly with port 80
of your host, and with EtherPad passing through a proxy. Unfortunately, it does
not seem as though EtherPad was ever designed with the intention of being hosted
anywhere besides the root of the web server. The steps to set up EtherPad behind
and nginx proxy are listed here, but they admittedly are very buggy and will
likely cause EtherPad not to work. This matter will be investigated more in the
future, hopefully resulting in a working installation model that involves a
proxy.

Base Installation
-----------------

All of the steps for this installation are based on a fresh installation of
Ubuntu 10.04 LTS Server Edition. We first start by adding the EtherPad package
repository to our aptitude sources::

    # bash -c 'echo "deb http://apt.etherpad.org all ." >> /etc/apt/sources.list'

We now install the EtherPad package. Please note that this package has a lot of
dependencies and will likely take a very long time to install::

    # aptitude update
    # aptitude install etherpad

Now we need to fix a reference that points the EtherPad init script at the wrong
directory::

    # sed -i 's|/usr/local/etherpad|/usr/share/etherpad|g' /etc/init.d/etherpad

At this point we now have EtherPad full installed. The question now becomes how
to host it properly. Below are the two possibilities for hosting. Note that, as
mentioned above, the second method of hosting, which includes hiding EtherPad
behind a proxy, does not function correctly; it is merely as far as we have been
able to get in hosting EtherPad in this fashion.

Hosting With Pure EtherPad
--------------------------
This version of hosting is much easier to set up, but forces a very strange sort
of URL when accessing PolicyPad materials, as they are stored as static content
within EtherPad. It does seem to be the most reliable form of hosting, though,
so as long as this URL discrepancy isn't a huge problem, this is the recommended
way to set up PolicyPad.

First, we need to let the EtherPad daemon run as root since we will be moving it
from its default port of 9000 to port 80::

    # sed -i 's/--chuid etherpad:etherpad//' /etc/init.d/etherpad

On that same note, we'll actually need to change the port we want EtherPad to
use in its configuration file and init.d script::

    # sed -i 's/listen = 9000/listen = 80/' /etc/etherpad/etherpad.local.properties
    # sed -i 's/9000/80/' /etc/init.d/etherpad

At this point we can actually start the EtherPad service. To do so, use the
init.d script provided by the software::

    # service etherpad start

You should now be able to browse to your server via http and see a standard
EtherPad installation.

Adding PolicyPad to your EtherPad installation is simple at this ponit. First
install Git and move to the static directory for EtherPad::

    # aptitude install git-core
    # cd /usr/share/etherpad/etherpad/src/static

Then simply clone the PolicyPad repository::

    # git clone https://jetheis@github.com/jetheis/PolicyPad.git

Now you should be able to browse to
http://your.server/static/demos/wymeditor/launcher.html and use
the PolicyPad sytem.

Hosting With a Proxy
--------------------
Remember, this set of steps for hosting EtherPad is unstable at this moment and
will likely result in PolicyPad not working correctly. It is simply a starting
point from which we hope to eventually develop a consistantly working solution.

First, install the nginx webserver and git::

    # aptitude install nginx git

Now edit the system nginx configuration file (/etc/nginx/nginx.conf), adding the
following section inside the default http section::

    server {
        listen       80;
        server_name  your.domain;
        root         /var/www/PolicyPad;
 
    location /client {
        
    }
 
    location / {
        proxy_pass http://localhost:9000;
        proxy_set_header Host $host;
    }
  }

Now set up a location for the PolicyPad files inside your web root::

    # cd /var/www
    # git clone https://jetheis@github.com/jetheis/PolicyPad.git

Finally, bring up both the nginx and EtherPad web services. EtherPad by default
will serve on port 9000, and nginx will send all requests not to /client to it.
EtherPad seems to work alright under these conditions, but PolicyPad does not
seem to be able to connect or exchange data with EtherPad. There is a
`StackOverflow question <http://stackoverflow.com/questions/1160454/nginx-proxy-to-comet>`_ 
dealing with
allowing Comet communication through Nginx, as well as an `Nginx module <http://pushmodule.slact.net/>`_ that sets up a simple Commet implementation. One
of these is likely to yield a favorable result, once some more time is spent on
it.

Hosting on a Different Subdomain
--------------------------------

Hosting EtherPad on a different subdomain than the pages using PolicyPad is
probably the best choice, as it allows more or less complete freedom in the
location and URL structure of pages making use of PolicyPad. To set this up,
first follow the instructions above for the pure EtherPad hosting style. You
should configure this to exist on a subdomain of the site you plan on hosting
your PolicyPad pages from.

Once pure EtherPad on a subdomain is set up, the editor plugin using PolicyPad
needs to be initialized with a different host than ``window.location``. This can
be specified in the initialization options for WYMeditor::

  jQuery('.wymeditor').wymeditor({ html: '',
                                   postInit: function(wym) {
                                       wym.etherpad({}, {padId: 'somepadid',
                                                         initialText: 'sometext',
                                                         username: 'someuser',
                                                         host: 'myhost.mydomain'})
                                       }
                                   });

Additional plugins written for other editors will need to support the ability to
specify a different hostname, as seen here.
