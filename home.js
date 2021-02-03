/*
    NanoPlay OS

    Copyright (C) Subnodal Technologies. All Rights Reserved.

    https://nanoplay.subnodal.com
    Licenced by the Subnodal Open-Source Licence, which can be found at LICENCE.md.
*/

var uiScreen = require("ui").Screen;

const ICON_PLACEMENT = new Uint8Array([
    17, 10,
    65, 10,
    17, 31,
    65, 31
]);

exports.HomeScreen = class extends uiScreen {
    constructor(items) {
        super();

        this.showStatusBar = false;
        this.idleRefreshInterval = 5000;

        this.items = items;
        this.selectedPageItem = 0;
        this.page = 0;
        this.closedModule = null;
    }

    tick(event) {
        if (event.buttons.tl == 1) {
            this.close();
        }

        if (event.buttons.tr == 1) {
            if (this.items[(this.page * 4) + this.selectedPageItem].action != undefined) {
                this.closedModule = this.items[(this.page * 4) + this.selectedPageItem].module;

                this.items[(this.page * 4) + this.selectedPageItem].action();

                return;
            }
        }

        if (event.buttons.bl == 1) {
            this.selectedPageItem--;
        }

        if (this.selectedPageItem < 0) {
            this.selectedPageItem = 3;
            this.page--;
        }

        if (event.buttons.br == 1) {
            this.selectedPageItem++;
        }

        if (this.selectedPageItem > 3) {
            this.selectedPageItem = 0;
            this.page++;
        }

        if (this.page < 0) {
            this.page = Math.ceil(this.items.length / 4) - 1;
            this.selectedPageItem = (this.items.length - 1) % 4;
        }

        if ((this.page * 4) + this.selectedPageItem >= this.items.length) {
            this.page = 0;
            this.selectedPageItem = 0;
        }

        if ((this.page * 4) + this.selectedPageItem >= this.items.length) {
            this.selectedPageItem = (this.items.length - 1) % 4;
        }

        for (var i = 0; i < 4; i++) {
            if ((this.page * 4) + i < this.items.length) {
                if (this.selectedPageItem == i) {
                    var textToShow = this.items[(this.page * 4) + i].text;

                    if (textToShow.length > 12) {
                        textToShow = this.items[(this.page * 4) + i].text.substring(0, 11).split("");
                        
                        textToShow.push("ellipsis");
                    }

                    require("display").drawCharsFromCell(textToShow, 2, 3);

                    g.fillRect(ICON_PLACEMENT[i * 2] + 1, ICON_PLACEMENT[i * 2 + 1] + 1, ICON_PLACEMENT[i * 2] + 44, ICON_PLACEMENT[i * 2 + 1] + 17);

                    g.setBgColor(1);
                    g.setColor(0);
                } else {
                    g.setBgColor(0);
                    g.setColor(1);
                }

                var appIcon = this.items[(this.page * 4) + i].icon || require("images").defaultIcon;

                if (appIcon.width <= 44 && appIcon.height <= 17) {
                    g.drawImage(appIcon, ICON_PLACEMENT[i * 2] + 1, ICON_PLACEMENT[i * 2 + 1] + 1);
                }

                g.setBgColor(0);
                g.setColor(1);

                g.drawLine(ICON_PLACEMENT[i * 2] + 2, ICON_PLACEMENT[i * 2 + 1], ICON_PLACEMENT[i * 2] + 43, ICON_PLACEMENT[i * 2 + 1]);
                g.drawLine(ICON_PLACEMENT[i * 2] + 2, ICON_PLACEMENT[i * 2 + 1] + 18, ICON_PLACEMENT[i * 2] + 43, ICON_PLACEMENT[i * 2 + 1] + 18);
                g.drawLine(ICON_PLACEMENT[i * 2], ICON_PLACEMENT[i * 2 + 1] + 2, ICON_PLACEMENT[i * 2], ICON_PLACEMENT[i * 2 + 1] + 16);
                g.drawLine(ICON_PLACEMENT[i * 2] + 45, ICON_PLACEMENT[i * 2 + 1] + 2, ICON_PLACEMENT[i * 2] + 45, ICON_PLACEMENT[i * 2 + 1] + 16);

                g.setPixel(ICON_PLACEMENT[i * 2] + 1, ICON_PLACEMENT[i * 2 + 1] + 1);
                g.setPixel(ICON_PLACEMENT[i * 2] + 44, ICON_PLACEMENT[i * 2 + 1] + 1);
                g.setPixel(ICON_PLACEMENT[i * 2] + 1, ICON_PLACEMENT[i * 2 + 1] + 17);
                g.setPixel(ICON_PLACEMENT[i * 2] + 44, ICON_PLACEMENT[i * 2 + 1] + 17);
            }
        }

        require("ui").drawButtonIcons("sleep", "ok", "left", "right");

        require("ui").drawStatusBar({
            pageUp: this.page > 0,
            pageDown: this.page + 1 < Math.ceil(this.items.length / 4)
        });

        if (this.closedModule != null) {
            Modules.removeCached(this.closedModule);

            this.closedModule = null;
        }
    }
};