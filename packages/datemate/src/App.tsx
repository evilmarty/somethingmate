import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { AppContainer, Field } from "@somethingmate/shared";
import {
  getDateInTimezone,
  getCurrentTimezone,
  setDay,
  getWeekdayNames,
  getMonthNames,
  getTimezones,
  getMeridians,
  getRelativeTime,
  parseRelativeTime,
  formatDateForInput,
  formatTimeForInput,
} from "./utils";
import logo from "./logo.svg";

type DerivedValues = {
  relativeTime: string;
  date: string;
  time: string;
  timestamp: string;
  year: string;
  month: string;
  day: string;
  dayOfWeek: string;
  hour: string;
  meridian: string;
  minute: string;
  second: string;
};

const NAME = "Date Mate";
const ABOUT =
  "Date Mate is a simple tool for manipulating and formatting dates, times, and timezones.";
const LINKS = {
  "CIDR Mate": "https://marty.zalega.me/cidrmate",
};

const MERIDIANS = getMeridians();
const [AM, PM] = MERIDIANS;
const TIMEZONES = getTimezones();
const MONTHS = getMonthNames();
const DAYS_OF_WEEK = getWeekdayNames();
const NONE = "none";

const NONE_OPTIONS = {
  [NONE]: "None",
};
const DAY_OPTIONS = {
  ...NONE_OPTIONS,
  numeric: "Numeric",
  "2-digit": "2-Digit",
};
const WEEKDAY_OPTIONS = {
  ...NONE_OPTIONS,
  long: "Long",
  short: "Short",
  narrow: "Narrow",
};
const MONTH_OPTIONS = {
  ...WEEKDAY_OPTIONS,
};
const YEAR_OPTIONS = {
  ...DAY_OPTIONS,
};
const HOUR_OPTIONS = {
  ...DAY_OPTIONS,
};
const MINUTE_OPTIONS = {
  ...DAY_OPTIONS,
};
const SECOND_OPTIONS = {
  ...DAY_OPTIONS,
};
const TIMEZONE_NAME_OPTIONS = {
  ...NONE_OPTIONS,
  long: "Long",
  short: "Short",
  shortOffset: "Short Offset",
  longOffset: "Long Offset",
  shortGeneric: "Short Generic",
  longGeneric: "Long Generic",
};

function getMeridian(date: Date) {
  return date.getHours() >= 12 ? PM : AM;
}

function getDateFromUrlParam(): Date | null {
  const urlParams = new URLSearchParams(window.location.search);
  const dateParam = urlParams.get("d");
  if (dateParam) {
    const date = new Date(dateParam);
    if (!isNaN(date.getTime())) {
      return date;
    }
  }
  return null;
}

function setDateInUrlParam(date: Date) {
  const url = new URL(window.location.href);
  const dateString = date.toISOString();
  url.searchParams.set("d", dateString);
  window.history.pushState({ date: dateString }, "", url.toString());
}

function getDerivedValues(date: Date, timezone: string): DerivedValues {
  const displayDate =
    timezone === getCurrentTimezone()
      ? date
      : getDateInTimezone(date, timezone);
  return {
    relativeTime: getRelativeTime(displayDate),
    date: formatDateForInput(displayDate),
    time: formatTimeForInput(displayDate),
    timestamp: displayDate.getTime().toString(),
    year: displayDate.getFullYear().toString(),
    month: MONTHS[displayDate.getMonth()],
    day: displayDate.getDate().toString(),
    dayOfWeek: DAYS_OF_WEEK[displayDate.getDay()],
    hour: displayDate.getHours().toString(),
    meridian: getMeridian(displayDate),
    minute: displayDate.getMinutes().toString(),
    second: displayDate.getSeconds().toString(),
  };
}

const App = () => {
  const [currentDate, setCurrentDate] = useState<Date>(
    () => getDateFromUrlParam() || new Date(),
  );
  const [selectedTimezone, setSelectedTimezone] =
    useState<string>(getCurrentTimezone);
  const derivedValues = getDerivedValues(currentDate, selectedTimezone);
  const [rawValues, setRawValues] = useState<DerivedValues>(
    () => derivedValues,
  );
  const [displayOptions, setDisplayOptions] =
    useState<Intl.DateTimeFormatOptions>({
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZoneName: "short",
    });

  useEffect(() => {
    const controller = new AbortController();
    window.addEventListener(
      "popstate",
      (e) => {
        const date = new Date(e.state?.date);
        if (!isNaN(date.valueOf())) {
          updateCurrentDate(date, false);
        }
      },
      { signal: controller.signal },
    );

    return () => {
      controller.abort();
    };
  });

  // Update current date and relative time
  const updateCurrentDate = (date: Date, updateUrl: boolean = true) => {
    const newValues = getDerivedValues(date, selectedTimezone);
    setCurrentDate(date);
    setRawValues(newValues);
    if (updateUrl) {
      setDateInUrlParam(date);
    }
  };

  const handleDisplayOptionChange = (
    option: keyof Intl.DateTimeFormatOptions,
    value: string,
  ) => {
    setDisplayOptions((prevOptions) => ({
      ...prevOptions,
      [option]: value === NONE ? undefined : value,
    }));
  };

  const maybeUpdateCurrentDate = (
    newDate: Date,
    key: keyof DerivedValues,
    value: string,
    reset: boolean = false,
  ) => {
    if (!isNaN(newDate.valueOf())) {
      updateCurrentDate(newDate, true);
    } else {
      setRawValues(reset ? derivedValues : { ...rawValues, [key]: value });
    }
  };

  const handleDateChange = (value: string, reset: boolean = false) => {
    const newDate = new Date(currentDate);
    const [year, month, day] = value.split("-");
    newDate.setFullYear(parseInt(year));
    newDate.setMonth(parseInt(month) - 1);
    newDate.setDate(parseInt(day));
    maybeUpdateCurrentDate(newDate, "date", value, reset);
  };

  const handleTimeChange = (value: string, reset: boolean = false) => {
    const newDate = new Date(currentDate);
    const [hours, minutes] = value.split(":");
    newDate.setHours(parseInt(hours));
    newDate.setMinutes(parseInt(minutes));
    maybeUpdateCurrentDate(newDate, "time", value, reset);
  };

  const handleTimestampChange = (value: string, reset: boolean = false) => {
    const timestamp = parseInt(value);
    const newDate = new Date(timestamp);
    maybeUpdateCurrentDate(newDate, "timestamp", value, reset);
  };

  const handleYearChange = (value: string, reset: boolean = false) => {
    const newDate = new Date(currentDate);
    newDate.setFullYear(parseInt(value));
    maybeUpdateCurrentDate(newDate, "year", value, reset);
  };

  const handleMonthChange = (value: string, reset: boolean = false) => {
    const newDate = new Date(currentDate);
    const index = MONTHS.indexOf(value);
    newDate.setMonth(index);
    maybeUpdateCurrentDate(newDate, "month", value, reset);
  };

  const handleDayChange = (value: string, reset: boolean = false) => {
    const newDate = new Date(currentDate);
    newDate.setDate(parseInt(value));
    maybeUpdateCurrentDate(newDate, "day", value, reset);
  };

  const handleDayOfWeekChange = (value: string, reset: boolean = false) => {
    const targetDayOfWeek = DAYS_OF_WEEK.indexOf(value);
    const newDate = setDay(currentDate, targetDayOfWeek);
    maybeUpdateCurrentDate(newDate, "dayOfWeek", value, reset);
  };

  const handleHourChange = (value: string, reset: boolean = false) => {
    const newDate = new Date(currentDate);
    newDate.setHours(parseInt(value));
    maybeUpdateCurrentDate(newDate, "hour", value, reset);
  };

  const handleMeridianChange = (value: string, reset: boolean = false) => {
    const newDate = new Date(currentDate);
    const currentHour = newDate.getHours();

    if (value === AM) {
      // Convert to AM
      if (currentHour >= 12) {
        newDate.setHours(currentHour - 12);
      }
    } else {
      // Convert to PM
      if (currentHour < 12) {
        newDate.setHours(currentHour + 12);
      }
    }
    maybeUpdateCurrentDate(newDate, "meridian", value, reset);
  };

  const handleMinuteChange = (value: string, reset: boolean = false) => {
    const newDate = new Date(currentDate);
    newDate.setMinutes(parseInt(value));
    maybeUpdateCurrentDate(newDate, "minute", value, reset);
  };

  const handleSecondChange = (value: string, reset: boolean = false) => {
    const newDate = new Date(currentDate);
    newDate.setSeconds(parseInt(value));
    maybeUpdateCurrentDate(newDate, "second", value, reset);
  };

  const handleRelativeTimeChange = (value: string, reset: boolean = false) => {
    const newDate = parseRelativeTime(value) || new Date(NaN);
    maybeUpdateCurrentDate(newDate, "relativeTime", value, reset);
  };

  const displayDate = currentDate.toLocaleString(undefined, {
    ...displayOptions,
    timeZone: selectedTimezone,
  });

  return (
    <AppContainer name={NAME} about={ABOUT} links={LINKS} logo={logo}>
      <div className="mb-10">
        <Field
          value={displayDate}
          fieldName="datetime"
          align="center"
          readOnly
        />

        <details className="mx-2 open:py-4 bg-base-200 border-t-0 border border-base-300 rounded-md rounded-t-none transition-all transition-discrete overflow-hidden group box-border">
          <summary className="transition-all py-2 not-group-open:hover:py-3 list-none cursor-pointer text-xs text-center font-bold text-base-content opacity-50">
            <div className="swap group-open:swap-active">
              <div className="swap-off">
                <ChevronDown size={16} />
              </div>
              <div className="swap-on">
                <ChevronUp size={16} />
              </div>
            </div>
            Display Options
          </summary>
          <div className="grid grid-cols-2 gap-2 px-4 pt-4 transition-all transition-discrete overflow-hidden h-0 group-open:h-auto box-border">
            <Field
              label="Day"
              fieldName="day-select"
              value={displayOptions.day || NONE}
              onChange={(e) => handleDisplayOptionChange("day", e.target.value)}
              options={DAY_OPTIONS}
              copyButton={false}
              size="sm"
              className="order-1"
            />
            <Field
              label="Weekday"
              fieldName="weekday-select"
              value={displayOptions.weekday || NONE}
              onChange={(e) =>
                handleDisplayOptionChange("weekday", e.target.value)
              }
              options={WEEKDAY_OPTIONS}
              copyButton={false}
              size="sm"
              className="order-3"
            />
            <Field
              label="Month"
              fieldName="month-select"
              value={displayOptions.month || NONE}
              onChange={(e) =>
                handleDisplayOptionChange("month", e.target.value)
              }
              options={MONTH_OPTIONS}
              copyButton={false}
              size="sm"
              className="order-5"
            />
            <Field
              label="Year"
              fieldName="year-select"
              value={displayOptions.year || NONE}
              onChange={(e) =>
                handleDisplayOptionChange("year", e.target.value)
              }
              options={YEAR_OPTIONS}
              copyButton={false}
              size="sm"
              className="order-7"
            />
            <Field
              label="Hour"
              fieldName="hour-select"
              value={displayOptions.hour || NONE}
              onChange={(e) =>
                handleDisplayOptionChange("hour", e.target.value)
              }
              options={HOUR_OPTIONS}
              copyButton={false}
              size="sm"
              className="order-2"
            />
            <Field
              label="Minute"
              fieldName="minute-select"
              value={displayOptions.minute || NONE}
              onChange={(e) =>
                handleDisplayOptionChange("minute", e.target.value)
              }
              options={MINUTE_OPTIONS}
              copyButton={false}
              size="sm"
              className="order-4"
            />
            <Field
              label="Second"
              fieldName="second-select"
              value={displayOptions.second || NONE}
              onChange={(e) =>
                handleDisplayOptionChange("second", e.target.value)
              }
              options={SECOND_OPTIONS}
              copyButton={false}
              size="sm"
              className="order-6"
            />
            <Field
              label="Time Zone Name"
              fieldName="timeZoneName-select"
              value={displayOptions.timeZoneName || NONE}
              onChange={(e) =>
                handleDisplayOptionChange("timeZoneName", e.target.value)
              }
              options={TIMEZONE_NAME_OPTIONS}
              copyButton={false}
              size="sm"
              className="order-8"
            />
          </div>
        </details>
      </div>

      <Field
        label="Relative"
        value={rawValues.relativeTime}
        type="search"
        onChange={(e) => handleRelativeTimeChange(e.target.value, false)}
        onBlur={(e) => handleRelativeTimeChange(e.target.value.trim(), true)}
        placeholder="e.g., 5 minutes ago, 2 hours from now"
        fieldName="relative"
      />

      <Field
        label="Date"
        type="date"
        value={rawValues.date}
        onChange={(e) => handleDateChange(e.target.value.trim(), false)}
        onBlur={(e) => handleDateChange(e.target.value.trim(), true)}
        fieldName="date"
      />

      <Field
        label="Time"
        type="time"
        value={rawValues.time}
        onChange={(e) => handleTimeChange(e.target.value.trim(), false)}
        onBlur={(e) => handleTimeChange(e.target.value.trim(), false)}
        fieldName="time"
      />

      <Field
        label="Timezone"
        value={selectedTimezone}
        onChange={(e) => setSelectedTimezone(e.target.value)}
        options={TIMEZONES}
        fieldName="timezone"
      />

      <Field
        label="Timestamp"
        type="number"
        value={rawValues.timestamp}
        onChange={(e) => handleTimestampChange(e.target.value.trim(), false)}
        onBlur={(e) => handleTimestampChange(e.target.value.trim(), true)}
        fieldName="timestamp"
      />

      <Field
        label="Year"
        type="number"
        value={rawValues.year}
        onChange={(e) => handleYearChange(e.target.value.trim(), false)}
        onBlur={(e) => handleYearChange(e.target.value.trim(), true)}
        fieldName="year"
      />

      <Field
        label="Month"
        value={rawValues.month}
        onChange={(e) => handleMonthChange(e.target.value.trim(), false)}
        onBlur={(e) => handleMonthChange(e.target.value.trim(), true)}
        options={MONTHS}
        fieldName="month"
      />

      <Field
        label="Day"
        type="number"
        min="1"
        max="31"
        value={rawValues.day}
        onChange={(e) => handleDayChange(e.target.value.trim(), false)}
        onBlur={(e) => handleDayChange(e.target.value.trim(), true)}
        fieldName="day"
      />

      <Field
        label="Day of Week"
        value={rawValues.dayOfWeek}
        onChange={(e) => handleDayOfWeekChange(e.target.value.trim(), false)}
        onBlur={(e) => handleDayOfWeekChange(e.target.value.trim(), true)}
        options={DAYS_OF_WEEK}
        fieldName="dayOfWeek"
      />

      <Field
        label="Hour"
        type="number"
        min="0"
        max="23"
        value={rawValues.hour}
        onChange={(e) => handleHourChange(e.target.value.trim(), false)}
        onBlur={(e) => handleHourChange(e.target.value.trim(), true)}
        fieldName="hour"
      />

      <Field
        label="Meridian"
        value={rawValues.meridian}
        onChange={(e) => handleMeridianChange(e.target.value.trim(), false)}
        onBlur={(e) => handleMeridianChange(e.target.value.trim(), true)}
        options={MERIDIANS}
        fieldName="meridian"
      />

      <Field
        label="Minute"
        type="number"
        min="0"
        max="59"
        value={rawValues.minute}
        onChange={(e) => handleMinuteChange(e.target.value.trim(), false)}
        onBlur={(e) => handleMinuteChange(e.target.value.trim(), true)}
        fieldName="minute"
      />

      <Field
        label="Second"
        type="number"
        min="0"
        max="59"
        value={rawValues.second}
        onChange={(e) => handleSecondChange(e.target.value.trim(), false)}
        onBlur={(e) => handleSecondChange(e.target.value.trim(), true)}
        fieldName="second"
      />
    </AppContainer>
  );
};

export default App;
