-- Content that was hard-coded in the components before the admin dashboard
-- managed it: hero offer posters, the gallery, Google reviews and the class
-- timetable. Images point at files already in /public.

INSERT INTO "offer_posters" ("image_url", "width", "height", "alt", "sort_order") VALUES
  ('/offers/teacher-training-200.jpg', 1024, 1536, '200-Hour Yoga Teacher Training starting October — 50% discount offer, course fee ₹27,500 (was ₹55,000). Limited seats.', 0),
  ('/offers/dussehra-annual.jpg', 900, 1600, 'Dussehra special offer — 40% off the annual package, now ₹12,000 (was ₹20,000). Valid till Dussehra, limited seats.', 1);
--> statement-breakpoint

INSERT INTO "gallery_photos" ("image_url", "width", "height", "caption", "sort_order") VALUES
  ('/gallery/01-community.jpg', 1318, 1400, 'The Arambha family, after aerial practice', 0),
  ('/gallery/02-namaste.jpg', 1067, 1400, 'Beginning together at the mandala wall', 1),
  ('/gallery/03-seniors.jpg', 1290, 1400, 'Yoga at every age — special classes for seniors', 2),
  ('/gallery/04-mat-practice.jpg', 1147, 1400, 'Guided mat practice', 3),
  ('/gallery/05-partner.jpg', 1053, 1400, 'Partner practice, side by side', 4),
  ('/gallery/06-stick-yoga.jpg', 1058, 1400, 'Stick Yoga — building posture and symmetry', 5),
  ('/gallery/07-aerial-guided.jpg', 1048, 1400, 'Aerial inversions, safely guided', 6),
  ('/gallery/08-acro.jpg', 1400, 927, 'Acro Yoga — trust and balance', 7),
  ('/gallery/09-aerial-inversion.jpg', 1053, 1400, 'Finding weightlessness in the silks', 8),
  ('/gallery/10-aerial-headstand.jpg', 1048, 1400, 'Aerial headstand practice', 9),
  ('/gallery/11-sirsasana.jpg', 1053, 1400, 'Sirsasana at the mandala wall', 10),
  ('/gallery/12-aerial-backbend.jpg', 637, 1400, 'Opening the spine in the hammock', 11),
  ('/gallery/13-graduation.jpg', 1048, 1400, 'Teacher training graduation day', 12),
  ('/gallery/14-headstand-class.jpg', 1048, 1400, 'Learning by watching', 13),
  ('/gallery/15-aerial-blue.jpg', 705, 1400, 'Upside down, wide awake', 14),
  ('/gallery/16-cycling.jpg', 1400, 1048, 'Beyond the mat — a community ride', 15);
--> statement-breakpoint

INSERT INTO "testimonials" ("name", "context", "quote", "sort_order") VALUES
  ('Sandeepa Kasaraneni', 'Beginner', 'I joined Arambha Yoga & Wellness as a beginner. I''m blown away by Giri sir''s yoga training! He brings a fresh vibe to every session, and his encouragement to push past our limits is just what is needed. I was skeptical at first, thinking yoga was all about slow movements, but he''s shown me that it''s actually about growth through challenge. As a newbie, I still get stuck in some poses, but his no-pressure approach keeps me coming back for more. Now, I''m hooked on his morning classes — they''re the perfect way to kickstart my day! Highly recommend to have positive energy in you!', 0),
  ('Bhargavi Boppana', '', 'I have been training at Arambha Yoga Studio for the past 20 days, and it has been such a positive experience. Giri Sir is extremely patient and gives individual attention to everyone, carefully correcting our posture and form.', 1),
  ('Shravya Anchuru', 'Postnatal practice', 'I joined Arambha Yoga & Wellness during my postpartum, and it has truly made a positive difference in my recovery and overall lifestyle. Under the guidance of Giri Sir, I''ve experienced a wonderful improvement in strength, flexibility, and mental well-being. The sessions are thoughtfully planned, focusing on gentle yet effective practices that suit every individual''s pace. Giri Sir''s patience, knowledge, and personalized attention have helped me rebuild my confidence and energy after delivery. I feel more balanced, calm, and active now — and yoga has become an important part of my daily life. Highly recommended to all new moms and anyone seeking mindful wellness.', 2),
  ('Ravi L', '', 'I am having an amazing experience at Arambha Yoga & Wellness! From the moment I walked in, I felt a beautiful sense of calm and care. A special thanks to Yoga guru Mr. Giri.', 3),
  ('Padmaja Doddi', '9 months practising', 'It''s more than 9 months I''m taking classes provided by Giri sir and they''re really commendable and worth it — it makes me motivated to come on my mat and go for classes regularly. When a guru puts his efforts, why not the student too? That''s what made me push my boundaries and be regular to his classes. The best part about the classes here is the unique workout format, so well designed that it never makes you feel bored. Thank you sir for motivating me to come for classes regularly — I genuinely feel like I''m giving 1 hr daily in my life to myself with no regrets.', 4),
  ('Gopinath Samal', 'Beginner', 'As a beginner, I had a wonderful learning experience. The instructors are knowledgeable, patient, and supportive, creating a comfortable environment to learn and grow. I highly recommend this institution to anyone beginning their yoga journey.', 5),
  ('Sarbani Bhattacharjee', 'Beginner', 'Training with Mr. Giri has truly changed my view of yoga. He brings something new to every session and pushes us just enough to step out of our comfort zone. I used to think yoga was slow, but he showed me that real progress comes when you challenge yourself. As a beginner, I still struggle with some postures, but he encourages me to keep trying without pressure. I now look forward to my morning classes so much that I travel every day from Financial District to Arambha just to attend. Truly worth it! Highly recommended!', 6),
  ('Manish', '', 'I joined Arambha Yoga & Wellness just a month ago, and I already can''t imagine my mornings without it. From day one, the environment felt calm, welcoming, and completely judgment-free.', 7),
  ('Rohit Kashyap', '', 'I joined Arambha for best teachers and flexible timing. The flexible timing at Arambha is perfect for my unpredictable work schedule. They offer early morning, evening, and weekend sessions.', 8),
  ('Satya Chaitanya', 'Local Guide', 'I joined a month ago and it has been a wonderful experience. The instructor is really good, using a beautiful combination of Hatha, Vinyasa, Ashtanga-Power, and Restorative yoga.', 9);
--> statement-breakpoint

-- No Sunday rows: Sunday is closed.
INSERT INTO "class_slots" ("day_type", "time") VALUES
  ('weekday', '05:30'),
  ('weekday', '06:30'),
  ('weekday', '07:30'),
  ('weekday', '08:30'),
  ('weekday', '17:00'),
  ('weekday', '18:00'),
  ('saturday', '07:30');
