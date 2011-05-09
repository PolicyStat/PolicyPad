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
 * These tests deal with generating changesets based in user 
 * insertions in the editor.
 */

function changesetTest(original, result, comment) {
    equals(applyChangeset(original, generateChangeset(original, result)), result, comment);
}

module('Changeset Generation - Insertion');

test('simple insertion', function() {
    changesetTest('foo', 'foo', 'Identity (no change)');
    changesetTest('fo', 'foo', 'Single letter append');
    changesetTest('foo', 'foobar', 'Three letter append');
    changesetTest('barbaz', 'foobarbaz', 'Insert at beginning');
    changesetTest('foobaz', 'foobarbaz', 'Three letter insert to center');
    changesetTest('foo', 'foobarfoobarfoobarfoobarfoobarfoobarfoobarfoobarfoobarfoobarfoobar', 'Many letter append');
    changesetTest('', 'foobar', 'Empty string append');
    changesetTest('foo bar baz', 'foo extra bar baz', 'Word append');
    changesetTest('foo\nbar\nbaz\n', 'foo\nbar\nbing\nbaz\n', 'Word append on new line');
    changesetTest('foo\n bar', 'foo\n baz\nbar', 'Multiple whitespace characters');
});

test('HTML-specific insertion', function() {
    changesetTest('<br />', '<p>Hello world!</p>', 'Paragraph insert from empty');
    changesetTest('<p>Hello world!</p><p>Goodbye world!</p>', '<p>Hello world!</p><p>This is a test.</p><p>Goodbye world!</p>', 'Paragraph insert mid-document');
    changesetTest('<br />', '<table summary="Just another table"><caption>A new table</caption><tbody><tr><td></td><td></td></tr><tr><td></td><td></td></tr><tr><td></td><td></td></tr></tbody></table>', 'Table insert from empty');
    changesetTest('<table summary="Just another table"><caption>A new table</caption><tbody><tr><td></td><td></td></tr><tr><td></td><td></td></tr><tr><td></td><td></td></tr></tbody></table>', '<table summary="Just another table"><caption>A new table</caption><tbody><tr><td>one</td><td>two</td></tr><tr><td>three</td><td>four</td></tr><tr><td>five</td><td>six</td></tr></tbody></table>', 'Populate table with values');
    changesetTest('<p>a\nb\nc\nd</p>', '<p>a\nb\nc\nq\nd</p>', 'Insert new word on new line');
    changesetTest('<p>a</p>\n<p>b</p\n<p>c</p>\n', '<p>a</p>\n<p>b</p\n<p>q</p>\n<p>c</p>\n', 'Insert paragraph on new line');
    changesetTest('<p>a \n b</p>', '<p>a \nc\n b</p>', 'Insert word on new line with spaces');
    changesetTest('<p>Hello</p>', '<p>Hello</p><p>There</p>', 'Append paragraph');
    changesetTest('<p>a</p>\n\n<table>\n\n<tbody>\n<tr>\n<td></td></tr>\n<tr>\n<td></td></tr></tbody></table>\n\n',
                  '<p>a</p>\n\n<table>\n\n<tbody>\n<tr>\n<td>a</td></tr>\n<tr>\n<td></td></tr></tbody></table>\n\n',
                  'Broke IE8');
 

});


/**
 * These tests deal with generating changesets based on deletions
 * from within the editor.
 */
module('Changeset Generation - Deletion');

test('simple deletion', function() {
    changesetTest('foobar', 'foo', 'Deletion from end');
    changesetTest('foobarbaz', 'fooz', 'Deletion from center');
    changesetTest('foobarbaz', 'barbaz', 'Deletion from beginning');
    changesetTest('Hello World', 'World', 'Delete first word');
    changesetTest('Hello World', 'Hello', 'Delete last word');
});

test('HTML-specific deletion', function() {
    changesetTest('<p>Hello, World!</p>', '<p>Hello!</p>', 'Simple deletion');
    changesetTest('<p>Hello!</p><p>World!</p><p>Foobar</p>', '<p>Hello!</p><p>Foobar</p>', 'Tag deletion');
    changesetTest('<table><tbody><tr><td></td></tr></tbody></table>\n\n', '<br />\n\n', 'Remove blank table');
});

/**
 * These tests deal with generating changesets based on a combination
 * of insertions and deletions
 */
module('Changeset Generation - Alter Text');

test('simple change', function() {
    changesetTest('foobar', 'foobaz', 'One letter replacement');
    changesetTest('foobar', 'zzzbar', 'Consecutive letter replacement');
    changesetTest('foobar', 'foozzz', 'Consecutive letter replacment (end)');
    changesetTest('foobar', 'fooaaaabbbbb', 'Letter replacement and append');
    changesetTest('foobar', 'abcdefghijklmnopqrstuvwxyz', 'Complete replacment with total growth');
    changesetTest('this is sentence', 'This is sentence of mine', 'change and append');
});

test('HTML-specific change', function() {
    changesetTest('<p>Hello world!</p>', '<p>Hello there!</p>', 'Replacement within tag');
    changesetTest('<p>Hello!</p><p>World!</p>', '<p>Hello!</p><p>There!</p><p>How are you?</p>', 'Change and append');
    changesetTest('<p>Hello my World!</p>\n\n', '<p>Initial HTML</p>', 'Replace consecutive newlines');
});
