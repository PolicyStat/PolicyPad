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

function parseChangeset(changeset) {
  var parts = changeset.split('$');
  
  if (changeset.substring(0,2) != "Z:")  {
      return null;
  }
  if (parts.length != 2) {
      return null;
  }
  
  var bank = parts[1];
  changeset = parts[0].substring(2);

  convBase36 = function(str) { return parseInt(str, 36); }

  parts = changeset.match(/^(\w+)([><])(\w+)/);
  if (!parts) {
    return null;
  }
  oldlen = convBase36(parts[1]);
  newlen = convBase36(parts[3]);
  switch (parts[2])
  {
    case '<':
      newlen = oldlen - newlen;
      break;
    case '>':
      newlen += oldlen;
      break;
    default:
      return null;
  }

  changeset = changeset.substring(parts[0].length);

  function OpIterator(changeset) {
    this._lens = changeset.split(/[|=+*-]/);
    this._ops = changeset.split(/\w+/);
    this._lens.shift();
    this._ops.pop();
  }
  OpIterator.prototype.next = function() {
    var iterator = this;

    if (this._lens.length == 0)
      throw StopIteration;

    var nextPart = function() {
      return {op: iterator._ops.shift(), len: convBase36(iterator._lens.shift())};
    }

    var newlines = 0;
    var attribs = [];
    var part = nextPart();
    while (part.op == '|' || part.op == '*') {
      if (part.op == '|') {
        newlines = part.len;
      } else {
        attribs.push(part.len);
      }
      part = nextPart();
    }

    part.newlines = newlines;
    part.attribs = attribs;

    return part;
  }
  OpIterator.prototype.__iterator__ = function() { return this; }

  var ops = new OpIterator(changeset);

  return {
    prefix: "Z:" + parts[0],
    ops: ops,
    oldlen: oldlen,
    newlen: newlen,
    bank: bank
  };
}

/**
 * Takes oldText and applies the given changeset to it.
 * @param {String} oldText The original text to modify.
 * @param {String} changeset The changeset to apply the document
 * @return A new document, transformed by the changeset
 */
function applyChangeset(oldText, changeset) {
  var res = ''; 
  
  var fail = function() {
    return null;
  }

  parsed = parseChangeset(changeset);
  if (!parsed)
    return fail();
  if (oldText.length != parsed.oldlen) {
    return fail();
  }

  //TODO: update attribs
  var i = 0;
  for (var part in parsed.ops) {
    switch (part.op) {
      case '=':
        change = oldText.substring(i, i + part.len);
        if (change.split('\n').length-1 != part.newlines) {
          return fail();
        }
        res += change;
        i += part.len;
        break;
      case '+':
        res += parsed.bank.substring(0, part.len);
        parsed.bank = parsed.bank.substring(part.len);
        break;
      case '-':
        if (oldText.substring(i, i + part.len).split('\n').length-1 != part.newlines) {
          return fail();
        }
        i += part.len;
        break;
    }
  }
  
  //The rest of the document is unchanged
  res += oldText.substring(i);

  if (res.length != newlen) {
    return fail();
  }

  return res;
}

function optimizeChangeset(oldText, changeset) {

  parsed = parseChangeset(changeset);

  optimized = parsed.prefix;
  var append_part = function(part) {
    var packNum = function(num) { return num.toString(36).toLowerCase(); };
    for (var i = 0; i < part.attribs.length; i++) {
      optimized += "*" + part.attribs[i];
    }
    if (part.newlines > 0)
      optimized += "|" + packNum(part.newlines);
    optimized += part.op + packNum(part.len);
  };

  var compareAttribs = function(attribs1, attribs2) {
    attribs1 = attribs1.slice(0);
    attribs2 = attribs2.slice(0);

    if (attribs1.length != attribs2.length)
      return false;

    for (var i = 0; i < attribs1.length; i++)
      if (attribs1[i] != attribs2[i])
        return false;

    return true;
  };

  pot = "";

  var prevPart = null;
  for (var part in parsed.ops) {
    if (prevPart && prevPart.op == part.op && compareAttribs(prevPart.attribs, part.attribs)) {
      switch (part.op) {
        case '+':
          pot += parsed.bank.substring(0, part.len);
          parsed.bank = parsed.bank.substring(part.len);
          break;
      }
      prevPart.len += part.len;
      prevPart.newlines += part.newlines;
    } else {
      if (prevPart) {
        append_part(prevPart);
        prevPart = null;
      }
      switch (part.op) {
        case '=':
          prevPart = part;
          break;
        case '+':
          pot += parsed.bank.substring(0, part.len);
          parsed.bank = parsed.bank.substring(part.len);
          prevPart = part;
          break;
        case '-':
          prevPart = part;
          break;
      }
    }
  }

  if (prevPart)
    append_part(prevPart);

  optimized += "$" + pot;

  return optimized;
}

/**
 * Generates a changeset that conveys the changes from the old text (o)
 * to the new text (n)
 *
 * Based on John Resig's JavaScript diff algorithm
 */
function generateChangeset(oldText, newText){

    function _newlines(t) {
        var newlines = t.match(/\n/g);
        if (newlines == null) {
            return '';
        }
        return '|' + newlines.length;
    }

    function _diff(o, n){
        var ns = {}; 
        var os = {};
        var i;
        var x = null;
        for (i=0; i<n.length; i++) {
            if (ns[n[i]] == x) {
                ns[n[i]] = {rows:[], o:x};
            }
            ns[n[i]].rows.push(i)
        }
        for (i=0; i<o.length; i++) {
            if(os[o[i]] == x) {
                os[o[i]] = {rows:[], n:x};
            }
            os[o[i]].rows.push(i);
        }
        for (i in ns){
            if (ns[i].rows.length == 1 && typeof(os[i]) != 'undefined' && os[i].rows.length == 1){
                n[ns[i].rows[0]] = {text:n[ns[i].rows[0]], row:os[i].rows[0]};
                o[os[i].rows[0]] = {text:o[os[i].rows[0]], row:ns[i].rows[0]};
            }
        }
        for (i=0; i<n.length-1; i++){
            if (n[i].text != x && n[i+1].text == x && n[i].row + 1 < o.length 
                && o[n[i].row+1].text == x && n[i+1]==o[n[i].row+1]) {
                n[i+1] = {text:n[i+1], row:n[i].row+1};
                o[n[i].row+1] = {text:o[n[i].row+1], row:i+1};
            }
        }
        for(i=n.length-1; i>0; i--){
            if(n[i].text!=x && n[i-1].text==x && n[i].row>0 && o[n[i].row-1].text==x &&
            n[i-1] == o[n[i].row-1]) {
                n[i-1] = {text:n[i-1], row:n[i].row - 1};
                o[n[i].row-1] = {text:o[n[i].row-1], row:i - 1};
            }
        }
        return {o:o, n:n}
    }

    var packNum = function(num) { return num.toString(36).toLowerCase(); };
    var str = 'Z:' + packNum(oldText.length);
    str += newText.length > oldText.length 
        ? '>' + packNum(newText.length - oldText.length) 
        : '<' + packNum(oldText.length - newText.length); 
    var out = _diff(oldText == '' ? [] : oldText.split(/ /), newText == '' ? [] : newText.split(/ /));
    var pot = '';
    var i;
    var pre;
    var potentialStr = '';
    var currentText;
    //var oSpace = o.match(/\s+/g);
    var oSpace = oldText.match(/ /g);
    //var nSpace = n.match(/\s+/g);
    var nSpace = newText.match(/ /g);
    var start = true

    if (oSpace == null) {
        oSpace=[];
    }

    if (nSpace == null) {
        nSpace=[];
    }
    
    /* Handle the case where we delete everything */
    if (out.n.length == 0) { 
        for(i=0; i<out.o.length; i++) {
            currentText = out.o[i] + (i >= oSpace.length ? '' : oSpace[i]);
            str += potentialStr;
            str += _newlines(currentText) + '-' + packNum(currentText.length);
            potentialStr = '';
            start = false;
        }
    }
    else {

        /* Handle the case where we delete the first word */
        if (out.n[0].text == null) {
            for(n=0; n<out.o.length && out.o[n].text==null; n++) {
                currentText = out.o[n] + (n >= oSpace.length ? '' : oSpace[n]);
                str += potentialStr;
                str += _newlines(currentText) + '-' + packNum(currentText.length);
                potentialStr = '';
                start = false;
            }
        }

        for (i=0; i<out.n.length; i++) {

            /* Additions */
            if (out.n[i].text == null) {
                currentText = out.n[i] + (i >= nSpace.length ? '' : nSpace[i]);
                str += potentialStr;
                str += '*0' + _newlines(currentText) + '+' + packNum(currentText.length);
                potentialStr = '';
                pot += currentText;
                start = false;
            }

            else {
                pre='';

                /* Deletions */
                for (n = out.n[i].row+1; n < out.o.length && out.o[n].text == null; n++) {
                    currentText = out.o[n] + (n >= oSpace.length ? '' : oSpace[n]);
                    pre += _newlines(currentText) + '-' + packNum(currentText.length);
                }

                /* Skips */
                currentText = out.n[i].text + (i >= oSpace.length ? '' : oSpace[i]);
                start = false;
                if (pre == '') {
                    potentialStr += _newlines(currentText) + '=' + packNum(currentText.length);
                } else {
                    str += potentialStr;
                    str += _newlines(currentText) + '=' + packNum(currentText.length) + pre;
                    potentialStr = '';
                }

            }
        }
    }
    result = optimizeChangeset(oldText, str + '$' + pot);
    if (applyChangeset(oldText, result) != newText) {
        alert("Changeset Generation Failed");
    }
    return optimizeChangeset(oldText, str + '$' + pot);
}

function mergeChangeset(cs1, cs2) {
    // TODO: Check if code like this already exists
    // Particularly check changeset.js in same directory - written by our team???
    return '';
}
