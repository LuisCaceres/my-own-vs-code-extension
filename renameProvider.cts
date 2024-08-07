// This piece of code keeps identifiers in comments in sync with identifiers in the rest of the file. 
// The reason why this piece of code is necessary is because the 'rename symbol' command doesn't 
// automatically rename identifiers in single-line JavaScript comments.
//
// Steps:
// 1. Insert a single-line comment above each `const` or `let` declaration. For example, 'Let `countries` be a list of countries'.
// 2. If you require it, rename an identifier with the 'rename symbol' command. Any occurrences of the identifier, 
// before renaming, will be automatically replaced by this piece of code.


// The module 'vscode' contains the VS Code extensibility API.
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const { getIdentifiers, getLines, Word } = require('./utils/utils.cts');
// Supported language type
const languages = ['javascript', 'typescript', 'vue'];


const regexes = {
  // Matches `person` and in `for (const person of persons) {`.
  forOfLoop: /(?<=for\s\(const\s)(\w+)\sof\s\w+/,
};


/**
 * 
 * @param {vscode.TextDocument} file 
 * @param {vscode.Position} position 
 * @param {String} newVariableName 
 * @param {CancellationToken} cancellationToken 
 */
async function provideRenameEdits(file, position, newVariableName, cancellationToken) {
  /** @type {[vscode.Location]} */ // Let `references` be a list of locations in which `oldVariableName` appears in `file`. 
  const references = await vscode.commands.executeCommand('vscode.executeReferenceProvider', file.uri, position);
  // Let `oldVariableName` be the variable name for which the rename provider has been requested.
  const oldVariableName = file.getText(references[0].range);
  const edit = new vscode.WorkspaceEdit();

  // For each reference `reference` in `references`.
  for (const reference of references) {
    const lineNumber = reference.range.start.line;
    const previousLine = file.lineAt(lineNumber - 1);

    // If `previousLine` is a JavaScript single line comment.
    if (previousLine.text.trim().startsWith('//')) {
      const replacement = previousLine.text.replace(`${oldVariableName}`, newVariableName);
      edit.replace(file.uri, previousLine.range, replacement);
    }
  }

  await vscode.workspace.applyEdit(edit);

  // If `oldVariableName` is a word in plural then `oldVariableName` could exist as the name of a variable in singular. Therefore, the rename provider should be requested for those other variables. For example: `for (const planet of planets)` where the `planets` variable has been renamed to `services` as in `for (const planet of services)`.
  if (oldVariableName.endsWith('s')) {
    // Let `newNameInSingular` be `newVariableName` as a word in singular.
    const newNameInSingular = new Word(newVariableName).toSingular();

    // For each reference `reference` in `references`.
    for (const reference of references) {
      // Let `lineNumber` be.
      const lineNumber = reference.range.start.line;
      // Let `line` be.
      const line = file.lineAt(lineNumber);
      // Let `text` be.
      const text = line.text.trim();

      // For each regular expression `regex` in `regexes`.
      for (const regex in regexes) {
        const isMatch = regexes[regex].test(line.text.trim());

        // If `line` is entirely described by `regex`.
        if (isMatch) {
          // Let `variables` be a list of variable names in `line`.
          const variables = line.text.trim().match(regexes[regex]).slice(1);

          // For each variable `variable` in `variables`.
          variables.forEach(async (variable, index) => {
            // Let `position` be.
            const position = new vscode.Position(lineNumber, text.indexOf(variable));
            const edit = await vscode.commands.executeCommand('vscode.executeDocumentRenameProvider', file.uri, position, newNameInSingular);
            await vscode.workspace.applyEdit(edit);
          });
        }
      }
    }
  }
}

const renameProvider = vscode.languages.registerRenameProvider(languages, { provideRenameEdits });

module.exports = [renameProvider];
