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
                thisScope.lastStatus = exports.buttonStatus.LONG_PRESSED;
            } else {
                thisScope.lastStatus = exports.buttonStatus.PRESSED;
            }
        }, input, {edge: "falling", repeat: true}));
    }

    poll() {
        var status = this.lastStatus;

        this.lastStatus = exports.buttonStatus.UNPRESSED;

        return status;
    }

    stopWatching() {
        for (var i = 0; i < this._watches.length; i++) {
            if (this._watches[i] != undefined) {
                clearWatch(this._watches[i]);

                this._watches[i] = undefined;
            }
        }
    }
};

exports.Screen = class {
    constructor() {
        this._lastButtonStateSerial = null;
        this._lastRefreshed = -1000;

        this.showStatusBar = true;
        this.alwaysClear = true;
        this.isOpen = true;
        this.openedScreen = null;
        this.idleRefreshInterval = 1000;
    }

    get _buttonStateSerial() {
        return (
            (exports.buttons.tl.lastStatus << 0) +
            (exports.buttons.tr.lastStatus << 2) +
            (exports.buttons.bl.lastStatus << 4) +
            (exports.buttons.br.lastStatus << 6)
        );
    }

    start() {}

    tick() {}

    next() {
        if (this.openedScreen != null) {
            if (!this.openedScreen.next()) {
                this.openedScreen = null;
            }

            return this.isOpen;
        }

        if (
            this._buttonStateSerial == this._lastButtonStateSerial &&
            new Date().getTime() - this._lastRefreshed < Math.min(this.idleRefreshInterval, 1000)
        ) {
            return this.isOpen;
        }

        if (this.alwaysClear) {
            require("display").clear();
        }

        this._lastButtonStateSerial = this._buttonStateSerial;

        this.tick({
            buttons: {
                tl: exports.buttons.tl.poll(),
                tr: exports.buttons.tr.poll(),
                bl: exports.buttons.bl.poll(),
                br: exports.buttons.br.poll()
            }
        });

        if (this.showStatusBar) {
            exports.drawStatusBar();
        }

        require("display").render();

        this._lastRefreshed = new Date().getTime();

        return this.isOpen;
    }

    open(screen) {
        this.openedScreen = screen;

        this.openedScreen.start();
    }

    close() {
        this.isOpen = false;
    }
};

var screenClass = exports.Screen;

exports.MenuScreen = class extends screenClass {
    constructor(menuItems) {
        super();

        this.menuItems = menuItems;
        
        this.selectedItem = 0;
        this.scrollPosition = 0;
    }

    start() {
        this.selectedItem = 0;
        this.scrollPosition = 0;
    }

    tick(event) {
        if (event.buttons.tl == require("ui").buttonStatus.PRESSED) {
            this.close();
        }

        if (event.buttons.tr == require("ui").buttonStatus.PRESSED) {
            if (this.menuItems[this.selectedItem].action != undefined) {
                this.menuItems[this.selectedItem].action();
            }
        }

        if (event.buttons.bl == require("ui").buttonStatus.PRESSED) {
            this.selectedItem--;

            if (this.selectedItem < 0) {
                this.selectedItem = this.menuItems.length - 1;
            }
        } else if (event.buttons.bl == require("ui").buttonStatus.LONG_PRESSED) {
            this.selectedItem = 0;
        }

        if (event.buttons.br == require("ui").buttonStatus.PRESSED) {
            this.selectedItem++;

            if (this.selectedItem >= this.menuItems.length) {
                this.selectedItem = 0;
            }
        } else if (event.buttons.br == require("ui").buttonStatus.LONG_PRESSED) {
            this.selectedItem = this.menuItems.length - 1;
        }

        while (this.selectedItem - this.scrollPosition < 0) {
            this.scrollPosition--;
        }

        while (this.selectedItem - this.scrollPosition > 3) {
            this.scrollPosition++;
        }

        for (var i = 0; i < 4; i++) {
            if (this.scrollPosition + i < this.menuItems.length) {
                if (this.selectedItem == this.scrollPosition + i) {
                    require("display").fillCells(1, i, 14, 1, true);
                }
                
                var textToShow = this.menuItems[this.scrollPosition + i].text;

                if (textToShow.length > 14) {
                    textToShow = this.menuItems[this.scrollPosition + i].text.substring(0, 13).split("");
                    
                    textToShow.push("ellipsis");
                }

                require("display").drawCharsFromCell(textToShow, 1, i, this.selectedItem == this.scrollPosition + i);
            }
        }

        require("ui").drawButtonIcons("back", "ok", "up", "down");
    }
};

exports.drawStatusBar = function() {
    g.clearRect(0, 0, 127, 6);

    require("display").drawCharsMini(require("l10n").formatDate("%g", new Date()), 1, 1);

    g.drawImage(require("images").batteryStatus[Math.floor(E.getBattery() / 12.5)], 116, 1);
    g.drawLine(0, 7, 127, 7);
};

exports.drawButtonIcons = function(tl, tr, bl, br) {
    require("display").drawCharsFromCell([tl], 0, 0);
    require("display").drawCharsFromCell([tr], 15, 0);
    require("display").drawCharsFromCell([bl], 0, 3);
    require("display").drawCharsFromCell([br], 15, 3);
};

exports.openRootScreen = function(screen) {
    var closeCallback = arguments[1] || function() {};

    screen.start();

    var loop = setInterval(function() {
        try {
            if (!screen.next()) {
                clearInterval(loop);

                closeCallback();
            }
        } catch (e) {
            clearInterval(loop);

            throw e;
        }
    }, require("config").properties.runSpeed);

    return loop;
};

exports.closeRootScreen = function(loop) {
    clearInterval(loop);
};

exports.buttons = {
    tl: new exports.Button(BTN1),
    tr: new exports.Button(BTN2),
    bl: new exports.Button(BTN4),
    br: new exports.Button(BTN3)
};