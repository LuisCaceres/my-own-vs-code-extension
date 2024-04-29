// This piece of code keeps identifiers in comments in sync with identifiers in the rest of the file. 
// The reason why this piece of code is necessary is because the 'rename symbol' command doesn't 
// automatically rename identifiers in single-line JavaScript comments.
//
// Steps:
// 1. Insert a single-line comment above each `const` or `let` declaration. For example, 'Let `countries` be a list of countries'.
// 2. If you require it, rename an identifier with the 'rename symbol' command. Any occurrences of the identifier, 
// before renaming, will be automatically replaced by this piece of code.


// The module 'vscode' contains the VS Code extensibility API.
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const { getLines } = require('./utils/utils');
// Supported language type
const languages = ['javascript', 'typescript'];

/**
 * 
 * @param {vscode.TextDocument} document 
 * @param {vscode.Position} position 
 * @param {String} newName 
 * @param {CancellationToken} cancellationToken 
 */
function provideRenameEdits(document, position, newName, cancellationToken) {
    const range = document.getWordRangeAtPosition(position);
    const oldName = document.getText(range);

    vscode.commands.executeCommand('extension.renameIdentifierInComments', oldName, newName);
}

const renameProvider = vscode.languages.registerRenameProvider(languages, { provideRenameEdits });

/**
 * 
 * @param {string} oldIdentifier - The new name of an identifier.
 * @param {string} newIdentifier - The old name of the identifier that `newIdentifier` is going to replace.
 */
function replaceIdentifier(oldIdentifier, newIdentifier) {
    // Let `file` be the current file.
    const file = vscode.window.activeTextEditor.document;
    // Let `lines` be a list of a lines in `file`.
    const lines = getLines(file);
    // Let `comments` be a list of lines in `lines` that are single-line JavaScript comments.
    const comments = lines.filter(line => line.text.trim().startsWith('//'));

    const edit = new vscode.WorkspaceEdit();

    // For each comment `comment` in `comments`.
    for (const comment of comments) {
        // Skip `comment` if `comment` doesn't contain `oldIdentifier`.
        if (comment.text.includes(oldIdentifier) === false) {
            continue;
        }

        // Replace `oldIdentifier` with `newIdentifier` in `comment`.
        const replacement = comment.text.replaceAll(`\`${oldIdentifier}\``, `\`${newIdentifier}\``);
        edit.replace(file.uri, comment.range, replacement);
    }

    vscode.workspace.applyEdit(edit);
}

const command = vscode.commands.registerCommand('extension.renameIdentifierInComments', replaceIdentifier);

module.exports = [renameProvider, command];
