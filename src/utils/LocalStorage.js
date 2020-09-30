export const setLSItem = (name, value) => {
  localStorage.setItem(name, JSON.stringify(value));
};

export const getLSItem = (name) => {
  const value = localStorage.getItem(name);
  let json = null;
  try {
    json = JSON.parse(value);
  } catch (e) {
    console.log(e);
  }
  return json;
};

export const removeLSItem = (name) => {
  localStorage.removeItem(name);
};
