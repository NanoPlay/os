/*
    NanoPlay

    Copyright (C) Subnodal Technologies. All Rights Reserved.

    https://nanoplay.subnodal.com
    Licenced by the Subnodal Open-Source Licence, which can be found at LICENCE.md.
*/

var uiScreen = require("ui").Screen;
var uiMenu = require("ui").MenuScreen;

function _(text) {
    return require("l10n").translate(text);
}

class MainScreen extends uiScreen {
    tick(event) {
        g.drawImage(require("images").logo, 34, 13);

        if (event.buttons.tl == require("ui").buttonStatus.PRESSED) {
            this.close();
        } else if (event.buttons.tr == require("ui").buttonStatus.PRESSED) {
            require("display").drawCharsFromCell("Press!", 1, 3);
        } else if (event.buttons.tr == require("ui").buttonStatus.LONG_PRESSED) {
            require("display").drawCharsFromCell("Long press!", 1, 3);
        } else {
            require("display").drawCharsFromCell(_("hello"), 1, 3);
        }

        require("ui").drawButtonIcons("back", "ok", "left", "right");
    }
}

exports.load = function(parentScreen) {
    var menu = new uiMenu([
        {
            text: "Test screen",
            action: function() {
                menu.open(new MainScreen());
            }
        },
        {text: "Hello"},
        {text: "World"},
        {text: "Testing"},
        {text: "Test 2"},
        {text: "Test 3"},
        {text: "Test 4"},
        {text: "Really long string that goes on for miles"}
    ]);
    
    parentScreen.open(menu);
};