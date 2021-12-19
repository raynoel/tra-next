//--------------------------
// GET selon son 'slug'
// Appel -> http://localhost:3000/api/events/throwback-thursdays-with-dj-manny-duke
const { events } = require('./data.json')

export default (req, res) => {
  const event = events.filter(e => e.slug === req.query.slug)
  if (req.method === 'GET') {
    res.status(200).json(event)
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).json({ message: `Method ${req.method} is not allowed`})
  }
}