export const setSessionStorage = ({
  key,
  value,
}: {
  key: string;
  value: string;
}) => {
  sessionStorage.setItem(key, value);
};

export const getSessionStorage = (key: string) => {
  const value = sessionStorage.getItem(key);

  if (value) return value;
};

export const removeSessionStorage = (key: string) => {
  return sessionStorage.removeItem(key);
};

export const clearSessionStorage = () => {
  return sessionStorage.clear();
};
