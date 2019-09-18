import * as vscode from 'vscode';
import { copy } from 'copy-paste';

const FILENAME_CONTAINER_PATH_REGEX = /app\/models\/(containers\/.*?)\.rb/
const URL_BASE = 'http://localhost:3000'

function notifyErr(err: any) {
  vscode.window.showErrorMessage(err)
}

function notifySuccess(res: any) {
  vscode.window.showInformationMessage(res)
}

export function register(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand('extension.copyContainerUrl', () => {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			return; // No open text editor
    }
    
    const fileName = editor.document.fileName
    const match = fileName.match(FILENAME_CONTAINER_PATH_REGEX)

    if (match && match[1]) {
      const url = `${URL_BASE}/v3/${match[1]}`

      copy(url, (err) => {
        if (err) {
          return notifyErr(err)
        }
        notifySuccess('Copied to clipboard')
      })
    } else {
      notifyErr('Could not get container URL')
    }
  });
  
  context.subscriptions.push(disposable);
}