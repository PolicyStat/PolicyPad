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

/* Useful methods in wymeditor
insert(string) -> void - insert text at current cursor position
html([string]) -> [string] - get/set html content
xhtml() -> string - get xhtml content
status(string) => void - display text in editor's status bar

*/


//Extend WYMeditor
WYMeditor.editor.prototype.etherpad = function(guioptions, options) {
  var wym = this;

  var etherpadGui = new WymEtherpadGUI(guioptions, options, this);
  this._etherpadGui = etherpadGui;

  //var handler = this._etherpadGui._etherpad;
  //jQuery(this._wym._doc).bind("keyup", function(evt) {handler.submitChanges();});
  return etherpadGui;
};

