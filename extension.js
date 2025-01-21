const vscode = require('vscode');
let idleTimer = 0;
let isIdle = false;
const idleTimeLimit = 5 * 60 * 1000; 
let lastActiveTime = Date.now();
/**
 * @param {vscode.ExtensionContext} context
 */
const resetIdleTimer = () =>{
lastActiveTime = Date.now();
if(isIdle){
	isIdle = false;
	vscode.window.showInformationMessage("Welcome back! Idle period ended.");
}
clearTimeout(idleTimer);
idleTimer = setTimeout(setIdle, idleTimeLimit);
}
const setIdle = ()=>{
	isIdle = true;
	const idleDuration = Math.round((Date.now() - lastActiveTime)/60000);
	vscode.window.showInformationMessage(`You have been idle for ${idleDuration} seconds.`);
}
function activate(context) {
	const disposable = vscode.commands.registerCommand('idle-time-detector.helloWorld', function () {
		vscode.window.showInformationMessage('Hello World from idle time detector!');
	});
	context.subscriptions.push(
        vscode.workspace.onDidChangeTextDocument(() => resetIdleTimer()),
        vscode.window.onDidChangeActiveTextEditor(() => resetIdleTimer()),
        vscode.window.onDidChangeVisibleTextEditors(() => resetIdleTimer())
    );
	context.subscriptions.push(disposable);
	resetIdleTimer();
}

function deactivate() {
	clearTimeout(idleTimer)
}

module.exports = {
	activate,
	deactivate
}
