import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { base64Data, filename } = req.body;

      if (!base64Data || !filename) {
        return res.status(400).json({ message: 'Base64 data and filename are required.' });
      }

      // Base64 문자열에서 데이터 추출
      const matches = base64Data.match(/^data:(.+);base64,(.+)$/);
      if (!matches || matches.length !== 3) {
        return res.status(400).json({ message: 'Invalid Base64 format.' });
      }

      const base64Content = matches[2]; // Base64 데이터

      // 파일 저장 경로 설정
      const savePath = path.join(process.cwd(), 'public/uploads', filename);

      // Base64 데이터를 Buffer로 변환
      const buffer = Buffer.from(base64Content, 'base64');

      // 파일 저장
      fs.writeFileSync(savePath, buffer);

      // 응답 반환
      res.status(200).json({ message: 'File uploaded successfully!', filePath: `/uploads/${filename}` });
    } catch (error) {
      console.error('File upload error:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
