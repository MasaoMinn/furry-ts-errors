import * as vscode from "vscode";

const CONFIG_NAMESPACE = "furry-ts-errors";

export interface ImagesConfig {
  confused: string;
  hook: string;
  dom: string;
  notFoundWink: string;
  reactFurryMoji: string;
}

export interface AdditionalImageVisibilityConfig {
  onVue: boolean;
  type: boolean;
}

const DEFAULT_IMAGES: ImagesConfig = {
  confused: "images/confused.png",
  hook: "images/hook.png",
  dom: "images/dom.png",
  notFoundWink: "images/not_found_wink.png",
  reactFurryMoji: "images/react-furry-moji.png",
};

const DEFAULT_ADDITIONAL_IMAGE_VISIBILITY: AdditionalImageVisibilityConfig = {
  onVue: true,
  type: true,
};

export class ConfigManager {
  private static get config() {
    return vscode.workspace.getConfiguration(CONFIG_NAMESPACE);
  }

  private static pickImagePath(
    images: Record<string, unknown>,
    aliases: string[],
    fallback: string
  ): string {
    for (const key of aliases) {
      const value = images[key];
      if (typeof value === "string" && value.trim() !== "") {
        return value.trim();
      }
    }
    return fallback;
  }

  private static pickBooleanSetting(
    settings: Record<string, unknown>,
    aliases: string[],
    fallback: boolean
  ): boolean {
    for (const key of aliases) {
      const value = settings[key];
      if (typeof value === "boolean") {
        return value;
      }
    }
    return fallback;
  }

  static get images(): ImagesConfig {
    const images = this.config.get<Record<string, unknown>>("images") || {};
    return {
      confused: this.pickImagePath(
        images,
        ["confused"],
        DEFAULT_IMAGES.confused
      ),
      hook: this.pickImagePath(images, ["hook"], DEFAULT_IMAGES.hook),
      dom: this.pickImagePath(images, ["dom"], DEFAULT_IMAGES.dom),
      notFoundWink: this.pickImagePath(
        images,
        ["notFoundWink", "not_found", "notFound"],
        DEFAULT_IMAGES.notFoundWink
      ),
      reactFurryMoji: this.pickImagePath(
        images,
        ["reactFurryMoji", "noerror", "noError"],
        DEFAULT_IMAGES.reactFurryMoji
      ),
    };
  }

  static get additionalImageVisibility(): AdditionalImageVisibilityConfig {
    const visibility =
      this.config.get<Record<string, unknown>>("imageVisibility") || {};
    return {
      onVue: this.pickBooleanSetting(
        visibility,
        ["onVue", "vue"],
        DEFAULT_ADDITIONAL_IMAGE_VISIBILITY.onVue
      ),
      type: this.pickBooleanSetting(
        visibility,
        ["type"],
        DEFAULT_ADDITIONAL_IMAGE_VISIBILITY.type
      ),
    };
  }

  static onImagesChange(callback: (images: ImagesConfig) => void) {
    return vscode.workspace.onDidChangeConfiguration((event) => {
      if (
        event.affectsConfiguration(`${CONFIG_NAMESPACE}.images`) ||
        event.affectsConfiguration(`${CONFIG_NAMESPACE}.imageVisibility`)
      ) {
        callback(this.images);
      }
    });
  }
}
