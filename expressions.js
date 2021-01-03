/*
    NanoPlay

    Copyright (C) Subnodal Technologies. All Rights Reserved.

    https://nanoplay.subnodal.com
    Licenced by the Subnodal Open-Source Licence, which can be found at LICENCE.md.
*/

exports.registeredSymbols = {
    "[\"multiply\"]": "*",
    "[\"divide\"]": "/"
};

exports.variables = {};

exports.stringOnlySymbols = "abcdefghijklmnopqrstuvwxyz".split("");

function registerSymbolsFromText(symbols) {
    for (var i = 0; i < symbols.length; i++) {
        exports.registeredSymbols[JSON.stringify(symbols[i])] = symbols[i];
    }
}

function registerVariables(symbols) {
    for (var i = 0; i < symbols.length; i++) {
        exports.variables[JSON.stringify(symbols[i])] = 0;
    }
}

exports.evaluate = function(expression) {
    var jsString = "";
    var inString = false;

    for (var i = 0; i < expression.length; i++) {
        if (expression[i] == "\"") {
            inString = !inString;
        }

        if (inString && JSON.stringify(expression[i]) in exports.variables) {
            jsString += JSON.stringify(exports.variables[JSON.stringify(expression[i])]);
        } else {
            if (!exports.stringOnlySymbols.includes(JSON.stringify(expression[i]))) {
                jsString += exports.registeredSymbols[JSON.stringify(expression[i])];
            }
        }
    }

    return eval(jsString);
};

registerSymbolsFromText("0123456789.+-\"".split(""));
registerVariables("ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""));