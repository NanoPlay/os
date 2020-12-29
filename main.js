/*
    NanoPlay

    Copyright (C) Subnodal Technologies. All Rights Reserved.

    https://nanoplay.subnodal.com
    Licenced by the Subnodal Open-Source Licence, which can be found at LICENCE.md.
*/

exports.start = function() {
    require("display").clear();

    g.drawImage(require("images").logo, 34, 13);

    require("display").drawCharsFromCell(require("l10n").translate("hello"), 1, 3);
    require("ui").drawStatusBar();

    require("display").render();

    NRF.nfcURL("https://subnodal.com");

    setInterval(function() {
        require("ui").drawStatusBar();
        require("display").render();
    }, 1000);
};