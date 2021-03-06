/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer. All rights reserved.
 * @module no-duplicate-definitions
 * @fileoverview
 *   Warn when duplicate definitions are found.
 * @example
 *   <!-- Valid: -->
 *   [foo]: bar
 *   [baz]: qux
 *
 *   <!-- Invalid: -->
 *   [foo]: bar
 *   [foo]: qux
 */

'use strict';

/*
 * Dependencies.
 */

var position = require('../utilities/position');
var visit = require('../utilities/visit');

/**
 * Warn when definitions with equal content are found.
 *
 * Matches case-insensitive.
 *
 * @param {Node} ast - Root node.
 * @param {File} file - Virtual file.
 * @param {*} preferred - Ignored.
 * @param {Function} done - Callback.
 */
function noDuplicateDefinitions(ast, file, preferred, done) {
    var map = {};

    /**
     * Check `node`.
     *
     * @param {Node} node
     */
    function validate(node) {
        var duplicate = map[node.identifier];
        var pos;

        if (position.isGenerated(node)) {
            return;
        }

        if (duplicate && duplicate.type) {
            pos = position.start(duplicate);

            file.warn(
                'Do not use definitions with the same identifier (' +
                pos.line + ':' + pos.column + ')',
                node
            );
        }

        map[node.identifier] = node;
    }

    visit(ast, 'definition', validate);
    visit(ast, 'footnoteDefinition', validate);

    done();
}

/*
 * Expose.
 */

module.exports = noDuplicateDefinitions;
