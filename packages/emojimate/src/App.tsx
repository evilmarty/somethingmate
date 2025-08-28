import { useState, useRef, useLayoutEffect } from "react";
import { FixedSizeGrid } from "react-window";
import EMOJIS from "emojilib";
import { AppContainer, CopyButton, Field } from "@somethingmate/shared";
import { useTimeout } from "./utils";
import logo from "./logo.svg";
import type { FC } from "react";
import type { FixedSizeGridProps } from "react-window"

interface EmojiButtonProps {
  emoji: string;
  size: number;
}

interface ItemProps extends FixedSizeGridProps<string[]> {
  size: number;
  rowIndex: number;
  columnIndex: number;
  data: string[];
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

function getItem({ data, columnCount, columnIndex, rowIndex }: Pick<ItemProps, "data" | "columnCount" | "columnIndex" | "rowIndex">): string | null {
  const index = rowIndex * columnCount + columnIndex;
  return data[index];
}

function itemKey(props: ItemProps): string {
  const item = getItem(props);
  return item || `${props.rowIndex}-${props.columnIndex}`;
}

const EmojiButton: FC<EmojiButtonProps> = ({ emoji, size }) => (
  <CopyButton value={emoji} size={size} title={(EMOJIS[emoji] || [""])[0].replaceAll("_", " ")} buttonStyle="ghost" buttonSize="sm" buttonShape="square">{emoji}</CopyButton>
);

const ItemRenderer: FC<ItemProps> = (props) => {
  const item = getItem(props);
  return (
    <li style={props.style}>{item && <EmojiButton emoji={item} size={props.size} />}</li>
  );
}

const App = () => {
  const timeout = useTimeout(500);
  const ref = useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = useState(0);
  const [query, setQuery] = useState(getQueryFromParam() || "");
  const columnCount = Math.floor(width / SIZE) || 1;
  const columnWidth = Math.max(Math.floor(width / columnCount), SIZE);
  const [emojis, setEmojis] = useState(EMOJI_KEYS);
  const rowCount = Math.ceil(emojis.length / columnCount);
  const height = SIZE * rowCount;

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

  useLayoutEffect(() => {
    const controller = new AbortController();
    if (ref.current) {
      setWidth(ref.current.getBoundingClientRect().width);
    }
    setEmojis(filterEmojis(query));

    window.addEventListener("resize", () => {
      if (ref.current) {
        setWidth(ref.current.getBoundingClientRect().width);
      }
    }, { signal: controller.signal });

    return () => {
      controller.abort();
    }
  }, []);

  return (
    <AppContainer name={NAME} about={ABOUT} links={LINKS} logo={logo}>
      <div ref={ref} className="mb-10">
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
      {/* @ts-expect-error */}
      <FixedSizeGrid itemData={emojis} itemKey={itemKey} width={columnWidth * columnCount} height={height} columnCount={columnCount} columnWidth={columnWidth} rowCount={rowCount} rowHeight={SIZE} innerElementType="ul" className="mx-auto">
        {props =>
          // @ts-expect-error
          <ItemRenderer columnCount={columnCount} size={SIZE} {...props} />
        }
      </FixedSizeGrid>
    </AppContainer>
  );
};

export default App;
