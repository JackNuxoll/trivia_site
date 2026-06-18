-- ============================================================
-- Migration 001 — Flag Quiz
-- Run in Supabase Dashboard → SQL Editor
-- Safe to re-run: uses ADD COLUMN IF NOT EXISTS + ON CONFLICT DO NOTHING
-- ============================================================

-- Extend questions table with columns needed for flag (and future) quizzes
ALTER TABLE public.questions
  ADD COLUMN IF NOT EXISTS image_url     text,
  ADD COLUMN IF NOT EXISTS wrong_answers text[],
  ADD COLUMN IF NOT EXISTS explanation   text;

-- Allow anonymous (public) read access to questions.
-- Without this, RLS silently returns 0 rows to unauthenticated users.
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "questions: public read" ON public.questions;
CREATE POLICY "questions: public read" ON public.questions
  FOR SELECT USING (true);

-- ── Seed flag questions ───────────────────────────────────────────────────────
-- 33 flags → random 10 are picked each session client-side
INSERT INTO public.questions
  (body, correct_answer, category, difficulty, image_url, wrong_answers, explanation)
VALUES
  (
    'Which country does this flag belong to?',
    'United States',
    'Flags', 2,
    'https://flagcdn.com/w320/us.png',
    ARRAY['Liberia', 'Malaysia', 'Togo'],
    'The US flag has 13 stripes for the 13 original colonies and 50 stars for each state.'
  ),
  (
    'Which country does this flag belong to?',
    'United Kingdom',
    'Flags', 2,
    'https://flagcdn.com/w320/gb.png',
    ARRAY['Australia', 'New Zealand', 'Fiji'],
    'The Union Jack combines the crosses of St George (England), St Andrew (Scotland), and St Patrick (Ireland).'
  ),
  (
    'Which country does this flag belong to?',
    'France',
    'Flags', 3,
    'https://flagcdn.com/w320/fr.png',
    ARRAY['Chad', 'Ireland', 'Romania'],
    'The French tricolor dates from the Revolution of 1789. Chad''s flag is nearly identical — only the blue shades differ slightly.'
  ),
  (
    'Which country does this flag belong to?',
    'Germany',
    'Flags', 2,
    'https://flagcdn.com/w320/de.png',
    ARRAY['Belgium', 'Yemen', 'Uganda'],
    'The German black-red-gold flag represents colors of the Holy Roman Empire and was the banner of the 1848 revolutionaries.'
  ),
  (
    'Which country does this flag belong to?',
    'Japan',
    'Flags', 1,
    'https://flagcdn.com/w320/jp.png',
    ARRAY['Bangladesh', 'Georgia', 'Palau'],
    'The Hinomaru features a red disc on white representing the rising sun — Japan is called the Land of the Rising Sun.'
  ),
  (
    'Which country does this flag belong to?',
    'China',
    'Flags', 2,
    'https://flagcdn.com/w320/cn.png',
    ARRAY['Vietnam', 'North Korea', 'Morocco'],
    'The red flag has one large star for the Communist Party and four smaller stars representing the social classes united under it.'
  ),
  (
    'Which country does this flag belong to?',
    'Brazil',
    'Flags', 2,
    'https://flagcdn.com/w320/br.png',
    ARRAY['Portugal', 'Colombia', 'Ecuador'],
    'The Brazilian flag features a green field, yellow rhombus, and a celestial globe showing the night sky over Rio de Janeiro on Independence Day 1889.'
  ),
  (
    'Which country does this flag belong to?',
    'India',
    'Flags', 3,
    'https://flagcdn.com/w320/in.png',
    ARRAY['Niger', 'Ivory Coast', 'Ireland'],
    'The Indian tricolor uses saffron (courage), white (peace), and green (faith). The Ashoka Chakra in the center has 24 spokes.'
  ),
  (
    'Which country does this flag belong to?',
    'Italy',
    'Flags', 3,
    'https://flagcdn.com/w320/it.png',
    ARRAY['Ireland', 'Mexico', 'Hungary'],
    'The Italian green-white-red tricolor was inspired by the French flag during the Napoleonic wars. Ireland''s flag is similar but uses orange instead of red.'
  ),
  (
    'Which country does this flag belong to?',
    'Spain',
    'Flags', 3,
    'https://flagcdn.com/w320/es.png',
    ARRAY['Peru', 'Andorra', 'Bolivia'],
    'The Spanish flag has a wider yellow central band than other tricolors, plus the royal coat of arms. Peru and Bolivia use similar red-and-yellow colors.'
  ),
  (
    'Which country does this flag belong to?',
    'Australia',
    'Flags', 3,
    'https://flagcdn.com/w320/au.png',
    ARRAY['New Zealand', 'Fiji', 'Tuvalu'],
    'The Australian flag shows the Union Jack, a seven-pointed Commonwealth Star, and the Southern Cross constellation on a blue background.'
  ),
  (
    'Which country does this flag belong to?',
    'Canada',
    'Flags', 1,
    'https://flagcdn.com/w320/ca.png',
    ARRAY['Peru', 'Denmark', 'Tonga'],
    'The Canadian maple leaf flag was adopted in 1965 after a heated national debate to replace a design that included the British Union Jack.'
  ),
  (
    'Which country does this flag belong to?',
    'Mexico',
    'Flags', 3,
    'https://flagcdn.com/w320/mx.png',
    ARRAY['Italy', 'Hungary', 'Nigeria'],
    'The Mexican flag has the same green-white-red colors as Italy but features the Aztec coat of arms: an eagle holding a snake on a cactus.'
  ),
  (
    'Which country does this flag belong to?',
    'Russia',
    'Flags', 3,
    'https://flagcdn.com/w320/ru.png',
    ARRAY['Slovakia', 'Slovenia', 'Serbia'],
    'The Russian white-blue-red tricolor dates from Peter the Great, who modeled it after the Dutch flag. Slovakia, Slovenia, and Serbia have very similar designs.'
  ),
  (
    'Which country does this flag belong to?',
    'South Africa',
    'Flags', 2,
    'https://flagcdn.com/w320/za.png',
    ARRAY['Zimbabwe', 'Zambia', 'Jamaica'],
    'South Africa''s unique six-color flag was designed in 1994 to represent the unity of diverse peoples after the end of apartheid.'
  ),
  (
    'Which country does this flag belong to?',
    'Sweden',
    'Flags', 3,
    'https://flagcdn.com/w320/se.png',
    ARRAY['Norway', 'Denmark', 'Finland'],
    'The Swedish flag uses the Nordic cross design with the cross offset to the left. The yellow cross on blue is distinct from Norway''s and Denmark''s red designs.'
  ),
  (
    'Which country does this flag belong to?',
    'Switzerland',
    'Flags', 3,
    'https://flagcdn.com/w320/ch.png',
    ARRAY['Georgia', 'Tonga', 'Malta'],
    'The Swiss flag is one of only two square national flags (the other is Vatican City). Georgia''s flag also has a white cross on red — but reversed colors.'
  ),
  (
    'Which country does this flag belong to?',
    'Norway',
    'Flags', 4,
    'https://flagcdn.com/w320/no.png',
    ARRAY['Iceland', 'Denmark', 'Faroe Islands'],
    'The Norwegian flag has the Nordic cross in blue outlined in white on a red background. Iceland uses the same design but with reversed colors.'
  ),
  (
    'Which country does this flag belong to?',
    'Denmark',
    'Flags', 3,
    'https://flagcdn.com/w320/dk.png',
    ARRAY['Switzerland', 'Norway', 'Iceland'],
    'The Dannebrog is the oldest national flag still in use, dating to the 13th century. It influenced all other Nordic country flags.'
  ),
  (
    'Which country does this flag belong to?',
    'Netherlands',
    'Flags', 4,
    'https://flagcdn.com/w320/nl.png',
    ARRAY['Luxembourg', 'France', 'Croatia'],
    'The Dutch red-white-blue tricolor (originally orange) directly influenced flags from France to Russia. Luxembourg''s flag uses a lighter shade of blue.'
  ),
  (
    'Which country does this flag belong to?',
    'South Korea',
    'Flags', 2,
    'https://flagcdn.com/w320/kr.png',
    ARRAY['China', 'Japan', 'Taiwan'],
    'The Taegukgi features a red-blue yin-yang symbol and four trigrams at the corners, representing sky, water, earth, and fire.'
  ),
  (
    'Which country does this flag belong to?',
    'Argentina',
    'Flags', 2,
    'https://flagcdn.com/w320/ar.png',
    ARRAY['Uruguay', 'Guatemala', 'El Salvador'],
    'The Argentinian flag features the Sol de Mayo — a sun with 32 alternating straight and wavy rays — commemorating the May Revolution of 1810.'
  ),
  (
    'Which country does this flag belong to?',
    'Turkey',
    'Flags', 3,
    'https://flagcdn.com/w320/tr.png',
    ARRAY['Tunisia', 'Azerbaijan', 'Pakistan'],
    'The Turkish red flag with crescent and star has roots in the Ottoman Empire. Tunisia, Azerbaijan, and Pakistan use similar crescent symbols.'
  ),
  (
    'Which country does this flag belong to?',
    'Portugal',
    'Flags', 3,
    'https://flagcdn.com/w320/pt.png',
    ARRAY['Brazil', 'Spain', 'Cameroon'],
    'The Portuguese flag uses a green-red vertical design with the national coat of arms. Brazil also uses green and red but in a very different layout.'
  ),
  (
    'Which country does this flag belong to?',
    'Poland',
    'Flags', 4,
    'https://flagcdn.com/w320/pl.png',
    ARRAY['Indonesia', 'Monaco', 'Singapore'],
    'Poland''s flag is white over red. Indonesia''s is the exact reverse — red over white. Monaco and Singapore are also red-over-white without the full width.'
  ),
  (
    'Which country does this flag belong to?',
    'Greece',
    'Flags', 3,
    'https://flagcdn.com/w320/gr.png',
    ARRAY['Uruguay', 'Honduras', 'El Salvador'],
    'The Greek flag has nine blue and white stripes representing the nine syllables of the phrase Eleftheria i Thanatos — Freedom or Death.'
  ),
  (
    'Which country does this flag belong to?',
    'Singapore',
    'Flags', 3,
    'https://flagcdn.com/w320/sg.png',
    ARRAY['South Korea', 'Tunisia', 'Malaysia'],
    'Singapore''s flag has a crescent moon (a young nation on the rise) and five stars representing democracy, peace, progress, justice, and equality.'
  ),
  (
    'Which country does this flag belong to?',
    'New Zealand',
    'Flags', 4,
    'https://flagcdn.com/w320/nz.png',
    ARRAY['Australia', 'Fiji', 'Tuvalu'],
    'New Zealand''s flag is often confused with Australia''s. The key difference is four red stars (New Zealand) vs. six white stars (Australia) in the Southern Cross.'
  ),
  (
    'Which country does this flag belong to?',
    'Nigeria',
    'Flags', 3,
    'https://flagcdn.com/w320/ng.png',
    ARRAY['Ireland', 'Ivory Coast', 'Saudi Arabia'],
    'Nigeria''s simple green-white-green design represents the country''s lush forests and natural wealth, with white symbolizing peace.'
  ),
  (
    'Which country does this flag belong to?',
    'Belgium',
    'Flags', 3,
    'https://flagcdn.com/w320/be.png',
    ARRAY['Germany', 'Mali', 'Guinea'],
    'The Belgian black-yellow-red vertical tricolor takes its colors from the coat of arms of the Duchy of Brabant. Germany uses the same colors but horizontally.'
  ),
  (
    'Which country does this flag belong to?',
    'Austria',
    'Flags', 3,
    'https://flagcdn.com/w320/at.png',
    ARRAY['Latvia', 'Georgia', 'Poland'],
    'Austria''s red-white-red flag is one of the oldest national flags, with legend dating its origin to a 1191 crusade battle where Duke Leopold''s coat was soaked in blood.'
  ),
  (
    'Which country does this flag belong to?',
    'Indonesia',
    'Flags', 4,
    'https://flagcdn.com/w320/id.png',
    ARRAY['Poland', 'Monaco', 'Singapore'],
    'Indonesia''s red-over-white Sang Saka Merah-Putih symbolizes the physical (red) and spiritual (white) aspects of life. Poland''s flag is the identical design — inverted.'
  ),
  (
    'Which country does this flag belong to?',
    'Ireland',
    'Flags', 4,
    'https://flagcdn.com/w320/ie.png',
    ARRAY['Ivory Coast', 'India', 'Niger'],
    'Ireland''s green-white-orange tricolor represents Irish Catholics (green), Protestants (orange), and the peace between them (white). Ivory Coast''s flag is the reverse.'
  )
ON CONFLICT DO NOTHING;
