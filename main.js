/*
    NanoPlay

    Copyright (C) Subnodal Technologies. All Rights Reserved.

    https://nanoplay.subnodal.com
    Licenced by the Subnodal Open-Source Licence, which can be found at LICENCE.md.
*/

var uiHomeScreen = require("home").HomeScreen;

var rootScreenIsOpen = false;

exports.rootScreenLoop = null;
exports.openRootScreenAllowed = true;

function _(text) {
    return require("l10n").translate(text);
}

function startRootScreen() {
    if (!rootScreenIsOpen && exports.openRootScreenAllowed) {
        Bluetooth.setConsole(true);

        rootScreenIsOpen = true;

        let homeScreen = new uiHomeScreen([
            {
                text: _("clock"),
                icon: require("images").clockIcon,
                module: "clock",
                action: function() {
                    let screenClass = require("clock").ClockScreen;

                    homeScreen.open(new screenClass());
                }
            },
            {
                text: _("settings"),
                icon: require("images").settingsIcon,
                module: "settings",
                action: function() {
                    require("settings").load(homeScreen);
                }
            }
        ]);

        homeScreen.items = homeScreen.items.concat(require("appload").getHomeScreenIcons(homeScreen));

        require("ui").buttons.tl.statusBuffer = [];
        require("ui").buttons.tr.statusBuffer = [];
        require("ui").buttons.bl.statusBuffer = [];
        require("ui").buttons.br.statusBuffer = [];

        LED.write(require("config").properties.backlight);
        Pixl.setLCDPower(true);

        exports.rootScreenLoop = require("ui").openRootScreen(homeScreen, function() {
            rootScreenIsOpen = false;

            require("display").clear();
            require("display").render();

            LED.write(0);
            Pixl.setLCDPower(false);
        });
    }
}

exports.start = function() {
    LED.write(0);
    Pixl.setLCDPower(false);

    setTime(Date.parse("2021-01-01T00:00:00") / 1000);
    NRF.setAdvertising({}, {name: "NanoPlay " + NRF.getAddress().substring(12).replace(":", "")});
    NRF.nfcURL("https://subnodal.com/np");

    require("display").clear();
    require("display").render();

    setWatch(startRootScreen, BTN1, {repeat: true, edge: "falling"});
    setWatch(startRootScreen, BTN2, {repeat: true, edge: "falling"});
    setWatch(startRootScreen, BTN4, {repeat: true, edge: "falling"});
    setWatch(startRootScreen, BTN3, {repeat: true, edge: "falling"});

    startRootScreen();
};

exports.preventOpening = function() {
    exports.openRootScreenAllowed = false;
};