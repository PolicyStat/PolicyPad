/**
 * Copyright 2010 PolicyPad
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
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
 * These tests deal with handling documents and document changes
 */
module("Etherpad Document");

function make_func(initial) {
  return function(html) {
    if (html === undefined)
      return initial;
    initial = html;
  }
}

test('Starting State', function() {
  var func = function(html) {
    ok(html === undefined, "Unexpected change to html");
    return "<p>Hello World</p>";
  };
  var doc = new EtherpadDocument(func, {text: func()});
  equals(doc.isModified(), false);
  equals(doc.hasPendingChangeset(), false);
});

test('Simple Outbound Change', function() {
  var old_html = "<p>Hello World</p>";
  var new_html = "<p>Hello Brave New World</p>";

  var func = make_func(old_html);
  var doc = new EtherpadDocument(func, {text: func()});
  func(new_html);
  equals(doc.isModified(), true);
  equals(doc.hasPendingChangeset(), false);

  var changeset = doc.generateChangeset();
  notEqual(changeset, null);
  equal(new_html, applyChangeset(old_html, changeset));

  equals(doc.isModified(), true);
  equals(doc.hasPendingChangeset(), true);

  doc.changesetAccepted();
  equals(doc.isModified(), false);
  equals(doc.hasPendingChangeset(), false);
});

test('Simple Inbound Change', function() {
  var old_html = "<p>Hello World</p>";
  var new_html = "<p>Hello Brave New World</p>";

  var func = make_func(old_html);
  var doc = new EtherpadDocument(func, {text: func()});

  doc.applyChangeset(generateChangeset(old_html, new_html));

  equal(doc.isModified(), false);
  equal(doc.hasPendingChangeset(), false);

  equal(func(), new_html);
});

test('Inbound change with unprepared outbound change', function() {
  var old_html =       "<p>Hello World</p>";
  var my_new_html =    "<p>Hello My World</p>";
  var their_new_html = "<p>Hello World!</p>";
  var merged_html =    "<p>Hello My World!</p>";
  
  var func = make_func(old_html);
  var doc = new EtherpadDocument(func, {text: func()});

  //update our document
  func(my_new_html);

  //uhoh, changes are coming from the server too
  var their_changeset = generateChangeset(old_html, their_new_html);
  doc.applyChangeset(their_changeset);

  //make sure we are modified, _prevHtml has been updated, and our model has the
  //merged changes
  equal(doc.isModified(), true);
  equal(doc.hasPendingChangeset(), false);
  equal(doc._prevHtml, their_new_html);
  equal(func(), merged_html);
});


