// hashPasswords.js
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function hashAllPasswords() {
  try {
    // Récupérer tous les utilisateurs
    const users = await prisma.user.findMany();

    for (const user of users) {
      // Vérifie si le mot de passe est déjà hashé (optionnel, si tu veux éviter de re-hasher)
      if (!user.password.startsWith('$2a$')) {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        await prisma.user.update({
          where: { id: user.id },
          data: { password: hashedPassword },
        });
        console.log(`Mot de passe hashé pour ${user.pseudo}`);
      } else {
        console.log(`Mot de passe déjà hashé pour ${user.pseudo}`);
      }
    }

    console.log('Tous les mots de passe ont été hashés avec succès !');
  } catch (err) {
    console.error('Erreur lors du hash des mots de passe :', err);
  } finally {
    await prisma.$disconnect();
  }
}

hashAllPasswords();
