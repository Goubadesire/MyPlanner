import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  const { id } = req.query; // id de la matière
  try {
    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('Note')
        .select('*')
        .eq('matiereId', id)
        .order('id', { ascending: true });
      if (error) throw error;
      return res.status(200).json({ notes: data });
    }

    if (req.method === 'DELETE') {
  const id = Number(req.query.id); // récupérer l’ID depuis la query string
  if (!id) return res.status(400).json({ message: 'ID invalide' });

  const { error } = await supabase
    .from('Note')
    .delete()
    .eq('id', id);

  if (error) return res.status(500).json({ message: error.message });

  return res.status(200).json({ message: 'Note supprimée' });
}


      if (req.method === 'PATCH') {
    const { id, note } = req.body;
    const { data, error } = await supabase
      .from('Note')
      .update({ note, updatedAt: new Date() })
      .eq('id', id);
    if (error) throw error;
    return res.status(200).json(data);
  }


    if (req.method === 'POST') {
      const { note } = req.body;
      if (!note) return res.status(400).json({ message: 'La note est requise' });
      const { data, error } = await supabase
        .from('Note')
        .insert([{ note, matiereId: Number(id) }]);
      if (error) throw error;
      return res.status(201).json(data);
    }

    return res.status(405).json({ message: 'Méthode non autorisée' });
  } catch (err) {
    console.error('Erreur API notes:', err.message);
    return res.status(500).json({ message: err.message });
  }
}
