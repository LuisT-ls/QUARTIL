type AnalyticsValue = string | number | boolean;

type AnalyticsParams = Record<string, AnalyticsValue>;

export function trackEvent(name: string, params: AnalyticsParams = {}) {
  if (typeof window === "undefined") return;

  const gtag = (
    window as Window & {
      gtag?: (command: string, eventName: string, params?: AnalyticsParams) => void;
    }
  ).gtag;

  gtag?.("event", name, params);
}
