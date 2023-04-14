export const setLSItem = (name: string, value: unknown) => {
  localStorage.setItem(name, JSON.stringify(value));
};

export const getLSItem = <T>(name: string) => {
  const value = localStorage.getItem(name);
  let json = null;
  try {
    if (value) {
      json = JSON.parse(value);
    }
  } catch (e) {}
  return json as T;
};

export const removeLSItem = (name: string) => {
  localStorage.removeItem(name);
};
