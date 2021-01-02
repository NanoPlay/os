/*
    NanoPlay

    Copyright (C) Subnodal Technologies. All Rights Reserved.

    https://nanoplay.subnodal.com
    Licenced by the Subnodal Open-Source Licence, which can be found at LICENCE.md.
*/

const OPERATION_PRECEDENCE = [["divide"], ["multiply"], "+", "-"];
const NON_OPERATOR_SYMBOLS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

function getLast(array) {
    return array[array.length - 1];
}

function areEquivalent(a, b) {
    if (a.length != b.length) {
        return false;
    }

    for (var i = 0; i < a.length; i++) {
        if (a[i] != b[i]) {
            return false;
        }
    }

    return true;
}

function evaluateOperatorFragment(operatorFragment) {
    console.log(operatorFragment);

    return ["3"];
}

function evaluateFragment(fragment) {
    debugger;

    for (var i = OPERATION_PRECEDENCE.length - 1; i >= 0; i--) {
        var newFragment = [];
        var newOperatorFragment = [[]];

        while (fragment.length > 0) {
            newFragment.push(fragment.shift());

            if (NON_OPERATOR_SYMBOLS.includes(getLast(newFragment))) {
                newOperatorFragment[newOperatorFragment.length - 1].push(getLast(newFragment));
            } else if (areEquivalent(getLast(newFragment), OPERATION_PRECEDENCE[i])) {
                newOperatorFragment.push([]);
            } else {
                var nextSymbol = newFragment.pop();

                while (
                    newFragment.length > 1 &&
                    !NON_OPERATOR_SYMBOLS.includes(getLast(newFragment)) &&
                    !areEquivalent(getLast(newFragment), OPERATION_PRECEDENCE[i])
                ) {
                    newFragment.pop();
                }

                var evaluatedFragment = evaluateOperatorFragment(newOperatorFragment);

                for (var j = 0; j < evaluatedFragment.length; j++) {
                    newFragment.push(evaluatedFragment[j]);
                }

                newFragment.push(nextSymbol);
                
                newOperatorFragment = [[]];
            }
        }

        fragment = newFragment;
    }

    console.log(fragment);
    return ["2"];
}

exports.evaluateExpression = function(expression) {
    var bracketsAreLeft = true;

    while (bracketsAreLeft) {
        var decomposedExpression = [];

        bracketsAreLeft = false;

        while (expression.length > 0) {
            decomposedExpression.push(expression.shift());

            if (getLast(decomposedExpression) == ")") {
                var fragment = [];

                bracketsAreLeft = true;

                decomposedExpression.pop();

                while (decomposedExpression.length > 0 && getLast(decomposedExpression) != "(") {
                    fragment.unshift(decomposedExpression.pop());
                }

                if (decomposedExpression.length > 0) {
                    decomposedExpression.pop();
                }

                fragment = evaluateFragment(fragment);

                for (var i = 0; i < fragment.length; i++) {
                    decomposedExpression.push(fragment[i]);
                }
            }
        }

        expression = decomposedExpression;
    }

    return evaluateFragment(expression);
};