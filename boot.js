/*
    NanoPlay

    Copyright (C) Subnodal Technologies. All Rights Reserved.

    https://nanoplay.subnodal.com
    Licenced by the Subnodal Open-Source Licence, which can be found at LICENCE.md.
*/

require("Storage").write(".splash", "");

if (!BTN2.read()) {
    require("main").start();
} else {
    g.clear();
    g.drawString("Boot cancelled. Please repower", 0, 0);
    g.drawString("device.", 0, 8);
    g.flip();
}