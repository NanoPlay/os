/*
    NanoPlay

    Copyright (C) Subnodal Technologies. All Rights Reserved.

    https://nanoplay.subnodal.com
    Licenced by the Subnodal Open-Source Licence, which can be found at LICENCE.md.
*/

exports.buttonStatus = {
    UNPRESSED: 0,
    PRESSED: 1,
    LONG_PRESSED: 2
};

exports.Button = class {
    constructor(input) {
        this._watches = [];

        this.isPressed = false;
        this.lastStatus = exports.buttonStatus.UNPRESSED;

        this.startWatching(input);
    }

    startWatching(input) {
        var thisScope = this;

        this.stopWatching();
        
        this._watches.push(setWatch(function() {
            thisScope.isPressed = true;
        }, input, {edge: "rising", repeat: true}));

        this._watches.push(setWatch(function(event) {
            thisScope.isPressed = false;

            if (event.time - event.lastTime > require("config").properties.longPressTime) {
                this.lastStatus = exports.buttonStatus.LONG_PRESSED;
            } else {
                this.lastStatus = exports.buttonStatus.PRESSED;
            }
        }, input, {edge: "falling"}));
    }

    poll() {
        var status = this.lastStatus;

        this.lastStatus = exports.buttonStatus.UNPRESSED;

        return status;
    }

    stopWatching() {
        for (var i = 0; i < this._watches.length; i++) {
            clearWatch(this._watches[i]);
        }
    }
};

exports.Screen = class {
    constructor() {
        this.buttons = {
            tl: new exports.Button(BTN1),
            tr: new exports.Button(BTN2),
            bl: new exports.Button(BTN4),
            br: new exports.Button(BTN3)
        };

        this.showStatusBar = true;
        this.alwaysClear = true;
        this.isOpen = true;
        this.openedScreen = null;
    }

    tick() {}

    next() {
        if (this.openedScreen != null) {
            if (!this.openedScreen.next()) {
                this.openedScreen = null;
            }

            return;
        }

        if (this.alwaysClear) {
            require("display").clear();
        }

        this.tick({
            buttons: {
                tl: this.buttons.tl.poll(),
                tr: this.buttons.tr.poll(),
                bl: this.buttons.bl.poll(),
                br: this.buttons.br.poll()
            }
        });

        if (this.showStatusBar) {
            exports.drawStatusBar();
        }

        require("display").render();

        return this.isOpen;
    }

    open(screen) {
        this.openedScreen = screen;
    }

    close() {
        this.isOpen = false;
    }
};

exports.drawStatusBar = function() {
    g.clearRect(0, 0, 127, 6);

    require("display").drawCharsMini(require("l10n").formatDate("%g", new Date()), 1, 1);

    g.drawLine(0, 7, 127, 7);
};

exports.openRootScreen = function(screen) {
    var closeCallback = arguments[1] || function() {};

    var loop = setInterval(function() {
        if (!screen.next()) {
            clearInterval(loop);

            closeCallback();
        }
    }, require("config").properties.runSpeed);

    return loop;
};

exports.closeRootScreen = function(loop) {
    clearInterval(loop);
};