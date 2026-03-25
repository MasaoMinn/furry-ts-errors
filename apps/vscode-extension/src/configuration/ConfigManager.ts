import * as vscode from "vscode";

const CONFIG_NAMESPACE = "furry-ts-errors";

export interface ImagesConfig {
  confused: string;
  hook: string;
  dom: string;
  notFoundWink: string;
  onVue: string;
  reactFurryMoji: string;
  type: string;
}

const DEFAULT_IMAGES: ImagesConfig = {
  confused: "images/confused.png",
  hook: "images/hook.png",
  dom: "images/dom.png",
  notFoundWink: "images/not_found_wink.png",
  onVue: "images/onVue.png",
  reactFurryMoji: "images/react-furry-moji.png",
  type: "images/type.png",
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
      onVue: this.pickImagePath(images, ["onVue", "vue"], DEFAULT_IMAGES.onVue),
      reactFurryMoji: this.pickImagePath(
        images,
        ["reactFurryMoji", "noerror", "noError"],
        DEFAULT_IMAGES.reactFurryMoji
      ),
      type: this.pickImagePath(images, ["type"], DEFAULT_IMAGES.type),
    };
  }

  static onImagesChange(callback: (images: ImagesConfig) => void) {
    return vscode.workspace.onDidChangeConfiguration((event) => {
      if (event.affectsConfiguration(`${CONFIG_NAMESPACE}.images`)) {
        callback(this.images);
      }
    });
  }
}
