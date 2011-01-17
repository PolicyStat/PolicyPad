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
function EtherpadDocument(func) {
  this._func = func;
  this._prevHtml = this._func();
}

EtherpadDocument.prototype.generateChangeset = function() {
  if (this._prevHtml == this._func())
    return null;
  var changeset = generateChangeset(this._prevHtml, this._func());
  this._prevHtml = this._func();
  //return changeset;
  return "Z:d>1=1*0+1$a";//TODO: Use real changset
}

EtherpadDocument.prototype.applyChangeset = function(changeset, apool) {
  //1. Generate changeset between html and prevHtml
  var diff = generateChangeset(this._prevHtml, this._func());

  //2. Merge the two changesets
  //3. Apply the changeset to html
  //4. Apply changeset to prevHtml
  return;
}
