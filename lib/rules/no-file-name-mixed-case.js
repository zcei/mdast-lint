/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer. All rights reserved.
 * @module no-file-name-mixed-case
 * @fileoverview
 *   Warn when a file name uses mixed case: both upper- and lower case
 *   characters.
 * @example
 *   Invalid: Readme.md
 *   Valid: README.md, readme.md
 */

'use strict';

/**
 * Warn when a file name uses mixed case: both upper- and
 * lower case characters.
 *
 * @param {Node} ast - Root node.
 * @param {File} file - Virtual file.
 * @param {*} preferred - Ignored.
 * @param {Function} done - Callback.
 */
function noFileNameMixedCase(ast, file, preferred, done) {
    var name = file.filename;

    if (name && !(name === name.toLowerCase() || name === name.toUpperCase())) {
        file.warn('Do not mix casing in file names');
    }

    done();
}

/*
 * Expose.
 */

module.exports = noFileNameMixedCase;
