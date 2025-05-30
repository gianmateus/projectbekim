import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.middleware';
import { 
  createClient, 
  listAllClients, 
  deactivateClient, 
  requireAdmin,
  updateClient,
  deleteClient,
  reactivateClient,
  listDeactivatedClients,
  listAllPayments,
  createPayment,
  markPaymentAsPaid,
  generateMonthlyPayments,
  updateOverduePayments
} from '../controllers/admin.controller';

const router = Router();

// Aplicar autenticação em todas as rotas admin
router.use(authenticateToken);

// Aplicar verificação de ADMIN em todas as rotas
router.use(requireAdmin);

// POST /api/admin/clients - Criar novo cliente (APENAS ADMIN)
router.post('/clients', createClient);

// GET /api/admin/clients - Listar todos os clientes (APENAS ADMIN)
router.get('/clients', listAllClients);

// GET /api/admin/clients/deactivated - Listar clientes desativados (APENAS ADMIN)
router.get('/clients/deactivated', listDeactivatedClients);

// PUT /api/admin/clients/:clientId - Editar cliente (APENAS ADMIN)
router.put('/clients/:clientId', updateClient);

// PUT /api/admin/clients/:clientId/deactivate - Desativar cliente (APENAS ADMIN)
router.put('/clients/:clientId/deactivate', deactivateClient);

// PUT /api/admin/clients/:clientId/reactivate - Reativar cliente (APENAS ADMIN)
router.put('/clients/:clientId/reactivate', reactivateClient);

// DELETE /api/admin/clients/:clientId - Excluir cliente permanentemente (APENAS ADMIN)
router.delete('/clients/:clientId', deleteClient);

// ========== ROTAS DE PAGAMENTOS ==========

// GET /api/admin/payments - Listar todos os pagamentos (APENAS ADMIN)
router.get('/payments', listAllPayments);

// POST /api/admin/payments - Criar novo pagamento (APENAS ADMIN)
router.post('/payments', createPayment);

// PUT /api/admin/payments/:paymentId/paid - Marcar pagamento como recebido (APENAS ADMIN)
router.put('/payments/:paymentId/paid', markPaymentAsPaid);

// POST /api/admin/payments/generate-monthly - Gerar pagamentos mensais (APENAS ADMIN)
router.post('/payments/generate-monthly', generateMonthlyPayments);

// PUT /api/admin/payments/update-overdue - Atualizar pagamentos em atraso (APENAS ADMIN)
router.put('/payments/update-overdue', updateOverduePayments);

export default router; 