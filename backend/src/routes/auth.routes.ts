import { Router } from 'express';
import { login, logout, verifyTokenEndpoint, getProfile } from '../controllers/auth.controller';

const router = Router();

// Authentication routes - Rotas de autenticação
router.post('/login', login);
router.post('/logout', logout);
router.get('/verify', verifyTokenEndpoint);
router.get('/profile', getProfile);

export default router; 