import Event from '@/models/event';
import { getUserIdByToken } from '@/models/user';
import { v4 as uuidv4 } from 'uuid';
import { DateTimeToString, StringToDateTime } from '@/lib/date';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  if (!req.body.token) {
    return res
      .status(400)
      .json({ message: 'token is required. (use body to send)' });
  }

  const fromCategory = req.body.fromCategory || '';

  const query = req.body.query || '';

  let searchQuery = {};
  if (query) {
    searchQuery = { $text: { $search: query } };
  }

  let events = [];
  if (fromCategory) {
    events = await Event.find({
      ...searchQuery,
      category: fromCategory,
    }).sort({ startDate: 1 });
  } else {
    events = await Event.find(searchQuery).sort({ startDate: 1 });
  }

  return res.status(200).json({ count: events.length, events });
}
