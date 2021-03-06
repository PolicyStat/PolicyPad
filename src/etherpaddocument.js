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
 * EtherpadDocument tracks a previous document version and the current version.
 * When a changeset is requested, the revisions are set equal to eachother.
 * This class also wraps up the functionality of applying changesets to an
 * existing document because that operation requires knowledge of our own
 * changes.
 * @param func A function that takes a single optional parameter.  When
 * called with a parameter, the html value should be set, and when the 
 * parameter is omitted, the current html value is returned
 */
function EtherpadDocument(funcHtml, funcXhtml, initialText) {
  handleNewlines = function(func) {
    return function(html) {
      if (html === undefined || !html)
        return func() + "\n\n";
      func(html.substring(0, html.length-2));
    };
  }

  this._funcHtml = handleNewlines(funcHtml);
  this._funcXhtml = handleNewlines(funcXhtml);

  //TODO: This class needs to track more than just HTML. In Etherpad, the text
  //consists of both the text and the mapping of text to attributes.  Etherpad
  //also tracks an attribute pool (apool) which provides formatting information,
  //but more importantly, authorship information.  Changeset manipulation needs
  //to manipulate both the text and the text/apool mappings.
  this._funcHtml(initialText.text);
  this._prevHtml = this._funcHtml();
  this._prevXhtml = initialText.text.replace(/\r/g, "");//this._funcXhtml();
  this._pendingChangeset = null;
}

EtherpadDocument.prototype.generateChangeset = function() {
  if (this._pendingChangeset || !this.isModified())
    return null;
  var newXhtml = this._funcXhtml();
  if (newXhtml == null)
    alert("new text is null");
  if (this._prevXhtml == null)
    alert("this._prevXhtml is null");
  this._pendingChangeset = generateChangeset(this._prevXhtml, newXhtml);
  this._pendingHtml = this._funcHtml();
  return this._pendingChangeset;
}

EtherpadDocument.prototype.applyChangeset = function(changeset, apool) {
  var isModified = this.isModified();
  var isPending = this.hasPendingChangeset();

  if (isPending) {
    //There are ALSO pending changes!  Here we go.

    // ops
    // + mergeChangeset
    // * applyChangeset
    // - generateChangeset

    // inputs
    //this._pendingChangeset
    //this._pendingHtml
    //this._prevHtml
    //this._prevXhtml  //base
    //this._funcXhtml()
    //changeset


    // temporaries
    //serverBase = base * changeset
    //localChanges = _funcXhtml() - base
    //newXhtml = base * (changeset + (pendingChangeset + localChanges))
    //newSubmittedBase = base * (changeset + pendingChangeset)
    //newPending = newSubmittedBase - serverBase
    
    //new base
    var serverBase = applyChangeset(this._prevXhtml, changeset);
    
    //merged document
    var localChanges = generateChangeset(this._prevXhtml, this._funcXhtml());
    var mergedAll = mergeChangeset(this._prevXhtml, changeset, localChanges);
    var newXhtml = applyChangeset(this._prevXhtml, mergedAll);
    
    //new pending changeset
    var merged = mergeChangeset(this._prevXhtml, changeset, this._pendingChangeset);
    var newSubmittedBase = applyChangeset(this._prevXhtml, merged);
    var newPending = generateChangeset(serverBase, newSubmittedBase);

    // outputs
    //this._pendingChangeset = newPending
    //this._pendingHtml = (filtered) submittedServerBase
    //this._prevXhtml = serverBase
    //this._prevHtml = (filtered) serverBase
    //this._funcHtml() = newXhtml

    this._funcHtml(newSubmittedBase);
    this._pendingHtml = this._funcHtml();
    this._pendingChangeset = newPending;

    this._funcHtml(serverBase);
    this._prevHtml = this._funcHtml();
    this._prevXhtml = this._funcXhtml();

    this._funcHtml(newXhtml);
    //alert('fanciful merge completed');
  } else if (isModified) {
    //We have local uncommitted changes, this merge is a bit complicated

    //1. Generate changeset between html and prevHtml
    var baseDiff = generateChangeset(this._prevXhtml, this._funcXhtml());

    //2. Merge the two changesets
    var merged = mergeChangeset(this._prevXhtml, baseDiff, changeset);

    //3. Apply changeset to prevHtml/prevXhtml
    var oldXhtml = this._prevXhtml;
    this._prevXhtml = applyChangeset(this._prevXhtml, changeset);
    if (this._prevXhtml == null)
      alert("Failed to apply changeset to base");
    this._funcHtml(this._prevXhtml);
    this._prevHtml = this._funcHtml();

    //4. Apply merged to current HTML
    var newXhtml = applyChangeset(oldXhtml, merged);
    if (newXhtml == null)
      alert("Failed to apply merged to oldXhtml");
    this._funcHtml(newXhtml);
    //alert('not so fanciful merge completed');
  } else {
    //no need to merge changes, just apply the changeset to our base
    var newXhtml = applyChangeset(this._prevXhtml, changeset);
    this._funcHtml(newXhtml);
    this._prevHtml = this._funcHtml();
    this._prevXhtml = newXhtml;
  }

  //check postconditions
  if (this._prevHtml == null)
    alert("prevHtml is null");
  if (this._prevXhtml == null)
    alert("prevXhtml is null");
  if (this._funcHtml() == null)
    alert("funcHtml() is null");
  if (this._funcXhtml() == null)
    alert("funcXhtml() is null");
}

EtherpadDocument.prototype.hasPendingChangeset = function() {
  return this._pendingChangeset != null;
}

EtherpadDocument.prototype.changesetAccepted = function() {
  if (!this.hasPendingChangeset())
    return;
  this._prevHtml = this._pendingHtml;
  this._prevXhtml = applyChangeset(this._prevXhtml, this._pendingChangeset);
  this._pendingChangeset = null;
}

EtherpadDocument.prototype.isModified = function() {
  if (this.hasPendingChangeset()) {
    //compare changesets
    var changes = generateChangeset(this._prevXhtml, this._funcXhtml());
    return this._pendingChangeset != changes;
  } else {
    //compare base with current document
    return this._prevHtml != this._funcHtml()
      && this._prevXhtml != this._funcXhtml();
  }
}

