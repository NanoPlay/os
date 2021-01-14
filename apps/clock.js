/*
    NanoPlay OS

    Copyright (C) Subnodal Technologies. All Rights Reserved.

    https://nanoplay.subnodal.com
    Licenced by the Subnodal Open-Source Licence, which can be found at LICENCE.md.
*/

var uiScreen = require("ui").Screen;

exports.ClockScreen = class extends uiScreen {
    constructor() {
        super();

        this.idleRefreshInterval = 3000;
    }

    tick(event) {
        if (event.buttons.tl == 1) {
            this.close();
        }

        g.setFont("Vector", 24);

        var time = require("l10n").formatDate("%g", new Date());

        g.drawString(time, (128 - g.stringWidth(time)) / 2, 18);

        var date = require("l10n").formatDate("%e", new Date());

        require("display").drawChars(date, (128 - (8 * date.length)) / 2, (2 * 14) + 8);

        require("ui").drawButtonIcons("back", " ", " ", " ");
    }
};