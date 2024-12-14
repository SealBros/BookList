import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'POST') {
      const { title, author, publisher, published_date, quantity, description, image_url } = req.body;

      if (!title || !author) {
        return res.status(400).json({ message: 'Title and Author are required.' });
      }

      const { data, error } = await supabase
        .from('books')
        .insert([
          {
            title,
            author,
            publisher,
            published_date,
            quantity: quantity || 0,
            description,
            image_url: image_url || null,
          },
        ])
        .select();

      if (error) {
        console.error('Insert error:', error);
        return res.status(500).json({ message: 'Failed to add book.', error });
      }

      return res.status(201).json({ message: 'Book added successfully!', data });
    }

    if (req.method === 'GET') {
      // 데이터 조회
      const { data, error } = await supabase.from('books').select('*');

      if (error) {
        console.error('Fetch error:', error);
        return res.status(500).json({ message: 'Failed to fetch books.', error });
      }

      return res.status(200).json(data);
    }

    return res.status(405).json({ message: 'Method Not Allowed' });
  } catch (error) {
    console.error('Supabase error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
