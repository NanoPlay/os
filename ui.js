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
        this.statusBuffer = [];

        this.startWatching(input);
    }

    get lastStatus() {
        if (this.statusBuffer.length > 0) {
            return this.statusBuffer[this.statusBuffer.length - 1];
        } else {
            return exports.buttonStatus.UNPRESSED;
        }
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
                thisScope.statusBuffer.push(exports.buttonStatus.LONG_PRESSED);
            } else {
                thisScope.statusBuffer.push(exports.buttonStatus.PRESSED);
            }

            // Prevent buffer from becoming too full where the user has to wait for all events to finish
            if (thisScope.statusBuffer.length > 5) {
                thisScope.statusBuffer = [thisScope.statusBuffer.pop()];
            }
        }, input, {edge: "falling", repeat: true}));
    }

    poll() {
        if (this.statusBuffer.length > 0) {
            return this.statusBuffer.pop();
        } else {
            return exports.buttonStatus.UNPRESSED;
        }
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
        this._lastRefreshed = -3000;

        this.showStatusBar = true;
        this.alwaysClear = true;
        this.isOpen = true;
        this.openedScreen = null;
        this.idleRefreshInterval = 3000;
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
        if (
            this._buttonStateSerial == this._lastButtonStateSerial &&
            new Date().getTime() - this._lastRefreshed < this.idleRefreshInterval
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
        screenClass.prototype.constructor.call(this);

        this.showStatusBar = false;

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
        } else if (event.buttons.bl == require("ui").buttonStatus.LONG_PRESSED) {
            this.selectedItem -= 4;
            this.scrollPosition -= 4;
        }

        if (this.selectedItem < 0) {
            this.selectedItem = this.menuItems.length - 1;
        }

        if (event.buttons.br == require("ui").buttonStatus.PRESSED) {
            this.selectedItem++;
        } else if (event.buttons.br == require("ui").buttonStatus.LONG_PRESSED) {
            this.selectedItem += 4;
            this.scrollPosition += 4;
        }

        if (this.selectedItem >= this.menuItems.length) {
            this.selectedItem = 0;
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

        require("ui").drawStatusBar({
            pageUp: this.scrollPosition,
            pageDown: this.scrollPosition + 4 < this.menuItems.length
        });
    }
};

exports.ExpressionScreen = class extends screenClass {
    constructor(basicSymbols) {
        screenClass.prototype.constructor.call(this);

        this.message = "";
        this.value = [];
        this.valueSaved = false;

        this.symbols = [{
            symbol: ["ok"],
            type: "process"
        }];

        this.selectedSymbol = 0;

        this.loadBasicSymbols(basicSymbols);
    }

    loadBasicSymbols(basicSymbols) {
        for (var i = 0; i < basicSymbols.length; i++) {
            this.symbols.push({symbol: basicSymbols[i]});
        }
    }

    process() {}

    tick(event) {
        if (event.buttons.tl == exports.buttonStatus.PRESSED) {
            if (this.value.length > 0) {
                this.value.pop();
            } else {
                this.close();                
            }
        } else if (event.buttons.tl == exports.buttonStatus.LONG_PRESSED) {
            this.close();
        }

        if (event.buttons.tr == exports.buttonStatus.PRESSED) {
            if (this.symbols[this.selectedSymbol].type == "action") {
                this.symbols[this.selectedSymbol].action();
            } if (this.symbols[this.selectedSymbol].type == "process") {
                this.process();
            } else {
                this.value.push(this.symbols[this.selectedSymbol].symbol);
            }
        } else if (event.buttons.tr == exports.buttonStatus.LONG_PRESSED) {
            this.process();
        }

        if (event.buttons.bl == exports.buttonStatus.PRESSED) {
            this.selectedSymbol--;
        } else if (event.buttons.bl == exports.buttonStatus.LONG_PRESSED) {
            this.selectedSymbol -= 10;
        }

        if (event.buttons.br == exports.buttonStatus.PRESSED) {
            this.selectedSymbol++;
        } else if (event.buttons.br == exports.buttonStatus.LONG_PRESSED) {
            this.selectedSymbol += 10;
        }

        if (this.selectedSymbol < 0) {
            this.selectedSymbol = this.symbols.length - 1;
        }

        if (this.selectedSymbol >= this.symbols.length) {
            this.selectedSymbol = 0;
        }

        var valueText = [];

        for (var i = 0; i < this.value.length; i++) {
            if (typeof(this.value[i]) == "string") {
                valueText = valueText.concat(this.value[i].split(""));
            } else {
                valueText.push(this.value[i]);
            }
        }

        require("display").drawCharsFromCell(this.message, 2, 0);
        require("display").drawCharsFromCell(valueText.slice(-16), 0, 1);

        var middleSymbolCx = Math.floor(((14 - this.symbols[this.selectedSymbol].symbol.length) / 2) + 1);
        var leftSymbolCx = middleSymbolCx;
        var rightSymbolCx = middleSymbolCx + this.symbols[this.selectedSymbol].symbol.length;
        var currentRenderingSymbol = this.selectedSymbol;

        for (var i = 0; i < this.symbols[this.selectedSymbol].symbol.length; i++) {
            require("display").fillCells(middleSymbolCx + i, 3, 1, 1, true);
        }
        
        require("display").drawCharsFromCell(this.symbols[this.selectedSymbol].symbol, middleSymbolCx, 3, true);

        while (currentRenderingSymbol > 0) {
            currentRenderingSymbol--;
            leftSymbolCx -= this.symbols[currentRenderingSymbol].symbol.length;

            require("display").drawCharsFromCell(this.symbols[currentRenderingSymbol].symbol, leftSymbolCx, 3);
        }

        currentRenderingSymbol = this.selectedSymbol;

        while (currentRenderingSymbol < this.symbols.length - 1) {
            currentRenderingSymbol++;

            require("display").drawCharsFromCell(this.symbols[currentRenderingSymbol].symbol, rightSymbolCx, 3);

            rightSymbolCx += this.symbols[currentRenderingSymbol].symbol.length;
        }

        require("display").fillCells(0, 3, 1, 1);
        require("display").fillCells(15, 3, 1, 1);
        
        g.drawLine(0, 49, 127, 49);

        exports.drawButtonIcons(this.value.length > 0 ? "backspace" : "cancel", "ok", "left", "right");
    }
};

exports.drawStatusBar = function() {
    var options = arguments[0] || {};

    g.clearRect(0, 0, 127, 6);

    require("display").drawCharsMini(require("l10n").formatDate("%g", new Date()), 1, 1);

    g.drawImage(require("images").batteryStatus[Math.floor(E.getBattery() / 12.5)], 116, 1);

    if (options.pageUp) {
        if (options.pageDown) {
            g.drawImage(require("images").pageUp, 102, 1);
        } else {
            g.drawImage(require("images").pageUp, 109, 1);
        }
    }

    if (options.pageDown) {
        g.drawImage(require("images").pageDown, 109, 1);
    }

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
            var currentScreen = screen;
            var parentScreen = null;

            while (currentScreen.openedScreen != null) {
                parentScreen = currentScreen;
                currentScreen = currentScreen.openedScreen;
            }

            var shouldContinue = currentScreen.next();

            if (!shouldContinue) {
                if (currentScreen == screen) {
                    clearInterval(loop);
    
                    closeCallback();
                } else {
                    parentScreen.openedScreen = null;
                }
            }
        } catch (e) {
            clearInterval(loop);

            setTimeout(function() {
                reset();
            });

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