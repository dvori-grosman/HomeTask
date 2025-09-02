export async function selectTrailer(req, res, next) {
  try {
    const t = ensureDate(req.query.time || new Date());
    const trailer = await TravelTrailer.find({ available_from: { $gte: t } })
      .sort({ available_from: 1 })
      .limit(1);

    if (!trailer.length) return res.status(404).json({ message: 'לא נמצאה ניידת זמינה בזמן המבוקש' });
    res.json(trailer[0]);
  } catch (e) {
    next(e);
  }
}

// Optional helper: list all trailers
export async function listTrailers(req, res, next) {
  try {
    const trailers = await TravelTrailer.find().sort({ available_from: 1 });
    res.json(trailers);
  } catch (e) {
    next(e);
  }
}