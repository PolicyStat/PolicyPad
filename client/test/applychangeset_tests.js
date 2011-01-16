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

test('no change', function() {
    equals(applyChangeset('foobar', 'Z:6>0=6$'), 'foobar', 'foobar/foobar');
});

test('single character insertions', function() {
    equals(applyChangeset('foobar', 'Z:6>1+1=6$z'), 'zfoobar', 'foobar/zfoobar');
    equals(applyChangeset('foobar', 'Z:6>1=3+1=3$z'), 'foozbar', 'foobar/foozbar');
    equals(applyChangeset('foobar', 'Z:6>1=6+1$z'), 'foobarz', 'foobar/foobarz');
});

//NOTE: Do not continue on from these test cases until we are sure that Etherpad
//uses this exact changeset syntax
// test('multiple character insertions', function() {
//     equals(applyChangeset('foobar', 'Z:6>1+1=6$z'), 'zfoobar', 'foobar/zfoobar');
//     equals(applyChangeset('foobar', 'Z:6>1=3+1=3$z'), 'foozbar', 'foobar/foozbar');
//     equals(applyChangeset('foobar', 'Z:6>1=6+1$z'), 'foobarz', 'foobar/foobarz');
// });
