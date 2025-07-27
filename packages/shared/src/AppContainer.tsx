import { useState } from "react";
import CopyContext from "./CopyContext";
import EmojiCycler from "./EmojiCycler";
import type { FC } from "react";
import type { AppContainerProps } from "./types";

const AppContainer: FC<AppContainerProps> = ({ name, logo, children }) => {
  const copiedField = useState<string | null>(null);
  return (
    <div className="max-w-2xl container mx-auto p-6 min-h-screen">
      <img src={logo} alt={name} className="w-50 mx-auto" />
      <CopyContext.Provider value={copiedField}>
        <div className="space-y-2">{children}</div>
      </CopyContext.Provider>
      <div className="mt-8 text-sm text-center font-medium text-gray-500 dark:text-gray-400">
        Made with
        <EmojiCycler
          emojis={["❤️", "🍺", "🌯", "🥃", "🍦"]}
          className="inline-block mx-1"
        />
        by
        <a href="https://marty.zalega.me" className="ml-1">
          evilmarty
        </a>
      </div>
    </div>
  );
};

export default AppContainer;
