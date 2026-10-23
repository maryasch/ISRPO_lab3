import * as vscode from 'vscode';

async function doPlugin(): Promise<void> {
	/*
    Реализует логику работы плагина, асинхронная функция.
        Параметры: нет.

        Возвращаемое значение: нет.    
    */
	const editor = vscode.window.activeTextEditor;
	if (!editor) {
    	vscode.window.showErrorMessage('No active editor.');
    	return;
	}

	const selection = editor.selection;
	if (selection.isEmpty) {
    	vscode.window.showErrorMessage('No selected text.');
    	return;
	}
	const selectedText = editor.document.getText(selection);
	console.log('Selected text: ', JSON.stringify(selectedText))

	vscode.window.showInformationMessage(`Selected: "${selectedText}"`);

	const lastLine = editor.document.lineAt(selection.end.line);
	const pos = lastLine.range.end;

	const side = parseText(selectedText);
	vscode.window.showInformationMessage(`Side: "${side}"`);

	const verticesArray = createVertices(side);
	const insertText = '\n' + verticesArray;

	await editor.edit(a => {
    	a.insert(pos, insertText);
	});
	return;
}

function parseText(text: string): number {
	/*
    Разбирает строку и находит в ней положительное число.
        Параметры:
			text (string): разбираемая строка.

        Возвращаемое значение:
			(number) - первое найденное в строке положительное число.  
    */
	if (null == text) {
		return 0;
	}
	const res = text.match(/\d+(?:\.\d+)?/);
	if (!res) {
        return 0;
    }
	let i = 0;
	while (i < res.length && parseFloat(res[i]) < 0) {
		i = i + 1;
	}
	if (i >= res.length) {
		return parseFloat(res[0]);
	}
    return parseFloat(res[i]);
}

function createVertices(side: number): string {
	/*
    Создает строку с массивом вершин (C++).
        Параметры:
			side (number): длина ребра куба.

        Возвращаемое значение:
			(string) - массив вершин.  
    */
	if (side <= 0) {
    	vscode.window.showErrorMessage('No positive number found in selected text.');
    	return '';
	}

	const verticesString = `std::vector<std::vector<double>> vertices =
	{
		{0, 0, 0},
		{0, ${side}, 0},
		{${side}, ${side}, 0},
		{${side}, 0, 0},
		{0, 0, ${side}},
		{0, ${side}, ${side}},
		{${side}, ${side}, ${side}},
		{${side}, 0, ${side}},
	};`;

	return verticesString;
}

export function activate(context: vscode.ExtensionContext) {
	/*
    Вызывает функцию реализации логики плагина.
        Параметры:
			context (vscode.ExtensionContext): используемый контекст.

        Возвращаемое значение: нет.  
    */
	console.log('Congratulations, your extension "geom-plugin" is now active!');

	const disposable = vscode.commands.registerCommand('geom-plugin.genCubeVertices', doPlugin);

	context.subscriptions.push(disposable);
}

/* Функция деактивации плагина */
export function deactivate() {}
