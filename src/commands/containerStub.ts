import * as vscode from 'vscode';

const FILENAME_CONTAINER_PATH_REGEX = /app\/models\/containers\/(.*?)\.rb/

function titleCase(str: string) {
	return str.replace(/(^\w|_\w)/g, function(m){return (m[1] || m[0]).toUpperCase();});
}

function filenameToModules(filename: string) {
  const match = filename.match(FILENAME_CONTAINER_PATH_REGEX) || []
  const modules = ['containers'].concat(match[1].split('/'))

  return modules
}

function modulesToCode(modules: string[]) {
  let str: string = '';

	for (let i = 0; i < modules.length; i++) {
		let moduleName = titleCase(modules[i])
		let indentation = Array(i + 1).join('  ')

		str += "\n"
		str += indentation

		if (i === modules.length - 1) {
			str += `class ${moduleName} < ::NextGenContainerBase`
		} else {
			str += `module ${moduleName}`
		}
	}

	for (let i = modules.length; i > 0; i--) {
		let indentation = Array(i).join('  ')

		str += "\n"
		str += indentation
		str += "end"
	}

	return str
}

export function register(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand('extension.containerStub', () => {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			return; // No open text editor
		}

		const content = modulesToCode(filenameToModules(editor.document.fileName))

		editor.edit(edit => {
			edit.insert(new vscode.Position(0, 0), content);
		});
  });
  
  context.subscriptions.push(disposable);
}