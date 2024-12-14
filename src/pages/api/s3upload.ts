import { S3 } from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import { NextApiRequest, NextApiResponse } from 'next';

const s3 = new S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { fileName, fileType } = req.body;

      if (!fileName || !fileType) {
        return res.status(400).json({ error: 'File name and type are required.' });
      }

      const extension = fileName.split('.').pop();
      const key = `${uuidv4()}.${extension}`;

      const s3Params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: key,
        Expires: 60,
        ContentType: fileType,
      };

      const uploadUrl = await s3.getSignedUrlPromise('putObject', s3Params);

      res.status(200).json({ uploadUrl, key });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error generating upload URL.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
