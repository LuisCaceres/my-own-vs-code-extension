// The module 'vscode' contains the VS Code extensibility API.
// Import the module and reference it with the alias vscode in your code;
const vscode = require('vscode');

const codeActionsProvider = require('./codeActionsProvider.cts');
const completionProvider = require('./completionItemProvider.cts');
const [renameProvider, command] = require('./renameProvider.cts');
const insertComments = require('./commands/insertComments.cts');

const providers = [];

providers.push(codeActionsProvider);
providers.push(completionProvider);

providers.push(renameProvider, command);
providers.push(insertComments);

// // This method is called when your extension is activated
// // Your extension is activated the very first time the command is executed
function activate(context) {
    context.subscriptions.push(...providers);
}

exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
}

exports.deactivate = deactivate;