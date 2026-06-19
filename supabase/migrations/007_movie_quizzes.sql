-- ============================================================
-- Migration 007 — Movie Quizzes
-- Adds: Academy Awards, Movie Quotes, Movie Villains
-- Safe to re-run: uses ON CONFLICT DO NOTHING
-- Run in Supabase Dashboard → SQL Editor
-- ============================================================

-- ── Academy Awards (12 questions, difficulty 2 = Medium) ─────────────────────
INSERT INTO public.questions (body, correct_answer, category, difficulty, wrong_answers, explanation)
VALUES

('Which film became the first non-English language film to win Best Picture at the Academy Awards?',
 'Parasite (2019)', 'Academy Awards', 2,
 ARRAY['Roma (2018)', 'Amour (2012)', 'Life Is Beautiful (1997)'],
 'Bong Joon-ho''s Parasite made history at the 2020 ceremony, winning Best Picture, Best Director, Best Original Screenplay, and Best International Feature Film.'),

('Which actress holds the record for the most Academy Award acting wins, with four awards?',
 'Katharine Hepburn', 'Academy Awards', 2,
 ARRAY['Meryl Streep', 'Cate Blanchett', 'Ingrid Bergman'],
 'Katharine Hepburn won Best Actress four times — for Morning Glory (1933), Guess Who''s Coming to Dinner (1967), The Lion in Winter (1968), and On Golden Pond (1981).'),

('Which 1991 film became only the third in history to win all five major Oscars: Picture, Director, Actor, Actress, and Screenplay?',
 'The Silence of the Lambs', 'Academy Awards', 2,
 ARRAY['Schindler''s List', 'American Beauty', 'Forrest Gump'],
 'The Silence of the Lambs joined It Happened One Night (1934) and One Flew Over the Cuckoo''s Nest (1975) as the only films to sweep the "Big Five" Oscar categories.'),

('Which 2003 film won all 11 of its Academy Award nominations, setting a record for a perfect sweep?',
 'The Lord of the Rings: The Return of the King', 'Academy Awards', 2,
 ARRAY['Chicago', 'Gladiator', 'Master and Commander'],
 'The Return of the King''s 11-win perfect sweep matched the all-time win record set by Ben-Hur (1959) and Titanic (1997), but no film before it had won every single one of its nominations.'),

('How many Academy Awards did "Everything Everywhere All at Once" win at the 2023 ceremony?',
 '7', 'Academy Awards', 2,
 ARRAY['4', '5', '9'],
 'The film swept the night, winning Best Picture, Best Director, Best Actress (Michelle Yeoh), Best Supporting Actor, Best Supporting Actress, Best Original Screenplay, and Best Film Editing.'),

('At 21 years old, who became the youngest Best Actress winner in Academy Award history for "Children of a Lesser God" (1987)?',
 'Marlee Matlin', 'Academy Awards', 2,
 ARRAY['Jodie Foster', 'Hilary Swank', 'Halle Berry'],
 'Marlee Matlin remains the youngest Best Actress winner ever. She is also the only deaf performer to have won an acting Oscar.'),

('Beauty and the Beast (1991) made Oscar history by becoming the first animated film nominated for which major award?',
 'Best Picture', 'Academy Awards', 2,
 ARRAY['Best Animated Feature', 'Best Visual Effects', 'Best Director'],
 'Before the Academy introduced the Best Animated Feature category in 2002, animated films rarely received major nominations. Beauty and the Beast broke the barrier with a Best Picture nod.'),

('Which film was incorrectly announced as Best Picture winner at the 2017 ceremony before the mistake was corrected live on stage?',
 'La La Land', 'Academy Awards', 2,
 ARRAY['Moonlight', 'Manchester by the Sea', 'Arrival'],
 'La La Land''s producers were mid-speech when it was revealed that Moonlight had actually won. The PricewaterhouseCoopers accountant had handed the wrong envelope to the presenters.'),

('Which director has won the most Academy Awards for Best Director, with four wins?',
 'John Ford', 'Academy Awards', 2,
 ARRAY['Steven Spielberg', 'Martin Scorsese', 'Woody Allen'],
 'John Ford won Best Director for The Informer (1935), The Grapes of Wrath (1940), How Green Was My Valley (1941), and The Quiet Man (1952).'),

('"Schindler''s List" (1993) won how many Academy Awards, including Best Picture and Best Director for Steven Spielberg?',
 '7', 'Academy Awards', 2,
 ARRAY['5', '9', '11'],
 'Schindler''s List won 7 of its 12 nominations, including Best Picture, Best Director, Best Adapted Screenplay, Best Cinematography, Best Film Editing, Best Art Direction, and Best Original Score.'),

('Which film made history as the first sequel ever to win the Academy Award for Best Picture?',
 'The Godfather Part II (1974)', 'Academy Awards', 2,
 ARRAY['The Lord of the Rings: The Return of the King', 'Aliens', 'Star Wars: The Empire Strikes Back'],
 'The Godfather Part II won 6 Oscars including Best Picture, making Francis Ford Coppola the first director to win for a sequel. It remains one of the rare sequels considered superior to the original.'),

('Halle Berry became the first Black woman to win the Academy Award for Best Actress. Which 2001 film earned her that historic win?',
 'Monster''s Ball', 'Academy Awards', 2,
 ARRAY['Losing Isaiah', 'Boomerang', 'Their Eyes Were Watching God'],
 'Halle Berry''s emotional acceptance speech at the 2002 ceremony acknowledged the groundbreaking nature of the win, dedicating it to every nameless, faceless woman of color who had come before her.');

-- ── Movie Quotes (12 questions, difficulty 1 = Easy) ──────────────────────────
INSERT INTO public.questions (body, correct_answer, category, difficulty, wrong_answers, explanation)
VALUES

('"Here''s looking at you, kid." This classic line is from which 1942 film?',
 'Casablanca', 'Movie Quotes', 1,
 ARRAY['Gone with the Wind', 'The African Queen', 'Key Largo'],
 'Humphrey Bogart''s Rick Blaine says this to Ingrid Bergman''s Ilsa four times throughout Casablanca. It was voted the 5th greatest movie quote of all time by the American Film Institute.'),

('"You can''t handle the truth!" is a famous courtroom outburst from which 1992 film?',
 'A Few Good Men', 'Movie Quotes', 1,
 ARRAY['The Firm', 'Philadelphia', 'The Pelican Brief'],
 'Jack Nicholson delivers this line as Colonel Jessup during his explosive cross-examination by Tom Cruise''s Lt. Kaffee. It ranked #29 on the AFI''s list of greatest movie quotes.'),

('"I''ll be back." This line is most famously from which 1984 science-fiction film?',
 'The Terminator', 'Movie Quotes', 1,
 ARRAY['Predator', 'Total Recall', 'Commando'],
 'Arnold Schwarzenegger''s T-800 says this to a police desk sergeant before driving a car through the station. The line became one of the most quoted in film history, ranked #37 by the AFI.'),

('"To infinity and beyond!" is the signature catchphrase of which character in Toy Story (1995)?',
 'Buzz Lightyear', 'Movie Quotes', 1,
 ARRAY['Woody', 'Rex', 'Mr. Potato Head'],
 'Space ranger Buzz Lightyear, voiced by Tim Allen, uses this phrase to express his belief that he is a real space ranger who can fly. The line became an iconic part of pop culture.'),

('"Life is like a box of chocolates, you never know what you''re gonna get." This quote is from which 1994 film?',
 'Forrest Gump', 'Movie Quotes', 1,
 ARRAY['Big', 'Cast Away', 'Philadelphia'],
 'Tom Hanks delivers this line as Forrest Gump, attributing the wisdom to his mother (Sally Field). It was ranked #40 on the AFI''s 100 greatest movie quotes list.'),

('"May the Force be with you" first appeared in which Star Wars film?',
 'Star Wars: A New Hope (1977)', 'Movie Quotes', 1,
 ARRAY['The Empire Strikes Back', 'Return of the Jedi', 'The Phantom Menace'],
 'The phrase first appears when General Dodonna tells the rebel pilots this before the Death Star assault. It has since become one of the most recognizable phrases in film history.'),

('"You talking to me?" is a line Robert De Niro largely improvised in which Martin Scorsese film?',
 'Taxi Driver (1976)', 'Movie Quotes', 1,
 ARRAY['Raging Bull', 'GoodFellas', 'Mean Streets'],
 'Travis Bickle''s mirror monologue was largely improvised by De Niro. The script simply said "Travis speaks to himself in the mirror." It ranked #10 on the AFI''s greatest quotes list.'),

('"I am your father." In which film does this iconic twist appear?',
 'The Empire Strikes Back (1980)', 'Movie Quotes', 1,
 ARRAY['Return of the Jedi', 'Star Wars: A New Hope', 'Revenge of the Sith'],
 'Darth Vader reveals this to Luke Skywalker during their duel on Cloud City. The secret was kept even from the cast — the version filmed on set had Vader say "Obi-Wan killed your father."'),

('"There''s no place like home." Dorothy repeats this three times while clicking her heels in which classic film?',
 'The Wizard of Oz (1939)', 'Movie Quotes', 1,
 ARRAY['Gone with the Wind', 'It''s a Wonderful Life', 'Rebecca'],
 'Judy Garland''s Dorothy says this while clicking her ruby slippers together, guided by Glinda the Good Witch. The line ranked #23 on the AFI''s 100 greatest movie quotes.'),

('"Get busy living, or get busy dying." This line is spoken by Andy Dufresne in which Stephen King adaptation?',
 'The Shawshank Redemption (1994)', 'Movie Quotes', 1,
 ARRAY['The Green Mile', 'Stand by Me', 'Misery'],
 'Andy (Tim Robbins) writes this in a letter to Red (Morgan Freeman) after escaping Shawshank prison. The film, initially a box-office disappointment, became one of the most beloved movies of all time.'),

('"I see dead people." This chilling line is from which 1999 M. Night Shyamalan film?',
 'The Sixth Sense', 'Movie Quotes', 1,
 ARRAY['Stir of Echoes', 'What Lies Beneath', 'The Others'],
 'Haley Joel Osment delivers this line as Cole Sear in a whispered conversation with child psychologist Malcolm Crowe (Bruce Willis). The film''s twist ending recontextualizes every scene.'),

('"Why so serious?" is a recurring taunt from which character in The Dark Knight (2008)?',
 'The Joker', 'Movie Quotes', 1,
 ARRAY['Batman', 'Harvey Dent', 'Alfred Pennyworth'],
 'Heath Ledger''s Joker uses this phrase while telling his "wanna know how I got these scars?" story. Ledger won a posthumous Oscar for the role, and the line became one of the most quoted of the 2000s.');

-- ── Movie Villains (12 questions, difficulty 3 = Hard) ───────────────────────
INSERT INTO public.questions (body, correct_answer, category, difficulty, wrong_answers, explanation)
VALUES

('Which actor won a posthumous Academy Award for Best Supporting Actor for his portrayal of the Joker in "The Dark Knight" (2008)?',
 'Heath Ledger', 'Movie Villains', 3,
 ARRAY['Jack Nicholson', 'Jared Leto', 'Joaquin Phoenix'],
 'Heath Ledger died in January 2008 before the film''s release. His transformative, method performance — including the voice, mannerisms, and psychology he developed in isolation — remains one of cinema''s most acclaimed villain portrayals.'),

('Who provided the voice of Darth Vader in the original Star Wars trilogy, while David Prowse portrayed him physically?',
 'James Earl Jones', 'Movie Villains', 3,
 ARRAY['Frank Oz', 'Peter Cushing', 'Christopher Lee'],
 'James Earl Jones''s deep, resonant voice gave Darth Vader his imposing presence. His contribution was uncredited in the original 1977 film at his own request, though he received credit in later films.'),

('In "No Country for Old Men" (2007), Anton Chigurh''s unusual and terrifying weapon of choice is a:',
 'Captive bolt pistol', 'Movie Villains', 3,
 ARRAY['Crossbow', 'Silenced rifle', 'Throwing knife'],
 'The captive bolt pistol — typically used in slaughterhouses to stun livestock — is used by Chigurh to blow out door locks and kill victims. It reinforces his cold, mechanical approach to killing.'),

('Which fictional villain is associated with the address 1428 Elm Street?',
 'Freddy Krueger', 'Movie Villains', 3,
 ARRAY['Michael Myers', 'Jason Voorhees', 'Leatherface'],
 'Freddy Krueger from Wes Craven''s A Nightmare on Elm Street (1984) lived at 1428 Elm Street before his death. The address has appeared across the entire Nightmare franchise.'),

('Who played the T-1000, the liquid metal shapeshifting villain, in "Terminator 2: Judgment Day" (1991)?',
 'Robert Patrick', 'Movie Villains', 3,
 ARRAY['Arnold Schwarzenegger', 'Joe Morton', 'Lance Henriksen'],
 'Robert Patrick''s lean, relentless T-1000 was a deliberate contrast to Schwarzenegger''s hulking T-800. Cameron chose Patrick specifically because audiences wouldn''t expect someone so unimposing to be the more dangerous threat.'),

('Which villain does Ralph Fiennes portray in all eight Harry Potter films?',
 'Lord Voldemort', 'Movie Villains', 3,
 ARRAY['Bellatrix Lestrange', 'Lucius Malfoy', 'Fenrir Greyback'],
 'Ralph Fiennes plays the dark wizard Voldemort from Goblet of Fire onward. Ian Hart and Richard Bremmer portrayed earlier versions. Fiennes underwent extensive makeup to achieve Voldemort''s noseless, serpentine appearance.'),

('Which animated Disney villain sings "Be Prepared" while planning to usurp the Pride Lands in "The Lion King" (1994)?',
 'Scar', 'Movie Villains', 3,
 ARRAY['Ursula', 'Maleficent', 'Gaston'],
 'Scar, voiced by Jeremy Irons, sings "Be Prepared" while revealing his plan to murder Mufasa and use the hyenas to seize power. Irons actually damaged his voice recording the song and needed assistance finishing it.'),

('Christoph Waltz won his first Academy Award for playing Hans Landa — nicknamed "The Jew Hunter" — in which Quentin Tarantino film?',
 'Inglourious Basterds (2009)', 'Movie Villains', 3,
 ARRAY['Django Unchained', 'The Hateful Eight', 'Kill Bill'],
 'Waltz also won his second Oscar for Tarantino''s Django Unchained (2012), making him one of only a handful of actors to win two Oscars for the same director. Tarantino wrote the role of Landa specifically for him.'),

('In "Die Hard" (1988), the charming but ruthless villain Hans Gruber is played by which actor, in his feature film debut?',
 'Alan Rickman', 'Movie Villains', 3,
 ARRAY['Jeremy Irons', 'Gary Oldman', 'Tim Roth'],
 'Alan Rickman was 41 when he made his film debut as Hans Gruber. To achieve the authentic look of Gruber falling from Nakatomi Plaza, the stunt team dropped Rickman from 25 feet, counting to three and letting go on one.'),

('Which film features the chilling antagonist Nurse Ratched, widely considered one of the greatest movie villains of all time?',
 'One Flew Over the Cuckoo''s Nest (1975)', 'Movie Villains', 3,
 ARRAY['Girl, Interrupted', 'The Snake Pit', 'Awakenings'],
 'Louise Fletcher played the controlling, cold Nurse Ratched opposite Jack Nicholson, winning the Academy Award for Best Actress. The character ranked #5 on the AFI''s 100 Greatest Villains list.'),

('The character of Hannibal Lecter first appeared on screen in which 1986 film, before Anthony Hopkins took the role?',
 'Manhunter', 'Movie Villains', 3,
 ARRAY['Red Dragon', 'Hannibal Rising', 'The Silence of the Lambs'],
 'Brian Cox played Hannibal Lecktor (spelled differently) in Michael Mann''s Manhunter, based on Thomas Harris''s novel Red Dragon. Cox''s quieter interpretation is often praised by critics, though Hopkins''s version is far more iconic.'),

('Which actress played the calculating, manipulative Amy Dunne in David Fincher''s "Gone Girl" (2014)?',
 'Rosamund Pike', 'Movie Villains', 3,
 ARRAY['Carey Mulligan', 'Emily Blunt', 'Natalie Portman'],
 'Rosamund Pike received an Academy Award nomination for Best Actress for the role. Fincher has said that Pike''s ability to project warmth and menace simultaneously made her perfect for a character who deceives everyone around her.');
