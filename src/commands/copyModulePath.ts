import * as vscode from 'vscode';
import { copy } from 'copy-paste';

function notifyErr(err: any) {
  vscode.window.showErrorMessage(err)
}

function notifySuccess(res: any) {
  vscode.window.showInformationMessage(res)
}

const MODULE_REGEX = /(?<=^\s*module |^\s*class )([a-zA-Z0-9_]+)/gm

export function register(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand('extension.copyModulePath', () => {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			return; // No open text editor
    }

		const document = editor.document;
    const contents = document.getText();
    const match = contents.match(MODULE_REGEX) || []

    if (match && match.length > 0) {
      const full_path = match.join("::")

      copy(full_path, (err) => {
        if (err) {
          return notifyErr(err)
        }
        notifySuccess(`${full_path} copied to clipboard`)
      })
    } else {
      notifyErr('Could not get module path')
    }
  });
  
  context.subscriptions.push(disposable);
}