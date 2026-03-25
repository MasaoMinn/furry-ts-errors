import * as vscode from "vscode";
import { execute } from "./execute";

const COMMAND_ID = "prettyTsErrors.selectImagePath";
const CONFIG_NAMESPACE = "furry-ts-errors";
const IMAGE_KEYS = [
  "confused",
  "hook",
  "dom",
  "notFoundWink",
  "onVue",
  "reactFurryMoji",
  "type",
] as const;

type ImageKey = (typeof IMAGE_KEYS)[number];

const IMAGE_KEY_LABELS: Record<ImageKey, string> = {
  confused: "Default / confused",
  hook: "Hook related",
  dom: "DOM related",
  notFoundWink: "Import / module not found",
  onVue: "Vue related",
  reactFurryMoji: "No error / prettified",
  type: "Type related",
};

function isImageKey(value: unknown): value is ImageKey {
  return typeof value === "string" && IMAGE_KEYS.includes(value as ImageKey);
}

async function pickImageKey(defaultKey?: ImageKey): Promise<ImageKey | undefined> {
  if (defaultKey) {
    return defaultKey;
  }
  const picked = await vscode.window.showQuickPick(
    IMAGE_KEYS.map((key) => ({
      label: IMAGE_KEY_LABELS[key],
      description: key,
      key,
    })),
    {
      placeHolder: "Select which image setting to update",
      ignoreFocusOut: true,
    }
  );
  return picked?.key;
}

export function registerSelectImagePath(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand(COMMAND_ID, async (maybeImageKey: unknown) =>
      execute(COMMAND_ID, async () => {
        const key = await pickImageKey(
          isImageKey(maybeImageKey) ? maybeImageKey : undefined
        );
        if (!key) {
          return;
        }

        const selected = await vscode.window.showOpenDialog({
          canSelectMany: false,
          canSelectFiles: true,
          canSelectFolders: false,
          filters: {
            Images: ["png", "jpg", "jpeg", "svg", "gif", "webp"],
          },
          openLabel: "Use image",
          title: `Select image for '${key}'`,
        });
        if (!selected?.length) {
          return;
        }

        const config = vscode.workspace.getConfiguration(CONFIG_NAMESPACE);
        const currentImages = config.get<Record<string, string>>("images") ?? {};
        const nextImages = { ...currentImages, [key]: selected[0].toString() };
        await config.update("images", nextImages, vscode.ConfigurationTarget.Global);

        vscode.window.showInformationMessage(
          `Updated '${CONFIG_NAMESPACE}.images.${key}'`
        );
      })
    )
  );
}
