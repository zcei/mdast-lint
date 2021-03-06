/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer. All rights reserved.
 * @module no-duplicate-headings
 * @fileoverview
 *   Warn when duplicate headings are found.
 * @example
 *   <!-- Valid: -->
 *   # Foo
 *
 *   ## Bar
 *
 *   <!-- Invalid: -->
 *   # Foo
 *
 *   ## Foo
 *
 *   ## [Foo](http://foo.com/bar)
 */

'use strict';

/*
 * Dependencies.
 */

var position = require('../utilities/position');
var visit = require('../utilities/visit');
var toString = require('../utilities/to-string');

/**
 * Warn when headings with equal content are found.
 *
 * Matches case-insensitive.
 *
 * @param {Node} ast - Root node.
 * @param {File} file - Virtual file.
 * @param {*} preferred - Ignored.
 * @param {Function} done - Callback.
 */
function noDuplicateHeadings(ast, file, preferred, done) {
    var map = {};

    visit(ast, 'heading', function (node) {
        var value = toString(node).toUpperCase();
        var duplicate = map[value];
        var pos;

        if (position.isGenerated(node)) {
            return;
        }

        if (duplicate && duplicate.type === 'heading') {
            pos = position.start(duplicate);

            file.warn(
                'Do not use headings with similar content (' +
                pos.line + ':' + pos.column + ')',
                node
            );
        }

        map[value] = node;
    });

    done();
}

/*
 * Expose.
 */

module.exports = noDuplicateHeadings;
