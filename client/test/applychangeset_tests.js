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
module("Changeset Application");

//TODO: Test failure cases (inconsistent newline count, different string
//lengths, etc...)


test('no change', function() {
    equals(applyChangeset('foobar', 'Z:6>0$'), 'foobar', 'foobar/foobar');
});

test('single character insertions', function() {
    equals(applyChangeset('foobar', 'Z:6>1+1$z'), 'zfoobar', 'foobar/zfoobar');
    equals(applyChangeset('foobar', 'Z:6>1=3+1$z'), 'foozbar', 'foobar/foozbar');
    equals(applyChangeset('foobar', 'Z:6>1=6+1$z'), 'foobarz', 'foobar/foobarz');
});

test('single character removals', function() {
    equals(applyChangeset('zfoobar', 'Z:7<1-1$'), 'foobar', 'zfoobar/foobar');
    equals(applyChangeset('foozbar', 'Z:7<1=3-1$'), 'foobar', 'foozbar/foobar');
    equals(applyChangeset('foobarz', 'Z:7<1=6-1$'), 'foobar', 'foobarz/foobar');
});

test('multiple character insertions', function() {
    equals(applyChangeset('foobar', 'Z:6>3+3$baz'), 'bazfoobar', 'foobar/bazfoobar');
    equals(applyChangeset('foobar', 'Z:6>3=3+3$baz'), 'foobazbar', 'foobar/foobazbar');
    equals(applyChangeset('foobar', 'Z:6>3=6+3$baz'), 'foobarbaz', 'foobar/foobarbaz');
});

test('multiple character removals', function() {
    equals(applyChangeset('bazfoobar', 'Z:9<3-3$'), 'foobar', 'bazfoobar/foobar');
    equals(applyChangeset('foobazbar', 'Z:9<3=3-3$'), 'foobar', 'foobazbar/foobar');
    equals(applyChangeset('foobarbaz', 'Z:9<3=6-3$'), 'foobar', 'foobarbaz/foobar');
});

test('single character insertions with attributes', function() {
    equals(applyChangeset('foobar', 'Z:6>1*1+1$z'), 'zfoobar', 'foobar/zfoobar');
    equals(applyChangeset('foobar', 'Z:6>1*0=3*1+1$z'), 'foozbar', 'foobar/foozbar');
    equals(applyChangeset('foobar', 'Z:6>1*0=6*1+1$z'), 'foobarz', 'foobar/foobarz');
});

test('single character removals with attributes', function() {
    equals(applyChangeset('zfoobar', 'Z:7<1-1$'), 'foobar', 'zfoobar/foobar');
    equals(applyChangeset('foozbar', 'Z:7<1*0=3-1$'), 'foobar', 'foozbar/foobar');
    equals(applyChangeset('foobarz', 'Z:7<1*0=6-1$'), 'foobar', 'foobarz/foobar');
});

test('multiple character insertions with attributes', function() {
    equals(applyChangeset('foobar', 'Z:6>3*1+3$baz'), 'bazfoobar', 'foobar/bazfoobar');
    equals(applyChangeset('foobar', 'Z:6>3*0=3*1+3$baz'), 'foobazbar', 'foobar/foobazbar');
    equals(applyChangeset('foobar', 'Z:6>3*0=6*1+3$baz'), 'foobarbaz', 'foobar/foobarbaz');
});

test('multiple character removals with attributes', function() {
    equals(applyChangeset('bazfoobar', 'Z:9<3-3$'), 'foobar', 'bazfoobar/foobar');
    equals(applyChangeset('foobazbar', 'Z:9<3*0=3-3$'), 'foobar', 'foobazbar/foobar');
    equals(applyChangeset('foobarbaz', 'Z:9<3*0=3*2=3-3$'), 'foobar', 'foobarbaz/foobar');
});

test('single character insertions with attributes and newlines', function() {
    equals(applyChangeset('foo\nbar', 'Z:7>1*1+1$z'), 'zfoo\nbar', 'foo\nbar/zfoo\nbar');
    equals(applyChangeset('foo\nbar', 'Z:7>1*0|1=4*1+1$z'), 'foo\nzbar', 'foo\nbar/foo\nzbar');
    equals(applyChangeset('foo\nbar', 'Z:7>1*0|1=7*1+1$z'), 'foo\nbarz', 'foo\nbar/foo\nbarz');
});

test('single character removals with attributes and newlines', function() {
    equals(applyChangeset('zfoo\nbar', 'Z:8<1-1$'), 'foo\nbar', 'zfoo\nbar/foo\nbar');
    equals(applyChangeset('foo\nzbar', 'Z:8<1*0|1=4-1$'), 'foo\nbar', 'foo\nzbar/foo\nbar');
    equals(applyChangeset('foo\nbarz', 'Z:8<1*0|1=7-1$'), 'foo\nbar', 'foo\nbarz/foo\nbar');
});

test('multiple character insertions with attributes and newlines', function() {
    equals(applyChangeset('foo\nbar', 'Z:7>3*1+3$baz'), 'bazfoo\nbar', 'foo\nbar/bazfoo\nbar');
    equals(applyChangeset('foo\nbar', 'Z:7>3*0|1=4*1+3$baz'), 'foo\nbazbar', 'foo\nbar/foo\nbazbar');
    equals(applyChangeset('foo\nbar', 'Z:7>3*0|1=7*1+3$baz'), 'foo\nbarbaz', 'foo\nbar/foo\nbarbaz');
});

test('multiple character removals with attributes and newlines', function() {
    equals(applyChangeset('bazfoo\nbar', 'Z:a<3-3$'), 'foo\nbar', 'bazfoo\nbar/foo\nbar');
    equals(applyChangeset('foo\nbazbar', 'Z:a<3*0|1=4-3$'), 'foo\nbar', 'foo\nbazbar/foo\nbar');
    equals(applyChangeset('foo\nbarbaz', 'Z:a<3*0|1=4*2=3-3$'), 'foo\nbar', 'foo\nbarbaz/foo\nbar');
});
