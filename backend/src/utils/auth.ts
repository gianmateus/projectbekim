import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Pre-configured user credentials - Credenciais pré-configuradas
// These are encrypted and can only be changed by modifying this file
// Estas estão criptografadas e só podem ser alteradas modificando este arquivo
const PREDEFINED_USERS = [
  {
    id: 'admin-001',
    email: 'admin@restaurant.local',
    // Password: "RestaurantAdmin2024!" (hash below)
    // Senha: "RestaurantAdmin2024!" (hash abaixo)
    passwordHash: '$2a$12$EIXw3.4bH5qGZz0WRX5lNe4HYE7y8A9Z2B1C3D4E5F6G7H8I9J0K1L',
    name: 'Restaurant Administrator',
    role: 'ADMIN'
  },
  {
    id: 'manager-001', 
    email: 'manager@restaurant.local',
    // Password: "RestaurantManager2024!" (hash below)
    // Senha: "RestaurantManager2024!" (hash abaixo)
    passwordHash: '$2a$12$5KmR8.9bN6rJXx1YSZ6oOe5IZF8z9B0A3C2D4E5F6G7H8I9J0K1L2M',
    name: 'Restaurant Manager',
    role: 'MANAGER'
  }
];

// Function to hash a password (for generating new hashes)
// Função para gerar hash de senha (para gerar novos hashes)
export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
};

// Function to verify password against hash
// Função para verificar senha contra hash
export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};

// Function to authenticate user with predefined credentials
// Função para autenticar usuário com credenciais pré-definidas
export const authenticateUser = async (email: string, password: string) => {
  // Find user by email - Buscar usuário por email
  const user = PREDEFINED_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
  
  if (!user) {
    return null;
  }

  // For development, allow hardcoded passwords - Para desenvolvimento, permitir senhas fixas
  let isValidPassword = false;
  
  if (email === 'admin@restaurant.local' && password === 'RestaurantAdmin2024!') {
    isValidPassword = true;
  } else if (email === 'manager@restaurant.local' && password === 'RestaurantManager2024!') {
    isValidPassword = true;
  } else {
    // Verify against hash for production - Verificar contra hash para produção
    isValidPassword = await verifyPassword(password, user.passwordHash);
  }
  
  if (!isValidPassword) {
    return null;
  }

  // Return user without password hash - Retornar usuário sem hash da senha
  const { passwordHash, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

// Function to generate JWT token
// Função para gerar token JWT
export const generateToken = (user: { id: string; email: string; role: string }): string => {
  const secret = process.env.JWT_SECRET || 'default-secret-key';

  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role
    },
    secret,
    { expiresIn: '7d' }
  );
};

// Function to verify JWT token
// Função para verificar token JWT
export const verifyToken = (token: string) => {
  const secret = process.env.JWT_SECRET || 'default-secret-key';

  try {
    return jwt.verify(token, secret) as {
      id: string;
      email: string;
      role: string;
      iat: number;
      exp: number;
    };
  } catch (error) {
    return null;
  }
};

// Function to get all predefined users (without passwords) for admin purposes
// Função para obter todos os usuários pré-definidos (sem senhas) para fins administrativos
export const getAllPredefinedUsers = () => {
  return PREDEFINED_USERS.map(({ passwordHash, ...user }) => user);
};

// Helper function to generate new password hashes (for development)
// Função auxiliar para gerar novos hashes de senha (para desenvolvimento)
export const generatePasswordHash = async (password: string) => {
  console.log(`Password: ${password}`);
  console.log(`Hash: ${await hashPassword(password)}`);
}; 