const vscode = require('vscode');
let idleTimer = 0;
let isIdle = false;
const idleTimeLimit = 5 * 60 * 1000;
const idleCheckInterval = 60 * 1000;
let lastActiveTime = Date.now();
let updateIdleTimer = 0;

const resetIdleTimer = () => {
  lastActiveTime = Date.now();
  if (isIdle) {
    isIdle = false;
    vscode.window.showInformationMessage("Welcome back! Idle period ended.");
  }
  clearTimeout(idleTimer);
  clearInterval(updateIdleTimer);  
  idleTimer = setTimeout(setIdle, idleTimeLimit);
  updateIdleTimer = setInterval(updateIdleStatus, idleCheckInterval); 
}

const setIdle = () => {
  isIdle = true;
  updateIdleStatus();  
}

const updateIdleStatus = () => {
  if (isIdle) {
    const idleDuration = Math.round((Date.now() - lastActiveTime) / 60000); 
    vscode.window.showInformationMessage(`You have been idle for ${idleDuration} mins`);
  }
}

function activate(context) {
  const disposable = vscode.commands.registerCommand('save-my-time.helloWorld', function () {
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
  clearTimeout(idleTimer);
  clearInterval(updateIdleTimer); 
}

module.exports = {
  activate,
  deactivate
}
