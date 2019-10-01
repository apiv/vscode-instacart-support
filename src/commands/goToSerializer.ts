import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import * as mkdirp from 'mkdirp';

const FILENAME_MODULE_REGEX = /app\/models\/modules\/(.*?)\.rb/
const FILENAME_SERIALIZER_REGEX = /components\/api_v3\/app\/serializers\/api_v3\/(.*?)_serializer\.rb/

const FILE_CONTENTS_SERIALIZER_REGEX = /def serializer_class\n(.*?)\n\W+end/m

function snakeCase(str: string) {
	return str.replace(/[A-Z]/g, (m) => '_' + m.toLowerCase()).slice(1)
}

function isModule(filename: string) {
  return FILENAME_MODULE_REGEX.test(filename)
}

function isSerializer(filename: string) {
	return FILENAME_SERIALIZER_REGEX.test(filename)
}

function moduleToSerializerPath(filename: string) {
  const match = filename.match(FILENAME_MODULE_REGEX) || []

  return `components/api_v3/app/serializers/api_v3/${match[1]}_serializer.rb`
}

function serializerToModulePath(filename: string) {
  const match = filename.match(FILENAME_SERIALIZER_REGEX) || []

  return `app/models/modules/${match[1]}.rb`
}

function getRelated(file: vscode.TextDocument) {
  const filename = file.fileName

  if (isModule(filename)) {
		const contents = file.getText()

		if (FILE_CONTENTS_SERIALIZER_REGEX.test(contents)) {
			const match = contents.match(FILE_CONTENTS_SERIALIZER_REGEX) || []
			if (match[1]) {
				return `components/api_v3/app/serializers/${match[1].trim().split('::').filter(Boolean).map(snakeCase).join('/')}.rb`
			}
		}	

		return moduleToSerializerPath(filename)
  } else if (isSerializer(filename)) {
    return serializerToModulePath(filename)
  }
}

function openFile(fileName: string) {
	vscode.workspace
		.openTextDocument(fileName)
		.then(vscode.window.showTextDocument);
}

function prompt(fileName: string, cb: any) {
	let options = {
		placeHolder: `Create ${fileName}?`
	}
	vscode.window.showQuickPick(["Yes", "No"], options)
			.then(function(answer) {
				if (answer === "Yes") {
					cb();
				}
			});
}

export function register(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand('extension.goToSerializer', () => {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			return; // No open text editor
		}

		let document = editor.document;
		let related: string | undefined = getRelated(document);

		if (!related) {
			return
		}

		let relative: string = vscode.workspace.asRelativePath(related);
		let absolutePath: string = path.join(vscode.workspace.rootPath || '', related);
		let absoluteDirname: string = path.dirname(absolutePath)
		let fileExists: boolean = fs.existsSync(absolutePath);

		if (fileExists) {
			openFile(absolutePath);
		} else {
			prompt(relative, function() {
				if (!fs.existsSync(absoluteDirname)) {
					mkdirp.sync(absoluteDirname);
				}
				fs.closeSync(fs.openSync(absolutePath, 'w'));
				openFile(absolutePath);
			});
		}
  });
  
  context.subscriptions.push(disposable);
}