/*
    NanoPlay

    Copyright (C) Subnodal Technologies. All Rights Reserved.

    https://nanoplay.subnodal.com
    Licenced by the Subnodal Open-Source Licence, which can be found at LICENCE.md.
*/

exports.properties = {
    language: "en_GB",
    longPressTime: 1,
    runSpeed: 0
};

exports.save = function() {
    require("Storage").writeJSON("config.json", exports.properties);
};

try {
    exports.properties = Object.assign(exports.properties, require("Storage").readJSON("config.json"));
} catch (e) {}