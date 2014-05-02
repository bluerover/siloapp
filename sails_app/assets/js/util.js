/*
 Javascript Utility functions
 By: Andrew Hassan

 Just a bunch of utility functions.
 */

function isUndefined(x) {
    if (typeof(x) === "undefined") { return true; }
    return false;
}

function isNull(x) {
    if (x == null) { return true; }
    return false;
}

function isNullOrUndefined(x) {
    if (isUndefined(x) || isNull(x)) {
        return true;
    }

    return false;
}

function stringIsEmpty(x) {
    if (x == '') {
        return true;
    }

    return false;
}

function fahrenheitToCelsius(temp) {
    return (temp - 32) / 1.8;
}

function celsiusToFahrenheit(temp) {
    return temp * 1.8 + 32;
}