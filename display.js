/*
    NanoPlay

    Copyright (C) Subnodal Technologies. All Rights Reserved.

    https://nanoplay.subnodal.com
    Licenced by the Subnodal Open-Source Licence, which can be found at LICENCE.md.
*/

var charset = require("charset");

require("Font6x8").add(Graphics);

exports.clear = function() {
    g.clear();
};

exports.render = function() {
    g.flip();
};

exports.drawChars = function(chars, x, y) {
    var invert = arguments[3] || false;

    if (invert) {
        g.setBgColor(1);
        g.setColor(0);
    } else {
        g.setBgColor(0);
        g.setColor(1);
    }

    g.setFont("6x8");

    for (var i = 0; i < chars.length; i++) {
        if (charset[chars[i]] != undefined) {
            g.drawImage(charset[chars[i]], x + (i * 8), y);
        } else {
            g.drawString(chars[i], x + (i * 8) + 1, y + 4);
        }
    }

    g.setBgColor(0);
    g.setColor(1);
};

exports.drawCharsFromCell = function(chars, cx, cy) {
    var invert = arguments[3] || false;

    exports.drawChars(chars, cx * 8, (cy * 14) + 8, invert);
};

exports.drawCharsMini = function(chars, x, y) {
    var invert = arguments[3] || false;

    if (invert) {
        g.setBgColor(1);
        g.setColor(0);
    } else {
        g.setBgColor(0);
        g.setColor(1);
    }

    g.setFont("4x6");

    g.drawString(chars, x, y);

    g.setBgColor(0);
    g.setColor(1);
};

exports.fillCells = function(cx, cy, cw, ch) {
    var invert = arguments[4] || false;

    if (invert) {
        g.fillRect(cx * 8, (cy * 14) + 8, ((cx + cw) * 8) - 1, ((cy + ch) * 14) + 7);
    } else {
        g.clearRect(cx * 8, (cy * 14) + 8, ((cx + cw) * 8) - 1, ((cy + ch) * 14) + 7);
    }
};

g.setFont6x8();