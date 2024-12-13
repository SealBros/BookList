import { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/lib/db';
import { ResultSetHeader } from 'mysql2';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'POST') {
      const { title, author, publisher, published_date, quantity, description, image_url } = req.body;

      if (!title || !author) {
        return res.status(400).json({ message: 'Title and Author are required.' });
      }

      const [result] = await pool.query<ResultSetHeader>(
        'INSERT INTO books (title, author, publisher, published_date, quantity, description, image_url) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [title, author, publisher, published_date, quantity || 0, description, image_url || null]
      );

      return res.status(201).json({ message: 'Book added successfully!', id: result.insertId });
    }

    if (req.method === 'GET') {
      const [rows] = await pool.query('SELECT * FROM books');
      return res.status(200).json(rows);
    }

    return res.status(405).json({ message: 'Method Not Allowed' });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}