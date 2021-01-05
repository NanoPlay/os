/*
    NanoPlay

    Copyright (C) Subnodal Technologies. All Rights Reserved.

    https://nanoplay.subnodal.com
    Licenced by the Subnodal Open-Source Licence, which can be found at LICENCE.md.
*/

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

exports.RuntimeScreen = class extends uiScreen {
    constructor(program) {
        super();

        this.showStatusBar = false;
        this.idleRefreshInterval = require("config").properties.runSpeed;

        this.program = program;
        this.expressionEngine = require("expressions");
    }

    argument(expression) {
        if (typeof(expression) == "string") {
            return expression;
        } else {
            return this.expressionEngine.evaluate(expression);
        }
    }

    step(programSource) {
        for (var i = 0; i < programSource.length; i++) {
            switch (programSource[i].c) {
                case 1: // output
                    require("display").drawChars(String(this.argument(programSource[i].a[0])), this.argument(programSource[i].a[1]), this.argument(programSource[i].a[2]));
                    
                    break;
                case 2: // set
                    this.expressionEngine.variables["\"" + this.argument(programSource[i].a[0]) + "\""] = this.argument(programSource[i].a[1]);

                    break;
            }
        }
    }

    tick() {
        if (BTN1.read() && BTN2.read() && BTN3.read() && BTN4.read()) {
            require("display").clear();

            this.program = null;
            this.expressionEngine = null;

            Modules.removeCached("config");

            this.close();

            return;
        }

        this.step(this.program["p"]);
    }
};

exports.ProgrammingScreen = class extends uiScreen {
    constructor() {
        super();

        this.program = {};
        this.filename = null;

        this.menuScreenWasOpen = false;
        this.scrollPosition = 0;
    }

    openProgram(filename) {
        this.program = require("Storage").readJSON(filename, true) || {p: [], v: LANG_VERSION};
        this.filename = filename;
    }

    tick(event) {
        var thisScope = this;

        if (event.buttons.tl == require("ui").buttonStatus.PRESSED) {
            if (this.filename != null) {
                this.filename = null;
                this.menuScreenWasOpen = false;
            }
        }

        if (event.buttons.tr == require("ui").buttonStatus.PRESSED) {
            var runtimeScreen = exports.RuntimeScreen;
            
            this.open(new runtimeScreen(this.program));

            this.program = {};
        }

        if (event.buttons.bl == require("ui").buttonStatus.PRESSED) {
            this.scrollPosition--;
        }

        if (event.buttons.br == require("ui").buttonStatus.PRESSED) {
            this.scrollPosition++;
        }

        if (this.menuScreenWasOpen && this.filename == null) {
            this.close();

            return;
        }

        if (this.filename == null) {
            let menuScreen = new uiMenuScreen([]);
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
            if (this.program["v"] == undefined) {
                this.openProgram(this.filename);
            }

            let sourceMap = getSourceMap(this.program["p"]);

            require("ui").drawButtonIcons("back", "play", "up", "down");

            for (let i = 0; i < sourceMap.length; i++) {
                let sourceText = [];

                for (let j = 0; j < sourceMap[i][0]; j++) {
                    sourceText.push(["indent"]);
                }

                sourceText = sourceText.concat(_("cmd" + sourceMap[i][1]).split(""));

                for (let j = 0; j < sourceMap[i][2].length; j++) {
                    sourceText.push(" ");

                    if (typeof(sourceMap[i][2][j]) == "string") {
                        sourceText = sourceText.concat(sourceMap[i][2][j].split(""));
                        
                        continue;
                    }

                    for (let k = 0; k < sourceMap[i][2][j].length; k++) {
                        if (typeof(sourceMap[i][2][j][k]) == "string") {
                            sourceText = sourceText.concat(sourceMap[i][2][j][k].split(""));
                        } else {
                            sourceText.push(sourceMap[i][2][j][k]);
                        }
                    }
                }

                if (this.scrollPosition < 0) {
                    this.scrollPosition = sourceMap.length - 4;
                }

                if (this.scrollPosition > sourceMap.length - 4) {
                    this.scrollPosition = 0;
                }

                let si = i - this.scrollPosition;

                if (si >= 0 && si <= 3) {
                    require("display").drawCharsFromCell(sourceText, 1, si);

                    g.drawLine((sourceMap[i][0] * 8) + 8, (si * 14) + 9, (sourceText.length * 8) + 7, (si * 14) + 9);
                    g.drawLine((sourceMap[i][0] * 8) + 8, (si * 14) + 21, (sourceText.length * 8) + 7, (si * 14) + 21);
                    g.drawLine((sourceMap[i][0] * 8) + 7, (si * 14) + 10, (sourceMap[i][0] * 8) + 7, (si * 14) + 20);
                    g.drawLine((sourceText.length * 8) + 8, (si * 14) + 10, (sourceText.length * 8) + 8, (si * 14) + 20);
                }
            }

            for (let i = 0; i < 4; i++) {
                require("display").fillCells(15, i, 1, 1);
            }

            require("ui").drawButtonIcons(" ", "play", " ", "down");
        }
    }
};