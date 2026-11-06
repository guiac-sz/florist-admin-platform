import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { hash } from 'bcryptjs';
import { PrismaClient } from '../src/generated/prisma/client';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const unsplash = (photoId: string) =>
  `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=900&q=85`;

const categories = [
  { name: 'Buquês', slug: 'buques', sortOrder: 1 },
  { name: 'Arranjos', slug: 'arranjos', sortOrder: 2 },
  { name: 'Rosas', slug: 'rosas', sortOrder: 3 },
  { name: 'Cestas', slug: 'cestas', sortOrder: 4 },
  { name: 'Presentes', slug: 'presentes', sortOrder: 5 },
];

const products = [
  {
    name: 'Buquê Aurora',
    price: 149.9,
    category: 'buques',
    isFeatured: true,
    imageUrl: unsplash('photo-1561181286-d3fee7d55364'),
    description:
      'Rosas e flores delicadas em tons suaves, ideal para aniversários e momentos românticos.',
  },
  {
    name: 'Jardim Rosé',
    price: 179.9,
    category: 'arranjos',
    imageUrl: unsplash('photo-1519378058457-4c29a0a2efac'),
    description:
      'Arranjo elegante em vaso com composição leve e acabamento artesanal.',
  },
  {
    name: 'Buquê Encanto',
    price: 129.9,
    category: 'buques',
    imageUrl: unsplash('photo-1494336934272-fb2757358dd5'),
    description:
      'Composição leve e romântica para demonstrar carinho em qualquer ocasião.',
  },
  {
    name: 'Presente Especial',
    price: 199.9,
    category: 'presentes',
    isFeatured: true,
    imageUrl: unsplash('photo-1526047932273-341f2a7631f9'),
    description:
      'Flores e complementos personalizados em uma opção completa para presentear.',
  },
  {
    name: 'Rosas Rubi',
    price: 189.9,
    category: 'rosas',
    isFeatured: true,
    imageUrl: unsplash('photo-1518621736915-f3b1c41bfd00'),
    description:
      'Rosas vermelhas em uma composição clássica, intensa e marcante.',
  },
  {
    name: 'Arranjo Primavera',
    price: 169.9,
    category: 'arranjos',
    imageUrl: unsplash('photo-1507501336603-6e31db2be093'),
    description:
      'Flores coloridas e alegres para celebrar aniversários e boas notícias.',
  },
  {
    name: 'Cesta Bom Dia',
    price: 239.9,
    category: 'cestas',
    isFeatured: true,
    imageUrl: unsplash('photo-1523294587484-bae6cc870010'),
    description:
      'Café da manhã, flores e pequenos mimos para começar o dia de forma especial.',
  },
  {
    name: 'Buquê Lavanda',
    price: 159.9,
    category: 'buques',
    imageUrl: unsplash('photo-1563241527-3004b7be0ffd'),
    description:
      'Tons lilás e rosados em uma composição delicada e sofisticada.',
  },
  {
    name: 'Rosas Champagne',
    price: 199.9,
    category: 'rosas',
    isAvailable: false,
    imageUrl: unsplash('photo-1494972308805-463bc619d34e'),
    description:
      'Rosas claras com embalagem refinada para celebrações especiais.',
  },
  {
    name: 'Arranjo Encanto',
    price: 189.9,
    category: 'arranjos',
    imageUrl: unsplash('photo-1501004318641-b39e6451bec6'),
    description:
      'Flores claras e folhagens em uma composição natural e refinada.',
  },
  {
    name: 'Cesta Doce Afeto',
    price: 209.9,
    category: 'cestas',
    imageUrl: unsplash('photo-1511381939415-e44015466834'),
    description:
      'Flores, chocolates e bombons em uma apresentação delicada.',
  },
  {
    name: 'Buquê Luz',
    price: 139.9,
    category: 'buques',
    imageUrl: unsplash('photo-1470509037663-253afd7f0f51'),
    description:
      'Girassóis e flores claras para um presente alegre e vibrante.',
  },
];

// Contas de DESENVOLVIMENTO: servem só para testar no seu computador.
// Em produção, a conta de administração é criada de outro jeito.
const devUsers = [
  {
    name: 'Marina Ferreira',
    email: 'admin@ateliefora.com',
    phone: null,
    password: 'admin1234',
    role: 'ADMIN' as const,
  },
  {
    name: 'Ana Carolina Souza',
    email: 'ana@email.com',
    phone: '15990000000',
    password: 'flores123',
    role: 'CUSTOMER' as const,
  },
];

async function seedUsers() {
  for (const { password, ...user } of devUsers) {
    const passwordHash = await hash(password, 10);

    await prisma.user.upsert({
      where: { email: user.email },
      update: { ...user, passwordHash },
      create: { ...user, passwordHash },
    });
  }
}

async function main() {
  await prisma.product.deleteMany();

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: { name: category.name, sortOrder: category.sortOrder },
      create: category,
    });
  }

  const savedCategories = await prisma.category.findMany();
  const categoryIdBySlug = new Map(
    savedCategories.map((category) => [category.slug, category.id]),
  );

  await prisma.product.createMany({
    data: products.map(({ category, ...product }, index) => {
      const categoryId = categoryIdBySlug.get(category);

      if (!categoryId) {
        throw new Error(`Categoria não encontrada: ${category}`);
      }

      return { ...product, categoryId, sortOrder: index + 1 };
    }),
  });

  await seedUsers();

  console.log(
    `Seed concluído: ${categories.length} categorias, ${products.length} produtos e ${devUsers.length} usuários.`,
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());