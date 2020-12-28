/*
    NanoPlay

    Copyright (C) Subnodal Technologies. All Rights Reserved.

    https://nanoplay.subnodal.com
    Licenced by the Subnodal Open-Source Licence, which can be found at LICENCE.md.
*/

exports.start = function() {
    g.drawImage(require("images").logo, 34, 13);
    
    require("display").drawCharsFromCell("0123456789", 0, 3);
    require("display").render();
};