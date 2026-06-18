-- ============================================================
-- Migration 003 — Sports Division/Conference Quizzes
-- Adds: NFL Divisions, MLB Divisions, NBA Divisions, NCAA Conferences
-- Safe to re-run: uses ON CONFLICT DO NOTHING
-- Run in Supabase Dashboard → SQL Editor
-- ============================================================

-- ── NFL Divisions (32 teams) ──────────────────────────────────────────────────
INSERT INTO public.questions (body, correct_answer, category, difficulty, image_url, wrong_answers, explanation)
VALUES

-- AFC East
('Which NFL division do the Buffalo Bills play in?', 'AFC East', 'NFL Divisions', 2,
 'https://a.espncdn.com/i/teamlogos/nfl/500/buf.png',
 ARRAY['NFC East', 'AFC West', 'NFC North'],
 'The Bills are one of four AFC East teams based in the Northeast, alongside the Dolphins, Patriots, and Jets.'),

('Which NFL division do the Miami Dolphins play in?', 'AFC East', 'NFL Divisions', 2,
 'https://a.espncdn.com/i/teamlogos/nfl/500/mia.png',
 ARRAY['NFC South', 'AFC North', 'NFC West'],
 'The Dolphins are the only NFL franchise based in Florida in the AFC East division.'),

('Which NFL division do the New England Patriots play in?', 'AFC East', 'NFL Divisions', 1,
 'https://a.espncdn.com/i/teamlogos/nfl/500/ne.png',
 ARRAY['NFC North', 'AFC North', 'NFC East'],
 'The Patriots, based in Foxborough, MA, are the most successful AFC East franchise in the Super Bowl era.'),

('Which NFL division do the New York Jets play in?', 'AFC East', 'NFL Divisions', 2,
 'https://a.espncdn.com/i/teamlogos/nfl/500/nyj.png',
 ARRAY['NFC East', 'AFC North', 'NFC South'],
 'The Jets share MetLife Stadium with the Giants but play in the AFC East, while the Giants are in the NFC East.'),

-- AFC North
('Which NFL division do the Baltimore Ravens play in?', 'AFC North', 'NFL Divisions', 2,
 'https://a.espncdn.com/i/teamlogos/nfl/500/bal.png',
 ARRAY['NFC North', 'AFC East', 'NFC East'],
 'The Ravens joined the AFC North (then AFC Central) in 1996 when the Cleveland Browns relocated to Baltimore.'),

('Which NFL division do the Cincinnati Bengals play in?', 'AFC North', 'NFL Divisions', 2,
 'https://a.espncdn.com/i/teamlogos/nfl/500/cin.png',
 ARRAY['NFC South', 'AFC West', 'NFC North'],
 'The Bengals compete in the AFC North alongside the Ravens, Browns, and Steelers — one of the NFL''s toughest divisions.'),

('Which NFL division do the Cleveland Browns play in?', 'AFC North', 'NFL Divisions', 2,
 'https://a.espncdn.com/i/teamlogos/nfl/500/cle.png',
 ARRAY['AFC East', 'NFC North', 'NFC East'],
 'The Browns are one of only two NFL teams (with the Bears) whose name does not reference an animal or a place concept.'),

('Which NFL division do the Pittsburgh Steelers play in?', 'AFC North', 'NFL Divisions', 1,
 'https://a.espncdn.com/i/teamlogos/nfl/500/pit.png',
 ARRAY['NFC West', 'AFC South', 'NFC North'],
 'The Steelers lead all NFL teams with six Super Bowl championships, all won as AFC North members.'),

-- AFC South
('Which NFL division do the Houston Texans play in?', 'AFC South', 'NFL Divisions', 2,
 'https://a.espncdn.com/i/teamlogos/nfl/500/hou.png',
 ARRAY['NFC South', 'AFC West', 'NFC West'],
 'The Texans are the newest AFC South team, joining the NFL as an expansion franchise in 2002.'),

('Which NFL division do the Indianapolis Colts play in?', 'AFC South', 'NFL Divisions', 2,
 'https://a.espncdn.com/i/teamlogos/nfl/500/ind.png',
 ARRAY['AFC East', 'NFC South', 'AFC North'],
 'The Colts moved from Baltimore to Indianapolis in 1984 and relocated to the AFC South at the 2002 realignment.'),

('Which NFL division do the Jacksonville Jaguars play in?', 'AFC South', 'NFL Divisions', 2,
 'https://a.espncdn.com/i/teamlogos/nfl/500/jax.png',
 ARRAY['NFC South', 'AFC East', 'NFC East'],
 'The Jaguars are one of two 1995 expansion teams in the AFC South — the Texans joined later in 2002.'),

('Which NFL division do the Tennessee Titans play in?', 'AFC South', 'NFL Divisions', 2,
 'https://a.espncdn.com/i/teamlogos/nfl/500/ten.png',
 ARRAY['AFC North', 'NFC South', 'AFC West'],
 'The Titans relocated from Houston (as the Oilers) to Tennessee in 1997 and now anchor the AFC South.'),

-- AFC West
('Which NFL division do the Denver Broncos play in?', 'AFC West', 'NFL Divisions', 2,
 'https://a.espncdn.com/i/teamlogos/nfl/500/den.png',
 ARRAY['NFC West', 'AFC North', 'NFC South'],
 'The Broncos have called the AFC West home since the AFL–NFL merger in 1970, winning three Super Bowls.'),

('Which NFL division do the Kansas City Chiefs play in?', 'AFC West', 'NFL Divisions', 1,
 'https://a.espncdn.com/i/teamlogos/nfl/500/kc.png',
 ARRAY['NFC West', 'AFC South', 'NFC North'],
 'The Chiefs dominate the AFC West and have won multiple Super Bowls in the early 2020s under Patrick Mahomes.'),

('Which NFL division do the Las Vegas Raiders play in?', 'AFC West', 'NFL Divisions', 2,
 'https://a.espncdn.com/i/teamlogos/nfl/500/lv.png',
 ARRAY['NFC West', 'AFC East', 'NFC East'],
 'The Raiders have played in the AFC West as an original AFL franchise, relocating from Oakland to Las Vegas in 2020.'),

('Which NFL division do the Los Angeles Chargers play in?', 'AFC West', 'NFL Divisions', 2,
 'https://a.espncdn.com/i/teamlogos/nfl/500/lac.png',
 ARRAY['NFC West', 'AFC South', 'NFC South'],
 'The Chargers moved from San Diego to Los Angeles in 2017 but remained in the AFC West throughout.'),

-- NFC East
('Which NFL division do the Dallas Cowboys play in?', 'NFC East', 'NFL Divisions', 1,
 'https://a.espncdn.com/i/teamlogos/nfl/500/dal.png',
 ARRAY['AFC East', 'NFC West', 'AFC South'],
 'America''s Team plays in the NFC East — one of the NFL''s most watched and storied divisions.'),

('Which NFL division do the New York Giants play in?', 'NFC East', 'NFL Divisions', 2,
 'https://a.espncdn.com/i/teamlogos/nfl/500/nyg.png',
 ARRAY['AFC East', 'NFC North', 'AFC North'],
 'The Giants share a stadium with the AFC East Jets but play in the NFC East themselves.'),

('Which NFL division do the Philadelphia Eagles play in?', 'NFC East', 'NFL Divisions', 2,
 'https://a.espncdn.com/i/teamlogos/nfl/500/phi.png',
 ARRAY['NFC South', 'AFC East', 'NFC West'],
 'The Eagles are charter NFC East members and play a fierce rivalry with the Cowboys, Giants, and Commanders.'),

('Which NFL division do the Washington Commanders play in?', 'NFC East', 'NFL Divisions', 2,
 'https://a.espncdn.com/i/teamlogos/nfl/500/wsh.png',
 ARRAY['AFC East', 'NFC South', 'AFC South'],
 'The Commanders (formerly Redskins, then Football Team) have always been in the NFC East since the merger.'),

-- NFC North
('Which NFL division do the Chicago Bears play in?', 'NFC North', 'NFL Divisions', 2,
 'https://a.espncdn.com/i/teamlogos/nfl/500/chi.png',
 ARRAY['AFC North', 'NFC West', 'AFC West'],
 'The Bears are a charter NFC North franchise and one of the NFL''s founding members, established in 1920.'),

('Which NFL division do the Detroit Lions play in?', 'NFC North', 'NFL Divisions', 2,
 'https://a.espncdn.com/i/teamlogos/nfl/500/det.png',
 ARRAY['AFC North', 'NFC South', 'AFC East'],
 'The Lions are one of four NFC North teams and have played in the division since the 2002 realignment.'),

('Which NFL division do the Green Bay Packers play in?', 'NFC North', 'NFL Divisions', 1,
 'https://a.espncdn.com/i/teamlogos/nfl/500/gb.png',
 ARRAY['AFC North', 'NFC East', 'AFC East'],
 'The Packers are the only community-owned, non-profit major professional sports franchise in the United States.'),

('Which NFL division do the Minnesota Vikings play in?', 'NFC North', 'NFL Divisions', 2,
 'https://a.espncdn.com/i/teamlogos/nfl/500/min.png',
 ARRAY['AFC North', 'NFC West', 'AFC South'],
 'The Vikings have been NFC North rivals of the Bears, Packers, and Lions since their 1961 founding.'),

-- NFC South
('Which NFL division do the Atlanta Falcons play in?', 'NFC South', 'NFL Divisions', 2,
 'https://a.espncdn.com/i/teamlogos/nfl/500/atl.png',
 ARRAY['AFC South', 'NFC East', 'AFC East'],
 'The Falcons joined the NFL in 1966 and have been in the NFC South since the 2002 realignment.'),

('Which NFL division do the Carolina Panthers play in?', 'NFC South', 'NFL Divisions', 2,
 'https://a.espncdn.com/i/teamlogos/nfl/500/car.png',
 ARRAY['AFC South', 'NFC North', 'AFC North'],
 'The Panthers, a 1995 expansion franchise, play in the NFC South alongside the Falcons, Saints, and Buccaneers.'),

('Which NFL division do the New Orleans Saints play in?', 'NFC South', 'NFL Divisions', 2,
 'https://a.espncdn.com/i/teamlogos/nfl/500/no.png',
 ARRAY['AFC South', 'NFC West', 'AFC West'],
 'The Saints are the anchor franchise of the NFC South and won their only Super Bowl after the 2009 season.'),

('Which NFL division do the Tampa Bay Buccaneers play in?', 'NFC South', 'NFL Divisions', 2,
 'https://a.espncdn.com/i/teamlogos/nfl/500/tb.png',
 ARRAY['AFC South', 'NFC East', 'AFC East'],
 'The Buccaneers have won two Super Bowls while competing in the NFC South.'),

-- NFC West
('Which NFL division do the Arizona Cardinals play in?', 'NFC West', 'NFL Divisions', 2,
 'https://a.espncdn.com/i/teamlogos/nfl/500/ari.png',
 ARRAY['AFC West', 'NFC North', 'AFC North'],
 'The Cardinals are the oldest franchise in professional football, founded in 1898, now in the NFC West.'),

('Which NFL division do the Los Angeles Rams play in?', 'NFC West', 'NFL Divisions', 2,
 'https://a.espncdn.com/i/teamlogos/nfl/500/lar.png',
 ARRAY['AFC West', 'NFC East', 'AFC East'],
 'The Rams returned to Los Angeles from St. Louis in 2016 and won Super Bowl LVI in 2022 in the NFC West.'),

('Which NFL division do the San Francisco 49ers play in?', 'NFC West', 'NFL Divisions', 2,
 'https://a.espncdn.com/i/teamlogos/nfl/500/sf.png',
 ARRAY['AFC West', 'NFC South', 'AFC South'],
 'The 49ers are a dominant NFC West franchise, winning five Super Bowls during the Walsh–Montana dynasty.'),

('Which NFL division do the Seattle Seahawks play in?', 'NFC West', 'NFL Divisions', 2,
 'https://a.espncdn.com/i/teamlogos/nfl/500/sea.png',
 ARRAY['AFC West', 'NFC North', 'AFC North'],
 'The Seahawks joined the NFC West in 2002 after spending their early years in the AFC West.');


-- ── MLB Divisions (30 teams) ──────────────────────────────────────────────────
INSERT INTO public.questions (body, correct_answer, category, difficulty, image_url, wrong_answers, explanation)
VALUES

-- AL East
('Which MLB division do the Baltimore Orioles play in?', 'AL East', 'MLB Divisions', 2,
 'https://a.espncdn.com/i/teamlogos/mlb/500/bal.png',
 ARRAY['NL East', 'AL West', 'NL Central'],
 'The Orioles are one of five AL East teams, competing against the Yankees, Red Sox, Rays, and Blue Jays.'),

('Which MLB division do the Boston Red Sox play in?', 'AL East', 'MLB Divisions', 1,
 'https://a.espncdn.com/i/teamlogos/mlb/500/bos.png',
 ARRAY['NL East', 'AL Central', 'NL West'],
 'The Red Sox are charter AL East members and share one of baseball''s greatest rivalries with the New York Yankees.'),

('Which MLB division do the New York Yankees play in?', 'AL East', 'MLB Divisions', 1,
 'https://a.espncdn.com/i/teamlogos/mlb/500/nyy.png',
 ARRAY['NL East', 'AL West', 'NL Central'],
 'The Yankees have won more World Series titles (27) than any other franchise, playing in the AL East.'),

('Which MLB division do the Tampa Bay Rays play in?', 'AL East', 'MLB Divisions', 2,
 'https://a.espncdn.com/i/teamlogos/mlb/500/tb.png',
 ARRAY['NL East', 'AL Central', 'NL South'],
 'The Rays, known for analytics-driven baseball, compete in the tough AL East despite a lower payroll.'),

('Which MLB division do the Toronto Blue Jays play in?', 'AL East', 'MLB Divisions', 2,
 'https://a.espncdn.com/i/teamlogos/mlb/500/tor.png',
 ARRAY['NL East', 'AL Central', 'NL West'],
 'The Blue Jays are the only AL East team based outside the United States, playing in Toronto, Canada.'),

-- AL Central
('Which MLB division do the Chicago White Sox play in?', 'AL Central', 'MLB Divisions', 2,
 'https://a.espncdn.com/i/teamlogos/mlb/500/chw.png',
 ARRAY['NL Central', 'AL East', 'NL East'],
 'The White Sox play on the South Side of Chicago in the AL Central, while the Cubs play in the NL Central.'),

('Which MLB division do the Cleveland Guardians play in?', 'AL Central', 'MLB Divisions', 2,
 'https://a.espncdn.com/i/teamlogos/mlb/500/cle.png',
 ARRAY['NL Central', 'AL East', 'NL West'],
 'The Guardians, formerly known as the Indians, compete in the AL Central and are based in Cleveland, Ohio.'),

('Which MLB division do the Detroit Tigers play in?', 'AL Central', 'MLB Divisions', 2,
 'https://a.espncdn.com/i/teamlogos/mlb/500/det.png',
 ARRAY['NL Central', 'AL West', 'NL East'],
 'The Tigers are a charter American League franchise, playing in the AL Central at Comerica Park in Detroit.'),

('Which MLB division do the Kansas City Royals play in?', 'AL Central', 'MLB Divisions', 2,
 'https://a.espncdn.com/i/teamlogos/mlb/500/kc.png',
 ARRAY['NL Central', 'AL East', 'NL West'],
 'The Royals play in the AL Central and won back-to-back World Series in 1985 and the championship in 2015.'),

('Which MLB division do the Minnesota Twins play in?', 'AL Central', 'MLB Divisions', 2,
 'https://a.espncdn.com/i/teamlogos/mlb/500/min.png',
 ARRAY['NL Central', 'AL East', 'NL East'],
 'The Twins play in the AL Central at Target Field in Minneapolis, having moved from Washington D.C. in 1961.'),

-- AL West
('Which MLB division do the Houston Astros play in?', 'AL West', 'MLB Divisions', 2,
 'https://a.espncdn.com/i/teamlogos/mlb/500/hou.png',
 ARRAY['NL West', 'AL Central', 'NL Central'],
 'The Astros moved from the NL Central to the AL West in 2013 and won World Series titles in 2017 and 2022.'),

('Which MLB division do the Los Angeles Angels play in?', 'AL West', 'MLB Divisions', 2,
 'https://a.espncdn.com/i/teamlogos/mlb/500/laa.png',
 ARRAY['NL West', 'AL East', 'NL East'],
 'The Angels play in Anaheim and compete in the AL West alongside the Astros, Mariners, Rangers, and Athletics.'),

('Which MLB division do the Athletics play in?', 'AL West', 'MLB Divisions', 3,
 'https://a.espncdn.com/i/teamlogos/mlb/500/oak.png',
 ARRAY['NL West', 'AL Central', 'NL Central'],
 'The Athletics, longtime Oakland residents now transitioning to Las Vegas, have always played in the AL West.'),

('Which MLB division do the Seattle Mariners play in?', 'AL West', 'MLB Divisions', 2,
 'https://a.espncdn.com/i/teamlogos/mlb/500/sea.png',
 ARRAY['NL West', 'AL Central', 'NL East'],
 'The Mariners play in Seattle and are the only current MLB franchise to have never appeared in a World Series.'),

('Which MLB division do the Texas Rangers play in?', 'AL West', 'MLB Divisions', 2,
 'https://a.espncdn.com/i/teamlogos/mlb/500/tex.png',
 ARRAY['NL West', 'AL East', 'NL Central'],
 'The Rangers play in Arlington, Texas, and won their first World Series championship in 2023.'),

-- NL East
('Which MLB division do the Atlanta Braves play in?', 'NL East', 'MLB Divisions', 2,
 'https://a.espncdn.com/i/teamlogos/mlb/500/atl.png',
 ARRAY['AL East', 'NL Central', 'AL Central'],
 'The Braves are a cornerstone NL East franchise, winning the World Series in 2021 after a dominant run.'),

('Which MLB division do the Miami Marlins play in?', 'NL East', 'MLB Divisions', 2,
 'https://a.espncdn.com/i/teamlogos/mlb/500/mia.png',
 ARRAY['AL East', 'NL West', 'AL West'],
 'The Marlins play in loanDepot park and are one of five NL East teams despite having two World Series titles.'),

('Which MLB division do the New York Mets play in?', 'NL East', 'MLB Divisions', 1,
 'https://a.espncdn.com/i/teamlogos/mlb/500/nym.png',
 ARRAY['AL East', 'NL Central', 'AL Central'],
 'The Mets play at Citi Field in Queens and share New York with the AL East Yankees.'),

('Which MLB division do the Philadelphia Phillies play in?', 'NL East', 'MLB Divisions', 2,
 'https://a.espncdn.com/i/teamlogos/mlb/500/phi.png',
 ARRAY['AL East', 'NL Central', 'AL West'],
 'The Phillies are a charter NL East franchise and one of the oldest continuous franchises in professional sports.'),

('Which MLB division do the Washington Nationals play in?', 'NL East', 'MLB Divisions', 2,
 'https://a.espncdn.com/i/teamlogos/mlb/500/wsh.png',
 ARRAY['AL East', 'NL Central', 'AL Central'],
 'The Nationals moved from Montreal (Expos) to Washington D.C. in 2005 and won the World Series in 2019.'),

-- NL Central
('Which MLB division do the Chicago Cubs play in?', 'NL Central', 'MLB Divisions', 1,
 'https://a.espncdn.com/i/teamlogos/mlb/500/chc.png',
 ARRAY['AL Central', 'NL East', 'AL East'],
 'The Cubs play on the North Side of Chicago in the NL Central and ended a 108-year World Series drought in 2016.'),

('Which MLB division do the Cincinnati Reds play in?', 'NL Central', 'MLB Divisions', 2,
 'https://a.espncdn.com/i/teamlogos/mlb/500/cin.png',
 ARRAY['AL Central', 'NL East', 'AL East'],
 'The Reds are one of the oldest professional baseball franchises and a founding NL Central member.'),

('Which MLB division do the Milwaukee Brewers play in?', 'NL Central', 'MLB Divisions', 2,
 'https://a.espncdn.com/i/teamlogos/mlb/500/mil.png',
 ARRAY['AL Central', 'NL West', 'AL West'],
 'The Brewers moved from the AL East to the NL Central in 1998 and play at American Family Field in Milwaukee.'),

('Which MLB division do the Pittsburgh Pirates play in?', 'NL Central', 'MLB Divisions', 2,
 'https://a.espncdn.com/i/teamlogos/mlb/500/pit.png',
 ARRAY['AL Central', 'NL East', 'AL East'],
 'The Pirates are a charter NL Central franchise that won five World Series titles, all before 1980.'),

('Which MLB division do the St. Louis Cardinals play in?', 'NL Central', 'MLB Divisions', 1,
 'https://a.espncdn.com/i/teamlogos/mlb/500/stl.png',
 ARRAY['AL Central', 'NL East', 'AL East'],
 'The Cardinals are the most successful NL franchise with 11 World Series titles, playing in the NL Central.'),

-- NL West
('Which MLB division do the Arizona Diamondbacks play in?', 'NL West', 'MLB Divisions', 2,
 'https://a.espncdn.com/i/teamlogos/mlb/500/ari.png',
 ARRAY['AL West', 'NL Central', 'AL Central'],
 'The Diamondbacks joined MLB as an NL West expansion team in 1998 and won the World Series in 2001.'),

('Which MLB division do the Colorado Rockies play in?', 'NL West', 'MLB Divisions', 2,
 'https://a.espncdn.com/i/teamlogos/mlb/500/col.png',
 ARRAY['AL West', 'NL Central', 'AL East'],
 'The Rockies play at Coors Field in Denver — the highest-elevation ballpark in MLB — in the NL West.'),

('Which MLB division do the Los Angeles Dodgers play in?', 'NL West', 'MLB Divisions', 1,
 'https://a.espncdn.com/i/teamlogos/mlb/500/lad.png',
 ARRAY['AL West', 'NL East', 'AL East'],
 'The Dodgers are one of baseball''s marquee NL West franchises, with multiple World Series championships.'),

('Which MLB division do the San Diego Padres play in?', 'NL West', 'MLB Divisions', 2,
 'https://a.espncdn.com/i/teamlogos/mlb/500/sd.png',
 ARRAY['AL West', 'NL Central', 'AL Central'],
 'The Padres play at Petco Park in San Diego and compete in the NL West alongside the Dodgers and Giants.'),

('Which MLB division do the San Francisco Giants play in?', 'NL West', 'MLB Divisions', 2,
 'https://a.espncdn.com/i/teamlogos/mlb/500/sf.png',
 ARRAY['AL West', 'NL East', 'NL Central'],
 'The Giants moved from New York to San Francisco in 1958 and play their NL West games at Oracle Park.');


-- ── NBA Divisions (30 teams) ──────────────────────────────────────────────────
INSERT INTO public.questions (body, correct_answer, category, difficulty, image_url, wrong_answers, explanation)
VALUES

-- Atlantic Division
('Which NBA division do the Boston Celtics play in?', 'Atlantic', 'NBA Divisions', 1,
 'https://a.espncdn.com/i/teamlogos/nba/500/bos.png',
 ARRAY['Southeast', 'Northwest', 'Pacific'],
 'The Celtics anchor the Atlantic Division and are the most successful NBA franchise with 18 championships.'),

('Which NBA division do the Brooklyn Nets play in?', 'Atlantic', 'NBA Divisions', 2,
 'https://a.espncdn.com/i/teamlogos/nba/500/bkn.png',
 ARRAY['Southeast', 'Central', 'Pacific'],
 'The Nets moved from New Jersey to Brooklyn in 2012 and play in the Atlantic Division of the Eastern Conference.'),

('Which NBA division do the New York Knicks play in?', 'Atlantic', 'NBA Divisions', 2,
 'https://a.espncdn.com/i/teamlogos/nba/500/ny.png',
 ARRAY['Southeast', 'Northwest', 'Pacific'],
 'The Knicks are one of the NBA''s original franchises and play in the Atlantic Division at Madison Square Garden.'),

('Which NBA division do the Philadelphia 76ers play in?', 'Atlantic', 'NBA Divisions', 2,
 'https://a.espncdn.com/i/teamlogos/nba/500/phi.png',
 ARRAY['Southeast', 'Central', 'Southwest'],
 'The 76ers are a charter Atlantic Division team and have won three NBA championships.'),

('Which NBA division do the Toronto Raptors play in?', 'Atlantic', 'NBA Divisions', 2,
 'https://a.espncdn.com/i/teamlogos/nba/500/tor.png',
 ARRAY['Southeast', 'Northwest', 'Central'],
 'The Raptors are the only Atlantic Division team based outside the United States, playing in Toronto.'),

-- Central Division
('Which NBA division do the Chicago Bulls play in?', 'Central', 'NBA Divisions', 1,
 'https://a.espncdn.com/i/teamlogos/nba/500/chi.png',
 ARRAY['Northwest', 'Atlantic', 'Southwest'],
 'The Bulls play in the Central Division and won six championships during the Michael Jordan era.'),

('Which NBA division do the Cleveland Cavaliers play in?', 'Central', 'NBA Divisions', 2,
 'https://a.espncdn.com/i/teamlogos/nba/500/cle.png',
 ARRAY['Atlantic', 'Northwest', 'Southeast'],
 'The Cavaliers are a Central Division team and won their only NBA title in 2016 led by LeBron James.'),

('Which NBA division do the Detroit Pistons play in?', 'Central', 'NBA Divisions', 2,
 'https://a.espncdn.com/i/teamlogos/nba/500/det.png',
 ARRAY['Atlantic', 'Southeast', 'Northwest'],
 'The Pistons play in the Central Division and won three NBA championships including back-to-back in 1989–90.'),

('Which NBA division do the Indiana Pacers play in?', 'Central', 'NBA Divisions', 2,
 'https://a.espncdn.com/i/teamlogos/nba/500/ind.png',
 ARRAY['Atlantic', 'Southeast', 'Southwest'],
 'The Pacers are a Central Division team based in Indianapolis and are former ABA champions.'),

('Which NBA division do the Milwaukee Bucks play in?', 'Central', 'NBA Divisions', 2,
 'https://a.espncdn.com/i/teamlogos/nba/500/mil.png',
 ARRAY['Atlantic', 'Northwest', 'Southeast'],
 'The Bucks play in the Central Division and won the NBA championship in 2021 led by Giannis Antetokounmpo.'),

-- Southeast Division
('Which NBA division do the Atlanta Hawks play in?', 'Southeast', 'NBA Divisions', 2,
 'https://a.espncdn.com/i/teamlogos/nba/500/atl.png',
 ARRAY['Pacific', 'Central', 'Atlantic'],
 'The Hawks play in the Southeast Division at State Farm Arena in Atlanta, Georgia.'),

('Which NBA division do the Charlotte Hornets play in?', 'Southeast', 'NBA Divisions', 2,
 'https://a.espncdn.com/i/teamlogos/nba/500/cha.png',
 ARRAY['Pacific', 'Atlantic', 'Central'],
 'The Hornets play in the Southeast Division and are the only major professional sports franchise based in Charlotte.'),

('Which NBA division do the Miami Heat play in?', 'Southeast', 'NBA Divisions', 2,
 'https://a.espncdn.com/i/teamlogos/nba/500/mia.png',
 ARRAY['Pacific', 'Central', 'Atlantic'],
 'The Heat play in the Southeast Division and have won three NBA championships (2006, 2012, 2013).'),

('Which NBA division do the Orlando Magic play in?', 'Southeast', 'NBA Divisions', 2,
 'https://a.espncdn.com/i/teamlogos/nba/500/orl.png',
 ARRAY['Pacific', 'Atlantic', 'Northwest'],
 'The Magic play in the Southeast Division at Kia Center in Orlando, Florida.'),

('Which NBA division do the Washington Wizards play in?', 'Southeast', 'NBA Divisions', 2,
 'https://a.espncdn.com/i/teamlogos/nba/500/wsh.png',
 ARRAY['Atlantic', 'Pacific', 'Central'],
 'The Wizards are the only Southeast Division team based outside the Deep South, playing in Washington D.C.'),

-- Northwest Division
('Which NBA division do the Denver Nuggets play in?', 'Northwest', 'NBA Divisions', 2,
 'https://a.espncdn.com/i/teamlogos/nba/500/den.png',
 ARRAY['Atlantic', 'Southwest', 'Southeast'],
 'The Nuggets play in the Northwest Division at Ball Arena in Denver and won the NBA title in 2023.'),

('Which NBA division do the Minnesota Timberwolves play in?', 'Northwest', 'NBA Divisions', 2,
 'https://a.espncdn.com/i/teamlogos/nba/500/min.png',
 ARRAY['Atlantic', 'Central', 'Southeast'],
 'The Timberwolves are a Northwest Division team based in Minneapolis, competing against the Jazz, Nuggets, and Thunder.'),

('Which NBA division do the Oklahoma City Thunder play in?', 'Northwest', 'NBA Divisions', 2,
 'https://a.espncdn.com/i/teamlogos/nba/500/okc.png',
 ARRAY['Southwest', 'Atlantic', 'Southeast'],
 'The Thunder moved from Seattle (as the SuperSonics) to Oklahoma City in 2008 and compete in the Northwest Division.'),

('Which NBA division do the Portland Trail Blazers play in?', 'Northwest', 'NBA Divisions', 2,
 'https://a.espncdn.com/i/teamlogos/nba/500/por.png',
 ARRAY['Pacific', 'Atlantic', 'Southeast'],
 'The Trail Blazers play in the Northwest Division at Moda Center in Portland, Oregon.'),

('Which NBA division do the Utah Jazz play in?', 'Northwest', 'NBA Divisions', 2,
 'https://a.espncdn.com/i/teamlogos/nba/500/utah.png',
 ARRAY['Pacific', 'Southwest', 'Southeast'],
 'The Jazz play in the Northwest Division in Salt Lake City — the name is a holdover from their New Orleans origins.'),

-- Pacific Division
('Which NBA division do the Golden State Warriors play in?', 'Pacific', 'NBA Divisions', 2,
 'https://a.espncdn.com/i/teamlogos/nba/500/gs.png',
 ARRAY['Southwest', 'Northwest', 'Atlantic'],
 'The Warriors play in the Pacific Division at Chase Center and won four NBA titles from 2015–2022.'),

('Which NBA division do the Los Angeles Clippers play in?', 'Pacific', 'NBA Divisions', 2,
 'https://a.espncdn.com/i/teamlogos/nba/500/lac.png',
 ARRAY['Southwest', 'Northwest', 'Southeast'],
 'The Clippers share a market with the Lakers in the Pacific Division, both playing in Los Angeles.'),

('Which NBA division do the Los Angeles Lakers play in?', 'Pacific', 'NBA Divisions', 1,
 'https://a.espncdn.com/i/teamlogos/nba/500/lal.png',
 ARRAY['Southwest', 'Northwest', 'Atlantic'],
 'The Lakers are a Pacific Division icon with 17 NBA championships, playing at Crypto.com Arena in Los Angeles.'),

('Which NBA division do the Phoenix Suns play in?', 'Pacific', 'NBA Divisions', 2,
 'https://a.espncdn.com/i/teamlogos/nba/500/phx.png',
 ARRAY['Southwest', 'Northwest', 'Southeast'],
 'The Suns are a Pacific Division franchise based in Phoenix, Arizona, playing at Footprint Center.'),

('Which NBA division do the Sacramento Kings play in?', 'Pacific', 'NBA Divisions', 2,
 'https://a.espncdn.com/i/teamlogos/nba/500/sac.png',
 ARRAY['Southwest', 'Northwest', 'Central'],
 'The Kings are the only Pacific Division team based in Sacramento, California, ending a 16-year playoff drought in 2023.'),

-- Southwest Division
('Which NBA division do the Dallas Mavericks play in?', 'Southwest', 'NBA Divisions', 2,
 'https://a.espncdn.com/i/teamlogos/nba/500/dal.png',
 ARRAY['Southeast', 'Pacific', 'Atlantic'],
 'The Mavericks play in the Southwest Division and won the NBA championship in 2011 led by Dirk Nowitzki.'),

('Which NBA division do the Houston Rockets play in?', 'Southwest', 'NBA Divisions', 2,
 'https://a.espncdn.com/i/teamlogos/nba/500/hou.png',
 ARRAY['Southeast', 'Northwest', 'Atlantic'],
 'The Rockets are a Southwest Division team that won back-to-back NBA titles in 1994 and 1995.'),

('Which NBA division do the Memphis Grizzlies play in?', 'Southwest', 'NBA Divisions', 2,
 'https://a.espncdn.com/i/teamlogos/nba/500/mem.png',
 ARRAY['Southeast', 'Pacific', 'Central'],
 'The Grizzlies moved from Vancouver to Memphis in 2001 and compete in the Southwest Division.'),

('Which NBA division do the New Orleans Pelicans play in?', 'Southwest', 'NBA Divisions', 2,
 'https://a.espncdn.com/i/teamlogos/nba/500/no.png',
 ARRAY['Southeast', 'Pacific', 'Atlantic'],
 'The Pelicans play in the Southwest Division in New Orleans, having been known as the Hornets before 2013.'),

('Which NBA division do the San Antonio Spurs play in?', 'Southwest', 'NBA Divisions', 2,
 'https://a.espncdn.com/i/teamlogos/nba/500/sa.png',
 ARRAY['Southeast', 'Northwest', 'Pacific'],
 'The Spurs are the Southwest Division''s most decorated franchise with five NBA championships.');


-- ── NCAA Football Conferences ─────────────────────────────────────────────────
INSERT INTO public.questions (body, correct_answer, category, difficulty, image_url, wrong_answers, explanation)
VALUES

-- SEC
('Which conference does Alabama football play in?', 'SEC', 'NCAA Conferences', 1,
 'https://a.espncdn.com/i/teamlogos/ncaa/500/333.png',
 ARRAY['Big Ten', 'Big 12', 'ACC'],
 'Alabama is a powerhouse of the SEC and has won multiple national championships under Nick Saban.'),

('Which conference does Auburn football play in?', 'SEC', 'NCAA Conferences', 2,
 'https://a.espncdn.com/i/teamlogos/ncaa/500/2.png',
 ARRAY['Big 12', 'Big Ten', 'ACC'],
 'Auburn plays in the SEC West and is Alabama''s biggest rival — their game is known as the Iron Bowl.'),

('Which conference does Florida football play in?', 'SEC', 'NCAA Conferences', 2,
 'https://a.espncdn.com/i/teamlogos/ncaa/500/57.png',
 ARRAY['ACC', 'Big 12', 'Big Ten'],
 'The Florida Gators compete in the SEC East and have won three national championships.'),

('Which conference does Georgia football play in?', 'SEC', 'NCAA Conferences', 1,
 'https://a.espncdn.com/i/teamlogos/ncaa/500/61.png',
 ARRAY['ACC', 'Big Ten', 'Big 12'],
 'Georgia plays in the SEC East and won back-to-back national championships in 2021 and 2022.'),

('Which conference does Kentucky football play in?', 'SEC', 'NCAA Conferences', 2,
 'https://a.espncdn.com/i/teamlogos/ncaa/500/96.png',
 ARRAY['ACC', 'Big 12', 'Mountain West'],
 'Kentucky plays in the SEC East — the Wildcats are far better known for basketball than football.'),

('Which conference does LSU football play in?', 'SEC', 'NCAA Conferences', 2,
 'https://a.espncdn.com/i/teamlogos/ncaa/500/99.png',
 ARRAY['Big 12', 'ACC', 'Big Ten'],
 'LSU competes in the SEC West and won the national championship in 2019 with Heisman winner Joe Burrow.'),

('Which conference does Mississippi State football play in?', 'SEC', 'NCAA Conferences', 3,
 'https://a.espncdn.com/i/teamlogos/ncaa/500/344.png',
 ARRAY['Big 12', 'ACC', 'Mountain West'],
 'Mississippi State plays in the SEC West and is Ole Miss''s biggest rival in the Egg Bowl.'),

('Which conference does Missouri football play in?', 'SEC', 'NCAA Conferences', 3,
 'https://a.espncdn.com/i/teamlogos/ncaa/500/142.png',
 ARRAY['Big 12', 'Big Ten', 'Mountain West'],
 'Missouri joined the SEC from the Big 12 in 2012 and competes in the SEC East division.'),

('Which conference does Ole Miss football play in?', 'SEC', 'NCAA Conferences', 2,
 'https://a.espncdn.com/i/teamlogos/ncaa/500/145.png',
 ARRAY['Big 12', 'ACC', 'Mountain West'],
 'Ole Miss (University of Mississippi) plays in the SEC West and has produced many NFL stars.'),

('Which conference does Oklahoma football play in?', 'SEC', 'NCAA Conferences', 2,
 'https://a.espncdn.com/i/teamlogos/ncaa/500/201.png',
 ARRAY['Big 12', 'Big Ten', 'Mountain West'],
 'Oklahoma joined the SEC from the Big 12 in 2024, ending a historic rivalry with Texas (also SEC-bound).'),

('Which conference does South Carolina football play in?', 'SEC', 'NCAA Conferences', 2,
 'https://a.espncdn.com/i/teamlogos/ncaa/500/2579.png',
 ARRAY['ACC', 'Big 12', 'Mountain West'],
 'South Carolina plays in the SEC East — their rivalry game with Clemson (ACC) is one of college football''s best.'),

('Which conference does Tennessee football play in?', 'SEC', 'NCAA Conferences', 2,
 'https://a.espncdn.com/i/teamlogos/ncaa/500/2633.png',
 ARRAY['ACC', 'Big Ten', 'Mountain West'],
 'Tennessee plays in the SEC East at Neyland Stadium, one of the largest stadiums in the world.'),

('Which conference does Texas football play in?', 'SEC', 'NCAA Conferences', 2,
 'https://a.espncdn.com/i/teamlogos/ncaa/500/251.png',
 ARRAY['Big 12', 'Big Ten', 'Mountain West'],
 'Texas joined the SEC in 2024 after spending decades as a Big 12 cornerstone alongside rival Oklahoma.'),

('Which conference does Texas A&M football play in?', 'SEC', 'NCAA Conferences', 2,
 'https://a.espncdn.com/i/teamlogos/ncaa/500/245.png',
 ARRAY['Big 12', 'Big Ten', 'Mountain West'],
 'Texas A&M moved from the Big 12 to the SEC West in 2012, playing in one of college football''s toughest divisions.'),

('Which conference does Vanderbilt football play in?', 'SEC', 'NCAA Conferences', 2,
 'https://a.espncdn.com/i/teamlogos/ncaa/500/238.png',
 ARRAY['ACC', 'Big Ten', 'Mountain West'],
 'Vanderbilt plays in the SEC East — the Commodores are known academically as the "Harvard of the South."'),

('Which conference does Arkansas football play in?', 'SEC', 'NCAA Conferences', 2,
 'https://a.espncdn.com/i/teamlogos/ncaa/500/8.png',
 ARRAY['Big 12', 'Big Ten', 'Mountain West'],
 'Arkansas plays in the SEC West and joined the SEC in 1991, leaving the Southwest Conference.'),

-- Big Ten
('Which conference does Michigan football play in?', 'Big Ten', 'NCAA Conferences', 1,
 'https://a.espncdn.com/i/teamlogos/ncaa/500/130.png',
 ARRAY['ACC', 'SEC', 'Big 12'],
 'Michigan is a Big Ten charter member and won the national championship in 2023 under Jim Harbaugh.'),

('Which conference does Ohio State football play in?', 'Big Ten', 'NCAA Conferences', 1,
 'https://a.espncdn.com/i/teamlogos/ncaa/500/194.png',
 ARRAY['ACC', 'SEC', 'Big 12'],
 'Ohio State is one of the Big Ten''s most successful programs, playing "The Game" against Michigan each year.'),

('Which conference does Penn State football play in?', 'Big Ten', 'NCAA Conferences', 2,
 'https://a.espncdn.com/i/teamlogos/ncaa/500/213.png',
 ARRAY['ACC', 'SEC', 'Mountain West'],
 'Penn State joined the Big Ten in 1993 and has been one of the conference''s most decorated programs.'),

('Which conference does Michigan State football play in?', 'Big Ten', 'NCAA Conferences', 2,
 'https://a.espncdn.com/i/teamlogos/ncaa/500/127.png',
 ARRAY['ACC', 'Big 12', 'Mountain West'],
 'Michigan State plays in the Big Ten East and is a fierce rival of Michigan in-state.'),

('Which conference does Wisconsin football play in?', 'Big Ten', 'NCAA Conferences', 2,
 'https://a.espncdn.com/i/teamlogos/ncaa/500/275.png',
 ARRAY['Big 12', 'ACC', 'Mountain West'],
 'Wisconsin is a Big Ten charter member and has been one of the conference''s most consistent programs.'),

('Which conference does Iowa football play in?', 'Big Ten', 'NCAA Conferences', 2,
 'https://a.espncdn.com/i/teamlogos/ncaa/500/2294.png',
 ARRAY['Big 12', 'ACC', 'Mountain West'],
 'Iowa is a Big Ten charter member and plays its home games at Kinnick Stadium in Iowa City.'),

('Which conference does Nebraska football play in?', 'Big Ten', 'NCAA Conferences', 2,
 'https://a.espncdn.com/i/teamlogos/ncaa/500/158.png',
 ARRAY['Big 12', 'Mountain West', 'ACC'],
 'Nebraska joined the Big Ten from the Big 12 in 2011 and won five national championships in the previous era.'),

('Which conference does Oregon football play in?', 'Big Ten', 'NCAA Conferences', 2,
 'https://a.espncdn.com/i/teamlogos/ncaa/500/2483.png',
 ARRAY['Pac-12', 'Mountain West', 'ACC'],
 'Oregon joined the Big Ten in 2024 after spending its history in the Pac-12 conference.'),

('Which conference does USC football play in?', 'Big Ten', 'NCAA Conferences', 2,
 'https://a.espncdn.com/i/teamlogos/ncaa/500/30.png',
 ARRAY['Pac-12', 'Mountain West', 'ACC'],
 'USC joined the Big Ten in 2024 — the Trojans won 11 national championships in the Pac-12 era.'),

('Which conference does UCLA football play in?', 'Big Ten', 'NCAA Conferences', 2,
 'https://a.espncdn.com/i/teamlogos/ncaa/500/26.png',
 ARRAY['Pac-12', 'Mountain West', 'ACC'],
 'UCLA joined the Big Ten in 2024 alongside USC, ending the Pac-12''s run as a major conference.'),

('Which conference does Washington football play in?', 'Big Ten', 'NCAA Conferences', 2,
 'https://a.espncdn.com/i/teamlogos/ncaa/500/264.png',
 ARRAY['Pac-12', 'Mountain West', 'ACC'],
 'Washington joined the Big Ten in 2024 after reaching the national championship game in the 2023 season.'),

('Which conference does Minnesota football play in?', 'Big Ten', 'NCAA Conferences', 2,
 'https://a.espncdn.com/i/teamlogos/ncaa/500/135.png',
 ARRAY['Big 12', 'ACC', 'Mountain West'],
 'Minnesota is a Big Ten charter member and plays for the Little Brown Jug against Michigan.'),

('Which conference does Indiana football play in?', 'Big Ten', 'NCAA Conferences', 2,
 'https://a.espncdn.com/i/teamlogos/ncaa/500/84.png',
 ARRAY['ACC', 'Big 12', 'Mountain West'],
 'Indiana is a Big Ten charter member — the Hoosiers are historically stronger in basketball than football.'),

('Which conference does Purdue football play in?', 'Big Ten', 'NCAA Conferences', 3,
 'https://a.espncdn.com/i/teamlogos/ncaa/500/2509.png',
 ARRAY['ACC', 'Big 12', 'Mountain West'],
 'Purdue is a Big Ten charter member known for engineering programs and producing NFL quarterbacks.'),

('Which conference does Northwestern football play in?', 'Big Ten', 'NCAA Conferences', 3,
 'https://a.espncdn.com/i/teamlogos/ncaa/500/77.png',
 ARRAY['ACC', 'Big 12', 'Mountain West'],
 'Northwestern is the only private university in the Big Ten and plays in Evanston, Illinois.'),

('Which conference does Illinois football play in?', 'Big Ten', 'NCAA Conferences', 3,
 'https://a.espncdn.com/i/teamlogos/ncaa/500/356.png',
 ARRAY['ACC', 'Big 12', 'Mountain West'],
 'Illinois is a Big Ten charter member and plays at Memorial Stadium in Champaign, Illinois.'),

('Which conference does Maryland football play in?', 'Big Ten', 'NCAA Conferences', 3,
 'https://a.espncdn.com/i/teamlogos/ncaa/500/120.png',
 ARRAY['ACC', 'Big 12', 'Mountain West'],
 'Maryland left the ACC to join the Big Ten in 2014, playing in the eastern division.'),

('Which conference does Rutgers football play in?', 'Big Ten', 'NCAA Conferences', 3,
 'https://a.espncdn.com/i/teamlogos/ncaa/500/164.png',
 ARRAY['ACC', 'Big 12', 'Mountain West'],
 'Rutgers joined the Big Ten from the Big East in 2014 and is the easternmost Big Ten program.'),

-- Big 12
('Which conference does Baylor football play in?', 'Big 12', 'NCAA Conferences', 2,
 'https://a.espncdn.com/i/teamlogos/ncaa/500/239.png',
 ARRAY['SEC', 'ACC', 'Mountain West'],
 'Baylor is a Big 12 member in Waco, Texas, and won the national championship in 2021.'),

('Which conference does Iowa State football play in?', 'Big 12', 'NCAA Conferences', 2,
 'https://a.espncdn.com/i/teamlogos/ncaa/500/66.png',
 ARRAY['Big Ten', 'ACC', 'Mountain West'],
 'Iowa State plays in the Big 12 — the Cyclones and in-state rival Iowa (Big Ten) do not play in the same conference.'),

('Which conference does Kansas State football play in?', 'Big 12', 'NCAA Conferences', 2,
 'https://a.espncdn.com/i/teamlogos/ncaa/500/2306.png',
 ARRAY['Big Ten', 'SEC', 'Mountain West'],
 'Kansas State plays in the Big 12 and is a historic rival of Kansas, though their football programs differ greatly.'),

('Which conference does Oklahoma State football play in?', 'Big 12', 'NCAA Conferences', 2,
 'https://a.espncdn.com/i/teamlogos/ncaa/500/197.png',
 ARRAY['SEC', 'ACC', 'Mountain West'],
 'Oklahoma State plays in the Big 12 — the Cowboys remain after rival Oklahoma departed for the SEC in 2024.'),

('Which conference does TCU football play in?', 'Big 12', 'NCAA Conferences', 2,
 'https://a.espncdn.com/i/teamlogos/ncaa/500/2628.png',
 ARRAY['SEC', 'ACC', 'Mountain West'],
 'TCU plays in the Big 12 and reached the national championship game in 2022.'),

('Which conference does Texas Tech football play in?', 'Big 12', 'NCAA Conferences', 2,
 'https://a.espncdn.com/i/teamlogos/ncaa/500/2641.png',
 ARRAY['SEC', 'Mountain West', 'ACC'],
 'Texas Tech plays in the Big 12 in Lubbock and is a charter member of the conference.'),

('Which conference does West Virginia football play in?', 'Big 12', 'NCAA Conferences', 2,
 'https://a.espncdn.com/i/teamlogos/ncaa/500/277.png',
 ARRAY['ACC', 'Big Ten', 'Mountain West'],
 'West Virginia joined the Big 12 from the Big East in 2012 and is the conference''s easternmost school.'),

('Which conference does BYU football play in?', 'Big 12', 'NCAA Conferences', 2,
 'https://a.espncdn.com/i/teamlogos/ncaa/500/252.png',
 ARRAY['Mountain West', 'ACC', 'Big Ten'],
 'BYU joined the Big 12 in 2023 after years as an independent and previous Mountain West membership.'),

('Which conference does Cincinnati football play in?', 'Big 12', 'NCAA Conferences', 3,
 'https://a.espncdn.com/i/teamlogos/ncaa/500/2132.png',
 ARRAY['ACC', 'Mountain West', 'Big Ten'],
 'Cincinnati joined the Big 12 in 2023, having previously been a dominant American Athletic Conference program.'),

('Which conference does Colorado football play in?', 'Big 12', 'NCAA Conferences', 2,
 'https://a.espncdn.com/i/teamlogos/ncaa/500/38.png',
 ARRAY['Pac-12', 'Mountain West', 'Big Ten'],
 'Colorado returned to the Big 12 in 2024 after a stint in the Pac-12, following coach Deion Sanders.'),

('Which conference does Houston football play in?', 'Big 12', 'NCAA Conferences', 3,
 'https://a.espncdn.com/i/teamlogos/ncaa/500/248.png',
 ARRAY['ACC', 'Mountain West', 'Big Ten'],
 'Houston joined the Big 12 in 2023 after building a powerhouse program in the American Athletic Conference.'),

('Which conference does UCF football play in?', 'Big 12', 'NCAA Conferences', 3,
 'https://a.espncdn.com/i/teamlogos/ncaa/500/2116.png',
 ARRAY['ACC', 'Mountain West', 'Big Ten'],
 'UCF joined the Big 12 in 2023 — the Knights famously claimed a national championship in 2017.'),

('Which conference does Utah football play in?', 'Big 12', 'NCAA Conferences', 2,
 'https://a.espncdn.com/i/teamlogos/ncaa/500/254.png',
 ARRAY['Mountain West', 'ACC', 'Big Ten'],
 'Utah joined the Big 12 in 2024 after spending years in the Pac-12, winning back-to-back Pac-12 titles.'),

('Which conference does Arizona football play in?', 'Big 12', 'NCAA Conferences', 2,
 'https://a.espncdn.com/i/teamlogos/ncaa/500/12.png',
 ARRAY['Pac-12', 'Mountain West', 'ACC'],
 'Arizona joined the Big 12 in 2024 from the Pac-12, along with Arizona State, Colorado, and Utah.'),

('Which conference does Arizona State football play in?', 'Big 12', 'NCAA Conferences', 2,
 'https://a.espncdn.com/i/teamlogos/ncaa/500/9.png',
 ARRAY['Pac-12', 'Mountain West', 'ACC'],
 'Arizona State joined the Big 12 in 2024 from the Pac-12 as part of the conference realignment wave.'),

('Which conference does Kansas football play in?', 'Big 12', 'NCAA Conferences', 2,
 'https://a.espncdn.com/i/teamlogos/ncaa/500/2305.png',
 ARRAY['Big Ten', 'ACC', 'Mountain West'],
 'Kansas plays in the Big 12 — the Jayhawks are far better known for basketball but are a charter Big 12 member.'),

-- ACC
('Which conference does Clemson football play in?', 'ACC', 'NCAA Conferences', 1,
 'https://a.espncdn.com/i/teamlogos/ncaa/500/228.png',
 ARRAY['SEC', 'Big 12', 'Big Ten'],
 'Clemson is the ACC''s premier football program, winning two national championships (2016, 2018).'),

('Which conference does Florida State football play in?', 'ACC', 'NCAA Conferences', 2,
 'https://a.espncdn.com/i/teamlogos/ncaa/500/52.png',
 ARRAY['SEC', 'Big 12', 'Big Ten'],
 'Florida State is a cornerstone of the ACC, winning three national championships under Bobby Bowden and Mike Norvell.'),

('Which conference does Miami football play in?', 'ACC', 'NCAA Conferences', 2,
 'https://a.espncdn.com/i/teamlogos/ncaa/500/2390.png',
 ARRAY['SEC', 'Big 12', 'Big Ten'],
 'Miami (FL) is an ACC member and was a dynasty in the 1980s and 2001, winning five national championships.'),

('Which conference does North Carolina football play in?', 'ACC', 'NCAA Conferences', 2,
 'https://a.espncdn.com/i/teamlogos/ncaa/500/153.png',
 ARRAY['SEC', 'Big 12', 'Mountain West'],
 'UNC plays in the ACC and is better known for basketball but has been competitive in football recently.'),

('Which conference does NC State football play in?', 'ACC', 'NCAA Conferences', 3,
 'https://a.espncdn.com/i/teamlogos/ncaa/500/152.png',
 ARRAY['SEC', 'Big 12', 'Mountain West'],
 'NC State plays in the ACC and is in-state rival of UNC and Duke within the conference.'),

('Which conference does Virginia Tech football play in?', 'ACC', 'NCAA Conferences', 2,
 'https://a.espncdn.com/i/teamlogos/ncaa/500/259.png',
 ARRAY['SEC', 'Big Ten', 'Mountain West'],
 'Virginia Tech joined the ACC in 2004 and had a legendary run under coach Frank Beamer.'),

('Which conference does Georgia Tech football play in?', 'ACC', 'NCAA Conferences', 2,
 'https://a.espncdn.com/i/teamlogos/ncaa/500/59.png',
 ARRAY['SEC', 'Big 12', 'Mountain West'],
 'Georgia Tech plays in the ACC and is a rival of SEC member Georgia — the two schools share Atlanta.'),

('Which conference does Louisville football play in?', 'ACC', 'NCAA Conferences', 2,
 'https://a.espncdn.com/i/teamlogos/ncaa/500/97.png',
 ARRAY['SEC', 'Big 12', 'Mountain West'],
 'Louisville joined the ACC from the Big East in 2014, competing in the Atlantic division.'),

('Which conference does Pittsburgh football play in?', 'ACC', 'NCAA Conferences', 2,
 'https://a.espncdn.com/i/teamlogos/ncaa/500/221.png',
 ARRAY['Big Ten', 'Big 12', 'Mountain West'],
 'Pitt joined the ACC in 2013 from the Big East and has produced legends like Tony Dorsett and Dan Marino.'),

('Which conference does Notre Dame football play in?', 'ACC', 'NCAA Conferences', 2,
 'https://a.espncdn.com/i/teamlogos/ncaa/500/87.png',
 ARRAY['Big Ten', 'Big 12', 'Mountain West'],
 'Notre Dame joined the ACC as a full member in 2024, ending decades as a football independent.'),

('Which conference does SMU football play in?', 'ACC', 'NCAA Conferences', 3,
 'https://a.espncdn.com/i/teamlogos/ncaa/500/2567.png',
 ARRAY['Big 12', 'Mountain West', 'Big Ten'],
 'SMU joined the ACC in 2024 after dominant runs in the American Athletic Conference.'),

('Which conference does Stanford football play in?', 'ACC', 'NCAA Conferences', 2,
 'https://a.espncdn.com/i/teamlogos/ncaa/500/24.png',
 ARRAY['Pac-12', 'Big Ten', 'Mountain West'],
 'Stanford joined the ACC in 2024 from the Pac-12, bringing its academic prestige and football history.'),

('Which conference does California football play in?', 'ACC', 'NCAA Conferences', 2,
 'https://a.espncdn.com/i/teamlogos/ncaa/500/25.png',
 ARRAY['Pac-12', 'Big Ten', 'Mountain West'],
 'Cal joined the ACC in 2024 as part of the Pac-12 dissolution, competing in the Atlantic Coast Conference.'),

('Which conference does Syracuse football play in?', 'ACC', 'NCAA Conferences', 2,
 'https://a.espncdn.com/i/teamlogos/ncaa/500/183.png',
 ARRAY['Big East', 'Big Ten', 'Mountain West'],
 'Syracuse joined the ACC from the Big East in 2013, playing in the Atlantic Division.'),

('Which conference does Wake Forest football play in?', 'ACC', 'NCAA Conferences', 3,
 'https://a.espncdn.com/i/teamlogos/ncaa/500/154.png',
 ARRAY['SEC', 'Big 12', 'Mountain West'],
 'Wake Forest is an ACC charter member and the conference''s smallest school by enrollment.'),

('Which conference does Duke football play in?', 'ACC', 'NCAA Conferences', 2,
 'https://a.espncdn.com/i/teamlogos/ncaa/500/150.png',
 ARRAY['SEC', 'Big 12', 'Mountain West'],
 'Duke plays in the ACC and is one of the few schools better known for basketball than football within the conference.'),

('Which conference does Boston College football play in?', 'ACC', 'NCAA Conferences', 2,
 'https://a.espncdn.com/i/teamlogos/ncaa/500/103.png',
 ARRAY['Big East', 'Big Ten', 'Mountain West'],
 'Boston College joined the ACC in 2005 and is the conference''s northernmost school.'),

('Which conference does Virginia football play in?', 'ACC', 'NCAA Conferences', 3,
 'https://a.espncdn.com/i/teamlogos/ncaa/500/258.png',
 ARRAY['SEC', 'Big 12', 'Mountain West'],
 'Virginia is an ACC charter member and a rival of Virginia Tech within the conference.'),

-- Mountain West
('Which conference does Boise State football play in?', 'Mountain West', 'NCAA Conferences', 2,
 'https://a.espncdn.com/i/teamlogos/ncaa/500/68.png',
 ARRAY['Big 12', 'ACC', 'Big Ten'],
 'Boise State plays in the Mountain West on their famous blue turf and has long been a Group of Five powerhouse.'),

('Which conference does Air Force football play in?', 'Mountain West', 'NCAA Conferences', 3,
 'https://a.espncdn.com/i/teamlogos/ncaa/500/2005.png',
 ARRAY['Big 12', 'ACC', 'Big Ten'],
 'Air Force competes in the Mountain West and is known for running the triple-option offense.'),

('Which conference does Colorado State football play in?', 'Mountain West', 'NCAA Conferences', 3,
 'https://a.espncdn.com/i/teamlogos/ncaa/500/36.png',
 ARRAY['Big 12', 'ACC', 'Big Ten'],
 'Colorado State plays in the Mountain West and is the in-state rival of Big 12 member Colorado.'),

('Which conference does Fresno State football play in?', 'Mountain West', 'NCAA Conferences', 3,
 'https://a.espncdn.com/i/teamlogos/ncaa/500/278.png',
 ARRAY['Big 12', 'ACC', 'Mountain West'],
 'Fresno State is a Mountain West member and one of the Group of Five''s more successful programs.'),

('Which conference does San Diego State football play in?', 'Mountain West', 'NCAA Conferences', 3,
 'https://a.espncdn.com/i/teamlogos/ncaa/500/21.png',
 ARRAY['Big 12', 'ACC', 'Big Ten'],
 'San Diego State plays in the Mountain West and has been one of the conference''s most consistent programs.'),

('Which conference does Utah State football play in?', 'Mountain West', 'NCAA Conferences', 3,
 'https://a.espncdn.com/i/teamlogos/ncaa/500/328.png',
 ARRAY['Big 12', 'ACC', 'Big Ten'],
 'Utah State plays in the Mountain West and is the in-state rival of Big 12 member Utah.'),

('Which conference does Wyoming football play in?', 'Mountain West', 'NCAA Conferences', 3,
 'https://a.espncdn.com/i/teamlogos/ncaa/500/2751.png',
 ARRAY['Big 12', 'ACC', 'Big Ten'],
 'Wyoming plays in the Mountain West at Jonah Field War Memorial Stadium, one of the highest-elevation FBS stadiums.'),

('Which conference does UNLV football play in?', 'Mountain West', 'NCAA Conferences', 3,
 'https://a.espncdn.com/i/teamlogos/ncaa/500/2439.png',
 ARRAY['Big 12', 'ACC', 'Big Ten'],
 'UNLV plays in the Mountain West in Las Vegas, Nevada, sharing the market with the NFL''s Raiders.'),

('Which conference does Nevada football play in?', 'Mountain West', 'NCAA Conferences', 3,
 'https://a.espncdn.com/i/teamlogos/ncaa/500/2440.png',
 ARRAY['Big 12', 'ACC', 'Big Ten'],
 'Nevada plays in the Mountain West in Reno — the Wolf Pack famously upset Boise State in 2010.'),

('Which conference does Hawaii football play in?', 'Mountain West', 'NCAA Conferences', 3,
 'https://a.espncdn.com/i/teamlogos/ncaa/500/62.png',
 ARRAY['Big 12', 'ACC', 'Big Ten'],
 'Hawaii plays in the Mountain West and has a unique schedule due to travel challenges to the islands.'),

('Which conference does New Mexico football play in?', 'Mountain West', 'NCAA Conferences', 3,
 'https://a.espncdn.com/i/teamlogos/ncaa/500/167.png',
 ARRAY['Big 12', 'ACC', 'Big Ten'],
 'New Mexico plays in the Mountain West and is the state flagship rival of New Mexico State.'),

('Which conference does San Jose State football play in?', 'Mountain West', 'NCAA Conferences', 3,
 'https://a.espncdn.com/i/teamlogos/ncaa/500/23.png',
 ARRAY['Big 12', 'ACC', 'Big Ten'],
 'San Jose State plays in the Mountain West and won the conference championship in 2020.');
