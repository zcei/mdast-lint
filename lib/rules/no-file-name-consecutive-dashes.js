/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer. All rights reserved.
 * @module no-file-name-consecutive-dashes
 * @fileoverview
 *   Warn when file names contain consecutive dashes.
 * @example
 *   Invalid: docs/plug--ins.md
 *   Valid: docs/plug-ins.md
 */

'use strict';

/**
 * Warn when file names contain consecutive dashes.
 *
 * @param {Node} ast - Root node.
 * @param {File} file - Virtual file.
 * @param {*} preferred - Ignored.
 * @param {Function} done - Callback.
 */
function noFileNameConsecutiveDashes(ast, file, preferred, done) {
    if (file.filename && /-{2,}/.test(file.filename)) {
        file.warn('Do not use consecutive dashes in a file name');
    }

    done();
}

/*
 * Expose.
 */

module.exports = noFileNameConsecutiveDashes;
