export const validateName = (name: string): string => {
  if (!name) return "Nome é obrigatório";
  if (name.length < 3) return "Nome deve ter pelo menos 3 caracteres";
  if (name.length > 50) return "Nome deve ter no máximo 50 caracteres";
  return "";
};

export const validateEmail = (email: string): string => {
  if (!email) return "E-mail é obrigatório";
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return "E-mail inválido";
  return "";
};

export const validatePassword = (password: string): string => {
  if (!password) return "Senha é obrigatória";
  if (password.length < 6) return "Senha deve ter pelo menos 6 caracteres";
  if (password.length > 50) return "Senha deve ter no máximo 50 caracteres";
  if (!/[A-Z]/.test(password))
    return "Senha deve conter pelo menos uma letra maiúscula";
  if (!/[a-z]/.test(password))
    return "Senha deve conter pelo menos uma letra minúscula";
  if (!/[0-9]/.test(password)) return "Senha deve conter pelo menos um número";
  return "";
};
