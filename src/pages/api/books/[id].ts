import { NextApiRequest, NextApiResponse } from 'next';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import pool from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ message: 'Invalid or missing book ID.' });
  }

  try {
    if (req.method === 'GET') {
      const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM books WHERE id = ?', [id]);
      if (rows.length === 0) {
        return res.status(404).json({ message: 'Book not found.' });
      }
      return res.status(200).json(rows[0]);
    }

    if (req.method === 'PUT') {
      const { title, author, publisher, published_date, quantity, description, image_url } = req.body;

      if (!title || !author) {
        return res.status(400).json({ message: 'Title and Author are required.' });
      }

      const [result] = await pool.query<ResultSetHeader>(
        'UPDATE books SET title = ?, author = ?, publisher = ?, published_date = ?, quantity = ?, description = ?, image_url = ? WHERE id = ?',
        [title, author, publisher, published_date, quantity || 0, description, image_url || null, id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Book not found.' });
      }

      return res.status(200).json({ message: 'Book updated successfully.' });
    }

    if (req.method === 'DELETE') {
      const [result] = await pool.query<ResultSetHeader>('DELETE FROM books WHERE id = ?', [id]);

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Book not found.' });
      }

      try {
        await pool.query('SET @rownum := 0;');
        await pool.query('UPDATE books SET id = (@rownum := @rownum + 1);');
        await pool.query('ALTER TABLE books AUTO_INCREMENT = 1;');

        return res.status(200).json({ message: 'Book deleted and IDs reordered successfully.' });
      } catch (error) {
        console.error('Reordering IDs failed:', error);
        return res.status(500).json({ message: 'Book deleted, but reordering IDs failed.' });
      }
    }

    return res.status(405).json({ message: 'Method Not Allowed' });
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
