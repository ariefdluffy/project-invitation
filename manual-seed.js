import { seedTemplates } from './src/lib/server/invitations.js';

async function runSeeding() {
  console.log('Starting manual seeding...');
  try {
    await seedTemplates();
    console.log('Seeding completed successfully!');
  } catch (error) {
    console.error('Seeding failed:', error);
  }
}

runSeeding();