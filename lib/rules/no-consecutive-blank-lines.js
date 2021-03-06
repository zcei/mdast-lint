/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer. All rights reserved.
 * @module no-consecutive-blank-lines
 * @fileoverview
 *   Warn for too many consecutive blank lines.  Knows about the extra line
 *   needed between a list and indented code, and two lists.
 * @example
 *   <!-- Valid: -->
 *   Foo...
 *
 *   ...Bar.
 *
 *   <!-- Invalid: -->
 *   Foo...
 *
 *
 *   ...Bar.
 */

'use strict';

/*
 * Dependencies.
 */

var visit = require('../utilities/visit');
var position = require('../utilities/position');
var plural = require('../utilities/plural');

/*
 * Constants.
 */

var MAX = 2;

/**
 * Warn for too many consecutive blank lines.  Knows
 * about the extra line needed between a list and
 * indented code, and two lists.
 *
 * @param {Node} ast - Root node.
 * @param {File} file - Virtual file.
 * @param {*} preferred - Ignored.
 * @param {Function} done - Callback.
 */
function noConsecutiveBlankLines(ast, file, preferred, done) {
    /**
     * Compare the difference between `start` and `end`,
     * and warn when that difference exceens `max`.
     *
     * @param {Position} start
     * @param {Position} end
     */
    function compare(start, end, max) {
        var diff = end.line - start.line;
        var word = diff > 0 ? 'before' : 'after';

        diff = Math.abs(diff) - max;

        if (diff > 0) {
            file.warn('Remove ' + diff + ' ' + plural('line', diff) + ' ' + word + ' node', end);
        }
    }

    visit(ast, function (node) {
        var children = node.children;

        if (position.isGenerated(node)) {
            return;
        }

        if (children && children[0]) {
            /*
             * Compare parent and first child.
             */

            compare(position.start(node), position.start(children[0]), 0);

            /*
             * Compare between each child.
             */

            children.forEach(function (child, index) {
                var prev = children[index - 1];
                var max = MAX;

                if (!prev) {
                    return;
                }

                if (
                    (
                        prev.type === 'list' &&
                        child.type === 'list'
                    ) ||
                    (
                        child.type === 'code' &&
                        prev.type === 'list' &&
                        !child.lang
                    )
                ) {
                    max++;
                }

                compare(position.end(prev), position.start(child), max);
            });

            /*
             * Compare parent and last child.
             */

            compare(position.end(node), position.end(children[children.length - 1]), 1);
        }
    });

    done();
}

/*
 * Expose.
 */

module.exports = noConsecutiveBlankLines;
