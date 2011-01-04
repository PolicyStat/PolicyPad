#!/usr/bin/python

import httplib

con = httplib.HTTPConnection("kevinwells.homeip.net", 8082)
con.connect()
params = {
"Host": "kevinwells.homeip.net:8082",
"User-Agent": "Mozilla/5.0 (X11; U; Linux x86_64; en-US; rv:1.9.2.12) Gecko/20101027 Ubuntu/10.04 (lucid) Firefox/3.6.12",
"Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
"Accept-Language": "en-us,en;q=0.5",
"Accept-Encoding": "gzip,deflate",
"Accept-Charset": "ISO-8859-1,utf-8;q=0.7,*;q=0.7",
"Keep-Alive": "115",
"Connection": "keep-alive",
"Referer": "http://kevinwells.homeip.net:8083/comet/test.html",
"Origin": "http://kevinwells.homeip.net:8083"
}

url = "/comet/channel?v=2&r=300213452569&id=302230364768&channel=shortpolling&new=yes&create=yes&seq=0"

con.request("GET", url, headers=params)

response = con.getresponse()
print response
print dir(response)
print response.getheaders()
print response.msg
print response.read()

con.close()



