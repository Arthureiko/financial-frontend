export const setLocalStorage = ({
  key,
  value,
}: {
  key: string;
  value: string;
}) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(key, value);
  }
};

export const getLocalStorage = (key: string) => {
  if (typeof window !== "undefined") {
    const value = localStorage.getItem(key);
    if (value) return value;
  }
  return null;
};

export const removeLocalStorage = (key: string) => {
  if (typeof window !== "undefined") {
    return localStorage.removeItem(key);
  }
};

export const clearLocalStorage = () => {
  if (typeof window !== "undefined") {
    return localStorage.clear();
  }
};
