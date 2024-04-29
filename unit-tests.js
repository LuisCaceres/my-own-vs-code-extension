// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const { env } = require('process');
const vscode = require('vscode');

// The command has been defined in the package.json file
// Now provide the implementation of the command with registerCommand
// The commandId parameter must match the command field in package.json
const disposable = vscode.commands.registerCommand('extension.generateUnitTest', function () {
    // The code you place here will be executed every time your command is executed

    // Let `editor` be the currently active editor.
    const editor = vscode.window.activeTextEditor;
    // Let `selection` be a text selection in `editor`.
    const { selection } = editor;
    // Let `text` be the text of `selection`.
    const text = editor.document.getText(selection);

    // Let `regexes` be a list of of regular expressions used in this file.
    const regexes = {
        // Matches `Executes a provided function once for each array element.` in 
        // `/**
        //   * Executes a provided function once for each array element.
        //   */
        //  forEach() {`.
        description: /(?<=\/\*\*\s)[\w\W]+?\./,
        // Matches `forEach()` in 
        // `/**
        //   * Executes a provided function once for each array element.
        //   */
        //  forEach() {`.
        functionName: /\w+?\(\)/,
    };

    // Let `description` be
    const description = text.match(regexes.description);
    // Let `functionName` be
    const functionName = text.match(regexes.functionName);

    // Let `string` be
    const string = `describe('${functionName}', function () {
            it('should ${description}', function () {

                assert.equal();
            });
        });`;

    vscode.env.clipboard.writeText(string);
});

module.exports = disposable;