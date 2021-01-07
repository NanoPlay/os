/*
    NanoPlay

    Copyright (C) Subnodal Technologies. All Rights Reserved.

    https://nanoplay.subnodal.com
    Licenced by the Subnodal Open-Source Licence, which can be found at LICENCE.md.
*/

var uiScreen = require("ui").Screen;

function _(text) {
    return require("l10n").translate(text);
}

exports.NoProgramsScreen = class extends uiScreen {
    tick(event) {
        if (event.buttons.tl == 1) {
            this.close();
        }

        NRF.nfcURL("https://subnodal.com/np");

        require("display").drawCharsFromCell(["back"], 0, 0);
        require("display").drawCharsFromCell(_("empty1"), 0, 1);
        require("display").drawCharsFromCell(_("empty2"), 0, 2);
        require("display").drawCharsFromCell("subnodal.com/np", 0, 3);
    }
};