import jwt from 'jsonwebtoken';

export const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'novamart_jwt_super_secret_production_key_2025',
    {
      expiresIn: '30d',
    }
  );
};
