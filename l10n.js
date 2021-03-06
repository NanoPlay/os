/*
    NanoPlay OS

    Copyright (C) Subnodal Technologies. All Rights Reserved.

    https://nanoplay.subnodal.com
    Licenced by the Subnodal Open-Source Licence, which can be found at LICENCE.md.
*/

const MILLISECONDS_IN_YEAR = 24 * 60 * 60 * 1000;

var config = require("config");

exports.locale = {};

function getDayOfYear(date) {
    return Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / MILLISECONDS_IN_YEAR);
}

function getWeekOfYearSunday(date) {
    return Math.ceil((((date.getTime() - new Date(date.getFullYear(), 0, 1).getTime()) / MILLISECONDS_IN_YEAR) + new Date(date.getFullYear(), 0, 1).getDay() + 1) / 7) - 1;
}

function getWeekOfYearMonday(date) {
    return Math.ceil((((date.getTime() - new Date(date.getFullYear(), 0, 1).getTime()) / MILLISECONDS_IN_YEAR) + new Date(date.getFullYear(), 0, 1).getDay()) / 7) - 1;
}

exports.loadLocale = function() {
    exports.locale = require("Storage").readJSON("lc_" + config.properties.language + ".json");
};

exports.getLocaleCode = function() {
    return config.properties.language;
};

exports.formatDate = function(text, date) {
    text = text
        .replace("%a", exports.locale.formats.weekdays[date.getDay()])
        .replace("%w", date.getDay())
        .replace("%d", String(date.getDate()).padStart(2, "0"))
        .replace("%-d", date.getDate())
        .replace("%b", exports.locale.formats.months[date.getMonth()])
        .replace("%m", String(date.getMonth() + 1).padStart(2, "0"))
        .replace("%-m", date.getMonth() + 1)
        .replace("%y", String(date.getFullYear()).substr(-2))
        .replace("%Y", String(date.getFullYear()))
        .replace("%H", String(date.getHours()).padStart(2, "0"))
        .replace("%-H", date.getHours())
        .replace("%I", String(date.getHours() % 12 == 0 ? 12 : date.getHours() % 12).padStart(2, "0"))
        .replace("%-I", date.getHours() % 12 == 0 ? 12 : date.getHours() % 12)
        .replace("%p", date.getHours() > 11 ? exports.locale.formats.pm : exports.locale.formats.am)
        .replace("%M", String(date.getMinutes()).padStart(2, "0"))
        .replace("%-M", date.getMinutes())
        .replace("%S", String(date.getSeconds()).padStart(2, "0"))
        .replace("%-S", date.getSeconds())
        .replace("%f", String(date.getMilliseconds() * 1000).padStart(6, "0"))
        .replace("%z",
            (date.getTimezoneOffset() > 0 ? "+" : "-") +
            (String(Math.floor(date.getTimezoneOffset() / 60)).padStart(2, "0")) +
            (String(date.getTimezoneOffset() % 60).padStart(2, "0"))
        )
        .replace("%j", String(getDayOfYear(date)).padStart(3, "0"))
        .replace("%-j", getDayOfYear(date))
        .replace("%U", String(getWeekOfYearSunday(date)).padStart(2, "0"))
        .replace("%W", String(getWeekOfYearMonday(date)).padStart(2, "0"))
    ;

    if (arguments[2] != true) {
        text = text
            .replace("%c", exports.formatDate("%a %-d %b %Y %H:%M:%S", date, true))
            .replace("%x", exports.formatDate("%a %-d %b %Y", date, true))
            .replace("%e", exports.formatDate("%d/%m/%Y", date, true))
            .replace("%E", exports.formatDate("%H:%M:%S", date, true))
            .replace("%g", exports.formatDate("%H:%M", date, true))
        ;
    }

    return text;
};

exports.translate = function(string) {
    return exports.locale.strings[string];
};

exports.loadLocale();