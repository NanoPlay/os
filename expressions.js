/*
    NanoPlay

    Copyright (C) Subnodal Technologies. All Rights Reserved.

    https://nanoplay.subnodal.com
    Licenced by the Subnodal Open-Source Licence, which can be found at LICENCE.md.
*/

exports.registeredSymbols = {
    "[\"multiply\"]": "*",
    "[\"divide\"]": "/",
    "\" mod \"": "%",
    "\"sin(\"": " Math.sin((Math.PI/180)*",
    "\"cos(\"": " Math.cos((Math.PI/180)*",
    "\"tan(\"": " Math.tan((Math.PI/180)*",
    "\"sin-1(\"": " (180/Math.PI)*Math.asin(",
    "\"cos-1(\"": " (180/Math.PI)*Math.acos(",
    "\"tan-1(\"": " (180/Math.PI)*Math.atan(",
    "\"log(\"": "Math.log10(",
    "\"ln(\"": "Math.log(",
    "\"pi\"": "Math.PI"
};

exports.variables = {};

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

        if (JSON.stringify(expression[i]) in exports.variables) {
            jsString += JSON.stringify(exports.variables[JSON.stringify(expression[i])]);
        } else {
            jsString += exports.registeredSymbols[JSON.stringify(expression[i])] || expression[i];
        }
    }

    return eval(jsString);
};

registerVariables("ABCDEF".split(""));