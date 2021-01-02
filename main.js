/*
    NanoPlay

    Copyright (C) Subnodal Technologies. All Rights Reserved.

    https://nanoplay.subnodal.com
    Licenced by the Subnodal Open-Source Licence, which can be found at LICENCE.md.
*/

var uiScreen = require("ui").Screen;
var uiMenuScreen = require("ui").MenuScreen;
var uiHomeScreen = require("home").HomeScreen;

var rootScreenIsOpen = false;

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
            require("display").drawCharsFromCell(require("l10n").translate("hello"), 1, 3);
        }

        require("ui").drawButtonIcons("back", "ok", "left", "right");
    }
}

function startRootScreen() {
    if (!rootScreenIsOpen) {
        rootScreenIsOpen = true;

        var homeScreen = new uiHomeScreen([
            {
                text: "Clock",
                icon: require("images").clockIcon
            },
            {
                text: "Compute",
                icon: require("images").computeIcons[require("l10n").getLocaleCode()]
            },
            {
                text: "Programming",
                icon: require("images").programmingIcon
            },
            {
                text: "Settings",
                icon: require("images").settingsIcon,
                action: function() {
                    var menu = new uiMenuScreen([
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
        
                    homeScreen.open(menu);
                }
            }
        ]);

        require("ui").buttons.tl.statusBuffer = [];
        require("ui").buttons.tr.statusBuffer = [];
        require("ui").buttons.bl.statusBuffer = [];
        require("ui").buttons.br.statusBuffer = [];

        LED.write(1);
        Pixl.setLCDPower(true);

        require("ui").openRootScreen(homeScreen, function() {
            rootScreenIsOpen = false;

            require("display").clear();
            require("display").render();

            LED.write(0);
            Pixl.setLCDPower(false);
        });
    }
}

exports.start = function() {
    NRF.nfcURL("https://subnodal.com");

    LED.write(0);
    Pixl.setLCDPower(false);

    require("display").clear();
    require("display").render();

    setWatch(startRootScreen, BTN1, {repeat: true, edge: "falling"});
    setWatch(startRootScreen, BTN2, {repeat: true, edge: "falling"});
    setWatch(startRootScreen, BTN4, {repeat: true, edge: "falling"});
    setWatch(startRootScreen, BTN3, {repeat: true, edge: "falling"});
};