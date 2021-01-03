/*
    NanoPlay

    Copyright (C) Subnodal Technologies. All Rights Reserved.

    https://nanoplay.subnodal.com
    Licenced by the Subnodal Open-Source Licence, which can be found at LICENCE.md.
*/

var uiScreen = require("ui").Screen;
var uiExpressionScreen = require("ui").ExpressionScreen;

exports.expressionSymbols = [];

function addExpressionSymbols(symbols) {
    for (var i = 0; i < symbols.length; i++) {
        exports.expressionSymbols.push(symbols[i]);
    }
}

class ComputeResultScreen extends uiScreen {
    constructor(result) {
        super();

        this.result = result;
    }

    tick(event) {
        if (event.buttons.tl == require("ui").buttonStatus.PRESSED) {
            this.close();
        }

        require("display").drawCharsFromCell(this.result, 0, 1);
        require("ui").drawButtonIcons("back", " ", " ", " ");
    }
};

class ComputeErrorScreen extends uiScreen {
    tick(event) {
        if (event.buttons.tl == require("ui").buttonStatus.PRESSED) {
            this.close();
        }

        require("display").drawCharsFromCell(require("l10n").translate("resultError0"), 0, 1);
        require("display").drawCharsFromCell(require("l10n").translate("resultError1"), 0, 2);

        require("ui").drawButtonIcons("back", " ", " ", " ");
    }
};

exports.ComputeScreen = class extends uiExpressionScreen {
    constructor() {
        uiExpressionScreen.prototype.constructor.call(this, exports.expressionSymbols);
    }

    process() {
        try {
            var result = require("expressions").evaluate(this.value);

            this.open(new ComputeResultScreen(String(result)));
        } catch (e) {
            this.open(new ComputeErrorScreen());
        }
    }
};

addExpressionSymbols("0123456789.+-".split(""));
addExpressionSymbols([["multiply"], ["divide"], "(", ")", " mod ", "\""]);
addExpressionSymbols(" ABCDEF".split(""));
addExpressionSymbols(["sin(", "cos(", "tan(", "sin-1(", "cos-1(", "tan-1(", "log(", "ln(", "pi"]);