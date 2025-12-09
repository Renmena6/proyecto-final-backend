

export const getJwtSecret = (): string => {
    
  // 1. Verificar si la variable de entorno existe
  const secret = process.env.JWT_SECRET;
  
  // 2. Si no existe (es undefined), lanzar un error CLARO
  if (!secret) {
    throw new Error('JWT_SECRET no está configurada en las variables de entorno.');
  }
  
  // 3. Si existe, devolverla
  return secret;
};