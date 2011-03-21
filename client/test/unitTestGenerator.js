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
 * This code is the brains behind the unittest generator page.
 * It is designed to help ease the process of creating unit tests from changesets.
 * 
 * Author: Jacob Schmidt
 * Last Update: 1/27/11
 */

function genCustom(form) {
    var original = form.txt1_1.value;
    var mod1 = form.txt1_2.value;
    var mod2 = form.txt2_2.value;
    var mod = form.txt3_2.value;

    form.txt_out.value = form.genUnitTest(original, mod1, mod2, mod);
}


function genPremade(form) {
    var tests = [
	// Need to discuss mergeChangeset rules with team...
	['jacob', 'jcob', 'jacb', 'jcb'],
	['eeasstterr eeeeggg', 'eeasster eeeeggg', 'eastterr egg', 'easter egg'],
	['new york', 'New york', 'new York', 'New York'],
	['<html></html>', '<html><p>Hello</p></html>', '<html><p>World</p></html>', '<html><p>Hello</p><p>World</p></html>'],
	['','null','s are cool','nulls are cool'],
	['Need mnay test', 'Need many test', 'Need mnay tests', 'Need many tests'],
	['Overlaps are bad.', 'Replacing them with server version?', 'Yes, I think so.', 'Yes, I think so.'],
	['dificcult', 'difficcult', 'difficult', 'difficult'],
	['a','b','c','c'],

	//apprently have to escape \n's, but are they really being treated as they would be in changesets??
	['helloworld', 'HelloWorld', 'hello\\nworld', 'Hello\\nWorld'],



	//Need full scale HTML tests too.

    ];


    var txt = [];
    for (i=0; i<tests.length; i++) {
	txt[i] = form.genUnitTest(tests[i][0], tests[i][1], tests[i][2], tests[i][3]);
    }

    form.txt_out.value = txt.join('\n');
}


function genUTFromGenerate(old, new1, new2, newcombined) {
    var cs1 = generateChangeset(old, new1);
    var cs2 = generateChangeset(old, new2);
    var cs3 = generateChangeset(old, newcombined);

    return "equals(mergeChangeset('"+old+"', '" + cs1 + "', '"+ cs2+"'), '"+ cs3 +"', '"+old+"/"+newcombined+"');";
}

function genUTFromApply(old, new1, new2, newcombined) {
//    equals(applyChangeset(old, mergeChangeset(cs1, cs2)), newcombined, "old/new");
    var result = [];
    var cs1 = generateChangeset(old, new1);
    var cs2 = generateChangeset(old, new2);

    return "equals(applyChangeset('"+old+"', mergeChangeset('"+old+"', '"+cs1+"', '"+cs2+"')), '"+newcombined+"', '"+old+"/"+newcombined+"');";
}



function setter(form) {
    if (form.testType[0].checked) form.genUnitTest = genUTFromGenerate;
    else form.genUnitTest = genUTFromApply;
    if (form.inputType[0].checked) form.generate = genCustom;
    else form.generate = genPremade;
}
