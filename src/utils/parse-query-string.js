export const parseQueryString = (search = "") =>
  search
    .replace(/^\?|#/, "")
    .split("&")
    .map((kv) => kv.split("="))
    .filter(([key]) => key)
    .reduce(
      (q, [key, val]) => ({
        ...q,
        [decodeURIComponent(key)]: decodeURIComponent(val),
      }),
      {}
    );
