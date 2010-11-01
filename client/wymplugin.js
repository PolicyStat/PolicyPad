

/*
insert(string) -> void - insert text at current cursor position
html([string]) -> [string] - get/set html content
xhtml() -> string - get xhtml content
status(string) => void - display text in editor's status bar

*/

//Extend WYMeditor
WYMeditor.editor.prototype.wymplugin = function(onchange) {
    var wym = this;

    //function onkeyup(evt) {
    //    alert("you pressed a key");
    //}

    //add a handler to the keyup event
    jQuery(wym._doc).bind("keyup", onchange);

    //example code
    jQuery(this._box).find(this._options.toolSelector).hover(
        function() { wym.status('hover'); },
        function() { wym.status('hi'); }
    );

};



