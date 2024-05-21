// src/app/api/pr/skill/route.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import '../../../../../envConfig';

const API_SERVER_URL = process.env.IL_UI_API_SERVER_URL || 'http://localhost:3000';
const USERNAME = process.env.IL_UI_API_SERVER_USERNAME || 'kitteh';
const PASSWORD = process.env.IL_UI_API_SERVER_PASSWORD || 'floofykittens';

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  console.log(`Received request: ${req.method} ${req.url}`);

  const auth = Buffer.from(`${USERNAME}:${PASSWORD}`).toString('base64');
  const headers = {
    'Content-Type': 'application/json',
    Authorization: 'Basic ' + auth,
  };

  try {
    const apiRes = await fetch(`${API_SERVER_URL}/pr/skill`, {
      method: 'POST',
      headers,
      body: JSON.stringify(req.body),
    });

    if (!apiRes.ok) {
      const errorText = await apiRes.text();
      console.error(`HTTP error status: ${apiRes.status} - ${errorText}`);
      throw new Error(`HTTP error status: ${apiRes.status} - ${errorText}`);
    }

    const text = await apiRes.text();

    let result;
    try {
      result = JSON.parse(text);
    } catch (e) {
      console.error('Failed to parse JSON:', text);
      throw new Error('Failed to parse JSON response');
    }

    res.status(201).json(result);
  } catch (error) {
    console.error('Failed to post Skill PR:', error);
    res.status(500).json({ error: 'Failed to post Skill PR' });
  }
}

