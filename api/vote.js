import { kv } from '@vercel/kv';

export default async function handler(req, res) {
    const KEY = 'nyc_election_results_2026';
    const defaultStats = [
        { id: 1, name: "Sohan Karki", votes: 0 },
        { id: 2, name: "Shubham Paneru", votes: 0 },
        { id: 3, name: "Narendra Modi", votes: 0 }
    ];

    try {
        if (req.method === 'GET') {
            const data = await kv.get(KEY);
            // If database is empty, return defaults instead of crashing
            return res.status(200).json(data || defaultStats);
        }

        if (req.method === 'POST') {
            const { candidateId } = req.body;
            let data = await kv.get(KEY) || defaultStats;

            const index = data.findIndex(c => c.id === candidateId);
            if (index !== -1) {
                data[index].votes += 1;
                await kv.set(KEY, data);
                return res.status(200).json(data);
            }
            return res.status(400).json({ error: "Invalid Candidate" });
        }
    } catch (error) {
        console.error("KV Error:", error);
        return res.status(500).json({ error: "Database Connection Failed" });
    }
}
