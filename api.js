/*
    NanoPlay

    Copyright (C) Subnodal Technologies. All Rights Reserved.

    https://nanoplay.subnodal.com
    Licenced by the Subnodal Open-Source Licence, which can be found at LICENCE.md.
*/

const PIN_REFERENCES = [A0, A1, A2, A3, A4, A5];

exports._communicators = "";

exports.OS_VERSION = require("config").OS_VERSION;
exports.OS_VERNUM = require("config").OS_VERNUM;

exports.fillShapes = false;

function typeAll(params, type) {
    for (var i = 0; i < params.length; i++) {
        if (typeof(params[i]) != type) {
            throw new TypeError("Expected a parameter to be " + type + ", but got " + typeof(params[i]) + " instead");
        }
    }
}

function typePin(pin) {
    if (typeof(pin) != "number" || pin != Math.floor(pin)) {
        throw new TypeError("Pin specified is not an integer");
    }

    if (pin < 0 || pin > 5) {
        throw new TypeError("NanoPlay doesn't have pin " + String(pin) + "; only has pins 0 to 5");
    }
}

exports._communicators += ";var close=" + (function() {
    _shouldClose = true;
}).toString();

exports._communicators += ";var statusBar=" + (function(enable) {
    _showStatusBar = !!enable;
}).toString();

exports.clear = function() {
    g.clear();
};

exports.fill = function(enable) {
    exports.fillShapes = !!enable;
};

exports.invert = function(enable) {
    g.setBgColor(enable & 1);
    g.setColor((!enable) & 1);
};

exports.line = function(x1, y1, x2, y2) {
    typeAll(arguments, "number");

    g.drawLine(x1, y1, x2, y2);
};

exports.rect = function(x, y, w, h) {
    typeAll(arguments, "number");

    if (exports.fillShapes) {
        g.fillRect(x, y, x + w, y + h);
    } else {
        g.drawRect(x, y, x + w, y + h);
    }
};

exports.circle = function(x, y, radius) {
    typeAll(arguments, "number");

    if (exports.fillShapes) {
        g.fillCircle(x, y, radius);
    } else {
        g.drawCircle(x, y, radius);
    }
};

exports.ellipse = function(x, y, w, h) {
    typeAll(arguments, "number");

    if (exports.fillShapes) {
        g.fillEllipse(x, y, x + w, y + h);
    } else {
        g.drawEllipse(x, y, x + w, y + h);
    }
};

exports.text = function(x, y, text) {
    var mini = arguments[3] || false;

    typeAll([x, y], "number");
    
    if (mini) {
        g.setFont("4x6");
    } else {
        g.setFont("6x8");
    }

    g.drawString(String(text), x, y);
};

exports.getTextWidth = function(text) {
    var mini = arguments[1] || false;
    
    if (mini) {
        g.setFont("4x6");
    } else {
        g.setFont("6x8");
    }

    return g.stringWidth(String(text));
};

exports.getPixel = function(x, y) {
    typeAll(arguments, "number");

    return !!g.getPixel(x, y);
};

exports.setPixel = function(x, y) {
    var on = arguments[2] || true;

    typeAll(arguments, "number");

    return g.setPixel(x, y, on & 1);
};

exports.tl = {
    pressed: function() {
        return BTN1.read();
    }
};

exports.tr = {
    pressed: function() {
        return BTN2.read();
    }
};

exports.bl = {
    pressed: function() {
        return BTN4.read();
    }
};

exports.br = {
    pressed: function() {
        return BTN3.read();
    }
};

exports.readPin = function(pin) {
    typePin(pin);
    
    return analogRead(PIN_REFERENCES[pin]);
};

exports.writePin = function(pin, value) {
    typePin(pin);

    if (typeof(value) == "boolean") {
        value = value & 1;
    } else if (typeof(value) != "number" || value < 0 || value > 1) {
        throw new TypeError("Value must be a positive real number within the bounds 0 to 1 inclusive");
    }

    analogWrite(PIN_REFERENCES[pin], value);
};

exports.readFile = function(filename) {
    typeAll([filename], "string");

    if (!(/^[a-zA-Z0-9]*$/.test(filename))) {
        throw new TypeError("Filename must only contain characters a-z, A-Z and 0-9");
    }

    if (filename.length < 1 || filename.length > 20) {
        throw new TypeError("Filename must be non-empty and be at most 20 characters long");
    }

    return require("Storage").read(filename + ".npd");
};

exports.writeFile = function(filename, data) {
    typeAll([filename], "string");

    if (!(/^[a-zA-Z0-9]*$/.test(filename))) {
        throw new TypeError("Filename must only contain characters a-z, A-Z and 0-9");
    }

    if (filename.length < 1 || filename.length > 20) {
        throw new TypeError("Filename must be non-empty and be at most 20 characters long");
    }

    if (require("Storage").getFree() < data + 1000) {
        throw new Error("Insufficient storage to store file");
    }

    return require("Storage").write(filename + ".npd", String(data));
};

exports.getFileList = function() {
    return require("Storage").list()
        .filter((a) => a.endsWith(".npd"))
        .map((a) => a.split(".")[0])
    ;
};

exports.nfcSet = function(url) {
    typeAll([url], "string");
    
    NRF.nfcURL(url);
};

exports.getBatteryPercentage = function() {
    return E.getBattery();
};

exports.getTemperatureCelsius = function() {
    return E.getTemperature();
};

exports.getTemperatureFahrenheit = function() {
    return (exports.getTemperatureCelsius() * 1.8) + 32;
};

exports.getTemperatureKelvin = function() {
    return exports.getTemperatureCelsius() + 273.15;
};

exports.getLocaleCode = function() {
    return require("l10n").getLocaleCode();
};