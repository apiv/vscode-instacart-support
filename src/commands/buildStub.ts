import * as vscode from 'vscode';

import { buildStub } from './stub_builders/utils'
import { buildContainerStub } from './stub_builders/container_stub'
import { buildSerializerStub } from './stub_builders/serializer_stub'
import { buildModuleStub } from './stub_builders/module_stub'

const FILENAME_CONTAINER_PATH_REGEX = /app\/models\/(containers\/.*?)\.rb/
const FILENAME_SERIALIZER_PATH_REGEX = /app\/serializers\/(.*?)\.rb/
const FILENAME_MODULE_PATH_REGEX = /app\/models\/(modules\/.*?)\.rb/

function titleCase(str: string) {
	return str.replace(/(^\w|_\w)/g, function(m){return (m[1] || m[0]).toUpperCase();});
}

function buildStubFromFilename(filename: string): string {
	let match: any|null = []

	if (match = filename.match(FILENAME_CONTAINER_PATH_REGEX)) {
		const modules = match[1].split('/').map(titleCase)
		return buildStub(modules, buildContainerStub)
	} else if (match = filename.match(FILENAME_SERIALIZER_PATH_REGEX)) {
		const modules = match[1].split('/').map(titleCase)
		return buildStub(modules, buildSerializerStub)
	} else if (match = filename.match(FILENAME_MODULE_PATH_REGEX)) {
		const modules = match[1].split('/').map(titleCase)
		return buildStub(modules, buildModuleStub)
	} else {
		return ''
	}
}

export function register(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand('extension.buildStub', () => {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			return; // No open text editor
		}

		const content = buildStubFromFilename(editor.document.fileName)

		editor.edit(edit => {
			edit.insert(editor.selection.active, content);
		});
  });
  
  context.subscriptions.push(disposable);
}