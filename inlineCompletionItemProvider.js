// // This piece of code keeps identifiers in comments in sync with identifiers in the rest of the file. 
// // The reason why this piece of code is necessary is because the 'rename symbol' command doesn't 
// // automatically rename identifiers in single-line JavaScript comments.
// //
// // Steps:
// // 1. Insert a single-line comment above each `const` or `let` declaration. For example, 'Let `countries` be a list of countries'.
// // 2. If you require it, rename an identifier with the 'rename symbol' command. Any occurrences of the identifier, 
// // before renaming, will be automatically replaced by this piece of code.


// // The module 'vscode' contains the VS Code extensibility API.
// // Import the module and reference it with the alias vscode in your code below
// const vscode = require('vscode');
// // const { getIdentifiers, getLines, toSingular } = require('./utils/utils');
// // Supported language type
// const languages = ['javascript', 'typescript', 'vue'];


// const regexes = {
//   // Matches `person` and in `for (const person of persons) {`.
//   forOfLoop: /(?<=for\s\(const\s)(\w+)\sof\s\w+/,
// };


// /**
//  * 
//  * @param {vscode.TextDocument} file 
//  * @param {vscode.Position} position 
//  * @param {vscode.InlineCompletionContext} context 
//  * @param {CancellationToken} cancellationToken 
//  */
// async function provider(file, position, context, cancellationToken) {
//   const item = new vscode.InlineCompletionItem('Hello world');
//   return [item];
// }

// const inlineCompletionItemProvider = vscode.languages.registerRenameProvider(languages, { provider });

// module.exports = [inlineCompletionItemProvider];
