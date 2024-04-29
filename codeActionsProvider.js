// The module 'vscode' contains the VS Code extensibility API.
// Import the module and reference it with the alias vscode in your code below
const { log } = require('console');
const vscode = require('vscode');

// Supported language type
const languages = ['javascript', 'typescript'];

function provideCodeActions(document, range) {
    const codeAction = new vscode.CodeAction('Use forEach method', vscode.CodeActionKind.Refactor);
    codeAction.edit = new vscode.WorkspaceEdit();

    const newText = 'maps.forEach((map, index) => {';
    codeAction.edit.replace(document.uri, range, newText);

    return [
        codeAction
    ];
}

const codeActionsProvider = vscode.languages.registerCodeActionsProvider(languages, { provideCodeActions });

module.exports = codeActionsProvider;
