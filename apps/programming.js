/*
    NanoPlay

    Copyright (C) Subnodal Technologies. All Rights Reserved.

    https://nanoplay.subnodal.com
    Licenced by the Subnodal Open-Source Licence, which can be found at LICENCE.md.
*/

const PROGRAM_FILE_SIZE = 512;
const LANG_VERSION = 0;

var uiScreen = require("ui").Screen;
var uiMenuScreen = require("ui").MenuScreen;

function _(text) {
    return require("l10n").translate(text);
}

function getSourceMap(programSource) {
    var map = [];
    var indent = arguments[1] || 0;

    for (var i = 0; i < programSource.length; i++) {
        map.push([indent, programSource[i].c, programSource[i].a || []]);

        if ("s" in programSource[i]) {
            map = map.concat(getSourceMap(programSource[i].s, indent + 1));

            map.push([indent, 0, []]);
        }
    }

    return map;
}

exports.ProgrammingScreen = class extends uiScreen {
    constructor() {
        super();

        this.program = {};
        this.filename = null;

        this.menuScreenWasOpen = false;
    }

    openProgram(filename) {
        this.program = require("Storage").readJSON(filename, true) || {p: [], v: LANG_VERSION};
        this.filename = filename;
    }

    saveProgram() {
        var json = JSON.stringify(this.program);

        // We buffer the file with PROGRAM_FILE_SIZE to ensure that program files fit nicely in the flash memory
        require("Storage").write(this.filename, json + " ".repeat(PROGRAM_FILE_SIZE - json.length));
    }

    tick(event) {
        var thisScope = this;

        if (event.buttons.tl == require("ui").buttonStatus.PRESSED) {
            if (this.filename != null) {
                this.saveProgram();

                this.filename = null;
                this.menuScreenWasOpen = false;
            }
        }

        if (this.menuScreenWasOpen && this.filename == null) {
            this.close();

            return;
        }

        if (this.filename == null) {
            let menuScreen = new uiMenuScreen([
                {
                    text: "+ " + _("new"),
                    action: function() {
                        thisScope.program = {p: [], v: LANG_VERSION};
                        thisScope.filename = String(Math.floor(Math.random() * 1e4)).padStart(4, "0") + ".np";

                        menuScreen.close();
                    }
                }
            ]);

            let storageList = require("Storage").list();

            for (var i = 0; i < storageList.length; i++) {
                (function(i) {
                    if (storageList[i].endsWith(".np")) {
                        menuScreen.menuItems.push({
                            text: storageList[i].split(".")[0],
                            action: function() {
                                thisScope.openProgram(storageList[i]);
                                menuScreen.close();

                                storageList = null;
                            }
                        });
                    }
                })(i);
            }

            this.menuScreenWasOpen = true;

            this.open(menuScreen);
        } else {
            var sourceMap = getSourceMap(this.program["p"]);

            for (var i = 0; i < 4; i++) {
                if (i < sourceMap.length) {
                    var sourceText = [];

                    for (var j = 0; j < sourceMap[i][0]; j++) {
                        sourceText.push(["indent"]);
                    }

                    sourceText = sourceText.concat(_("cmd" + sourceMap[i][1]).split(""));

                    for (var j = 0; j < sourceMap[i][2].length; j++) {
                        sourceText.push(" ");

                        for (var k = 0; k < sourceMap[i][2][j].length; k++) {
                            if (typeof(sourceMap[i][2][j][k]) == "string") {
                                sourceText = sourceText.concat(sourceMap[i][2][j][k].split(""));
                            } else {
                                sourceText.push(sourceMap[i][2][j][k]);
                            }
                        }
                    }

                    require("display").drawCharsFromCell(sourceText, 1, i);
                }
            }
        }
    }
};