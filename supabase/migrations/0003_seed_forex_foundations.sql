-- Idempotent starter curriculum for the first production-ready learning path.
insert into public.courses (slug, title, description, status)
values ('forex-foundations', 'Forex Foundations', 'Learn how currency markets work, how to manage risk, and how to build a disciplined trading process.', 'published')
on conflict (slug) do update set title = excluded.title, description = excluded.description, status = excluded.status, updated_at = now();

with course as (select id from public.courses where slug = 'forex-foundations')
insert into public.modules (course_id, title, position, description, status)
select course.id, data.title, data.position, data.description, 'published'::public.content_status
from course cross join (values
  ('Market Foundations', 1, 'Understand pairs, price quotes, pips, lots and spread.'),
  ('Risk Before Reward', 2, 'Protect capital with position sizing, stops and risk-to-reward thinking.'),
  ('Building a Trading Process', 3, 'Turn analysis into a repeatable plan with journaling and review.')
) as data(title, position, description)
on conflict (course_id, position) do update set title = excluded.title, description = excluded.description, status = excluded.status;

with course as (select id from public.courses where slug = 'forex-foundations'),
module as (select id from public.modules where course_id = (select id from course) and position = 1)
insert into public.lessons (module_id, title, position, content, estimated_minutes, status)
select module.id, data.title, data.position, data.content::jsonb, data.minutes, 'published'::public.content_status from module cross join (values
 ('How currency pairs work', 1, '{"body":["Every forex quote compares two currencies. The first is the base currency and the second is the quote currency.","EUR/USD at 1.1000 means one euro is valued at 1.10 US dollars.","When the quote rises, the base currency has strengthened relative to the quote currency."]}', 6),
 ('Pips, lots and spread', 2, '{"body":["A pip is a standardized unit of price movement used to describe changes in an exchange rate.","Lot size controls how much money each pip is worth, so position size directly affects risk.","The spread is the distance between the bid and ask and is part of the cost of entering a trade."]}', 8)
) as data(title, position, content, minutes)
on conflict (module_id, position) do update set title = excluded.title, content = excluded.content, estimated_minutes = excluded.estimated_minutes, status = excluded.status;

with course as (select id from public.courses where slug = 'forex-foundations'), module as (select id from public.modules where course_id = (select id from course) and position = 2)
insert into public.lessons (module_id, title, position, content, estimated_minutes, status)
select module.id, data.title, data.position, data.content::jsonb, data.minutes, 'published'::public.content_status from module cross join (values
 ('Risk per trade', 1, '{"body":["Choose the maximum percentage of your account you are willing to lose before entering a trade.","Many disciplined traders use a small fixed fraction of capital so a losing streak cannot destroy the account.","Risk is decided before entry, not after the market moves against you."]}', 7),
 ('Stops and risk-to-reward', 2, '{"body":["A stop loss defines where the trade idea is invalidated.","Risk-to-reward compares the amount you could lose with the amount you reasonably expect to gain.","A high win rate is not enough if average losses are much larger than average wins."]}', 9)
) as data(title, position, content, minutes)
on conflict (module_id, position) do update set title = excluded.title, content = excluded.content, estimated_minutes = excluded.estimated_minutes, status = excluded.status;

with course as (select id from public.courses where slug = 'forex-foundations'), module as (select id from public.modules where course_id = (select id from course) and position = 3)
insert into public.lessons (module_id, title, position, content, estimated_minutes, status)
select module.id, data.title, data.position, data.content::jsonb, data.minutes, 'published'::public.content_status from module cross join (values
 ('Write the plan before the trade', 1, '{"body":["Define setup, entry, invalidation, target and risk before placing an order.","A written plan reduces impulsive decisions when price starts moving quickly.","If a trade does not match the plan, skipping it is a valid decision."]}', 8),
 ('Journal and review', 2, '{"body":["Record the reason for the trade, the result and whether you followed your rules.","Review patterns across many trades instead of judging the process from one outcome.","The goal of a journal is to improve decision quality, not to create perfect hindsight."]}', 8)
) as data(title, position, content, minutes)
on conflict (module_id, position) do update set title = excluded.title, content = excluded.content, estimated_minutes = excluded.estimated_minutes, status = excluded.status;

with course as (select id from public.courses where slug = 'forex-foundations')
insert into public.quizzes (module_id, title, passing_score, xp_reward, status)
select module.id, data.title, data.passing_score, data.xp_reward, 'published'::public.content_status
from public.modules module
join course on course.id = module.course_id
join (values
  (1, 'Market Foundations Check', 70, 20),
  (2, 'Risk Management Check', 75, 25),
  (3, 'Trading Process Check', 75, 25)
) as data(position, title, passing_score, xp_reward) on data.position = module.position
on conflict (module_id) do update set title = excluded.title, passing_score = excluded.passing_score, xp_reward = excluded.xp_reward, status = excluded.status;

with q as (
  select quizzes.id as quiz_id, modules.position as module_position
  from public.quizzes join public.modules on public.modules.id = quizzes.module_id
  join public.courses on public.courses.id = modules.course_id
  where public.courses.slug = 'forex-foundations'
), data(module_position, position, prompt, answers, correct_index, explanation) as (values
  (1,1,'In EUR/USD, which currency is the base currency?','["EUR","USD","Both"]'::jsonb,0,'The first currency in the pair is the base currency.'),
  (1,2,'What does the spread represent?','["The difference between bid and ask","Your account balance","Guaranteed profit"]'::jsonb,0,'The spread is the distance between bid and ask.'),
  (1,3,'Why does lot size matter?','["It controls exposure per pip","It predicts direction","It removes trading costs"]'::jsonb,0,'Lot size determines exposure and therefore risk.'),
  (2,1,'When should risk be decided?','["Before entering the trade","After a loss","Only after profit appears"]'::jsonb,0,'Risk belongs in the plan before entry.'),
  (2,2,'What is the main purpose of a stop loss?','["Define invalidation and limit loss","Guarantee profit","Increase leverage"]'::jsonb,0,'A stop identifies where the trade idea is invalid.'),
  (2,3,'What does 1:2 risk-to-reward mean?','["Potential reward is twice the planned risk","Risk is twice the reward","The trade must win twice"]'::jsonb,0,'A 1:2 setup risks one unit for a potential two-unit reward.'),
  (3,1,'What should a trading plan include before entry?','["Setup, entry, invalidation, target and risk","Only a profit target","Only market news"]'::jsonb,0,'A complete plan defines both the opportunity and the risk.'),
  (3,2,'Why keep a journal?','["To improve decisions across many trades","To prove every trade was correct","To avoid using stops"]'::jsonb,0,'A journal helps identify repeatable strengths and mistakes.'),
  (3,3,'What is a valid decision when a setup breaks your rules?','["Skip the trade","Increase size","Remove the stop"]'::jsonb,0,'Not trading is part of disciplined execution.')
)
insert into public.quiz_questions (quiz_id, position, prompt, answers, correct_answer_index, explanation)
select q.quiz_id, data.position, data.prompt, data.answers, data.correct_index, data.explanation from q join data on data.module_position = q.module_position
on conflict (quiz_id, position) do update set prompt = excluded.prompt, answers = excluded.answers, correct_answer_index = excluded.correct_answer_index, explanation = excluded.explanation;
