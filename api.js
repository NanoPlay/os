/*
    NanoPlay OS

    Copyright (C) Subnodal Technologies. All Rights Reserved.

    https://nanoplay.subnodal.com
    Licenced by the Subnodal Open-Source Licence, which can be found at LICENCE.md.
*/

exports._communicators = "";

/*
    @name OS_VERSION
    @type const <String>
    The version string of NanoPlay OS.
*/
exports.OS_VERSION = require("config").OS_VERSION;

/*
    @name OS_VERNUM
    @type const <Number>
    The comparable version number of NanoPlay OS.
*/
exports.OS_VERNUM = require("config").OS_VERNUM;

/*
    @name fillShapes
    @type var <Boolean>
    Whether to fill in the insides of shapes.
*/
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

/*
    @name close
    Close the app and return to the home screen.
*/
exports._communicators += ";var close=" + (function() {
    _shouldClose = true;
}).toString();

/*
    @name statusBar
    Enable/disable showing the status bar. The status bar is drawn over everything else.
    @param enable <Boolean = false> Whether to show the status bar
*/
exports._communicators += ";var statusBar=" + (function(enable) {
    _showStatusBar = !!enable;
}).toString();

/*
    @name clear
    Clear the screen.
*/
exports.clear = function() {
    g.clear();
};

/*
    @name fill
    Enable/disable the filling in of subsequent shapes. If disabled, only shape outlines are drawn.
    @param enable <Boolean = false> Whether to fill in subsequent shapes
*/
exports.fill = function(enable) {
    exports.fillShapes = !!enable;
};

/*
    @name invert
    Enable/disable the inversion of subequent graphics. If enabled, filled-in
    shapes will appear as off whereas they would appear as on when inversion is
    disabled.
    @param enable <Boolean = false> Whether to invert subsequent graphics
*/
exports.invert = function(enable) {
    g.setBgColor(enable & 1);
    g.setColor((!enable) & 1);
};

/*
    @name line
    Draw a line from one coordinate to another.
    @param x1 <Number> The X component of the first coordinate
    @param y1 <Number> The Y component of the first coordinate
    @param x2 <Number> The X component of the second coordinate
    @param y2 <Number> The Y component of the second coordinate
*/
exports.line = function(x1, y1, x2, y2) {
    typeAll(arguments, "number");

    g.drawLine(x1, y1, x2, y2);
};

/*
    @name rect
    Draw a rectangle from a given coordinate.
    @param x <Number> The X component of the origin coordinate
    @param y <Number> The Y component of the origin coordinate
    @param w <Number> The width of the rectangle
    @param h <Number> The height of the rectangle
*/
exports.rect = function(x, y, w, h) {
    typeAll(arguments, "number");

    if (exports.fillShapes) {
        g.fillRect(x, y, x + w, y + h);
    } else {
        g.drawRect(x, y, x + w, y + h);
    }
};

/*
    @name circle
    Draw a circle around a given coordinate with a specified radius.
    @param x <Number> The X component of the origin coordinate
    @param y <Number> The Y component of the origin coordinate
    @param radius <Number> The radius of the circle
*/
exports.circle = function(x, y, radius) {
    typeAll(arguments, "number");

    if (exports.fillShapes) {
        g.fillCircle(x, y, radius);
    } else {
        g.drawCircle(x, y, radius);
    }
};

/*
    @name ellipse
    Draw an ellipse from a given coordinate.
    @param x <Number> The X component of the origin coordinate
    @param y <Number> The Y component of the origin coordinate
    @param w <Number> The width of the ellipse
    @param h <Number> The height of the ellipse
*/
exports.ellipse = function(x, y, w, h) {
    typeAll(arguments, "number");

    if (exports.fillShapes) {
        g.fillEllipse(x, y, x + w, y + h);
    } else {
        g.drawEllipse(x, y, x + w, y + h);
    }
};

/*
    @name text
    Draw a string of text from a given coordinate.
    @param x <Number> The X component of the origin coordinate
    @param y <Number> The Y component of the origin coordinate
    @param text <*> The string to be drawn as text
    @param mini <Boolean = false> Whether to draw the text in a smaller font
*/
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

/*
    @name getTextWidth
    Calculate the width of a given string of text
    @param text <*> The string to calculate the textual width of
    @param mini <Boolean = false> Whether the text is set in a smaller font
    @returns <Number> The width of the text in pixels
*/
exports.getTextWidth = function(text) {
    var mini = arguments[1] || false;
    
    if (mini) {
        g.setFont("4x6");
    } else {
        g.setFont("6x8");
    }

    return g.stringWidth(String(text));
};

/*
    @name getPixel
    Get a specified pixel's value.
    @param x <Number> The X component of the pixel's coordinate
    @param y <Number> The Y component of the pixel's coordinate
    @returns <Boolean> Whether the pixel is on or off
*/
exports.getPixel = function(x, y) {
    typeAll(arguments, "number");

    return !!g.getPixel(x, y);
};

/*
    @name setPixel
    Set a specified pixel's value.
    @param x <Number> The X component of the pixel's coordinate
    @param y <Number> The Y component of the pixel's coordinate
    @param on <Boolean = true> Whether the pixel is on or off
*/
exports.setPixel = function(x, y) {
    var on = arguments[2] || true;

    typeAll(arguments, "number");

    return g.setPixel(x, y, on & 1);
};

exports.tl = {
    /*
        @name tl.pressed
        Whether the top-left button is pressed.
        @returns <Boolean> Whether the button is pressed
    */
    pressed: function() {
        return BTN1.read();
    }
};

exports.tr = {
    /*
        @name tr.pressed
        Whether the top-right button is pressed.
        @returns <Boolean> Whether the button is pressed
    */
    pressed: function() {
        return BTN2.read();
    }
};

exports.bl = {
    /*
        @name bl.pressed
        Whether the bottom-left button is pressed.
        @returns <Boolean> Whether the button is pressed
    */
    pressed: function() {
        return BTN4.read();
    }
};

exports.br = {
    /*
        @name br.pressed
        Whether the bottom-right button is pressed.
        @returns <Boolean> Whether the button is pressed
    */
    pressed: function() {
        return BTN3.read();
    }
};

/*
    @name readPin
    Read an analog pin's value (on the back of the NanoPlay).
    @param pin <Number> Index of the pin: an integer within the bounds 0 to 5 inclusive
    @returns <Number> The analog value of the pin: a real number within the bounds 0 to 1 inclusive
*/
exports.readPin = function(pin) {
    typePin(pin);

    return analogRead(pin + 14); // Analog pins start at 14
};

/*
    @name writePin
    Write an analog pin's value (on the back of the NanoPlay).
    @param pin <Number> Index of the pin: an integer within the bounds 0 to 5 inclusive
    @param value <Number> The The analog value of the pin: a real number within the bounds 0 to 1 inclusive
*/
exports.writePin = function(pin, value) {
    typePin(pin);

    if (typeof(value) == "boolean") {
        value = value & 1;
    } else if (typeof(value) != "number" || value < 0 || value > 1) {
        throw new TypeError("Value must be a positive real number within the bounds 0 to 1 inclusive");
    }

    analogWrite(pin + 14, value); // Analog pins start at 14
};

/*
    @name readFile
    Read a data file from the NanoPlay's storage.
    @param filename <String> The filename to read from: a string with only characters a-z, A-Z and 0-9, between 1 to 20 characters long
    @returns <String> The contents of the data file that have been read
*/
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

/*
    @name writeFile
    Write a data file to the NanoPlay's storage. Any data files with the same
    name will be overwritten.
    @param filename <String> The filename to write to: a string with only characters a-z, A-Z and 0-9, between 1 to 20 characters long
    @param data <String> The contents of the data file to write
*/
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

/*
    @name getFileList
    Get a list of data files in the NanoPlay's storage.
    @returns <Object> A list of filenames of data files
*/
exports.getFileList = function() {
    return require("Storage").list()
        .filter((a) => a.endsWith(".npd"))
        .map((a) => a.split(".")[0])
    ;
};

/*
    @name nfcSet
    Set the NanoPlay's NFC chip to emit the specified URL to nearby devices.
    @param url <String> The URL to emit to nearby devices
*/
exports.nfcSet = function(url) {
    typeAll([url], "string");
    
    NRF.nfcURL(url);
};

/*
    @name getBatteryPercentage
    Get the battery's fullness percentage.
    @returns <Number> The percentage fullness of the battery: a number within the bounds of 0 to 100 inclusive
*/
exports.getBatteryPercentage = function() {
    return E.getBattery();
};

/*
    @name getTemperatureCelsius
    Get the current measured temperature in degrees Celsius.
    @returns <Number> The temperature in degrees Celsius
*/
exports.getTemperatureCelsius = function() {
    return E.getTemperature();
};

/*
    @name getTemperatureFahrenheit
    Get the current measured temperature in degrees Fahrenheit.
    @returns <Number> The temperature in degrees Fahrenheit
*/
exports.getTemperatureFahrenheit = function() {
    return (exports.getTemperatureCelsius() * 1.8) + 32;
};

/*
    @name getTemperatureKelvin
    Get the current measured temperature in Kelvin.
    @returns <Number> The temperature in Kelvin
*/
exports.getTemperatureKelvin = function() {
    return exports.getTemperatureCelsius() + 273.15;
};

/*
    @name getLocaleCode
    Get the NanoPlay's current locale code. For example, for English (United Kingdom), the locale code would be `"en_GB"`.
    @returns <String> The locale code of the currently-set locale
*/
exports.getLocaleCode = function() {
    return require("l10n").getLocaleCode();
};