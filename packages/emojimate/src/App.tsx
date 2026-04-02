import { useState } from "react";
import { Grid } from "react-window";
import EMOJIS from "emojilib";
import { AppContainer, CopyButton, Field } from "@somethingmate/shared";
import { useTimeout } from "./utils";
import logo from "./logo.svg";
import type { FC } from "react";
import type { CellComponentProps } from "react-window";

interface EmojiButtonProps {
  emoji: string;
  size: number;
}

interface EmojiCellProps {
  emojis: string[];
  columnCount: number;
  size: number;
}

const NAME = "Emoji Mate";
const ABOUT =
  "Emoji Mate is a simple emoji finder.";
const LINKS = {
  "Date Mate": "https://marty.zalega.me/datemate",
  "CIDR Mate": "https://marty.zalega.me/cidrmate",
  "URL Mate": "https://marty.zalega.me/urlmate",
};
const EMOJI_KEYS = Object.keys(EMOJIS);
const SIZE = 32;

function filterEmojis(rawQuery: string): string[] {
  const query = rawQuery.trim().toLowerCase();
  if (!query) {
    return EMOJI_KEYS;
  }
  return EMOJI_KEYS.filter(key => EMOJIS[key].some(tag => tag.includes(query)));
}

function getQueryFromParam(): string | null {
  const urlParams = new URLSearchParams(window.location.search);
  const urlParam = urlParams.get("q");
  if (urlParam) {
    try {
      return urlParam;
    } catch (e) {
      // ignore invalid URLs
    }
  }
  return null;
}

function setQueryInUrlParam(query: string): void {
  const newUrl = new URL(window.location.href);
  newUrl.searchParams.set("q", query);
  window.history.pushState({ query }, "", newUrl.toString());
}

const EmojiButton: FC<EmojiButtonProps> = ({ emoji, size }) => (
  <CopyButton value={emoji} size={size} title={(EMOJIS[emoji] || [""])[0].replaceAll("_", " ")} buttonStyle="ghost" buttonSize="sm" buttonShape="square">{emoji}</CopyButton>
);

const ItemRenderer = ({ columnIndex, rowIndex, style, ariaAttributes, emojis, columnCount, size }: CellComponentProps<EmojiCellProps>) => {
  const index = rowIndex * columnCount + columnIndex;
  const item = emojis[index];
  return (
    <div {...ariaAttributes} style={style}>{item && <EmojiButton emoji={item} size={size} />}</div>
  );
}

const App = () => {
  const timeout = useTimeout(500);
  const [width, setWidth] = useState(0);
  const [query, setQuery] = useState(getQueryFromParam() || "");
  const columnCount = Math.floor(width / SIZE) || 1;
  const columnWidth = Math.max(Math.floor(width / columnCount), SIZE);
  const [emojis, setEmojis] = useState(() => filterEmojis(getQueryFromParam() || ""));
  const rowCount = Math.ceil(emojis.length / columnCount);

  const updateQuery = (query: string): void => {
    setQuery(query);
    timeout(() => {
      const emojis = filterEmojis(query);
      setEmojis(emojis)
      if (emojis) {
        setQueryInUrlParam(query);
      }
    })
  };

  return (
    <AppContainer name={NAME} about={ABOUT} links={LINKS} logo={logo}>
      <div className="mb-10">
        <Field
          type="search"
          fieldName="query"
          placeholder="Query..."
          align="center"
          copyButton={false}
          value={query}
          onChange={e => updateQuery(e.target.value)}
        />
      </div>
      <Grid
        cellComponent={ItemRenderer}
        cellProps={{ emojis, columnCount, size: SIZE }}
        columnCount={columnCount}
        columnWidth={columnWidth}
        rowCount={rowCount}
        rowHeight={SIZE}
        className="mx-auto"
        onResize={({ width }) => setWidth(width)}
      />
    </AppContainer>
  );
};

export default App;
