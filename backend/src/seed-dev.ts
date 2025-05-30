import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de desenvolvimento...');

  // Criar usuário admin de desenvolvimento
  const adminPassword = 'RestaurantAdmin2024!';
  const managerPassword = 'RestaurantManager2024!';

  // Hash das senhas
  const adminHash = await bcrypt.hash(adminPassword, 12);
  const managerHash = await bcrypt.hash(managerPassword, 12);

  // Verificar se já existem usuários
  let admin = await prisma.user.findUnique({
    where: { email: 'admin@restaurant.local' }
  });

  if (!admin) {
    // Criar usuário admin
    admin = await prisma.user.create({
      data: {
        email: 'admin@restaurant.local',
        password: adminHash,
        name: 'Restaurant Administrator',
        role: 'ADMIN',
        isActive: true
      }
    });

    console.log('✅ Usuário admin criado:', { 
      id: admin.id, 
      email: admin.email, 
      password: adminPassword 
    });
  } else {
    console.log('👤 Usuário admin já existe');
  }

  // Verificar se já existe usuário manager
  let manager = await prisma.user.findUnique({
    where: { email: 'manager@restaurant.local' }
  });

  if (!manager) {
    // Criar usuário manager
    manager = await prisma.user.create({
      data: {
        email: 'manager@restaurant.local',
        password: managerHash,
        name: 'Restaurant Manager',
        role: 'MANAGER',
        isActive: true
      }
    });

    console.log('✅ Usuário manager criado:', { 
      id: manager.id, 
      email: manager.email, 
      password: managerPassword 
    });
  } else {
    console.log('👤 Usuário manager já existe');
  }

  // Criar restaurantes de exemplo para o admin (se não existirem)
  const existingRestaurants = await prisma.restaurant.findMany({
    where: { ownerId: admin.id }
  });

  if (existingRestaurants.length === 0) {
    const restaurantsData = [
      {
        name: 'La Bella Vista',
        description: 'Authentische italienische Küche im Herzen der Stadt',
        address: 'Hauptstraße 123, 10115 Berlin',
        phone: '+49 30 12345678',
        email: 'info@labellavista.de',
        color: '#c54f42',
        ownerId: admin.id
      },
      {
        name: 'Zur Goldenen Gans',
        description: 'Traditionelle deutsche Küche und gemütliche Atmosphäre',
        address: 'Friedrichstraße 456, 10117 Berlin',
        phone: '+49 30 87654321',
        email: 'kontakt@goldenengans.de',
        color: '#d96d62',
        ownerId: admin.id
      },
      {
        name: 'Sakura Sushi',
        description: 'Frisches Sushi und japanische Spezialitäten',
        address: 'Unter den Linden 789, 10117 Berlin',
        phone: '+49 30 11223344',
        email: 'info@sakurasushi.de',
        color: '#6c798b',
        ownerId: admin.id
      }
    ];

    for (const restaurantData of restaurantsData) {
      const restaurant = await prisma.restaurant.create({
        data: restaurantData
      });
      console.log('✅ Restaurante criado:', { 
        id: restaurant.id, 
        name: restaurant.name 
      });
    }
  } else {
    console.log('🏪 Restaurantes já existem para o admin');
  }

  console.log('\n📋 Credenciais de desenvolvimento:');
  console.log('Admin: admin@restaurant.local / RestaurantAdmin2024!');
  console.log('Manager: manager@restaurant.local / RestaurantManager2024!');
  console.log('🎉 Seed de desenvolvimento concluído!');
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 