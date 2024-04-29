// The module 'vscode' contains the VS Code extensibility API.
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

/**
 * Returns a list of lines `lines` in `file`.
 * @param {vscode.TextDocument} file 
 * @returns {[vscode.TextLine]}
 */
function getLines(file) {
    // Let `numberOfLines` be the number of lines in `file`.
    const numberOfLines = file.lineCount;
    // Let `lines` be an initially empty list of text lines.
    const lines = [];
    let count = 0;

    // For each line `line` in `file`.
    while (++count < numberOfLines) {
        const line = file.lineAt(count);
        // Add `line` to `lines`.
        lines.push(line);
    }

    // Return `lines`.
    return lines;
}

/**
 * Return a list of all identifiers found in `file`.
 * @param {vscode.TextDocument} file 
 * @returns {Set<string>}
 */
function getIdentifiers(file) {
    // Let `regexes` be.
    const regexes = {
        // Matches `people` and `person` in `const people =` and `let person =`.
        identifier: /(?<=(const|let)\s)\w+(?=\s\=)/,
    };
    // Let `lines` be lines of text in `file`.
    const lines = getLines(file);
    // Let `identifiers` be an initially empty list of identifiers.
    const identifiers = new Set();

    // For each line `line` in `lines`.
    for (const line of lines) {
        // Let `text` be the text content of `line`.
        const text = line.text;
        // Let `identifier` be the name of an identifier in `text`, if there is one.
        const identifier = text.match(regexes.identifier)?.[0];

        // If there is an identifier.
        if (identifier) {
            // Add `identifier` to `identifiers`.
            identifiers.add(identifier);
        }
    }

    return identifiers;
}

/**
 * Detects if `position` is part of a JavaScript template literal.
 * @param {vscode.Position} position - The current position of the cursor.
 */
function isTemplateLiteral(position) {
    // Let `line` be the line on which `position` is located.
    const line = position.line;
    // Let `characters` be a list of characters found in `line`.
    const characters = vscode.window.activeTextEditor.document.lineAt(line).text.split('');
    // Let `character` be the current character located at `position`.
    // Let `before` be a list of characters in `characters` that appear before `character`.
    const before = characters.slice(0, position.character - 1);
    // Let `after` be a list of characters in `characters` that appear after `character`.
    const after = characters.slice(position.character);

    // If there is a backtick character (`) in both `before` and `after`.
        // Then `position` is within a JavaScript template literal.
    return before.includes('`') && after.includes('`');
}

module.exports = {
    getIdentifiers,
    getLines,
    isTemplateLiteral,
};