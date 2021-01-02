/*
    NanoPlay

    Copyright (C) Subnodal Technologies. All Rights Reserved.

    https://nanoplay.subnodal.com
    Licenced by the Subnodal Open-Source Licence, which can be found at LICENCE.md.
*/

var uiScreen = require("ui").Screen;

exports.ClockScreen = class extends uiScreen {
    constructor() {
        super();

        this.idleRefreshInterval = 500;
    }

    tick(event) {
        if (event.buttons.tl == require("ui").buttonStatus.PRESSED) {
            this.close();
        }

        g.setFont("Vector", 24);

        var time = require("l10n").formatDate("%X", new Date())

        g.drawString(time, (128 - g.stringWidth(time)) / 2, 20);

        require("ui").drawButtonIcons("back", " ", " ", " ");
    }
};