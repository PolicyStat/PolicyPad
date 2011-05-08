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

function make_no_set(func) {
  return function(html) {
    ok(html === undefined, "Xhtml modified");
    return func(html);
  };
}

test('Starting State', function() {
  var func = function(html) {
    var val = "<p>Hello World</p>";
    ok(html === undefined || html == val, "Unexpected change to html");
    return val;
  };
  var doc = new EtherpadDocument(func, make_no_set(func), {text: func() + "\n\n"});
  equals(doc.isModified(), false);
  equals(doc.hasPendingChangeset(), false);
});

test('Simple Outbound Change', function() {
  var old_html = "<p>Hello World</p>";
  var new_html = "<p>Hello Brave New World</p>";

  var func = make_func(old_html);
  var doc = new EtherpadDocument(func, make_no_set(func), {text: func() + "\n\n"});
  func(new_html);
  equals(doc.isModified(), true);
  equals(doc.hasPendingChangeset(), false);

  var changeset = doc.generateChangeset();
  notEqual(changeset, null);
  equal(new_html + "\n\n", applyChangeset(old_html + "\n\n", changeset));

  equals(doc.isModified(), false);
  equals(doc.hasPendingChangeset(), true);

  doc.changesetAccepted();
  equals(doc.isModified(), false);
  equals(doc.hasPendingChangeset(), false);
});

test('Simple Inbound Change', function() {
  var old_html = "<p>Hello World</p>";
  var new_html = "<p>Hello Brave New World</p>";

  var func = make_func(old_html);
  var doc = new EtherpadDocument(func, make_no_set(func), {text: func() + "\n\n"});

  doc.applyChangeset(generateChangeset(old_html + "\n\n", new_html + "\n\n"));

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
  var doc = new EtherpadDocument(func, make_no_set(func), {text: func() + "\n\n"});

  //update our document
  func(my_new_html);
  equal(my_new_html, func());

  //uhoh, changes are coming from the server too
  var their_changeset = generateChangeset(old_html + "\n\n", their_new_html + "\n\n");
  doc.applyChangeset(their_changeset);

  //make sure we are modified, _prevHtml has been updated, and our model has the
  //merged changes
  equal(func(), merged_html);
  equal(doc.isModified(), true);
  equal(doc.hasPendingChangeset(), false);
  equal(doc._prevHtml, their_new_html + "\n\n");
  equal(func(), merged_html);
});

test('Inbound change with prepared outbound change', function() {
  var old_html =       "<p>Hello World</p>";
  var my_new_html =    "<p>Hello My World</p>";
  var their_new_html = "<p>Hello World!</p>";
  var merged_html =    "<p>Hello My World!</p>";
  
  var func = make_func(old_html);
  var doc = new EtherpadDocument(func, make_no_set(func), {text: func() + "\n\n"});

  //update our document
  func(my_new_html);
  equal(my_new_html, func());
  
  equal(doc.isModified(), true);
  equal(doc.hasPendingChangeset(), false);

  //generate a changeset, send it to the server
  var changeset = doc.generateChangeset();
  
  equal(doc.isModified(), false);
  equal(doc.hasPendingChangeset(), true);

  //uhoh, changes are coming from the server too
  var their_changeset = generateChangeset(old_html + "\n\n", their_new_html + "\n\n");
  doc.applyChangeset(their_changeset);

  equal(doc.isModified(), false);
  equal(doc.hasPendingChangeset(), true);

  //server accepted our changes
  doc.changesetAccepted();
  equal(func(), merged_html);
  equal(doc.isModified(), false);
  equal(doc.hasPendingChangeset(), false);
  equal(doc._prevHtml, merged_html + "\n\n");
});


test('Inbound change with prepared outbound change and local modifications', function() {
  var old_html =        "xxxx";
  var my_new_html =     "xsxxx";
  var my_newer_html =   "xsxlxx";
  var their_new_html =  "xxxtx";
  var new_server_base = "xsxxtx";
  var merged_html =     "xsxlxtx";
  
  var func = make_func(old_html);
  var doc = new EtherpadDocument(func, make_no_set(func), {text: func() + "\n\n"});

  //1. Make some changes
  func(my_new_html);
  equal(my_new_html, func());
  
  equal(doc.isModified(), true);
  equal(doc.hasPendingChangeset(), false);

  //2. Submit those changes to the server.
  var changeset = doc.generateChangeset();
  
  equal(applyChangeset(old_html + "\n\n", changeset), my_new_html + "\n\n");
  equal(doc.isModified(), false);
  equal(doc.hasPendingChangeset(), true);

  //3. Make more changes
  func(my_newer_html);
  equal(my_newer_html, func());

  equal(doc.isModified(), true);
  equal(doc.hasPendingChangeset(), true);

  //4. Receive changes from the server
  var their_changeset = generateChangeset(old_html + "\n\n", their_new_html + "\n\n");
  doc.applyChangeset(their_changeset);

  equal(doc.isModified(), true);
  equal(doc.hasPendingChangeset(), true);
  equal(func(), merged_html);
  equal(doc._prevHtml, their_new_html + "\n\n");
  equal(doc._pendingHtml, new_server_base + "\n\n");
  equal(applyChangeset(their_new_html + "\n\n", doc._pendingChangeset), new_server_base + "\n\n");

  //5. Receive acceptance of changes from server
  doc.changesetAccepted();

  equal(doc.isModified(), true);
  equal(doc.hasPendingChangeset(), false);
  equal(func(), merged_html);
  equal(doc._prevHtml, new_server_base + "\n\n");

  //6. Send more local changes to the server
  changeset = doc.generateChangeset();

  equal(applyChangeset(new_server_base + "\n\n", changeset), merged_html + "\n\n");
  equal(doc.isModified(), false);
  equal(doc.hasPendingChangeset(), true);

  //7. Receive acceptance of changes from server
  doc.changesetAccepted();
  equal(doc.isModified(), false);
  equal(doc.hasPendingChangeset(), false);
  equal(func(), merged_html);
  equal(doc._prevHtml, merged_html + "\n\n");
});

test('Multiple inbound changes with prepared outbound change and local modifications', function() {
  var old_html =        "xxxx";
  var my_new_html =     "xsxxx";
  var my_newer_html =   "xsxlxx";
  var their_new_html =  "xxxtx";
  var new_server_base = "xsxxtx";
  var merged_html =     "xsxlxtx";
  
  var func = make_func(old_html);
  var doc = new EtherpadDocument(func, make_no_set(func), {text: func() + "\n\n"});

  //1. Make some changes
  func(my_new_html);
  equal(my_new_html, func());
  
  equal(doc.isModified(), true);
  equal(doc.hasPendingChangeset(), false);

  //2. Submit those changes to the server.
  var changeset = doc.generateChangeset();
  
  equal(applyChangeset(old_html + "\n\n", changeset), my_new_html + "\n\n");
  equal(doc.isModified(), false);
  equal(doc.hasPendingChangeset(), true);

  //3. Make more changes
  func(my_newer_html);
  equal(my_newer_html, func());

  equal(doc.isModified(), true);
  equal(doc.hasPendingChangeset(), true);

  //4.1. Receive changes from the server
  var their_changeset = generateChangeset(old_html + "\n\n", their_new_html + "\n\n");
  doc.applyChangeset(their_changeset);

  equal(doc.isModified(), true);
  equal(doc.hasPendingChangeset(), true);
  equal(func(), merged_html);
  equal(doc._prevHtml, their_new_html + "\n\n");
  equal(doc._pendingHtml, new_server_base + "\n\n");
  equal(applyChangeset(their_new_html + "\n\n", doc._pendingChangeset), new_server_base + "\n\n");

  //4.2. Receive more changes from the server
  their_changeset = generateChangeset(their_new_html + "\n\n", old_html + "\n\n");
  doc.applyChangeset(their_changeset);

  equal(doc.isModified(), true);
  equal(doc.hasPendingChangeset(), true);
  equal(func(), my_newer_html);
  equal(doc._prevHtml, old_html + "\n\n");
  equal(doc._pendingHtml, my_new_html + "\n\n");
  equal(applyChangeset(old_html + "\n\n", doc._pendingChangeset), my_new_html + "\n\n");

  //4.3. Receive even more changes from the server
  var their_changeset = generateChangeset(old_html + "\n\n", their_new_html + "\n\n");
  doc.applyChangeset(their_changeset);

  equal(doc.isModified(), true);
  equal(doc.hasPendingChangeset(), true);
  equal(func(), merged_html);
  equal(doc._prevHtml, their_new_html + "\n\n");
  equal(doc._pendingHtml, new_server_base + "\n\n");
  equal(applyChangeset(their_new_html + "\n\n", doc._pendingChangeset), new_server_base + "\n\n");

  //5. Receive acceptance of changes from server
  doc.changesetAccepted();

  equal(doc.isModified(), true);
  equal(doc.hasPendingChangeset(), false);
  equal(func(), merged_html);
  equal(doc._prevHtml, new_server_base + "\n\n");

  //6. Send more local changes to the server
  changeset = doc.generateChangeset();

  equal(applyChangeset(new_server_base + "\n\n", changeset), merged_html + "\n\n");
  equal(doc.isModified(), false);
  equal(doc.hasPendingChangeset(), true);

  //7. Receive acceptance of changes from server
  doc.changesetAccepted();
  equal(doc.isModified(), false);
  equal(doc.hasPendingChangeset(), false);
  equal(func(), merged_html);
  equal(doc._prevHtml, merged_html + "\n\n");
});

