-- ============================================================
-- Migration 008 — Additional Flag Questions
-- Brings the Flags pool from 33 to ~58 questions
-- Safe to re-run: uses ON CONFLICT DO NOTHING
-- Run in Supabase Dashboard → SQL Editor
-- ============================================================

INSERT INTO public.questions
  (body, correct_answer, category, difficulty, image_url, wrong_answers, explanation)
VALUES
  (
    'Which country does this flag belong to?',
    'Ukraine',
    'Flags', 2,
    'https://flagcdn.com/w320/ua.png',
    ARRAY['Kazakhstan', 'Palau', 'Sweden'],
    'Ukraine''s flag is two equal horizontal bands — blue on top representing the sky, yellow on the bottom representing wheat fields.'
  ),
  (
    'Which country does this flag belong to?',
    'Israel',
    'Flags', 2,
    'https://flagcdn.com/w320/il.png',
    ARRAY['Greece', 'El Salvador', 'Uruguay'],
    'Israel''s flag features the Star of David (Magen David) in blue on a white field, flanked by two horizontal blue stripes inspired by a Jewish prayer shawl.'
  ),
  (
    'Which country does this flag belong to?',
    'Saudi Arabia',
    'Flags', 2,
    'https://flagcdn.com/w320/sa.png',
    ARRAY['Pakistan', 'Iran', 'Libya'],
    'Saudi Arabia''s green flag bears the Shahada (Islamic declaration of faith) in white Arabic script, with a sword symbolizing justice.'
  ),
  (
    'Which country does this flag belong to?',
    'Pakistan',
    'Flags', 3,
    'https://flagcdn.com/w320/pk.png',
    ARRAY['Saudi Arabia', 'Algeria', 'Mauritania'],
    'Pakistan''s flag has a white crescent and star on dark green, representing Islam. The white vertical stripe on the left represents religious minorities.'
  ),
  (
    'Which country does this flag belong to?',
    'Malaysia',
    'Flags', 3,
    'https://flagcdn.com/w320/my.png',
    ARRAY['Liberia', 'United States', 'Puerto Rico'],
    'Malaysia''s Jalur Gemilang has 14 red and white stripes for the 13 states plus the federal government, with a blue canton bearing a crescent and 14-pointed star.'
  ),
  (
    'Which country does this flag belong to?',
    'Thailand',
    'Flags', 3,
    'https://flagcdn.com/w320/th.png',
    ARRAY['Laos', 'Cambodia', 'Myanmar'],
    'Thailand''s tricolor has five horizontal bands: red-white-blue-white-red. The wide blue center stripe was added by King Vajiravudh to show solidarity with the Allies in WWI.'
  ),
  (
    'Which country does this flag belong to?',
    'Vietnam',
    'Flags', 2,
    'https://flagcdn.com/w320/vn.png',
    ARRAY['China', 'Morocco', 'Burkina Faso'],
    'Vietnam''s flag features a yellow five-pointed star on a red background. The star''s points represent farmers, workers, soldiers, intellectuals, and youth.'
  ),
  (
    'Which country does this flag belong to?',
    'Bangladesh',
    'Flags', 2,
    'https://flagcdn.com/w320/bd.png',
    ARRAY['Japan', 'Palau', 'Georgia'],
    'Bangladesh''s flag has a red disc on a green field. Unlike Japan''s flag, the disc is offset slightly toward the hoist so it appears centered when the flag flies.'
  ),
  (
    'Which country does this flag belong to?',
    'Philippines',
    'Flags', 3,
    'https://flagcdn.com/w320/ph.png',
    ARRAY['Cuba', 'Liberia', 'Puerto Rico'],
    'The Philippine flag has a white equilateral triangle with a golden sun and three stars. Uniquely, the flag is flipped upside-down — red on top — during wartime.'
  ),
  (
    'Which country does this flag belong to?',
    'Egypt',
    'Flags', 3,
    'https://flagcdn.com/w320/eg.png',
    ARRAY['Iraq', 'Syria', 'Yemen'],
    'Egypt''s red-white-black tricolor features the Eagle of Saladin in the center. Iraq and Syria share the same base colors but with different emblems.'
  ),
  (
    'Which country does this flag belong to?',
    'Kenya',
    'Flags', 2,
    'https://flagcdn.com/w320/ke.png',
    ARRAY['Palestine', 'Malawi', 'Papua New Guinea'],
    'Kenya''s flag uses the colors of the KANU party: black, red, and green, separated by white stripes. The center features a Maasai warrior''s shield and two crossed spears.'
  ),
  (
    'Which country does this flag belong to?',
    'Ghana',
    'Flags', 3,
    'https://flagcdn.com/w320/gh.png',
    ARRAY['Ethiopia', 'Cameroon', 'Senegal'],
    'Ghana''s red-gold-green tricolor with a black star was designed in 1957, making it the first African country to adopt the Pan-African colors. The black star symbolizes African freedom.'
  ),
  (
    'Which country does this flag belong to?',
    'Ethiopia',
    'Flags', 3,
    'https://flagcdn.com/w320/et.png',
    ARRAY['Ghana', 'Mali', 'Bolivia'],
    'Ethiopia''s flag uses the Pan-African green-yellow-red colors with a blue disc and yellow star added in 1996. Ethiopia originated these colors, which were later adopted by many African nations.'
  ),
  (
    'Which country does this flag belong to?',
    'Morocco',
    'Flags', 3,
    'https://flagcdn.com/w320/ma.png',
    ARRAY['Tunisia', 'Jordan', 'Libya'],
    'Morocco''s red flag features a green Seal of Solomon — a five-pointed star known as the Pentagram of Solomon — representing the royal dynasty''s connection to the Prophet Muhammad.'
  ),
  (
    'Which country does this flag belong to?',
    'Cuba',
    'Flags', 3,
    'https://flagcdn.com/w320/cu.png',
    ARRAY['Chile', 'Liberia', 'Puerto Rico'],
    'Cuba''s flag has five alternating blue and white stripes with a red equilateral triangle bearing a white star. Puerto Rico''s flag uses the same elements with reversed colors.'
  ),
  (
    'Which country does this flag belong to?',
    'Colombia',
    'Flags', 3,
    'https://flagcdn.com/w320/co.png',
    ARRAY['Ecuador', 'Venezuela', 'Chad'],
    'Colombia''s yellow-blue-red tricolor uses a wider yellow top stripe representing gold. Ecuador and Venezuela use the same three colors but with different proportions and emblems.'
  ),
  (
    'Which country does this flag belong to?',
    'Chile',
    'Flags', 3,
    'https://flagcdn.com/w320/cl.png',
    ARRAY['Cuba', 'Texas', 'Liberia'],
    'Chile''s flag has a blue canton with a white five-pointed star, and two horizontal bands — white and red. The star is called La Estrella Solitaria (The Lone Star).'
  ),
  (
    'Which country does this flag belong to?',
    'Finland',
    'Flags', 3,
    'https://flagcdn.com/w320/fi.png',
    ARRAY['Sweden', 'Iceland', 'Greece'],
    'Finland''s flag has a blue Nordic cross on white. While Sweden''s cross is yellow on blue, Finland''s cross uses the blue of its many lakes against the white of its winter snow.'
  ),
  (
    'Which country does this flag belong to?',
    'Hungary',
    'Flags', 4,
    'https://flagcdn.com/w320/hu.png',
    ARRAY['Bulgaria', 'Italy', 'Tajikistan'],
    'Hungary''s red-white-green horizontal tricolor dates to the 1848 revolution. It shares these colors with Italy but is oriented horizontally rather than vertically.'
  ),
  (
    'Which country does this flag belong to?',
    'Romania',
    'Flags', 4,
    'https://flagcdn.com/w320/ro.png',
    ARRAY['Chad', 'Andorra', 'Moldova'],
    'Romania''s blue-yellow-red vertical tricolor is nearly identical to Chad''s flag — the only difference is a very slight variation in the shade of blue, nearly indistinguishable.'
  ),
  (
    'Which country does this flag belong to?',
    'Iceland',
    'Flags', 4,
    'https://flagcdn.com/w320/is.png',
    ARRAY['Norway', 'Faroe Islands', 'Denmark'],
    'Iceland''s flag is the inverse of Norway''s — a red cross outlined in white on a dark blue background. Both use the Nordic cross design, offset to the left.'
  ),
  (
    'Which country does this flag belong to?',
    'Nepal',
    'Flags', 2,
    'https://flagcdn.com/w320/np.png',
    ARRAY['Bhutan', 'Sri Lanka', 'Maldives'],
    'Nepal has the only non-rectangular national flag in the world — a double-pennant shape formed by two stacked triangles. It features the moon, sun, and the Himalayan colors of crimson and blue.'
  ),
  (
    'Which country does this flag belong to?',
    'Qatar',
    'Flags', 3,
    'https://flagcdn.com/w320/qa.png',
    ARRAY['Bahrain', 'UAE', 'Kuwait'],
    'Qatar''s flag has a wide maroon section and a narrower white band separated by a serrated edge with nine points. Bahrain uses a similar design but with red and fewer points.'
  ),
  (
    'Which country does this flag belong to?',
    'United Arab Emirates',
    'Flags', 3,
    'https://flagcdn.com/w320/ae.png',
    ARRAY['Jordan', 'Kuwait', 'Oman'],
    'The UAE flag has a vertical red stripe on the left with three equal horizontal bands of green, white, and black — the Pan-Arab colors — extending to the right.'
  ),
  (
    'Which country does this flag belong to?',
    'Czech Republic',
    'Flags', 3,
    'https://flagcdn.com/w320/cz.png',
    ARRAY['Slovakia', 'Poland', 'Croatia'],
    'The Czech flag has white and red horizontal stripes with a blue triangle on the hoist. Slovakia''s flag is similar — white-blue-red — but without the triangle and with a coat of arms.'
  ),
  (
    'Which country does this flag belong to?',
    'Tanzania',
    'Flags', 3,
    'https://flagcdn.com/w320/tz.png',
    ARRAY['Zimbabwe', 'Uganda', 'Congo'],
    'Tanzania''s flag has a diagonal black stripe edged in yellow running from lower-left to upper-right, dividing the flag into a green upper-left and blue lower-right triangle.'
  )
ON CONFLICT DO NOTHING;
