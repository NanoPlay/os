/*
    NanoPlay

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

class AppScreen extends uiScreen {
    constructor(program) {
        super();

        this.showStatusBar = false;
        this.idleRefreshInterval = 100;

        var exposedGlobals = {
            Math: Math,
            String: String,
            Object: Object,
            Date: Date
        };

        Object.assign(exposedGlobals, require("api"));

        this.programGlobal = (function() {
            var __objects = eval(
                "var global,start,loop,_shouldClose=false,_showStatusBar=false;" +
                require("api")._communicators +
                ";" + program +
                ";var _status=" + STATUS_FUNCTION +
                ";[start,loop,_status]"
            );

            return {
                start: __objects[0] || function() {},
                loop: __objects[1] || function() {},
                _status: __objects[2]
            };
        }).call(exposedGlobals);
    }

    start() {
        this.programGlobal.start();
    }

    tick(event) {
        if (BTN1.read() && BTN2.read() && BTN3.read() && BTN4.read()) {
            debounceButtons();
            this.close();

            return;
        }

        this.showStatusBar = this.programGlobal._status()._showStatusBar;

        this.programGlobal.loop(event);

        if (this.programGlobal._status()._shouldClose) {
            debounceButtons();
            this.close();
        }
    }
};

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
                text: manifest["name"][require("l10n").getLocaleCode()],
                icon: manifest["icon"] || require("images").defaultIcon,
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