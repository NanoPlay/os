/*
    NanoPlay OS

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
        if (event.buttons.tl == 1) {
            this.close();
        }

        g.drawImage(require("images").logo, 34, 13);

        require("display").drawCharsFromCell(require("config").OS_VERSION, 0, 3);
        require("display").drawCharsFromCell("(C) {sn}", 8, 3);

        require("ui").drawButtonIcons("back", " ", " ", " ");
    }
}

class SetTimeScreen extends uiScreen {
    constructor() {
        super();

        this.digitString = require("l10n").formatDate("%Y/%m/%d %H:%M", new Date());
        this.currentDigit = 0;
    }

    tick(event) {
        if (event.buttons.tl == 1) {
            do {
                this.currentDigit--;
            } while (this.currentDigit >= 0 && ["/", " ", ":"].includes(this.digitString[this.currentDigit]))

            if (this.currentDigit < 0) {
                this.close();

                return;
            }
        } else if (event.buttons.tl == 2) {
            this.close();
        }

        if (event.buttons.tr == 1) {
            do {
                this.currentDigit++;
            } while (["/", " ", ":"].includes(this.digitString[this.currentDigit]))

            if (this.currentDigit > 15) {
                setTime(Date.parse(
                    this.digitString.substring(0, 4) + "-" +
                    this.digitString.substring(5, 7) + "-" +
                    this.digitString.substring(8, 10) + "T" +
                    this.digitString.substring(11, 16) + ":00"
                ) / 1000);

                this.close();

                return;
            }
        }

        var newDigit = this.digitString[this.currentDigit];

        if (event.buttons.bl == 1) {
            if (newDigit == "0") {
                newDigit = "9";
            } else {
                newDigit = String(Number(newDigit) - 1);
            }

        } else if (event.buttons.br == 1) {
            if (newDigit == "9") {
                newDigit = "0";
            } else {
                newDigit = String(Number(newDigit) + 1);
            }
        }

        this.digitString = this.digitString.substring(0, this.currentDigit) + newDigit + this.digitString.substring(this.currentDigit + 1);

        require("display").drawCharsFromCell(this.digitString, 0, 1);
        require("display").drawCharsFromCell("YYYY/MM/DD hh:mm", 0, 2);

        require("display").fillCells(this.currentDigit, 1, 1, 1, true);
        require("display").drawCharsFromCell(this.digitString[this.currentDigit], this.currentDigit, 1, true);

        require("ui").drawButtonIcons(
            this.currentDigit == 0 ? "back" : "left",
            this.currentDigit == 15 ? "ok" : "right",
            "-",
            "+",
        );
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
        },
        {
            text: _("setTime"),
            action: function() {
                menu.open(new SetTimeScreen());
            }
        },
        {
            text: _("restart"),
            action: function() {
                reset();
            }
        }
    ]);

    menu.close = function() {
        uiMenu.prototype.close.call(menu);

        menu.menuItems = [];
    };

    LED.write(require("config").properties.backlight);
    
    parentScreen.open(menu);
};