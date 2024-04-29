// This piece of code automatically generates a for of loop for an iterable.
// Steps:
// 1. Type the name of an iterable followed by the words `for of`. For example, `elements for of`.
// 2. Select the `for of` completion shown by Intellisense.
// 3. VS Code inserts a for of loop in the editor. 


// The module 'vscode' contains the VS Code extensibility API.
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const { isTemplateLiteral, getIdentifiers } = require('./utils/utils');

// Supported language type
const languages = ['javascript', 'typescript'];

const dataSets = [
    {
        labels: ['ael'],
        snippet:
            '.addEventListener(\${2:type}\, event => {\n' +
            '\tevent$3\n' +
            '});',
        kind: vscode.CompletionItemKind.Method,
    },
    {
        labels: ['forof'],
        snippet:
            '// For each ^token^ `^token^` in `^token^s`.\n' +
            'for (const ^token^ of ^token^s) {\n' +
            '\t$1^token^$2;\n' +
            '}\n',
    },
    {
        labels: ['lookahead positive assertion'],
        snippet:
            '(?=$1)',
        kind: vscode.CompletionItemKind.Snippet
    },
    {
        labels: ['lookahead negative assertion'],
        snippet:
            '(?!$1)',
        kind: vscode.CompletionItemKind.Snippet
    },
    {
        labels: ['lookbehind positive assertion'],
        snippet:
            '(?<=$1)',
        kind: vscode.CompletionItemKind.Snippet
    },
    {
        labels: ['lookbehind negative assertion'],
        snippet:
            '(?<!$1)',
        kind: vscode.CompletionItemKind.Snippet
    },
    {
        labels: ['every', 'filter', 'find', 'findIndex', 'forEach', 'map', 'some'],
        snippet: '.^snippetName^(^token^ => ^token^$1);\n',
        sortText: "0",
    },
    {
        labels: ['flat', 'reverse', 'shift', 'unshift'],
        snippet: '.^snippetName^();\n',
    },
    {
        labels: ['push'],
        snippet: '.^snippetName^(^token^);\n',
    },
    {
        labels: ['const', 'let'],
        snippet:
            '// Let `${1:identifier}` be $3.\n' +
            '^snippetName^ ${1:identifier} = $2;\n',
        kind: 14
    },
    {
        labels: ['DOMParser'],
        snippet:
            'const template = [].join(\'\');\n' +
            'const parser = new DOMParser();\n' +
            'const children = [...parser.parseFromString(template, \'text/html\').querySelector(\'${1:selector}\')];\n' +
            'const parentElement = $0;\n' +
            'parentElement.append(...children);\n'
    },
    {
        labels: ['sort'],
        snippet:
            '.sort((^token^A$1, ^token^B)$2 => {\n' +
            '\tlet comparison = 0;\n\n' +

            '\tif (^token^A < ^token^B) {\n' +
            '\t\tcomparison = 1;\n' +
            '\t}\n' +
            '\telse if (^token^A > ^token^B) {\n' +
            '\t\tcomparison = -1;\n' +
            '\t}\n\n' +

            '\treturn comparison;\n' +
            '});\n',
    },
    {
        labels: ['qs'],
        snippet: '.querySelector(\'${2:selector}\')',
    },
    {
        labels: ['qsa'],
        snippet: '[...^token^.querySelectorAll(\'${2:selector}\')]',
    },
    {
        detail: 'Formats identifier into a string literal',
        labels: ['sl'],
        snippet: '`\\${\^token^\\}`',
        // // Intellisense shows a "snippet" icon.
        // relevantCompletionItems.kind = 14;
    },
    //
].map(obj => {
    // Let `dataSets` be an initially empty list of data sets.
    const dataSets = [];
    const labels = obj.labels;

    // For each label `label` in `labels`.
    for (const label of labels) {
        // Let `dataSet` be a new data set.
        const dataSet = {
            ...obj,
            snippet: obj.snippet.replace('^snippetName^', label),
            label,
        };

        // Add `dataSet` to `dataSets`.
        dataSets.push(dataSet);
    }

    return dataSets;
}).flat();


function foo(characters, document, cursor) {
    const regexes = {
        // Matches `const` and `persons` in `const persons`.
        identifier: /\w+/g,
    };

    const lineNumber = cursor.line;

    // Let `line` be the line on which `cursor` is currently located.
    // Let `text` be the text content of `line`.
    const text = document.lineAt(lineNumber).text;

    // Let `identifier1` be the last JavaScript identifier in `text`.
    // Let `identifier2` be the second last JavaScript identifier in `text`, if any.
    const [identifier1, identifier2] = [...text.matchAll(regexes.identifier)].slice(-2).reverse();

    const completionItems = [];

    const relevantDataSets = dataSets.filter(dataSet => dataSet.label.startsWith(characters));

    for (const relevantDataSet of relevantDataSets) {
        let snippet = relevantDataSet.snippet;

        // If there is a token `token`.
        if (identifier2) {
            if (identifier2[0].endsWith('s')) {
                snippet = snippet.replaceAll('^token^', identifier2[0].slice(0, -1));
            }
            else {
                // Replace 
                snippet = snippet.replaceAll('^token^', identifier2[0]);
            }
        }

        // When token?.index === 0 then this 0 is considered falsy. It should'nt happen.
        const start = new vscode.Position(lineNumber, Math.max((identifier2?.index || identifier1.index) - 1, 0));
        // Let `end` be.
        const end = new vscode.Position(lineNumber, identifier1.index + identifier1[0].length);
        // Let `range` be a range of text that spans the current line of text.
        const range = new vscode.Range(start, end);

        const completionItem = {
            ...relevantDataSet,
            // additionalTextEdits: [vscode.TextEdit.delete(range)],
            insertText: new vscode.SnippetString(snippet),
        };

        completionItems.push(completionItem);
    }

    return completionItems;
}


/**
 * @param {string} characters 
 * @param {vscode.TextDocument} file 
 * @returns {[vscode.CompletionItem]}
 */
function getCompletionItemsForTemplateLiteral(characters, file) {
    // Let `identifiers` be a list of `const` and `let` identifiers found in `file`.
    const identifiers = getIdentifiers(file);
    // Let `relevantIdentifiers` be a list of identifiers from `identifiers` whose initial characters are the same as `characters`.
    const relevantIdentifiers = [...identifiers].filter(identifier => identifier.startsWith(characters));
    // Let `completionItems` be an initially empty list of completion items.
    const completionItems = [];

    // For each relevant identifier `relevantIdentifier` from `relevantIdentifiers`.
    for (const relevantIdentifier of relevantIdentifiers) {
        // Let `completionItem` be a new completion item.
        const completionItem = {
            insertText: `$\{${relevantIdentifier}}`, // For example: `${person}`
            kind: vscode.CompletionItemKind.Variable,
            label: relevantIdentifier,
        }

        // Add `completionItem` to `completionItems`.
        completionItems.push(completionItem);
    }

    // Return `completionItems`.
    return completionItems;
}


/**
 * 
 * @returns 
 */
function createCompletionProvider() {
    const completionProvider = vscode.languages.registerCompletionItemProvider(languages, {
        provideCompletionItems(document, cursor, cancellationToken, context) {
            // Let `line` be the line on which `cursor` is located.
            // Let `text` be the text content of `line` that includes up to the character immediately preceding `cursor`.
            const text = document.lineAt(cursor.line).text.slice(0, cursor.character);
            const regexes = {
                identifier: /\w+$/g,
            };
            // Let `characters` be the last sequence of non-white-space characters found in `text`.
            const [characters] = text.match(regexes.identifier);
            // Let `completionItems` be an initially empty list of completion items.
            const completionItems = [];

            switch (true) {
                // If `cursor` is within a template literal.
                case isTemplateLiteral(cursor):
                    // Then get completion items for template literals.
                    completionItems.push(...getCompletionItemsForTemplateLiteral(characters, document, cursor));
                    break;
                default:
                    completionItems.push(...foo(characters, document, cursor));
                    break;
            }

            return completionItems;
        }
    });

    return completionProvider;
}

module.exports = createCompletionProvider;