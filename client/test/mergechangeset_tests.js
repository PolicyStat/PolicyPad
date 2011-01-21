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
	 equals(mergeChangeset('Z:d>6=3*0+6$jacob ', 'Z:j>5=b*0+5$ cool'), 'Z:d>b=3*0+6=2*0+5$jacob cool');
	 equals(mergeChangeset('Z:1f>e=17*0+e$Kevin Wells is', 'Z:1t>5=1l*0+5$ good'), 'Z:1f>n=17*0|1+1=1-2*0+2=2*0+m$ /pp>Kevin Wells is good<');
	 equals(mergeChangeset('Z:C>2*0=4+2$ob' 'Z:C>3*0+3$jac'), 'Z:C>5*0+3=1+2$jacob');
     }
);

test('overlapping merge',
     function() {
	 equals(mergeChangeset('Z:C>0=3+2=4-2$ch' 'Z:C>0+2-2$as'), 'Z:C>0+2=1+2=4-2$asch');
	 equals(mergeChangeset('Z:C>0=3+2=4-2$ch' 'Z:C>0+2-2$as'), 'Z:C>0+2=1+2=4-2$asch');
	 equals(mergeChangeset('Z:C>0=3+2=4-2$ch' 'Z:C>0+2-2$as'), 'Z:C>0+2=1+2=4-2$asch');
	 equals(mergeChangeset('Z:C>0=3+2=4-2$ch' 'Z:C>0+2-2$as'), 'Z:C>0+2=1+2=4-2$asch');
     }
);




module('Deletion');
test('non-overlapping merge',
     function() {
	 equals(mergeChangeset('Z:C>0=3+2=4-2$ch' 'Z:C>0+2-2$as'), 'Z:C>0+2=1+2=4-2$asch');
	 equals(mergeChangeset('Z:C>0=3+2=4-2$ch' 'Z:C>0+2-2$as'), 'Z:C>0+2=1+2=4-2$asch');
	 equals(mergeChangeset('Z:C>0=3+2=4-2$ch' 'Z:C>0+2-2$as'), 'Z:C>0+2=1+2=4-2$asch');
	 equals(mergeChangeset('Z:C>0=3+2=4-2$ch' 'Z:C>0+2-2$as'), 'Z:C>0+2=1+2=4-2$asch');
     }
);

test('overlapping merge',
     function() {
	 equals(mergeChangeset('Z:C>0=3+2=4-2$ch' 'Z:C>0+2-2$as'), 'Z:C>0+2=1+2=4-2$asch');
	 equals(mergeChangeset('Z:C>0=3+2=4-2$ch' 'Z:C>0+2-2$as'), 'Z:C>0+2=1+2=4-2$asch');
	 equals(mergeChangeset('Z:C>0=3+2=4-2$ch' 'Z:C>0+2-2$as'), 'Z:C>0+2=1+2=4-2$asch');
	 equals(mergeChangeset('Z:C>0=3+2=4-2$ch' 'Z:C>0+2-2$as'), 'Z:C>0+2=1+2=4-2$asch');
     }
);



module('Insertion and Deletion');

test('non-overlapping merge',
     function() {
	 equals(mergeChangeset('Z:C>0=3+2=4-2$ch' 'Z:C>0+2-2$as'), 'Z:C>0+2=1+2=4-2$asch');
	 equals(mergeChangeset('Z:C>0=3+2=4-2$ch' 'Z:C>0+2-2$as'), 'Z:C>0+2=1+2=4-2$asch');
	 equals(mergeChangeset('Z:C>0=3+2=4-2$ch' 'Z:C>0+2-2$as'), 'Z:C>0+2=1+2=4-2$asch');
	 equals(mergeChangeset('Z:C>0=3+2=4-2$ch' 'Z:C>0+2-2$as'), 'Z:C>0+2=1+2=4-2$asch');
     }
);

test('overlapping merge',
     function() {
	 equals(mergeChangeset('Z:C>0=3+2=4-2$ch' 'Z:C>0+2-2$as'), 'Z:C>0+2=1+2=4-2$asch');
	 equals(mergeChangeset('Z:C>0=3+2=4-2$ch' 'Z:C>0+2-2$as'), 'Z:C>0+2=1+2=4-2$asch');
	 equals(mergeChangeset('Z:C>0=3+2=4-2$ch' 'Z:C>0+2-2$as'), 'Z:C>0+2=1+2=4-2$asch');
	 equals(mergeChangeset('Z:C>0=3+2=4-2$ch' 'Z:C>0+2-2$as'), 'Z:C>0+2=1+2=4-2$asch');
     }
);

