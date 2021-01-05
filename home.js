/*
    NanoPlay

    Copyright (C) Subnodal Technologies. All Rights Reserved.

    https://nanoplay.subnodal.com
    Licenced by the Subnodal Open-Source Licence, which can be found at LICENCE.md.
*/

var uiScreen = require("ui").Screen;

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
        var iconPlacement = [
            [17, 10],
            [65, 10],
            [17, 31],
            [65, 31]
        ];

        if (event.buttons.tl == require("ui").buttonStatus.PRESSED) {
            this.close();
        }

        if (event.buttons.tr == require("ui").buttonStatus.PRESSED) {
            if (this.items[(this.page * 4) + this.selectedPageItem].action != undefined) {
                this.closedModule = this.items[(this.page * 4) + this.selectedPageItem].module;

                this.items[(this.page * 4) + this.selectedPageItem].action();

                return;
            }
        }

        if (event.buttons.bl == require("ui").buttonStatus.PRESSED) {
            this.selectedPageItem--;
        }

        if (this.selectedPageItem < 0) {
            this.selectedPageItem = 3;
            this.page--;
        }

        if (event.buttons.br == require("ui").buttonStatus.PRESSED) {
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

                    g.fillRect(iconPlacement[i][0] + 1, iconPlacement[i][1] + 1, iconPlacement[i][0] + 44, iconPlacement[i][1] + 17);

                    g.setBgColor(1);
                    g.setColor(0);
                } else {
                    g.setBgColor(0);
                    g.setColor(1);
                }

                if (this.items[(this.page * 4) + i].icon.width <= 44 && this.items[(this.page * 4) + i].icon.height <= 17) {
                    g.drawImage(this.items[(this.page * 4) + i].icon, iconPlacement[i][0] + 1, iconPlacement[i][1] + 1);
                }

                g.setBgColor(0);
                g.setColor(1);

                g.drawLine(iconPlacement[i][0] + 2, iconPlacement[i][1], iconPlacement[i][0] + 43, iconPlacement[i][1]);
                g.drawLine(iconPlacement[i][0] + 2, iconPlacement[i][1] + 18, iconPlacement[i][0] + 43, iconPlacement[i][1] + 18);
                g.drawLine(iconPlacement[i][0], iconPlacement[i][1] + 2, iconPlacement[i][0], iconPlacement[i][1] + 16);
                g.drawLine(iconPlacement[i][0] + 45, iconPlacement[i][1] + 2, iconPlacement[i][0] + 45, iconPlacement[i][1] + 16);

                g.setPixel(iconPlacement[i][0] + 1, iconPlacement[i][1] + 1);
                g.setPixel(iconPlacement[i][0] + 44, iconPlacement[i][1] + 1);
                g.setPixel(iconPlacement[i][0] + 1, iconPlacement[i][1] + 17);
                g.setPixel(iconPlacement[i][0] + 44, iconPlacement[i][1] + 17);
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