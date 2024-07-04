// The module 'vscode' contains the VS Code extensibility API.
// Import the module and reference it with the alias vscode in your code below
const { log } = require('console');
const { toSingular } = require('./utils/utils');
const vscode = require('vscode');

// Supported language type
const languages = ['javascript', 'typescript', 'vue'];




// Let `dataSets` be a list of data sets each of which containing information about code refactorings.
const dataSets = [
    {
        // Matches `elements` in `const elements =`.
        regex: /(?<=const\s)\w+s(?=\s=)/g,
        snippet:
            '\n\n' +
            '// For each ^variable2^ `^variable2^` in `^variable1^`.\n' +
            'for (const ^variable2^ of ^variable1^) {\n' +
            '\t^variable2^;\n' +
            '}\n',
        title: 'Insert for of loop',
        transformer: function (snippet, variable) {
            const singular = toSingular(variable);
            return snippet.replaceAll('^variable1^', variable).replaceAll('^variable2^', singular);
        }
    },
    {
        // Matches `elements` in `const elements = []`.
        regex: /(?<=const\s)\w+s(?=\s=\s\[])/g,
        snippet:
            '\n\n' +
            'const ^variable2^ = ``;\n' +
            '^variable1^.push(^variable2^);\n',
        title: 'Add elements to array (push)',
        transformer: function (snippet, variable) {
            const singular = toSingular(variable);
            return snippet.replaceAll('^variable1^', variable).replaceAll('^variable2^', singular);
        }
    },
    {
        // Matches `elements` in `const elements = []`.
        regex: /(?<=const\s)\w+(?=\s=)/g,
        snippet:
            '\n\n' +
            'if (^variable1^) {\n\n' +
            '}',
        title: 'Insert if statement',
        transformer: function (snippet, variable) {
            return snippet.replaceAll('^variable1^', variable);
        }
    },
    {
        // Matches `elements` in `const elements =`.
        regex: /(?<=const\s)\w+s(?=\s=)/g,
        snippet:
            '\n\n' +
            '{\n' +
            '\tfunction toNumber(^variable2^) {\n' +
                '\t\treturn ^variable2^;\n' +
            '\t}\n\n' +

            '\tconst map = new Map();\n\n' +    

            '\t^variable1^.forEach(^variable2^ => {\n' +
                '\t\tconst number = toNumber(^variable2^);\n' +
                '\t\tmap.set(^variable2^, number);\n' +
            '\t});\n\n' +

            '\t// Sort `^variable1^` accordingly.\n' +
            '\t^variable1^.sort((^variable2^A, ^variable2^B) => map.get(^variable2^A).number -  map.get(^variable2^B).number);\n' +
            '}\n',
        title: 'Sort',
        transformer: function (snippet, variable) {
            const singular = toSingular(variable);
            return snippet.replaceAll('^variable1^', variable).replaceAll('^variable2^', singular);
        }
    } 
];


/**
 * 
 * @param {vscode.TextDocument} document 
 * @param {vscode.Range} range 
 * @returns 
 */
function provideCodeActions(document, range) {
    // Let `line` be the line of code on which the cursor is located.
    const line = document.lineAt(range.start);
    // Let `text` be the text content of `line`.
    const text = line.text;

    const codeActions = [];

    // For each dataSet `dataSet` in `dataSets`.
    for (const dataSet of dataSets) {
        // Let `regex` be the regular expression associated with `dataSet`.
        const regex = dataSet.regex;

        // If `text` matches the pattern described by `regex`.
        if (regex.test(text)) {
            // Let `words` be a list of words in `text` that `regex` matches.
            const words = text.match(regex);
            // Let `snippet` be resulf of modyfing `dataSet`'s snippet so that the snippet includes each word in `words`.
            const snippet = dataSet.transformer(dataSet.snippet, ...words);

            const codeAction = new vscode.CodeAction(dataSet.title, vscode.CodeActionKind.Refactor);
            codeAction.edit = new vscode.WorkspaceEdit();
            codeAction.edit.insert(document.uri, line.range.end, snippet);

            codeActions.push(codeAction);            
        }
    }

    return codeActions;
}

const codeActionsProvider = vscode.languages.registerCodeActionsProvider(languages, { provideCodeActions });

module.exports = codeActionsProvider;




