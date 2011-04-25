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
  this._prevXhtml = this._funcXhtml();
  this._pendingChangeset = null;
}

EtherpadDocument.prototype.generateChangeset = function() {
  if (this._pendingChangeset || !this.isModified())
    return null;
  this._pendingChangeset = generateChangeset(this._prevXhtml, this._funcXhtml());
  this._pendingHtml = this._funcHtml();
  return this._pendingChangeset;
}

EtherpadDocument.prototype.applyChangeset = function(changeset, apool) {
  if (!this.isModified()) {
    //no need to merge changes, just apply the changeset to our base
    var newXhtml = applyChangeset(this._prevXhtml, changeset);
    this._funcHtml(newXhtml);
    this._prevHtml = this._funcHtml();
    this._prevXhtml = newXhtml;
  }
  else {
    //We have local uncommitted changes, this merge is a bit more complicated

    //1. Generate changeset between html and prevHtml
    var baseDiff = generateChangeset(this._prevXhtml, this._funcXhtml());

    //2. Merge the two changesets
    var merged = mergeChangeset(this._prevXhtml, baseDiff, changeset);

    //3. Apply changeset to prevHtml/prevXhtml
    //FIXME we can't get prevHtml from funcHtml without first setting the merged
    //document.  In order to make this work with the two functions, we need to
    //be able to grab both selections
    var oldXhtml = this._prevXhtml;
    this._prevXhtml = applyChangeset(this._prevXhtml, changeset);
    this._funcHtml(this._prevXhtml);
    this._prevHtml = this._funcHtml();

    //4. Apply merged to current HTML
    var newXhtml = applyChangeset(oldXhtml, merged);
    this._funcHtml(newXhtml);
  }

  return;
}

EtherpadDocument.prototype.hasPendingChangeset = function() {
  return this._pendingChangeset != null;
}

EtherpadDocument.prototype.changesetAccepted = function() {
  this._prevHtml = this._pendingHtml;
  this._prevXhtml = applyChangeset(this._prevXhtml, this._pendingChangeset);
  this._pendingChangeset = null;
}

EtherpadDocument.prototype.isModified = function() {
  return this._prevHtml != this._funcHtml()
    && this._prevXhtml != this._funcXhtml();
}

