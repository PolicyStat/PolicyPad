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
      //alert('11');
      return null;
  }
  if (parts.length != 2) {
      //alert('22');
      return null;
  }

  
  var bank = parts[1];
  changeset = parts[0].substring(2);

  convBase36 = function(str) { return parseInt(str, 36); }

  parts = changeset.match(/^(\w+)([><])(\w+)/);
  if (!parts) {
    //alert('1');
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
      //alert('2');
      return null;
  }

  if (oldText.length != oldlen) {
    //alert('3');
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
          //alert('Incorrect number of newlines in [' + change + ']. Reported: ' + newlines + ' Actual: ' + (change.split('\n').length - 1));
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
          //alert('Incorrect number of newlines in [' + oldText.substring(i, i + part.len) + ']. Reported: ' + newlines + ' Actual: ' + (oldText.substring(i, i + part.len).split('\n').length - 1));
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
    //alert(res);
    //alert('final lengths do not match. changeset: [' + trueChangeset + '] actual: ' + res.length + ' reported: ' + newlen);
    return null;
  }

  return res;
}

/**
 * John Resig's JavaScript diff algorithm
 */
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

function _newlines(t) {
    var newlines = t.match(/\n/);
    if (newlines == null) {
        return "";
    }
    return '|' + newlines.length;
}

function generateChangeset(o,n){
    //alert("Generating Changeset: Old: [" + o + "] New: [" + n + "]");
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
            str += _newlines(currentText) + '-' + packNum(currentText.length);
            start = false;
        }
    }
    else {
        if (out.n[0].text==x) {
            for(n=0; n<out.o.length && out.o[n].text==x; n++) {
                currentText = out.o[n] + (n >= oSpace.length ? '' : oSpace[n]);
                str += _newlines(currentText) + '-' + packNum(currentText.length);
                start = false;
            }
        }
        for (i=0; i<out.n.length; i++) {
            if (out.n[i].text==x) {
                currentText = out.n[i] + (i >= nSpace.length ? '' : nSpace[i]);
                str += '*0' + _newlines(currentText) + '+' + packNum(currentText.length);
                pot += currentText;
                start = false;
            }
            else {
                pre='';
                for (n=out.n[i].row+1; n<out.o.length && out.o[n].text==x; n++) {
                    currentText = out.o[n] + (n >= oSpace.length ? '' : oSpace[n]);
                    pre += '-' + packNum(currentText.length);
                }
                currentText = (start ? '' : " ") + out.n[i].text + (n >= nSpace.length ? '' : nSpace[i]);
                start = false;
                str += _newlines(currentText) + '=' + packNum(currentText.length) + pre;
            }
        }
    }
    return str + '$' + pot;
}

/**
 * Compares oldText and newText, generating a changeset of the differences.
 * @param {String} oldText The original editor text.
 * @param {String} newText The editor text after changes have been made.
 * @return A changeset representing the differences between oldText and newText.
 */
//function generateChangesetOld(oldText, newText) {
//    var packNum = function(num) { return num.toString(36).toLowerCase(); };
//
//    var wd = wordDiff(oldText, newText); 
//    var diff = _diff(oldText, newText);
//
//    var result = 'Z:';
//
//    var pot = '';
//
//    result += packNum(oldText.length); // original length
//    result += newText.length > oldText.length 
//        ? '>' + packNum(newText.length - oldText.length) 
//        : '<' + packNum(oldText.length - newText.length); // length change
//
//    var skips = '';
//
//    $.each(wd, function(i, cs) {
//        var keep = 0; // non-newline characters to keep
//        var keepN = 0; // characters including newlines to keep
//        var numN = 0; // number of newlines
//        var ins = 0; // characters to insert
//        var insN = 0; // characters including newlines to insert
//        var del = 0; // characters to delete
//        var delN = 0; // characters including newlines to delete
//
//        if (cs.common != undefined) {
//            common = cs.common.join('');
//            keep += common.length;
//
//            if (common.search('\n') >= 0) {
//                var lastN = common.lastIndexOf('\n');
//                keepN = lastN + 1;
//                numN = common.match(/\n/g).length;
//                keep = common.length - lastN - 1;
//            }
//        }
//
//        if (cs.file1 != undefined) {
//            var missing = cs.file1.join('');
//            del = missing.length;
//                
//            if (missing.search('\n') >= 0) {
//                var lastN = missing.lastIndexOf('\n');
//                delN = lastN + 1;
//                numN = missing.match(/\n/g).length;
//                del = missing.length - lastN - 1;
//            }
//        }
//
//        if (cs.file2 != undefined) {
//            var added = cs.file2.join('');
//            ins = added.length;
//            pot += added;
//
//            if (added.search('\n') >= 0) {
//                var lastN = added.lastIndexOf('\n');
//                insN = lastN + 1;
//                numN = added.match(/\n/g).length;
//                ins = added.length - lastN - 1;
//            }
//        }
//
//        skips += keepN > 0 ? '|' + packNum(numN) + '=' + packNum(keepN) : '';
//        skips += keep > 0 ? '=' + packNum(keep) : '';
//        
//        if (delN > 0 || del > 0 || insN > 0 || ins > 0) {
//            result += skips;
//            skips = '';
//        }
//
//        result += delN > 0 ? '|' + packNum(numN) + '-' + packNum(delN) : '';  
//        result += del > 0 ? '-' + packNum(del) : '';
//        result += insN > 0 ? '*0|' + packNum(numN) + '+' + packNum(insN) : ''; // TODO: Don't hard code "0" authorship attribute 
//        result += ins > 0 ? '*0+' + packNum(ins) : '';                         // 
//    });
//
//    result += '$';
//    result += pot.length > 0 ? pot : '';
//
//    return result;
//}

function mergeChangeset(cs1, cs2) {
    // TODO: Check if code like this already exists
    // Particularly check changeset.js in same directory - written by our team???
    return '';
}
