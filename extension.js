// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const { env } = require('process');
const vscode = require('vscode');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    const disposable1 = vscode.commands.registerCommand('extension.generateUnitTest', function () {
        // The code you place here will be executed every time your command is executed

        // Let `editor` be the currently active editor.
        const editor = vscode.window.activeTextEditor;
        // Let `selection` be a text selection in `editor`.
        const {selection} = editor;
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

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    const disposable2 = vscode.commands.registerCommand('extension.arrayMethods', function () {
        // NOTE: The code you place here will be executed every time your command is executed

        // Let `editor` be 
        const editor = vscode.window.activeTextEditor;
        // Let `selection` be
        const {selection} = editor;
        // Let `text` be
        const text = editor.document.getText(selection);

        // Let `regexes` be
        const regexes = {
            // Matches `item` in `items.forEach`.
            name: /\w+(?=s\.)/,
            // Matches `forEach` in `items.forEach`.
            method: /(?<=\.)\w+/,
        };

        // Let `name` be
        const name = text.match(regexes.name)[0];
        // Let `method` be
        const method = text.match(regexes.method)[0];

        // Let `methods` be
        const methods = ['every', 'filter', 'findIndex', 'forEach', 'map', 'some', 'sort', 'reduce', 'reduceRight'];

        if (methods.includes(method)) {
            // Let `string` be
            const string = `(${name} => ${name});`;
            vscode.env.clipboard.writeText(string);
        }
    });

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    const disposable3 = vscode.commands.registerCommand('extension.insertCommentAboveDeclaration', function () {
        // NOTE: The code you place here will be executed every time your command is executed

        // Let `editor` be 
        const editor = vscode.window.activeTextEditor;
        // Let `selection` be
        const {selection} = editor;
        // Let `text` be
        const text = editor.document.getText(selection);

        // Let `regexes` be
        const regexes = {
            // Matches `items` in `const items = [];`.
            identifier: /\w+(?=\s=)/,
        };

        // Let `name` be
        const identifier = text.match(regexes.identifier)[0];
        
        // Let `string` be
        const string = `// Let \`${identifier}\` be`;
        vscode.env.clipboard.writeText(string);
    });

    context.subscriptions.push(disposable1, disposable2, disposable3);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
}

exports.deactivate = deactivate;