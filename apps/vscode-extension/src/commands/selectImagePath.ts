import * as vscode from "vscode";
import { execute } from "./execute";

const COMMAND_ID = "prettyTsErrors.selectImagePath";
const CONFIG_NAMESPACE = "furry-ts-errors";
const IMAGE_KEYS = [
  "confused",
  "hook",
  "dom",
  "notFoundWink",
  "reactFurryMoji",
] as const;
const ADDITIONAL_IMAGE_TOGGLE_KEYS = ["onVue", "type"] as const;

type ImageKey = (typeof IMAGE_KEYS)[number];
type AdditionalImageToggleKey = (typeof ADDITIONAL_IMAGE_TOGGLE_KEYS)[number];
type SettingsAction =
  | { kind: "set-image"; key: ImageKey }
  | { kind: "toggle-additional-image"; key: AdditionalImageToggleKey }
  | { kind: "reset-defaults" };

const IMAGE_KEY_LABELS: Record<ImageKey, string> = {
  confused: "Default / confused",
  hook: "Hook related",
  dom: "DOM related",
  notFoundWink: "Import / module not found",
  reactFurryMoji: "No error / prettified",
};

const ADDITIONAL_IMAGE_TOGGLE_LABELS: Record<AdditionalImageToggleKey, string> = {
  onVue: "Vue related additional image",
  type: "Type related additional image",
};

function isImageKey(value: unknown): value is ImageKey {
  return typeof value === "string" && IMAGE_KEYS.includes(value as ImageKey);
}

function isAdditionalImageToggleKey(
  value: unknown
): value is AdditionalImageToggleKey {
  return (
    typeof value === "string" &&
    ADDITIONAL_IMAGE_TOGGLE_KEYS.includes(value as AdditionalImageToggleKey)
  );
}

function getAdditionalImageVisibilitySettings(
  config: vscode.WorkspaceConfiguration
): Record<AdditionalImageToggleKey, boolean> {
  const visibility =
    config.get<Record<string, boolean>>("imageVisibility") ?? {};
  return {
    onVue: visibility["onVue"] ?? true,
    type: visibility["type"] ?? true,
  };
}

async function pickSettingsAction(
  config: vscode.WorkspaceConfiguration,
  defaultKey?: unknown
): Promise<SettingsAction | undefined> {
  if (isImageKey(defaultKey)) {
    return { kind: "set-image", key: defaultKey };
  }
  if (isAdditionalImageToggleKey(defaultKey)) {
    return { kind: "toggle-additional-image", key: defaultKey };
  }

  const toggles = getAdditionalImageVisibilitySettings(config);
  const picked = await vscode.window.showQuickPick(
    [
      ...IMAGE_KEYS.map((key) => ({
        label: `Set: ${IMAGE_KEY_LABELS[key]}`,
        description: key,
        action: { kind: "set-image", key } as SettingsAction,
      })),
      ...ADDITIONAL_IMAGE_TOGGLE_KEYS.map((key) => ({
        label: `${ADDITIONAL_IMAGE_TOGGLE_LABELS[key]}: ${toggles[key] ? "On" : "Off"}`,
        description: key,
        action: {
          kind: "toggle-additional-image",
          key,
        } as SettingsAction,
      })),
      {
        label: "Reset to default",
        description: "Restore all image paths and image visibility toggles",
        action: { kind: "reset-defaults" } as SettingsAction,
      },
    ],
    {
      placeHolder: "Select an image setting action",
      ignoreFocusOut: true,
    }
  );
  return picked?.action;
}

async function updateImagePath(
  config: vscode.WorkspaceConfiguration,
  key: ImageKey
) {
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
  const selectedFile = selected?.[0];
  if (!selectedFile) {
    return;
  }

  const currentImages = config.get<Record<string, string>>("images") ?? {};
  const nextImages = { ...currentImages, [key]: selectedFile.toString() };
  await config.update("images", nextImages, vscode.ConfigurationTarget.Global);

  vscode.window.showInformationMessage(
    `Updated '${CONFIG_NAMESPACE}.images.${key}'`
  );
}

async function toggleAdditionalImage(
  config: vscode.WorkspaceConfiguration,
  key: AdditionalImageToggleKey
) {
  const current = getAdditionalImageVisibilitySettings(config);
  const nextVisibility = { ...current, [key]: !current[key] };
  await config.update(
    "imageVisibility",
    nextVisibility,
    vscode.ConfigurationTarget.Global
  );

  vscode.window.showInformationMessage(
    `${ADDITIONAL_IMAGE_TOGGLE_LABELS[key]}: ${nextVisibility[key] ? "On" : "Off"}`
  );
}

async function resetImageSettings(config: vscode.WorkspaceConfiguration) {
  await config.update("images", undefined, vscode.ConfigurationTarget.Global);
  await config.update(
    "imageVisibility",
    undefined,
    vscode.ConfigurationTarget.Global
  );

  vscode.window.showInformationMessage(
    "Reset image paths and image visibility settings to default values"
  );
}

export function registerSelectImagePath(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand(COMMAND_ID, async (maybeSetting: unknown) =>
      execute(COMMAND_ID, async () => {
        const config = vscode.workspace.getConfiguration(CONFIG_NAMESPACE);
        const action = await pickSettingsAction(config, maybeSetting);
        if (!action) {
          return;
        }

        switch (action.kind) {
          case "set-image":
            await updateImagePath(config, action.key);
            break;
          case "toggle-additional-image":
            await toggleAdditionalImage(config, action.key);
            break;
          case "reset-defaults":
            await resetImageSettings(config);
            break;
        }
      })
    )
  );
}
