// The module 'vscode' contains the VS Code extensibility API.
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

/**
 * Returns a list of lines `lines` in `file`.
 * @param {vscode.TextDocument} file
 * @param {RegExp} regex
 * @returns {[vscode.TextLine]}
 */
function getLines(file, regex) {
    // Let `numberOfLines` be the number of lines in `file`.
    const numberOfLines = file.lineCount;
    // Let `lines` be an initially empty list of text lines.
    let lines = [];
    let count = 0;

    // For each line `line` in `file`.
    while (count < numberOfLines) {
        const line = file.lineAt(count);
        // Add `line` to `lines`.
        lines.push(line);
        count++;
    }

    if (regex instanceof RegExp) {
        lines = lines.filter(line => regex.test(line.text));
    }

    // Return `lines`.
    return lines;
}

/**
 * Return a list of all identifiers found in `file`.
 * @param {vscode.TextDocument} file 
 * @returns {Set<string>}
 */
async function getIdentifiers(file) {
    const documentSymbols = await vscode.commands.executeCommand('vscode.executeDocumentSymbolProvider', file.uri);
    // Let `identifiers` be an initially empty list of identifiers.
    const identifiers = new Set();

    (function recursion(documentSymbols) {
        // For each line `line` in `lines`.
        for (const documentSymbol of documentSymbols) {

            // If there is an identifier.
            if (documentSymbol.kind === vscode.SymbolKind.Variable) {
                identifiers.add(documentSymbol.name);
            }

            if (documentSymbol.children.length) {
                recursion(documentSymbol.children)
            }
        }
    })(documentSymbols);

    return identifiers;
}

/**
 * Detects if `position` is within a JavaScript template literal.
 * @param {vscode.Position} position - The current position of the cursor.
 */
async function isCursorWithinTemplateLiteral(position) {
    // Let `file` be the current file.
    // Let `characters` be a list of characters found in `file`.
    const characters = vscode.window.activeTextEditor.document.getText();
    // Let `dataSets` be an initially empty list of data sets.
    const dataSets = [];

    // For each character `character` in `charachters`.
    for (let index = 0; index < characters.length; index++) {
        // Let `character` be the current character.
        const character = characters[index];

        // If `character` is a backtick character.
        if (character === '`') {
            // Let `previousCharacter` be the character immediately preceding `character`.
            const previousCharacter = characters[index - 1];

            // If `previousCharacter` is a backslash then ignore `character`. 
            if (previousCharacter === '\'') {
                continue;
            }

            // Let `dataSet` be a new data set with the following information about `character`.
            const dataSet = {
                // The index of `character` in `characters`.
                index,
                // Whether `character` denotes the start or the end of a template literal.
                position: dataSets.length % 2 === 0 ? 'start' : 'end',
            };

            // Add `dataSet` to `dataSets`.
            dataSets.push(dataSet);
        }
    }

    // Let `isCursorBetweenBacktickCharacters` be.
    const isCursorBetweenBacktickCharacters = dataSets.some((dataSet, index, dataSets) => {

        if (dataSet.position === 'start') {
            // Let `index1` be.
            const index1 = dataSet.index;
            // Let `index2` be.
            const index2 = vscode.window.activeTextEditor.document.offsetAt(position);
            // Let `index3` be.
            const index3 = dataSets[index + 1].index;

            if (index1 <= index2 && index2 <= index3) {
                return true;
            }
        }
    });

    return isCursorBetweenBacktickCharacters;
}

/**
 * Formats `wordInPlural` into a word in singular. 
 * @param {string} wordInPlural - A word in plural, for example: 'planets', 'maps', 'computers'.
 * @return {string} A word in singular.
 */
function toSingular(wordInPlural) {
    let wordInSingular = '';

    switch (true) {
        // For example: 'entries'.
        case wordInPlural.endsWith('ies'):
            wordInSingular = `${wordInPlural.slice(0, -3)}y`
            break;
        // For example: 'services'.
        case wordInPlural.endsWith('ces'):
            wordInSingular = `${wordInPlural.slice(0, -1)}`
            break;
        // For example: 'boxes'.            
        case wordInPlural.endsWith('ches'):
        case wordInPlural.endsWith('sses'):
        case wordInPlural.endsWith('xes'):
            wordInSingular = `${wordInPlural.slice(0, -2)}`
            break;
        default:
            // For example: 'dogs'.
            wordInSingular = `${wordInPlural.slice(0, -1)}`
            break;
    }

    return wordInSingular;
}

module.exports = {
    getIdentifiers,
    getLines,
    isCursorWithinTemplateLiteral,
    toSingular,
};