/*
    NanoPlay

    Copyright (C) Subnodal Technologies. All Rights Reserved.

    https://nanoplay.subnodal.com
    Licenced by the Subnodal Open-Source Licence, which can be found at LICENCE.md.
*/

var charset = require("charset");

exports.graphicsModule = new Graphics();

exports.clear = function() {
    g.clear();
};

exports.render = function() {
    g.flip();
};

exports.drawChars = function(chars, x, y) {
    for (var i = 0; i < chars.length; i++) {
        g.drawImage(charset[chars[i]], x + (i * 8), y);
    }
};

exports.drawCharsFromCell = function(chars, cx, cy) {
    exports.drawChars(chars, cx * 8, (cy * 14) + 8);
};