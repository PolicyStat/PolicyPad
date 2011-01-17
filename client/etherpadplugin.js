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
  var etherpad = new WymEtherpad(options, this);
  this._etherpad = etherpad;

  //create the GUI
  var initial_options = {
    //sUrl:          wym._options.basePath + "plugins/tidy/tidy.php",
    sButtonHtml:     "<li class='wym_tools_strong'>"
                     + "<a name='AboutEtherpad' href='#'"
                     //+ " style='background-image:"
                     //+ " url(" + wym._options.basePath + "plugins/tidy/wand.png)'>"
                     + ">"
                     + "About Etherpad"
                     + "</a></li>",
    sButtonSelector: "li.wym_tools_strong a"
  };
  guioptions = jQuery.extend(initial_options, guioptions);

  //Add button to toolbar
  jQuery(this._box).find(this._options.toolsSelector + this._options.toolsListSelector).append(guioptions.sButtonHtml);

  //handle click event
  jQuery(this._box).find(guioptions.sButtonSelector).click(function() {
    etherpad.testGuiEvent();
    return(false);
  });
  
  //register keyup handler
  jQuery(this._doc).bind("keyup", function(evt) { etherpad.submitChanges(); });
  
  //example code
  // jQuery(this._box).find(this._options.toolSelector).hover(
  //     function() { wym.status('hover'); },
  //     function() { wym.status('hi'); }
  // );

  etherpad.init();
  return etherpad;
};

