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
module('Changeset Generation - Insertion');

test('single line insertions', function() {
    equals(generateChangeset('foobar', 'foobarbaz'), 'Z:6>3=6*0+3$baz', 'foobar/foobarbaz');
    equals(generateChangeset('fo', 'foo'), 'Z:2>1=2*0+1$o', 'fo/foo');
    equals(generateChangeset('foo', 'foobarfoobarfoobarfoobarfoobarfoobarfoobarfoo'), 'Z:3>16=3*0+16$barfoobarfoobarfoobarfoobarfoobarfoobarfoo', 'foo/foobarfoobarfoobarfoobarfoobarfoobarfoobarfoo');
    equals(generateChangeset('foobaz', 'foobarbaz'), 'Z:6>3=5*0+3$rba', 'foobaz/foobarbaz');
});

test('multiline insertions', function() {
    equals(generateChangeset('foo\n', 'foo\nbar'), 'Z:4>3|1=4*0+3$bar', 'foo\n/foo\nbar');
    equals(generateChangeset('foo\nbar', 'foo\nbar\nbaz'), 'Z:7>4|1=4=3*0|1+1*0+3$\nbaz', 'foo\nbar/foo\nbar\nbaz');
    equals(generateChangeset('foo\nbaz', 'foo\nbar\nbaz'), 'Z:7>4|1=4=2*0|1+2*0+2$r\nba', 'foo\nbaz/foo\nbar\nbaz');
});

/**
 * These tests deal with generating changesets based on deletions
 * from within the editor.
 */
module('Changeset Generation - Deletion');

test('single line deletions', function() {
    equals(generateChangeset('fooo', 'foo'), 'Z:4<1=3-1', 'foooo/foo');
    equals(generateChangeset('foobarbaz', 'foobaz'), 'Z:9<3=5-3', 'foobarbaz/foobaz');
});
