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
 * These test deal with generating changesets based in user 
 * insertions in the editor.
 */
module("Insertion Changeset Generation");

/**
 * Old: foobar
 * New: foobarbaz
 *
 * Expected: Z:6>3=6+3$baz
 */
test('simple single line append', function() {
    equals(generateChangeset('foobar', 'foobarbaz'), 'Z:6>3=6+3$baz');
});


/**
 * Old: fo
 * New: foo
 *
 * Expected: Z:2>1=2+1$o
 */
test('single character append', function() {
    equals(generateChangeset('fo', 'foo'), 'Z:2>1=2+1$o');
});


/**
 * Old: foobaz
 * New: foobarbaz
 *
 * Expected: Z:6>3=5+3=1$rba
 */
test('simple single line insert', function() {
    equals(generateChangeset('foobaz', 'foobarbaz'), 'Z:6>3=5+3=1$rba');
});


/**
 * Old: foo\n
 * New: foo\nbar
 * 
 * Expected: Z:4>3|1=4+3$bar
 */
test('simple multi line append', function() {
    equals(generateChangeset('foo\n', 'foo\nbar'), 'Z:4>3|1=4+3$bar');
});


/**
 * Old: foo\nbar
 * New: foo\nbar\nbaz
 *
 * Expected: Z:7>4|1=4=3|1+1+3$\nbaz
 */
test('simple multi line append without original newline', function() {
    equals(generateChangeset('foo\nbar', 'foo\nbar\nbaz'), 'Z:7>4|1=4=3|1+1+3$\nbaz');
});


/**
 * Old: foo\nbaz
 * New: foo\nbar\nbaz
 *
 * Expected: Z:7>4|1=4+4$bar\n
 */
test('simple multi line insert', function() {
    equals(generateChangeset('foo\nbaz', 'foo\nbar\nbaz'), 'Z:7>4|1=4=2|1+2+2=1$r\nba');
});


/**
 * These tests deal with generating changesets based on deletions
 * from within the editor.
 */
module('Deletion Changeset Generation');

/**
 * Old: fooo
 * New: foo
 *
 * Expected: Z:4<1=3-1
 */
test('simple single character delete', function() {
    equals(generateChangeset('fooo', 'foo'), 'Z:4<1=3-1');
});


/**
 * Old: foobarbaz
 * New: foobaz
 *
 * Expected: Z:9<3=5-3=1
 */
test('simple single line characters delete', function() {
    equals(generateChangeset('foobarbaz', 'foobaz'), 'Z:9<3=5-3=1');
});
