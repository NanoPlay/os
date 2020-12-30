/*
    NanoPlay

    Copyright (C) Subnodal Technologies. All Rights Reserved.

    https://nanoplay.subnodal.com
    Licenced by the Subnodal Open-Source Licence, which can be found at LICENCE.md.
*/

var uiScreen = require("ui").Screen;

class MainScreen extends uiScreen {
    constructor() {
        super();
    }
    
    tick() {
        g.drawImage(require("images").logo, 34, 13);

        require("display").drawCharsFromCell(require("l10n").translate("hello"), 1, 3);
    }
}

exports.start = function() {
    NRF.nfcURL("https://subnodal.com");

    require("ui").openRootScreen(new MainScreen());
};