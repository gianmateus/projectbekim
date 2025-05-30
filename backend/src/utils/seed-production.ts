import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de produção...');

  // Usar credenciais do ambiente OU credenciais padrão como fallback
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@restaurant.local';
  const adminPassword = process.env.ADMIN_PASSWORD || 'RestaurantAdmin2024!';
  const adminName = process.env.ADMIN_NAME || 'Restaurant Administrator';

  // Verificar se já existe usuário admin
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail }
  });

  if (existingAdmin) {
    console.log('👤 Usuário admin já existe - pulando seed');
    console.log('📧 Email do admin:', adminEmail);
    return;
  }

  if (adminPassword.length < 8) {
    throw new Error('❌ ADMIN_PASSWORD deve ter pelo menos 8 caracteres!');
  }

  // Hash da senha
  const hashedPassword = await bcrypt.hash(adminPassword, 12);

  // Criar usuário admin
  const admin = await prisma.user.create({
    data: {
      email: adminEmail,
      password: hashedPassword,
      name: adminName,
      role: 'ADMIN',
      isActive: true
    }
  });

  console.log('✅ Usuário admin criado:', { 
    id: admin.id, 
    email: admin.email, 
    name: admin.name 
  });

  // Verificar se já existe restaurante
  const existingRestaurant = await prisma.restaurant.findFirst({
    where: { ownerId: admin.id }
  });

  if (!existingRestaurant) {
    // Criar restaurante padrão
    const restaurant = await prisma.restaurant.create({
      data: {
        name: process.env.RESTAURANT_NAME || 'Meu Restaurante',
        description: 'Restaurante criado automaticamente',
        address: process.env.RESTAURANT_ADDRESS || 'Endereço não informado',
        phone: process.env.RESTAURANT_PHONE || '',
        email: adminEmail,
        ownerId: admin.id
      }
    });

    console.log('✅ Restaurante criado:', { 
      id: restaurant.id, 
      name: restaurant.name 
    });
  }

  console.log('\n📋 Credenciais de acesso:');
  console.log(`📧 Email: ${adminEmail}`);
  console.log(`🔐 Senha: ${adminPassword}`);
  console.log('🎉 Seed de produção concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed de produção:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 