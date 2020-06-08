import * as vscode from 'vscode';

import { buildStub, buildUnwrappedStub } from './stub_builders/utils'
import { buildContainerStub } from './stub_builders/V3/container_stub'
import { buildContainerSpecStub } from './stub_builders/V3/container_spec_stub'
import { buildSerializerStub } from './stub_builders/V3/serializer_stub'
import { buildModuleStub } from './stub_builders/V3/module_stub'
import { buildFeaturePolicyStub } from './stub_builders/V3/feature_policy_stub'
import { buildDefaultStub } from './stub_builders/default_stub';

const FILENAME_CONTAINER_PATH_REGEX = /app\/models\/(containers\/.*?)\.rb/
const FILENAME_CONTAINER_SPEC_PATH_REGEX = /spec\/models\/(containers\/.*?)\.rb/
const FILENAME_SERIALIZER_PATH_REGEX = /app\/serializers\/(.*?)\.rb/
const FILENAME_MODULE_PATH_REGEX = /app\/models\/(modules\/.*?)\.rb/
const FILENAME_DEFAULT_PATH_REGEX = /app\/[a-z0-9\_]*\/(.*?)\.rb/
const FILENAME_FEATURE_POLICY_REGEX = /app\/models\/(feature_policies\/.*?)\.rb/

function titleCase(str: string) {
	return str.replace(/(^\w|_\w)/g, function(m){return (m[1] || m[0]).toUpperCase();});
}

function buildStubFromFilename(filename: string): string {
	let match: any|null = []

	if (match = filename.match(FILENAME_CONTAINER_PATH_REGEX)) {
		const modules = match[1].split('/').map(titleCase)
		return buildStub(modules, buildContainerStub)
	} else if (match = filename.match(FILENAME_CONTAINER_SPEC_PATH_REGEX)) {
		const modules = match[1].split('/').map(titleCase)
		return buildUnwrappedStub(modules, buildContainerSpecStub)
	} else if (match = filename.match(FILENAME_SERIALIZER_PATH_REGEX)) {
		const modules = match[1].split('/').map(titleCase)
		return buildStub(modules, buildSerializerStub)
	} else if (match = filename.match(FILENAME_MODULE_PATH_REGEX)) {
		const modules = match[1].split('/').map(titleCase)
		return buildStub(modules, buildModuleStub)
	} else if (match = filename.match(FILENAME_FEATURE_POLICY_REGEX)) {
		const modules = match[1].split('/').map(titleCase)
		return buildStub(modules, buildFeaturePolicyStub)
	} else if (match = filename.match(FILENAME_DEFAULT_PATH_REGEX)) {
		const modules = match[1].split('/').map(titleCase)
		return buildStub(modules, buildDefaultStub)
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