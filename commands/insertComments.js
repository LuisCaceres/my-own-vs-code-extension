// The module 'vscode' contains the VS Code extensibility API.
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const { getLines } = require('../utils/utils');

const regexes = {
    // Matches `const` or `let` in `const elements =` or `let count = 0`.
    declaration: /^(const|let)/,
    // Matches `person` in `for (const person of persons) {`.
    forOfLoop: /(?<=for\s\(const\s)\w+(?=\sof)/,
    // Matches `elements` or `count` in `const elements =` or `let count = 0`.
    identifier: /(?<=^(const|let)\s)\w+(?=\s=)/,
};

/** Inserts a JavaScript single-line comment one line above `const` and `let` declarations.
 */
function insertComments() {
    // Let `file` be the current file.
    const file = vscode.window.activeTextEditor.document;
    // Let `lines` be a list of lines in `file`.
    const lines = getLines(file);
    // Let `declarations` be a list of lines from `lines` that are const and let declarations.
    const declarations = lines.filter(line => line.text.trim().match(regexes.declaration));

    const edit = new vscode.WorkspaceEdit();

    // For each declaration `declaration` in `declarations`.
    for (const declaration of declarations) {
        // Let `previousLine` be the line preceding `declaration`.
        const previousLine = file.lineAt(declaration.lineNumber - 1).text;

        // If `previousLine` isn't a JavaScript single line comment.
        if (previousLine.trim().startsWith('//') === false) {
            // Let `identifier` be the name of the identifier from `declaration`.
            const identifier = declaration.text.trim().match(regexes.identifier)?.[0];
            // Let `comment` be a a JavaScript single line comment for `declaration`.
            const comment = `// Let \`${identifier}\` be.\n`;
            // Insert `comment` one line above `declaration`.
            edit.insert(file.uri, declaration.range.start, comment);
        }
    }

    // Let `forOfLoops` be a list of lines from `lines` that are for of loops.
    const forOfLoops = lines.filter(line => line.text.trim().match(regexes.forOfLoop));

    // For each forOfLoop `forOfLoop` in `forOfLoops`.
    for (const forOfLoop of forOfLoops) {
        // Let `previousLine` be the line preceding `forOfLoop`.
        const previousLine = file.lineAt(forOfLoop.lineNumber - 1).text;

        // If `previousLine` isn't a JavaScript single line comment.
        if (previousLine.trim().startsWith('//') === false) {
            // Let `identifier` be the name of the identifier from `forOfLoop`.
            const identifier = forOfLoop.text.trim().match(regexes.forOfLoop)?.[0];
            // Let `comment` be a a JavaScript single line comment for `forOfLoop`.
            const comment = `// For each ${identifier} \`${identifier}\` in \`${identifier}\`s.\n`;
            // Insert `comment` one line above `forOfLoop`.
            edit.insert(file.uri, forOfLoop.range.start, comment);
        }
    }

    vscode.workspace.applyEdit(edit);
}

const command = vscode.commands.registerCommand('extension.insertComments', insertComments);

module.exports = command;