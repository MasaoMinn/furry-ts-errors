import * as vscode from "vscode";
import { ConfigManager } from "../configuration/ConfigManager";

/**
 * @see https://github.com/microsoft/vscode-extension-samples/blob/main/webview-sample
 */
export class MarkdownWebviewProvider {
  private webviewRootUri: vscode.Uri;
  private webviewHtmlTemplate: Promise<string>;

  constructor(private readonly context: vscode.ExtensionContext) {
    this.webviewRootUri = vscode.Uri.joinPath(
      this.context.extensionUri,
      "webview"
    );
    this.webviewHtmlTemplate = this.loadWebviewHtmlTemplate();
  }

  private async loadWebviewHtmlTemplate(): Promise<string> {
    const htmlTemplateUri = vscode.Uri.joinPath(
      this.webviewRootUri,
      "index.html"
    );
    const htmlTemplateBytes =
      await vscode.workspace.fs.readFile(htmlTemplateUri);
    const htmlTemplate = new TextDecoder("utf-8").decode(htmlTemplateBytes);
    return htmlTemplate;
  }

  private isAbsolutePath(pathValue: string): boolean {
    return /^(?:[A-Za-z]:[\\/]|\\\\|\/)/.test(pathValue);
  }

  private getParentUri(uri: vscode.Uri): vscode.Uri {
    const normalizedPath = uri.path.replace(/\/+$/, "");
    const lastSlash = normalizedPath.lastIndexOf("/");
    const parentPath = lastSlash > 0 ? normalizedPath.slice(0, lastSlash) : "/";
    return uri.with({ path: parentPath });
  }

  private getConfiguredImageRoots(): vscode.Uri[] {
    const roots: vscode.Uri[] = [];
    const images = ConfigManager.images;

    for (const configuredPath of Object.values(images)) {
      if (!configuredPath) {
        continue;
      }

      try {
        if (/^file:\/\//i.test(configuredPath)) {
          const uri = vscode.Uri.parse(configuredPath);
          roots.push(this.getParentUri(uri));
          continue;
        }
        if (this.isAbsolutePath(configuredPath)) {
          roots.push(this.getParentUri(vscode.Uri.file(configuredPath)));
        }
      } catch {
        // Ignore invalid configured paths and fallback to built-in images.
      }
    }

    return roots;
  }

  private getWebviewLocalResourceRoots(): vscode.Uri[] {
    const roots = new Map<string, vscode.Uri>();
    const addRoot = (uri: vscode.Uri) => roots.set(uri.toString(), uri);

    addRoot(this.webviewRootUri);
    addRoot(this.context.extensionUri);
    for (const folder of vscode.workspace.workspaceFolders ?? []) {
      addRoot(folder.uri);
    }
    for (const root of this.getConfiguredImageRoots()) {
      addRoot(root);
    }

    return [...roots.values()];
  }

  getWebviewOptions(): vscode.WebviewOptions {
    return {
      enableCommandUris: [
        "prettyTsErrors.revealSelection",
        "prettyTsErrors.copyError",
        "prettyTsErrors.pinError",
        "prettyTsErrors.unpinError",
      ],
      enableScripts: true,
      enableForms: false,
      localResourceRoots: this.getWebviewLocalResourceRoots(),
    };
  }

  createOnDidReceiveMessage() {
    return (message: { command: string; [key: string]: unknown }) => {
      if (message && message.command) {
        switch (message.command) {
          case "notify": {
            if (typeof message["text"] === "string") {
              vscode.window.showInformationMessage(message["text"]);
            }
            break;
          }
        }
      }
    };
  }

  async getWebviewContent(
    webview: vscode.Webview,
    content: string,
    classList: string[] = []
  ): Promise<string> {
    const template = await this.webviewHtmlTemplate;
    const html = this.patchCspSafeAttrs(template, webview);
    return html.replace(
      '<div id="content"></div>',
      `<div id="content" class="${classList.join(" ")}">${content}</div>`
    );
  }

  private normalizeConfiguredPath(configuredPath: string): string {
    return configuredPath.replaceAll("\\", "/").replace(/^\.\//, "").trim();
  }

  private getImagePathCandidates(configuredPath: string): vscode.Uri[] {
    const normalized = this.normalizeConfiguredPath(configuredPath);
    if (!normalized) {
      return [];
    }

    const candidates = new Map<string, vscode.Uri>();
    const addCandidate = (uri: vscode.Uri) =>
      candidates.set(uri.toString(), uri);

    try {
      if (/^file:\/\//i.test(normalized)) {
        addCandidate(vscode.Uri.parse(normalized));
      } else if (this.isAbsolutePath(normalized)) {
        addCandidate(vscode.Uri.file(normalized));
      } else {
        addCandidate(vscode.Uri.joinPath(this.webviewRootUri, normalized));
        addCandidate(vscode.Uri.joinPath(this.context.extensionUri, normalized));
        for (const folder of vscode.workspace.workspaceFolders ?? []) {
          addCandidate(vscode.Uri.joinPath(folder.uri, normalized));
        }
      }
    } catch {
      // Invalid configured value should not break UI, fallback is handled downstream.
    }

    return [...candidates.values()];
  }

  private async uriExists(uri: vscode.Uri): Promise<boolean> {
    try {
      await vscode.workspace.fs.stat(uri);
      return true;
    } catch {
      return false;
    }
  }

  private async resolveImageUri(
    webview: vscode.Webview,
    configuredPath: string,
    fallbackFileName: string
  ): Promise<string> {
    const fallbackUri = vscode.Uri.joinPath(
      this.webviewRootUri,
      "images",
      fallbackFileName
    );

    for (const candidate of this.getImagePathCandidates(configuredPath)) {
      if (await this.uriExists(candidate)) {
        return webview.asWebviewUri(candidate).toString();
      }
    }

    return webview.asWebviewUri(fallbackUri).toString();
  }

  async updateWebviewContent(
    webview: vscode.Webview,
    html: string,
    content = ""
  ): Promise<void> {
    const images = ConfigManager.images;

    const confusedImageUri = await this.resolveImageUri(
      webview,
      images.confused,
      "confused.png"
    );
    const hookImageUri = await this.resolveImageUri(
      webview,
      images.hook,
      "hook.png"
    );
    const domImageUri = await this.resolveImageUri(
      webview,
      images.dom,
      "dom.png"
    );
    const notFoundWinkImageUri = await this.resolveImageUri(
      webview,
      images.notFoundWink,
      "not_found_wink.png"
    );
    const onVueImageUri = await this.resolveImageUri(
      webview,
      images.onVue,
      "onVue.png"
    );
    const reactFurryMojiImageUri = await this.resolveImageUri(
      webview,
      images.reactFurryMoji,
      "react-furry-moji.png"
    );
    const typeImageUri = await this.resolveImageUri(
      webview,
      images.type,
      "type.png"
    );

    webview.postMessage({
      command: "update-content",
      html,
      content,
      confusedImageUri,
      hookImageUri,
      domImageUri,
      notFoundWinkImageUri,
      onVueImageUri,
      reactFurryMojiImageUri,
      typeImageUri,
    });
  }

  private patchCspSafeAttrs(html: string, webview: vscode.Webview) {
    // replace stylesheet href's to webview uri's
    html = html.replaceAll(
      /<link\s+rel="stylesheet"\s+href="(\.\/.+)"\s+data-href-as-webview-uri\s*\/?>/gm,
      (match, filePath) => {
        const path = vscode.Uri.joinPath(this.webviewRootUri, filePath);
        const uri = webview.asWebviewUri(path);
        return match.replace(filePath, uri.toString());
      }
    );

    // replace script src's to webiew uri's
    html = html.replaceAll(
      /<script\s+src="(\.\/.+)"\s+data-src-as-webview-uri\s*>/gm,
      (match, filePath) => {
        const path = vscode.Uri.joinPath(this.webviewRootUri, filePath);
        const uri = webview.asWebviewUri(path);
        return match.replace(filePath, uri.toString());
      }
    );

    // replace the local development csp header with `webview.cspSource`
    // @see https://code.visualstudio.com/api/extension-guides/webview#content-security-policy
    html = html.replace(
      /<meta\s+http-equiv="Content-Security-Policy"\s+data-csp-replace-content\s+content="(.+)"\s*\/>/m,
      (match, content) => {
        return match.replace(
          content,
          content
            .replaceAll(
              "style-src http://localhost:8080",
              // TODO: remove `unsafe-inline` if vscode ever fixes their styles and api injection
              `style-src ${webview.cspSource} 'unsafe-inline'`
            )
            .replaceAll(
              "script-src http://localhost:8080",
              // TODO: remove `unsafe-inline` if vscode ever fixes their styles and api injection
              `script-src ${webview.cspSource} 'unsafe-inline'`
            )
            .replaceAll(
              "font-src http://localhost:8080",
              `font-src ${webview.cspSource}`
            )
            .replaceAll(
              "img-src http://localhost:8080",
              `img-src ${webview.cspSource}`
            )
        );
      }
    );
    return html;
  }
}