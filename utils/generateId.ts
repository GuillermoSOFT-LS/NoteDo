// Función simple para generar IDs únicos compatible con React Native
export const generateId = (): string => {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 15);
  return `${timestamp}_${randomPart}`;
};

// Función alternativa más robusta
export const generateUniqueId = (): string => {
  return 'id_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
};