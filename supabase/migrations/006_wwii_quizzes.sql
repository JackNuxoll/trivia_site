-- ============================================================
-- Migration 006 — WWII Quizzes
-- Adds: WWII Battles, WWII Leaders, WWII Timeline
-- Safe to re-run: uses ON CONFLICT DO NOTHING
-- Run in Supabase Dashboard → SQL Editor
-- ============================================================

-- ── WWII Battles (12 questions) ──────────────────────────────────────────────
INSERT INTO public.questions (body, correct_answer, category, difficulty, wrong_answers, explanation)
VALUES

('What was the code name for the German invasion of the Soviet Union, launched on June 22, 1941?',
 'Operation Barbarossa', 'WWII Battles', 3,
 ARRAY['Operation Sea Lion', 'Operation Citadel', 'Operation Typhoon'],
 'Operation Barbarossa was the largest military invasion in history, deploying over 3 million Axis troops across a 2,900-km front.'),

('Which naval battle in June 1942 turned the tide of the Pacific War decisively in America''s favor?',
 'Battle of Midway', 'WWII Battles', 3,
 ARRAY['Battle of the Coral Sea', 'Battle of Leyte Gulf', 'Battle of the Philippine Sea'],
 'At Midway, US forces sank four Japanese fleet carriers — Akagi, Kaga, Sōryū, and Hiryū — a loss Japan could never fully replace.'),

('The Battle of Stalingrad ended in February 1943 with the surrender of which German formation?',
 'German 6th Army', 'WWII Battles', 3,
 ARRAY['German 4th Panzer Army', 'German Army Group South', 'German 17th Army'],
 'Over 90,000 survivors of the 6th Army surrendered, including Field Marshal Paulus. It was the first surrender of an entire German army in the war.'),

('Operation Market Garden (September 1944) aimed to capture key bridges. In which country did it take place?',
 'Netherlands', 'WWII Battles', 3,
 ARRAY['Belgium', 'France', 'Germany'],
 'The operation aimed to capture bridges over Dutch rivers including the Rhine at Arnhem. It failed at ''a bridge too far'' in Arnhem.'),

('What is the common name for Germany''s last major offensive on the Western Front, launched through the Ardennes in December 1944?',
 'Battle of the Bulge', 'WWII Battles', 3,
 ARRAY['Battle of the Rhineland', 'Operation Autumn Mist', 'Battle of Hürtgen Forest'],
 'The ''bulge'' referred to the salient driven into Allied lines. Despite initial German successes, the offensive ultimately failed as Allied forces regrouped.'),

('Which Pacific island battle in February–March 1945 is famous for the photograph of Marines raising the US flag on a volcanic peak?',
 'Battle of Iwo Jima', 'WWII Battles', 3,
 ARRAY['Battle of Okinawa', 'Battle of Guadalcanal', 'Battle of Saipan'],
 'The iconic photo by Joe Rosenthal showed Marines raising the flag on Mount Suribachi. It became one of the most reproduced photographs in history.'),

('Operation Torch (November 1942) was the Allied invasion of which region?',
 'French North Africa', 'WWII Battles', 3,
 ARRAY['Sicily', 'Italian mainland', 'Southern France'],
 'Operation Torch landed Allied forces in Morocco and Algeria, opening a new front and eventually trapping Axis forces in Tunisia.'),

('At the Second Battle of El Alamein (1942), which British general defeated Rommel''s Afrika Korps?',
 'Bernard Montgomery', 'WWII Battles', 3,
 ARRAY['Harold Alexander', 'Claude Auchinleck', 'William Slim'],
 'Montgomery''s 8th Army broke through at El Alamein, beginning the Allied advance that would eventually push Axis forces out of North Africa entirely.'),

('Which German operation at Kursk in July 1943 resulted in the largest tank battle in history?',
 'Operation Citadel', 'WWII Battles', 3,
 ARRAY['Operation Bagration', 'Operation Blue', 'Operation Winter Storm'],
 'Operation Citadel''s failure ended Germany''s ability to launch major strategic offensives on the Eastern Front. The Soviets subsequently launched devastating counter-offensives.'),

('The Battle of Britain (1940) saw the RAF defeat an air campaign conducted by which German military branch?',
 'Luftwaffe', 'WWII Battles', 3,
 ARRAY['Kriegsmarine', 'Wehrmacht infantry', 'Waffen-SS'],
 'The RAF''s Fighter Command, equipped with Spitfires and Hurricanes, defeated the Luftwaffe''s attempt to gain air superiority — forcing Hitler to postpone Operation Sea Lion.'),

('Which island campaign, fought August 1942–February 1943, was the first major Allied ground offensive against Japan?',
 'Guadalcanal', 'WWII Battles', 3,
 ARRAY['Okinawa', 'Tarawa', 'Saipan'],
 'Guadalcanal in the Solomon Islands saw six months of brutal fighting. Its capture denied Japan a vital airbase and marked the beginning of the Allied offensive in the Pacific.'),

('The capture of which island group in mid-1944 put American B-29 Superfortresses within bombing range of the Japanese home islands?',
 'Mariana Islands', 'WWII Battles', 3,
 ARRAY['Solomon Islands', 'Marshall Islands', 'Caroline Islands'],
 'Airbases on Saipan, Tinian, and Guam allowed the US to begin strategic bombing of Japan. The atomic bomb missions were launched from Tinian.');


-- ── WWII Leaders (12 questions) ──────────────────────────────────────────────
INSERT INTO public.questions (body, correct_answer, category, difficulty, wrong_answers, explanation)
VALUES

('Which British Prime Minister rallied his nation with speeches such as ''We shall fight on the beaches''?',
 'Winston Churchill', 'WWII Leaders', 3,
 ARRAY['Neville Chamberlain', 'Clement Attlee', 'Anthony Eden'],
 'Churchill became Prime Minister on May 10, 1940 — the same day Germany began its invasion of France and the Low Countries. His oratory became a symbol of British resolve.'),

('Which American general commanded Allied forces in Europe as Supreme Commander and later became the 34th US President?',
 'Dwight D. Eisenhower', 'WWII Leaders', 3,
 ARRAY['George S. Patton', 'Omar Bradley', 'Douglas MacArthur'],
 'Eisenhower commanded Operation Overlord and accepted Germany''s surrender. He served as President from 1953 to 1961.'),

('Which Japanese admiral masterminded the attack on Pearl Harbor?',
 'Isoroku Yamamoto', 'WWII Leaders', 3,
 ARRAY['Hideki Tojo', 'Chuichi Nagumo', 'Soemu Toyoda'],
 'Yamamoto opposed war with the US, knowing Japan couldn''t win a prolonged conflict. He was killed in 1943 when his plane was ambushed after US forces decoded Japanese communications.'),

('German general Erwin Rommel earned which famous nickname during his North Africa campaigns?',
 'The Desert Fox', 'WWII Leaders', 3,
 ARRAY['The Iron General', 'The Black Baron', 'The Butcher of Normandy'],
 'Rommel''s bold, fast-moving tactics earned him the nickname. He was respected by both his own troops and Allied commanders.'),

('Which Soviet marshal played a pivotal role at Stalingrad, Kursk, and the final assault on Berlin?',
 'Georgy Zhukov', 'WWII Leaders', 3,
 ARRAY['Vasily Chuikov', 'Konstantin Rokossovsky', 'Ivan Konev'],
 'Zhukov was arguably the most successful Soviet commander of the war, coordinating major defensive and offensive operations from 1941 to Germany''s surrender.'),

('Who led the Free French Forces from exile and broadcast a famous appeal on June 18, 1940, calling for continued resistance?',
 'Charles de Gaulle', 'WWII Leaders', 3,
 ARRAY['Philippe Pétain', 'Jean Darlan', 'Henri Giraud'],
 'De Gaulle refused to accept France''s armistice with Germany. He later became the first President of the French Fifth Republic.'),

('Which American general''s 3rd Army swept across France in one of history''s fastest armored advances after the Normandy breakout?',
 'George S. Patton', 'WWII Leaders', 3,
 ARRAY['Omar Bradley', 'Mark Clark', 'Courtney Hodges'],
 'Patton''s 3rd Army covered hundreds of miles in weeks during Operation Cobra''s exploitation phase, liberating large swathes of France.'),

('As head of the SS, who was the chief architect of the Holocaust and oversaw the concentration camp system?',
 'Heinrich Himmler', 'WWII Leaders', 3,
 ARRAY['Joseph Goebbels', 'Hermann Göring', 'Reinhard Heydrich'],
 'Himmler built the SS into a massive organization controlling the concentration camps, the Gestapo, and several Waffen-SS military divisions.'),

('Which US President made the decision to use atomic bombs against Japan in August 1945?',
 'Harry S. Truman', 'WWII Leaders', 3,
 ARRAY['Franklin D. Roosevelt', 'Dwight D. Eisenhower', 'Herbert Hoover'],
 'Roosevelt died on April 12, 1945, and Truman only learned of the Manhattan Project after becoming President. He authorized the bomb''s use to end the war with Japan.'),

('General Douglas MacArthur made his famous promise ''I shall return'' when forced to retreat from which country?',
 'Philippines', 'WWII Leaders', 3,
 ARRAY['Guam', 'Wake Island', 'New Guinea'],
 'MacArthur escaped from Corregidor in March 1942 and fulfilled his promise with the invasion of Leyte in October 1944.'),

('Which German general, considered the Wehrmacht''s finest strategic mind, devised the daring plan that outflanked France''s Maginot Line in 1940?',
 'Erich von Manstein', 'WWII Leaders', 3,
 ARRAY['Heinz Guderian', 'Gerd von Rundstedt', 'Fedor von Bock'],
 'Manstein''s ''Sickle Cut'' plan attacked through the Ardennes, bypassing the Maginot Line. He later planned major operations on the Eastern Front before being dismissed by Hitler in 1944.'),

('Which US Army Chief of Staff later developed the European economic recovery program that bears his name?',
 'George C. Marshall', 'WWII Leaders', 3,
 ARRAY['Henry Stimson', 'Douglas MacArthur', 'Omar Bradley'],
 'Marshall organized the enormous expansion of the US Army during the war. His post-war Marshall Plan, announced in 1947, helped rebuild war-ravaged European economies.');


-- ── WWII Timeline (12 questions) ─────────────────────────────────────────────
INSERT INTO public.questions (body, correct_answer, category, difficulty, wrong_answers, explanation)
VALUES

('In which year did World War II begin with Germany''s invasion of Poland?',
 '1939', 'WWII Timeline', 2,
 ARRAY['1937', '1938', '1940'],
 'Germany invaded Poland on September 1, 1939. Britain and France declared war on Germany two days later, beginning World War II in Europe.'),

('Which diplomatic agreement between Germany and the Soviet Union, signed in August 1939, enabled the invasion of Poland?',
 'Molotov-Ribbentrop Pact', 'WWII Timeline', 2,
 ARRAY['Treaty of Versailles', 'Tripartite Pact', 'Munich Agreement'],
 'The non-aggression pact secretly divided Eastern Europe into German and Soviet spheres. It collapsed when Germany invaded the USSR in June 1941.'),

('What name was given to Germany''s strategy of rapid, combined-arms warfare using tanks, aircraft, and infantry together?',
 'Blitzkrieg', 'WWII Timeline', 2,
 ARRAY['Trench warfare', 'Total war', 'Scorched earth'],
 'Blitzkrieg, meaning ''lightning war,'' used fast-moving armored columns supported by dive bombers to penetrate enemy lines before defenses could be organized.'),

('What was the code name for the mass evacuation of Allied troops from Dunkirk, France, in May–June 1940?',
 'Operation Dynamo', 'WWII Timeline', 2,
 ARRAY['Operation Sea Lion', 'Operation Overlord', 'Operation Compass'],
 'Over 338,000 Allied troops were rescued by naval vessels and civilian ''little ships.'' Churchill called it ''a miracle of deliverance'' while also warning that ''wars are not won by evacuations.'''),

('What did the US Congress declare the day after Japan''s attack on Pearl Harbor on December 7, 1941?',
 'War on Japan', 'WWII Timeline', 2,
 ARRAY['War on Germany', 'War on the Axis Powers', 'A national state of emergency'],
 'FDR called December 7, 1941 ''a date which will live in infamy.'' Congress declared war on Japan the next day; Germany and Italy declared war on the US days later.'),

('What was the name of the US program signed in March 1941 that supplied war materials to Allied nations before America entered the conflict?',
 'Lend-Lease Act', 'WWII Timeline', 2,
 ARRAY['Marshall Plan', 'Atlantic Charter', 'Cash and Carry Act'],
 'Lend-Lease authorized the President to lend or lease war supplies to any nation whose defense was vital to US security, providing massive aid to Britain and the Soviet Union.'),

('The Wannsee Conference of January 1942 was a secret Nazi meeting held to coordinate which policy?',
 'The ''Final Solution'' — the systematic genocide of European Jews', 'WWII Timeline', 2,
 ARRAY['The invasion of the Soviet Union', 'The occupation of Western Europe', 'The formation of the Axis alliance'],
 'Fifteen senior Nazi officials met at the Wannsee villa near Berlin to coordinate the logistics of murdering all Jews in German-occupied Europe.'),

('Which February 1945 conference brought together Churchill, Roosevelt, and Stalin to plan the post-war world?',
 'Yalta Conference', 'WWII Timeline', 2,
 ARRAY['Tehran Conference', 'Potsdam Conference', 'Casablanca Conference'],
 'At Yalta in Crimea, the ''Big Three'' agreed on the occupation of Germany, Soviet entry into the Pacific War, and the framework for the United Nations.'),

('Victory in Europe (V-E Day) was declared on May 8, 1945 after which event?',
 'Germany''s unconditional surrender', 'WWII Timeline', 2,
 ARRAY['Hitler''s capture', 'The fall of Berlin', 'The liberation of Paris'],
 'Germany signed unconditional surrender in Reims on May 7, with a second ceremony in Berlin on May 8. Hitler had died by suicide on April 30.'),

('The Manhattan Project was a secret Allied program that produced what weapon?',
 'The atomic bomb', 'WWII Timeline', 2,
 ARRAY['Long-range ballistic missiles', 'Radar systems', 'Jet-powered aircraft'],
 'The Manhattan Project employed over 130,000 people across dozens of sites. The first test detonation occurred at Trinity, New Mexico, on July 16, 1945.'),

('On which US Navy vessel did Japan formally surrender on September 2, 1945?',
 'USS Missouri', 'WWII Timeline', 2,
 ARRAY['USS Enterprise', 'USS Iowa', 'USS New Jersey'],
 'The surrender ceremony took place in Tokyo Bay. General MacArthur presided over the signing of the Japanese Instrument of Surrender.'),

('The Nuremberg Trials (1945–1946) established the precedent that individuals could be prosecuted for which category of offense?',
 'Crimes against humanity', 'WWII Timeline', 2,
 ARRAY['War crimes only', 'Espionage', 'Treason against the German state'],
 'The Nuremberg Trials held Nazi leaders accountable for crimes against humanity, genocide, and waging aggressive war — setting landmark precedents in international law.');
