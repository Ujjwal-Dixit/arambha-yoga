-- The promotions that were hard-coded in components/Promotions.tsx before the
-- admin dashboard existed. End dates match each card's own text, so offers
-- that have already passed arrive as "expired" rather than going live again.
INSERT INTO "promotions"
  ("tag", "tag_color", "title", "description", "date_text", "time_text", "icon", "highlight", "starts_on", "ends_on", "sort_order")
VALUES
  ('New Batch', 'sage', 'Morning Flow — May Batch',
   '4-week Hatha & Pranayama batch starting May 5th. All levels welcome. Limited seats.',
   'Starts May 5, 2026', '6:30 AM – 7:30 AM', '🌅', true, NULL, '2026-05-05', 0),
  ('Workshop', 'earth', 'Aerial Yoga Weekend',
   'Two-day beginner-friendly aerial workshop. All equipment provided.',
   'May 10 – 11, 2026', '8:30 AM – 11:00 AM', '🪢', false, NULL, '2026-05-11', 1),
  ('Special Offer', 'forest', 'First Class Free',
   'New to Arambha? Your first class is on us. No commitment required.',
   'Ongoing', 'Any available slot', '🎁', false, NULL, NULL, 2),
  ('Early Bird', 'amber', '15% Off — April Enrolments',
   'Enrol in any batch before April 30 and save 15% on your monthly fee.',
   'Ends April 30, 2026', 'All batches', '⏰', false, NULL, '2026-04-30', 3);
