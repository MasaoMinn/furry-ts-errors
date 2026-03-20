import { commands, window, type ExtensionContext, type WebviewPanel } from "vscode";
import { ViewColumn } from "vscode";
import { execute } from "./execute";

const COMMAND_ID = "prettyTsErrors.openConfiguration";

const VIEW_TYPE = "prettyTsErrors.configurationWebview";

let panel: WebviewPanel | undefined;

export function registerOpenConfiguration(context: ExtensionContext) {
  context.subscriptions.push(
    commands.registerCommand(COMMAND_ID, () =>
      execute(COMMAND_ID, async () => {
        if (panel) {
          panel.reveal(ViewColumn.Beside);
          return;
        }

        panel = window.createWebviewPanel(
          VIEW_TYPE,
          "Furry TS Errors - Configuration",
          ViewColumn.Beside,
          {
            enableScripts: false,
            enableCommandUris: false,
            retainContextWhenHidden: false,
            localResourceRoots: [context.extensionUri],
          }
        );

        panel.onDidDispose(() => {
          panel = undefined;
        });

        panel.webview.html = getEmptyHtml(panel.webview);
      })
    )
  );
}

function getEmptyHtml(webview: WebviewPanel["webview"]) {
  const cspSource = webview.cspSource;
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta
      http-equiv="Content-Security-Policy"
      content="default-src 'none'; img-src ${cspSource} data:; style-src ${cspSource} 'unsafe-inline';"
    />
    <title>Furry TS Errors - Configuration</title>
  </head>
  <body></body>
</html>`;
}

