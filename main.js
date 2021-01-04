/*
    NanoPlay

    Copyright (C) Subnodal Technologies. All Rights Reserved.

    https://nanoplay.subnodal.com
    Licenced by the Subnodal Open-Source Licence, which can be found at LICENCE.md.
*/

var uiHomeScreen = require("home").HomeScreen;

var rootScreenIsOpen = false;

function _(text) {
    return require("l10n").translate(text);
}

function startRootScreen() {
    if (!rootScreenIsOpen) {
        rootScreenIsOpen = true;

        var homeScreen = new uiHomeScreen([
            {
                text: _("clock"),
                icon: require("images").clockIcon,
                action: function() {
                    var screenClass = require("clock").ClockScreen;

                    homeScreen.open(new screenClass());
                }
            },
            {
                text: _("compute"),
                icon: require("images").computeIcons[require("l10n").getLocaleCode()],
                action: function() {
                    var screenClass = require("compute").ComputeScreen;

                    homeScreen.open(new screenClass());
                }
            },
            {
                text: _("programming"),
                icon: require("images").programmingIcon,
                action: function() {
                    var programmingClass = require("programming").ProgrammingScreen;

                    homeScreen.open(new programmingClass());
                }
            },
            {
                text: _("settings"),
                icon: require("images").settingsIcon,
                action: function() {
                    require("settings").load(homeScreen);
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