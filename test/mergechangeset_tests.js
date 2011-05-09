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
 * These tests deal with merging two changesets. 
 * Changesets must be merged if a changed document is out-of-sync with
 * the server which sends a new changeset to all clients.
 * These two changesets must be merged before they can be applied to the
 * document in question.
 */


module('mergeChangeset');

test('independent changes', function() {
   equals(applyChangeset('hello world', mergeChangeset('hello world', 'Z:b>0-1*0+1$H', 'Z:b>0=6-1*0+1$W')), 'Hello World', 'hello world/Hello World');
	 equals(mergeChangeset('jacob', 'Z:5<1=1-1$', 'Z:5<1=3-1$'), 'Z:5<2=1-1=1-1$', 'jacob/jcb');
	 equals(mergeChangeset('eeasstterr eeeeggg', 'Z:i<2=6-1=2-1$', 'Z:i<6=1-1=2-1=7-3=2-1$'), 'Z:i<8=1-1=2-1=1-1=2-1=2-3=2-1$', 'eeasstterr eeeeggg/easter egg');
	 equals(mergeChangeset('new york', 'Z:8>0-1*0+1$N', 'Z:8>0=4-1*0+1$Y'), 'Z:8>0-1*0+1=3-1*0+1$NY', 'new york/New York');
	 equals(mergeChangeset('Need mnay test', 'Z:e>0=6-1=1*0+1$n', 'Z:e>1=e*0+1$s'), 'Z:e>1=6-1=1*0+1=6*0+1$ns', 'Need mnay test/Need many tests');
   equals(applyChangeset('hELLO wORLD', mergeChangeset('hELLO wORLD', 'Z:b>0-5*0+5$Hello', 'Z:b>0=6-5*0+5$World')), 'Hello World', 'hELLO wORLD/Hello World');


});

test('mutual additions', function() {
  equals(applyChangeset('This is sentence', mergeChangeset('This is sentence', 'Z:g>2=8*0+2$a ', 'Z:g>2=8*0+2$a ')), 'This is a a sentence', 'This is sentence/This is a a sentence');
  equals(applyChangeset('Append to first', mergeChangeset('Append to first', 'Z:f>3=6*0+3$ing', 'Z:f>2=6*0+2$ed')), 'Appendinged to first', 'Append to first/Appendinged to first');
  equals(applyChangeset('word', mergeChangeset('word', 'Z:4>3=4*0+3$add', 'Z:4>4=4*0+4$more')), 'wordaddmore', 'word/wordaddmore');
  equals(applyChangeset('word', mergeChangeset('word', 'Z:4>4=4*0+4$more', 'Z:4>3=4*0+3$add')), 'wordmoreadd', 'word/wordmoreadd');
  equals(applyChangeset('word', mergeChangeset('word', 'Z:4>4=4*0+4$more', 'Z:4>3=4*0+3$add')), 'wordmoreadd', 'word/wordmoreadd');
  equals(applyChangeset('<p>Hello World</p>', mergeChangeset('<p>Hello World</p>', 'Z:i>3=9*0+3$My ', 'Z:i>1=d-1*0+2$d!')), '<p>Hello My World!</p>', '<p>Hello World</p>/<p>Hello My World!</p>');
});

test('mutual removals', function() {
  equals(applyChangeset('This is a simple sentence.', mergeChangeset('This is a simple sentence.', 'Z:q<7=a-7$', 'Z:q<7=a-7$')), 'This is a sentence.', 'This is a simple sentence./This is a sentence.');
  equals(applyChangeset('This is a simple sentence.', mergeChangeset('This is a simple sentence.', 'Z:q<3=a-3$', 'Z:q<7=a-7$')), 'This is a sentence.', 'This is a simple sentence./This is a sentence.');
  equals(applyChangeset('This is a simple sentence.', mergeChangeset('This is a simple sentence.', 'Z:q<7=a-7$', 'Z:q<3=a-3$')), 'This is a sentence.', 'This is a simple sentence./This is a sentence.');
});

test('addition and removal', function() {
  equals(applyChangeset('This s a sentence.', mergeChangeset('This s a sentence.', 'Z:i>7=9*0+7$simple ', 'Z:i>2=5-1*0+3$was')), 'This was a simple sentence.', 'This s a sentence./This was a simple sentence.');
  equals(applyChangeset('b hello world b', mergeChangeset('b hello world b', 'Z:f>7-1*0+8$b prefix', 'Z:f<6=8-7*0+1$b')), 'b prefix hello b', 'b hello world b/b prefix hello b');
  var changeset = mergeChangeset('xxxtxx\n\n', 'Z:8>1=4-1*0+2$xt', 'Z:8>1-1*0+2$xs');
  equals(applyChangeset('xxxtxx\n\n', changeset), 'xsxxtxtx\n\n', 'xxxtxx/xsxxtxtx');
});

test('non-overlapping merge', function() {
   //TODO This is a bad test case, but it demonstrates that merging html may
   //break the DOM
	 //equals(mergeChangeset('<html></html>', 'Z:d>c=7*0+8=1*0+4$p>Hello<p></', 'Z:d>c=7*0+8=1*0+4$p>World<p></'), 'Z:d>o=7*0+8=1*0+g$p>Hello<p><p>World</p></', '<html></html>/<html><p>Hello</p><p>World</p></html>');
	 equals(mergeChangeset('', 'Z:0>4*0+4$null', 'Z:0>a*0+a$s are cool'), 'Z:0>e*0+e$nulls are cool', '/nulls are cool');
   //TODO This is a bad test case, but it demonstrates that a portion of
   //mergeChangeset is not yet implemented
	 //equals(mergeChangeset('Overlaps are bad.', 'Z:h>i-4*0+3=2-4*0+7=1*0+1=1*0+b=1-4*0+8$Repcing thmwith serverversion?', 'Z:h<1-2*0+1=1-4=1*0+1=1-3*0+1=1-3*0+8$Y,Ithink so'), 'Z:h<1-2*0+1=1-4=1*0+1=1-3*0+1=1-3*0+8$Y,Ithink so', 'Overlaps are bad./Yes, I think so.');
	 equals(mergeChangeset('dificcult', 'Z:9>1=3*0+1$f', 'Z:9>0=3*0+1=2-1$f'), 'Z:9>1=3*0+2=2-1$ff', 'dificcult/difficult');
	 equals(mergeChangeset('a', 'Z:1>0-1*0+1$b', 'Z:1>0-1*0+1$c'), 'Z:1>1-1*0+2$bc', 'a/c');
	 equals(mergeChangeset('helloworld', 'Z:a>0-1*0+1=4-1*0+1$HW', 'Z:a>2=5*0+2$\n'), 'Z:a>2-1*0+1=4-1*0+3$H\nW', 'helloworld/Hello\nWorld');
});
