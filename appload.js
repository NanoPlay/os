/*
    NanoPlay OS

    Copyright (C) Subnodal Technologies. All Rights Reserved.

    https://nanoplay.subnodal.com
    Licenced by the Subnodal Open-Source Licence, which can be found at LICENCE.md.
*/

/*
    appload.js is designed to expose the NanoPlay API so that third-party and
    user-made apps can interact with NanoPlay OS. Scripts stored in the apps/
    directory of NanoPlay OS are internal apps and do not make use of the
    NanoPlay API.
*/

const STATUS_FUNCTION = (function() {
    return {
        _shouldClose: _shouldClose,
        _showStatusBar: _showStatusBar
    };
}).toString();

var uiScreen = require("ui").Screen;

function debounceButtons() {
    // Wait for all buttons to be released
    while (BTN1.read() || BTN2.read() || BTN3.read() || BTN4.read()) {}

    // Then poll them all to pop their status buffers
    require("ui").buttons.tl.poll();
    require("ui").buttons.tr.poll();
    require("ui").buttons.bl.poll();
    require("ui").buttons.br.poll();
}

class ErrorScreen extends uiScreen {
    constructor(error) {
        super();

        this.showStatusBar = false;

        this.errorMessage = error.toString();
        this.scrollPosition = 0;
    }

    start() {
        print("<error type=\"app\">" + this.errorMessage + "</error>");
    }

    tick(event) {
        if (event.buttons.tl == 1) {
            this.close();
        }

        var unwrappedText = this.errorMessage.split(" ");
        var wrappedText = [""];

        while (unwrappedText.length > 0) {
            var nextUnwrap = unwrappedText.shift();

            if (nextUnwrap.length > 14) {
                nextUnwrap += " ";

                while (nextUnwrap.length > 0) {
                    wrappedText[wrappedText.length - 1] += nextUnwrap[0];

                    if (wrappedText[wrappedText.length - 1].length >= 14) {
                        wrappedText.push("");
                    }

                    nextUnwrap = nextUnwrap.substring(1);
                }

                continue;
            }

            if (nextUnwrap.length > 14 - wrappedText[wrappedText.length - 1].length - 1) {
                wrappedText.push("");
            }

            wrappedText[wrappedText.length - 1] += nextUnwrap + " ";
        }

        if (event.buttons.bl == 1) {
            this.scrollPosition -= 1;
        } else if (event.buttons.bl == 2) {
            this.scrollPosition -= 4;
        }

        if (event.buttons.br == 1) {
            this.scrollPosition += 1;
        } else if (event.buttons.br == 2) {
            this.scrollPosition += 4;
        }

        if (this.scrollPosition < 0) {
            this.scrollPosition = wrappedText.length - 4;
        }

        if (this.scrollPosition > wrappedText.length - 4) {
            this.scrollPosition = 0;
        }

        for (var i = 0; i < 4; i++) {
            if (this.scrollPosition + i < wrappedText.length) {
                require("display").drawCharsFromCell(wrappedText[this.scrollPosition + i], 1, i);
            }
        }

        require("ui").drawButtonIcons("back", " ", "up", "down");

        require("ui").drawStatusBar({
            pageUp: this.scrollPosition,
            pageDown: this.scrollPosition + 4 < wrappedText.length
        });
    }
}

class AppScreen extends uiScreen {
    constructor(program) {
        super();

        this.showStatusBar = false;
        this.idleRefreshInterval = 100;
        this.error = null;
        this.errorShown = false;

        var exposedGlobals = {
            Math: Math,
            String: String,
            Object: Object,
            Date: Date
        };

        Object.assign(exposedGlobals, require("api"));

        this.programGlobal = {};

        try {
            this.programGlobal = (function() {
                var __objects = eval(
                    "var global,require,start,loop,_shouldClose=false,_showStatusBar=false;" +
                    require("api")._communicators +
                    ";" + program +
                    ";var _status=" + STATUS_FUNCTION +
                    ";[start,loop,_status]"
                );

                return {
                    start: __objects[0] || function() {},
                    loop: __objects[1] || function() {},
                    _status: __objects[2] || function() {return {_shouldClose: false, _showStatusBar: false};}
                };
            }).call(exposedGlobals);
        } catch (e) {
            this.error = e;
        }
    }

    start() {
        if (this.programGlobal["start"] != undefined) {
            this.programGlobal.start();
        }
    }

    tick(event) {
        if (BTN1.read() && BTN2.read() && BTN3.read() && BTN4.read()) {
            debounceButtons();
            this.close();

            return;
        }

        if (this.errorShown) {
            this.close();

            return;
        }

        if (this.error != null) {
            this.open(new ErrorScreen(this.error));
            
            this.errorShown = true;

            return;
        }

        this.showStatusBar = this.programGlobal._status()._showStatusBar;

        try {
            this.programGlobal.loop(event);
        } catch (e) {
            this.error = e;
        }

        if (this.programGlobal._status()._shouldClose) {
            debounceButtons();
            this.close();
        }
    }
}

exports.getApps = function() {
    return require("Storage").list().filter((a) => a.endsWith(".np"));
};

exports.getHomeScreenIcons = function(homeScreen) {
    var apps = exports.getApps();
    var iconData = [];

    for (var i = 0; i < apps.length; i++) {
        (function(i) {
            var manifest = require("Storage").readJSON(apps[i].split(".")[0] + ".npm", true) || {};

            if (typeof(manifest["name"]) == "string") {
                var nonL10nName = manifest["name"];

                manifest["name"] = {};
                manifest["name"][require("l10n").getLocaleCode()] = nonL10nName;
            } else if (typeof(manifest["name"]) != "object") {
                apps[i].split(".")[0];
            }

            iconData.push({
                text: manifest["name"][require("l10n").getLocaleCode()] || apps[i].split(".")[0],
                icon: typeof(manifest["icon"]) == "string" ? {width: 44, height: 17, buffer: atob(manifest["icon"])} : require("images").defaultIcon,
                action: function() {
                    try {
                        homeScreen.open(new AppScreen(require("Storage").read(apps[i])));
                    } catch (e) {
                        print(e);
                    }
                }
            });
        })(i);
    }
    
    return iconData;
};