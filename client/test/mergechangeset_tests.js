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


module('Insertion');

test('non-overlapping merge',
     function() {
	 equals(mergeChangeset('Z:5<1=1-1$', 'Z:5<1=3-1$'), 'Z:5<2=1-1=1-1$', 'jacob/jcb');
	 equals(mergeChangeset('Z:i<2=6-1=2-1$', 'Z:i<6=1-1=2-1=7-3=2-1$'), 'Z:i<8=1-1=2-1=1-1=2-1=2-3=2-1$', 'eeasstterr eeeeggg/easter egg');
	 equals(mergeChangeset('Z:8<0-1*0+1$N', 'Z:8<0=4-1*0+1$Y'), 'Z:8<0-1*0+1=3-1*0+1$NY', 'new york/New York');
	 equals(mergeChangeset('Z:d>c=7*0+8=1*0+4$p>Hello<p></', 'Z:d>c=7*0+8=1*0+4$p>World<p></'), 'Z:d>o=7*0+8=1*0+g$p>Hello<p><p>World</p></', '<html></html>/<html><p>Hello</p><p>World</p></html>');
	 equals(mergeChangeset('Z:0>4*0+4$null', 'Z:0>a*0+a$s are cool'), 'Z:0>e*0+e$nulls are cool', '/nulls are cool');
	 equals(mergeChangeset('Z:e<0=6-1=1*0+1$n', 'Z:e>1=e*0+1$s'), 'Z:e>1=6-1=1*0+1=6*0+1$ns', 'Need mnay test/Need many tests');
	 equals(mergeChangeset('Z:h>i-4*0+3=2-4*0+7=1*0+1=1*0+b=1-4*0+8$Repcing thmwith serverversion?', 'Z:h<1-2*0+1=1-4=1*0+1=1-3*0+1=1-3*0+8$Y,Ithink so'), 'Z:h<1-2*0+1=1-4=1*0+1=1-3*0+1=1-3*0+8$Y,Ithink so', 'Overlaps are bad./Yes, I think so.');
	 equals(mergeChangeset('Z:9>1=3*0+1$f', 'Z:9<0=3*0+1=2-1$f'), 'Z:9<0=3*0+1=2-1$f', 'dificcult/difficult');
	 equals(mergeChangeset('Z:1<0-1*0+1$b', 'Z:1<0-1*0+1$c'), 'Z:1<0-1*0+1$c', 'a/c');
	 equals(mergeChangeset('Z:a<0-1*0+1=4-1*0+1$HW', 'Z:a>2=5*0+2$\n'), 'Z:a>2-1*0+1=4-1*0+3$H\nW', 'helloworld/Hello\nWorld');
     });