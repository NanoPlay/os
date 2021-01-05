/*
    NanoPlay

    Copyright (C) Subnodal Technologies. All Rights Reserved.

    https://nanoplay.subnodal.com
    Licenced by the Subnodal Open-Source Licence, which can be found at LICENCE.md.
*/

exports.properties = {
    language: "en_GB",
    backlight: true,
    longPressTime: 1,
    runSpeed: 50
};

try {
    exports.properties = Object.assign(exports.properties, require("Storage").readJSON("config.json"));
} catch (e) {}

exports.save = function() {
    require("Storage").writeJSON("config.json", exports.properties);
};