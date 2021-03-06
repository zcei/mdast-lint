/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer. All rights reserved.
 * @module table-pipe-alignment
 * @fileoverview
 *   Warn when table pipes are not aligned.
 * @example
 *   <!-- Valid: -->
 *   | A     | B     |
 *   | ----- | ----- |
 *   | Alpha | Bravo |
 *
 *   <!-- Invalid: -->
 *   | A | B |
 *   | -- | -- |
 *   | Alpha | Bravo |
 */

'use strict';

/*
 * Dependencies.
 */

var visit = require('../utilities/visit');
var position = require('../utilities/position');

/*
 * Methods.
 */

var start = position.start;
var end = position.end;

/**
 * Warn when table pipes are not aligned.
 *
 * @param {Node} ast - Root node.
 * @param {File} file - Virtual file.
 * @param {*} preferred - Ignored.
 * @param {Function} done - Callback.
 */
function tablePipeAlignment(ast, file, preferred, done) {
    visit(ast, 'table', function (node) {
        var contents = file.toString();
        var indices = [];
        var offset;
        var line;

        if (position.isGenerated(node)) {
            return;
        }

        /**
         * Check all pipes after each column are at
         * aligned.
         */
        function check(initial, final, index) {
            var pos = initial + contents.slice(initial, final).indexOf('|') - offset + 1;

            if (indices[index] === undefined) {
                indices[index] = pos;
            } else if (pos !== indices[index]) {
                file.warn('Misaligned table fence', {
                    'start': {
                        'line': line,
                        'column': pos
                    },
                    'end': {
                        'line': line,
                        'column': pos + 1
                    }
                });
            }
        }

        node.children.forEach(function (row) {
            var cells = row.children;

            line = start(row).line;
            offset = start(row).offset;

            check(start(row).offset, start(cells[0]).offset, 0);

            row.children.forEach(function (cell, index) {
                var next = start(cells[index + 1]).offset || end(row).offset;

                check(end(cell).offset, next, index + 1);
            });
        });
    });

    done();
}

/*
 * Expose.
 */

module.exports = tablePipeAlignment;
