/*
    NanoPlay

    Copyright (C) Subnodal Technologies. All Rights Reserved.

    https://nanoplay.subnodal.com
    Licenced by the Subnodal Open-Source Licence, which can be found at LICENCE.md.
*/

const LANG_VERSION = 0;

var uiScreen = require("ui").Screen;

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
        this.lastCondition = true;
        this.fillShapes = false;
    }

    argument(expression) {
        if (typeof(expression) == "string") {
            return expression;
        } else {
            return this.expressionEngine.evaluate(expression);
        }
    }

    start() {
        Modules.removeCached("images");

        this.expressionEngine.variables["\"start\""] = true;
    }

    step(programSource) {
        for (var i = 0; i < programSource.length; i++) {
            var x1 = 0;
            var y1 = 0;
            var x2 = 0;
            var y2 = 0;

            if (programSource[i].a.length >= 4) {
                x1 = this.argument(programSource[i].a[0]);
                y1 = this.argument(programSource[i].a[1]);
                x2 = this.argument(programSource[i].a[2]);
                y2 = this.argument(programSource[i].a[3]);
            }

            switch (programSource[i].c) {
                case 1: // output
                    require("display").drawChars(String(this.argument(programSource[i].a[0])), this.argument(programSource[i].a[1]), this.argument(programSource[i].a[2]));
                    
                    break;
                case 2: // set
                    this.expressionEngine.variables["\"" + this.argument(programSource[i].a[0]) + "\""] = this.argument(programSource[i].a[1]);

                    break;
                case 3: // if
                    this.lastCondition = this.argument(programSource[i].a[0]);

                    if (this.lastCondition) {
                        this.step(programSource[i].s);
                    }

                    break;
                case 4: // else
                    if (!this.lastCondition) {
                        this.step(programSource[i].s);
                    }

                    break;
                case 5: // fill
                    this.fillShapes = this.argument(programSource[i].a[0]);

                    break;
                case 6: // rect
                    if (this.fillShapes) {
                        g.fillRect(x1, y1, x2, y2);
                    } else {
                        g.drawRect(x1, y1, x2, y2);
                    }

                    break;
                case 7: // ellipse
                    if (this.fillShapes) {
                        g.fillEllipse(x1, y1, x2, y2);
                    } else {
                        g.drawEllipse(x1, y1, x2, y2);
                    }

                    break;
                case 8: // line
                    g.drawLine(x1, y1, x2, y2);

                    break;
                case 9: // NFC set
                    NRF.nfcURL(this.argument(programSource[i].a[0]));

                    break;
            }
        }
    }

    tick() {
        if (BTN1.read() && BTN2.read() && BTN3.read() && BTN4.read()) {
            require("display").clear();

            this.program = null;
            this.expressionEngine = null;

            this.close();

            return;
        }

        this.step(this.program["p"]);

        this.expressionEngine.variables["\"start\""] = false;
    }
};

exports.ProgrammingScreen = class extends uiScreen {
    constructor() {
        super();

        this.showStatusBar = false;

        this.program = {};
        this.filename = null;

        this.menuScreenWasOpen = false;
        this.scrollPosition = 0;
    }

    start() {
        Modules.removeCached("home");
    }

    openProgram(filename) {
        this.program = require("Storage").readJSON(filename, true) || {p: [], v: LANG_VERSION};
        this.filename = filename;

        Modules.removeCached("Storage");
    }

    tick(event) {
        var thisScope = this;

        if (event.buttons.tl == 1) {
            if (this.filename != null) {
                this.filename = null;
                this.menuScreenWasOpen = false;
            }
        }

        if (event.buttons.tr == 1) {
            var runtimeScreen = exports.RuntimeScreen;
            
            this.open(new runtimeScreen(this.program));

            this.program = {};

            return;
        }

        if (event.buttons.bl == 1) {
            this.scrollPosition--;
        }

        if (event.buttons.br == 1) {
            this.scrollPosition++;
        }

        if (this.menuScreenWasOpen && this.filename == null) {
            this.close();

            return;
        }

        if (this.filename == null) {
            let uiMenuScreen = require("ui").MenuScreen;
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

            if (menuScreen.menuItems.length > 0) {
                this.open(menuScreen);
            } else {
                let noPrograms = require("noprog").NoProgramsScreen;

                this.open(new noPrograms());
            }
        } else {
            if (this.program["v"] == undefined) {
                this.openProgram(this.filename);
            }

            var sourceMap = getSourceMap(this.program["p"]);

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

            require("ui").drawStatusBar({
                pageUp: this.scrollPosition,
                pageDown: this.scrollPosition < sourceMap.length - 4
            });
        }
    }
};