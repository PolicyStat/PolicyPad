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


/**
 * Takes oldText and applies the given changeset to it.
 * @param {String} oldText The original text to modify.
 * @param {String} changeset The changeset to apply the document
 * @return A new document, transformed by the changeset
 */
function applyChangeset(oldText, changeset) {
  var trueChangeset = changeset;
  var res = '';
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

  if (oldText.length != oldlen) {
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
    if (this._lens.length == 0)
      throw StopIteration;
    return {op: this._ops.shift(), len: convBase36(this._lens.shift())};
  }
  OpIterator.prototype.__iterator__ = function() { return this; }

  var ops = new OpIterator(changeset);
  var i = 0;
  var attribs = [];
  var newlines = 0;
  for (var part in ops) {
    switch (part.op) {
      case '=':
        change = oldText.substring(i, i + part.len);
        if (change.split('\n').length-1 != newlines) {
          return null;
        }
        res += change;
        i += part.len;
        newlines = 0;
        break;
      case '*':
        //TODO: update attribs
        break;
      case '|':
        newlines = part.len;
        break;
      case '+':
        res += bank.substring(0, part.len);
        bank = bank.substring(part.len);
        break;
      case '-':
        if (oldText.substring(i, i + part.len).split('\n').length-1 != newlines) {
          return null;
        }
        i += part.len;
        newlines = 0;
        break;
    }
  }
  
  //The rest of the document is unchanged
  res += oldText.substring(i);

  if (res.length != newlen) {
    return null;
  }

  return res;
}

/**
 * Generates a changeset that conveys the changes from the old text (o)
 * to the new text (n)
 *
 * Based on John Resig's JavaScript diff algorithm
 */
function generateChangeset(o,n){

    function _newlines(t) {
        var newlines = t.match(/\n/g);
        if (newlines == null) {
            return "";
        }
        return '|' + newlines.length;
    }

    function _diff(o,n){
        var ns={},os={},i,x=null
        for(i=0;i<n.length;i++){if(ns[n[i]]==x)ns[n[i]]={rows:[],o:x};ns[n[i]].rows.push(i)}
        for(i=0;i<o.length;i++){if(os[o[i]]==x)os[o[i]]={rows:[],n:x};os[o[i]].rows.push(i)}
        for(i in ns){
            if(ns[i].rows.length==1 && typeof(os[i])!='undefined' && os[i].rows.length==1){
                n[ns[i].rows[0]]={text:n[ns[i].rows[0]],row:os[i].rows[0]}
                o[os[i].rows[0]]={text:o[os[i].rows[0]],row:ns[i].rows[0]}
            }
        }
        for(i=0;i<n.length-1;i++){
            if(n[i].text!=x && n[i+1].text==x && n[i].row+1<o.length && o[n[i].row+1].text==x &&
            n[i+1]==o[n[i].row+1]){
                n[i+1]={text:n[i+1],row:n[i].row+1}
                o[n[i].row+1]={text:o[n[i].row+1],row:i+1}
            }
        }
        for(i=n.length-1;i>0;i--){
            if(n[i].text!=x && n[i-1].text==x && n[i].row>0 && o[n[i].row-1].text==x &&
            n[i-1]==o[n[i].row-1]){
                n[i-1]={text:n[i-1],row:n[i].row-1}
                o[n[i].row-1]={text:o[n[i].row-1],row:i-1}
            }
        }
        return {o:o,n:n}
    }

    var packNum = function(num) { return num.toString(36).toLowerCase(); };
    var out = _diff(o == '' ? [] : o.split(/\s+/), n== '' ? [] : n.split(/\s+/));
    var str = 'Z:' + packNum(o.length);
    str += n.length > o.length 
        ? '>' + packNum(n.length - o.length) 
        : '<' + packNum(o.length - n.length); 
    var pot = '';
    var i;
    var x = null; 
    var pre;
    var potentialStr = '';
    var currentText;
    var oSpace = o.match(/\s+/g);
    var nSpace = n.match(/\s+/g);
    var start = true;

    if (oSpace == x) {
        oSpace=[];
    }

    if (nSpace == x) {
        nSpace=[];
    }
    
    if (out.n.length==0) {
        for(i=0; i<out.o.length; i++) {
            currentText = out.o[i] + (i >= oSpace.length ? '' : oSpace[i]);
            str += potentialStr;
            str += _newlines(currentText) + '-' + packNum(currentText.length);
            potentialStr = '';
            start = false;
        }
    }
    else {
        if (out.n[0].text==x) {
            for(n=0; n<out.o.length && out.o[n].text==x; n++) {
                currentText = out.o[n] + (n >= oSpace.length ? '' : oSpace[n]);
                str += potentialStr;
                str += _newlines(currentText) + '-' + packNum(currentText.length);
                potentialStr = '';
                start = false;
            }
        }
        for (i=0; i<out.n.length; i++) {
            if (out.n[i].text==x) {
                currentText = out.n[i] + (i >= nSpace.length ? '' : nSpace[i]);
                str += potentialStr;
                str += '*0' + _newlines(currentText) + '+' + packNum(currentText.length);
                potentialStr = '';
                pot += currentText;
                start = false;
            }
            else {
                pre='';
                for (n=out.n[i].row+1; n<out.o.length && out.o[n].text==x; n++) {
                    currentText = out.o[n] + (n >= oSpace.length ? '' : oSpace[n]);
                    pre += '-' + packNum(currentText.length);
                }
                currentText = (start ? '' : " ") + out.n[i].text + (i >= nSpace.length ? '' : nSpace[i]);
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
    return str + '$' + pot;
}

function mergeChangeset(cs1, cs2) {
    // TODO: Check if code like this already exists
    // Particularly check changeset.js in same directory - written by our team???
    return '';
}
