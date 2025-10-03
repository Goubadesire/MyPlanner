// pages/api/login.js
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  const { pseudo, password } = req.body;

  if (!pseudo || !password) {
    return res.status(400).json({ message: 'Veuillez remplir tous les champs' });
  }

  try {
    // Récupération de l'utilisateur par pseudo
    const user = await prisma.user.findUnique({
      where: { pseudo },
    });

    if (!user) {
      return res.status(401).json({ message: 'Identifiants incorrects' });
    }

    // Vérification du mot de passe hashé
    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      return res.status(401).json({ message: 'Identifiants incorrects' });
    }

    // Connexion réussie
    return res.status(200).json({ message: 'Connexion réussie' });
  } catch (err) {
    console.error('Erreur API login:', err);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
}
