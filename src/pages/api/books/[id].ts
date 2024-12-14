import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ message: 'Invalid or missing book ID.' });
  }

  try {
    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !data) {
        return res.status(404).json({ message: 'Book not found.' });
      }

      return res.status(200).json(data);
    }

    if (req.method === 'PUT') {
      const { title, author, publisher, published_date, quantity, description, image_url } = req.body;
    
      if (!title || !author) {
        return res.status(400).json({ message: 'Title and Author are required.' });
      }
    
      const { data, error } = await supabase
        .from('books')
        .update({
          title,
          author,
          publisher,
          published_date,
          quantity: quantity || 0,
          description,
          image_url: image_url || null,
        })
        .eq('id', id)
        .select();

      if (error) {
        return res.status(404).json({ message: 'Book not found or update failed.' });
      }

      return res.status(200).json({ message: 'Book updated successfully.', data });
    }

    if (req.method === 'DELETE') {
      const { error } = await supabase.from('books').delete().eq('id', id);

      if (error) {
        return res.status(404).json({ message: 'Book not found or delete failed.' });
      }

      return res.status(200).json({ message: 'Book deleted successfully.' });
    }

    return res.status(405).json({ message: 'Method Not Allowed' });
  } catch {
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
