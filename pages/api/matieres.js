import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('Matiere')
        .select('*')
        .order('id', { ascending: true });
      if (error) throw error;
      return res.status(200).json(data);
    }

    if (req.method === 'DELETE') {
    const { id } = req.body;
    const { data, error } = await supabase
      .from('Matiere')
      .delete()
      .eq('id', id);
    if (error) throw error;
    return res.status(200).json({ message: 'Matière supprimée' });
  }

    if (req.method === 'PATCH') {
    const { id, nom, coefficient } = req.body;
    const { data, error } = await supabase
      .from('Matiere')
      .update({ nom, coefficient, updatedAt: new Date() })
      .eq('id', id);
    if (error) throw error;
    return res.status(200).json(data);
  }



    if (req.method === 'POST') {
      const { nom, coefficient } = req.body;
      if (!nom || !coefficient) return res.status(400).json({ message: 'Tous les champs sont requis' });
      const { data, error } = await supabase
        .from('Matiere')
        .insert([{ nom, coefficient }]);
      if (error) throw error;
      return res.status(201).json(data);
    }

    return res.status(405).json({ message: 'Méthode non autorisée' });
  } catch (err) {
    console.error('Erreur API matieres:', err.message);
    return res.status(500).json({ message: err.message });
  }
}
