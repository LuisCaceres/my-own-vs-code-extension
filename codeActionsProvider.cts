/* The following piece of code provides code snippets based on the position of the caret in the file.
If a code snippet is selected then it will be inserted below the current line of code. */




// The module 'vscode' contains the VS Code extensibility API.
const vscode = require('vscode');
const { Word } = require('./utils/utils.cts');

// Supported language types.
const languages = ['javascript', 'typescript', 'vue'];

// Let `dataSets` be a list of data sets each of which containing information about code refactorings.
const dataSets = [
    {
        title: 'Insert for... of loop',
        // For example, it matches `elements` in `const elements =`.
        regex: /(?<=const\s)\w+s(?=\s=)/g,
        snippet:
        /*  Example of code snippet:
            // For each `element` in `elements`.
            for (const element of elements) {
                element;
            } 
        */
        `

        // For each ^variable2^ '^variable2^' in '^variable1^'.
        for (const ^variable2^ of ^variable1^) {
            ^variable2^;
        }
        `,
        generateCodeSnippet: function (variable) {
            const singular = new Word(variable).toSingular();
            return this.snippet.replaceAll('^variable1^', variable).replaceAll('^variable2^', singular);
        }
    },
    {
        title: 'Add elements to array (push)',
        // For example, it matches `elements` in `const elements = []`.
        regex: /(?<=const\s)\w+s(?=\s=\s\[])/g,
        snippet:
        ` 

        const ^variable2^ = ;
        ^variable1^.push(^variable2^);
        `,
        generateCodeSnippet: function (variable) {
            const singular = new Word(variable).toSingular();
            return this.snippet.replaceAll('^variable1^', variable).replaceAll('^variable2^', singular);
        }
    },
    {
        title: 'Insert if statement',
        // For example, it matches `elements` in `const elements = []`.
        regex: /(?<=const\s)\w+(?=\s=)/g,
        snippet:
        `

        if (^variable1^) {
        }
        `,
        generateCodeSnippet: function (variable) {
            return this.snippet.replaceAll('^variable1^', variable);
        }
    },
    {
        title: 'Sort',
        // For example, it matches `elements` in `const elements =`.
        regex: /(?<=const\s)\w+s(?=\s=)/g,
        snippet:
        `

        {
            function toNumber(^variable2^) {
                return ^variable2^;
            }

            const map = new Map();

            ^variable1^.forEach(^variable2^ => {
                const number = toNumber(^variable2^);
                map.set(^variable2^, number);
            });

            // Sort '^variable1^' accordingly. 
            ^variable1^.sort((^variable2^A, ^variable2^B) => map.get(^variable2^A).number -  map.get(^variable2^B).number);
        }
        `,
        generateCodeSnippet: function (variable) {
            const singular = new Word(variable).toSingular();
            return this.snippet.replaceAll('^variable1^', variable).replaceAll('^variable2^', singular);
        }
    } 
];


/**
 * Provide a list of code snippets for the given line of code.
 * @param {vscode.TextDocument} file - The current file. 
 * @param {vscode.Range} position - The current position of the cursor.
 * @returns {vscode.CodeAction[]} - A list of code snippets.
 */
function provideCodeActions(file, position) {
    // Let `line` be the line of code on which the cursor is located.
    const line = file.lineAt(position.start);
    // Let `text` be the text content of `line`.
    const text = line.text;
    // Let `codeActions` be an initially empty list of code actions.
    const codeActions = [];

    // For each dataSet `dataSet` in `dataSets`.
    for (const dataSet of dataSets) {
        // Let `regex` be the regular expression associated with `dataSet`.
        const regex = dataSet.regex;

        // If `text` matches the pattern described by `regex`.
        if (regex.test(text)) {
            // Let `words` be a list of words in `text` that `regex` matches.
            const words = text.match(regex);
            // Let `codeSnippet` be a code snippet that includes each word in `words`.
            const codeSnippet = dataSet.generateCodeSnippet(...words);
            // Let `codeAction` be a new code action.
            const codeAction = new vscode.CodeAction(dataSet.title, vscode.CodeActionKind.Refactor);
            codeAction.edit = new vscode.WorkspaceEdit();
            // If `codeAction` is selected then insert `codeSnippet` below `line`.
            codeAction.edit.insert(file.uri, line.range.end, codeSnippet);
            // Format the file to avoid inconsistent levels of indentation.
            codeAction.command = {command: 'editor.action.formatDocument', title: 'Format Document'};
            // Add `codeAction` to `codeActions`.
            codeActions.push(codeAction);
        }
    }

    // Return `codeActions`.
    return codeActions;
}

const codeActionsProvider = vscode.languages.registerCodeActionsProvider(languages, { provideCodeActions });

module.exports = codeActionsProvider;