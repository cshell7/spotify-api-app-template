export const objectToQueryParamString = (paramsAsObject) =>
  Object.entries(paramsAsObject).reduce(
    (paramsString, [key, value], index) =>
      `${paramsString}${index === 0 ? "?" : "&"}${key}=${value}`,
    ""
  );
