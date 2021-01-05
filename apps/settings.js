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

class AboutScreen extends uiScreen {
    tick(event) {
        if (event.buttons.tl == require("ui").buttonStatus.PRESSED) {
            this.close();
        }

        g.drawImage(require("images").logo, 34, 13);

        require("display").drawCharsFromCell("V0.1.0", 0, 3);
        require("display").drawCharsFromCell("(C) {sn}", 8, 3);

        require("ui").drawButtonIcons("back", " ", " ", " ");
    }
}

exports.load = function(parentScreen) {
    var menu = new uiMenu([
        {
            text: _("about"),
            action: function() {
                menu.open(new AboutScreen());
            }
        },
        {
            text: _("language"),
            action: function() {
                var languageMenu = new uiMenu([]);
                var storageList = require("Storage").list();

                for (var i = 0; i < storageList.length; i++) {
                    (function(i) {
                        if (storageList[i].startsWith("lc_")) {
                            languageMenu.menuItems.push({
                                text: require("Storage").readJSON(storageList[i])["name"],
                                action: function() {
                                    require("config").properties.language = storageList[i].substring(3, 8);

                                    require("config").save();
                                    require("l10n").loadLocale();

                                    reset();
                                }
                            });
                        }
                    })(i);
                }
                
                menu.open(languageMenu);
            }
        },
        {
            text: require("config").properties.backlight ? _("bl_on") : _("bl_off"),
            action: function() {
                require("config").properties.backlight = !require("config").properties.backlight;

                LED.write(require("config").properties.backlight);
                require("config").save();

                menu.menuItems[2].text = require("config").properties.backlight ? _("bl_on") : _("bl_off");
            }
        }
    ]);

    LED.write(require("config").properties.backlight);
    
    parentScreen.open(menu);
};