// The module 'vscode' contains the VS Code extensibility API.
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const { getLines } = require('../utils/utils');

const regexes = {
    // Matches `elements` in `const elements = []` or `countries` in `let countries = []`.
    arrayLiteral: /(?<=^(?:const|let)\s\[?)(\w+)(?=]?\s=\s\[])/,
    // Matches `elements` in `const [elements] =` or `count` in `let count =`.
    declaration: /(?<=^(?:const|let)\s\[?)(\w+)(?=]?\s=)/,
    // Matches `if ` in `if (database) {`.
    ifStatement: /^if\s/,
    // Matches `person` and `persons` in `for (const person of persons) {`.
    forOfLoop: /(?<=for\s\(const\s)(\w+)\sof\s(\w+)/,
};

const templates = {
    arrayLiteral: '// Let `^variable1^` be an initially empty list of .\n',
    declaration: '// Let `^variable1^` be.\n',
    ifStatement: '// If .\n',
    forOfLoop: '// For each ^variable1^ `^variable1^` of `^variable2^`.\n',
};

/** Inserts a JavaScript single-line comment one line above selected lines of code.
 */
function insertComments() {
    // Let `file` be the current file.
    const file = vscode.window.activeTextEditor.document;
    // Let `lines` be a list of lines in `file`.
    const lines = getLines(file);
    const edit = new vscode.WorkspaceEdit();

    // For each line `line` in `lines`.
    for (const line of lines) {

        // For each regular expression `regex` in `regexes`.
        for (const regex in regexes) {
            const isMatch = regexes[regex].test(line.text.trim());

            // If `line` is entirely described by `regex`.
            if (isMatch) {
                // Let `previousLine` be the line preceding `line`.
                const previousLine = file.lineAt(Math.max(line.lineNumber - 1, 0));
                
                // If `previousLine` isn't a JavaScript single line comment.
                if (previousLine.text.trim().startsWith('//') === false) {
                    // Let `comment` be a new template of a JavaScript single-line comment.
                    let comment = templates[regex];
                    // Let `variables` be a list of variable names in `line`.
                    const variables = line.text.trim().match(regexes[regex]).slice(1);

                    // For each variable `variable` in `variables`.
                    variables.forEach((variable, index) => {
                        // Locate a relevant placeholder in `comment` and replace it with `variable`.
                        comment = comment.replaceAll(`^variable${index + 1}^`, variable);
                    });

                    // Insert `comment` above `line`. 
                    edit.insert(file.uri, line.range.start, comment);
                }

                break;
            }
        }
    }

    vscode.workspace.applyEdit(edit);
}

const command = vscode.commands.registerCommand('extension.insertComments', insertComments);

module.exports = command;