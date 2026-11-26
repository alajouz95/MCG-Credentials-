/* MCG AI Readiness Assessment: English copy */
window.MCG_COPY = window.MCG_COPY || {};
window.MCG_COPY.en = {
  dir: 'ltr',
  ui: {
    langLabel: 'عربي',
    tag: 'Free · No sign-up · Instant results',
    title: 'AI Readiness Assessment',
    sub: 'Find out how ready you are for AI. Free, with instant results and clear next steps.',
    cue: 'Choose one to start',
    business: { title: 'For my business', meta: '15 questions · about 5 minutes' },
    individual: { title: 'For myself', meta: '10 questions · about 3 minutes' },
    questionOf: function (x, y) { return 'Question ' + x + ' of ' + y; },
    back: 'Back',
    startOver: 'Start over',
    keysHint: 'Tap an answer, or press 1 to 4',
    resultsKicker: 'Your results',
    overall: 'Overall score',
    outOf: 'out of 100',
    level: 'Level',
    byDimension: 'By dimension',
    shape: 'Your readiness shape',
    tiers: { start: 'Start', build: 'Build', advance: 'Advance' },
    recTitle: { business: 'What your business should do', individual: 'What you should do' },
    recSub: 'One action for each area, starting with where you need it most.',
    movesTitle: 'Your next three moves',
    talkTitle: 'Talk to the {logo} AI team',
    talkBody: 'From AI consulting and strategy, to private AI that runs on your own servers, to hands-on training for your teams, we can help you take the next step.',
    talkScan: 'Scan to continue on your phone',
    note: { all: 'These results are indicative and based only on the answers given.', business: ' They are not a formal technical or security audit.' },
    idle: 'Starting over for the next visitor'
  },
  business: {
    levels: [
      { name: 'Exploring', desc: 'AI isn’t part of how your organization works yet, and that is a common starting point. The fastest progress comes from a clear owner, a few simple rules and one or two small wins.' },
      { name: 'Emerging', desc: 'You have started, with some tools and interest in place, but the effort is scattered. Now is the time to agree priorities, set rules for data and train your people.' },
      { name: 'Scaling', desc: 'AI is already creating value in parts of your business. The next step is to connect it to your systems and data, and spread it safely across more teams.' },
      { name: 'AI-powered', desc: 'AI is built into how you plan, decide and operate. Stay ahead by measuring results, governing carefully and testing new ideas early.' }
    ],
    dims: [
      { key: 'strategy', name: 'Strategy and leadership', qs: [
        { q: 'How does your leadership team currently treat AI?', a: ['It hasn’t come up as a topic yet', 'It’s discussed, but no one owns it', 'A senior leader sponsors a few AI initiatives', 'It’s a leadership priority with clear owners and goals'] },
        { q: 'Does your organization have a documented AI strategy or roadmap?', a: ['No, nothing is written down', 'Some ideas, but nothing formal', 'A draft roadmap for some departments', 'Yes, an approved roadmap linked to business goals'] },
        { q: 'How is AI funded?', a: ['There is no budget for AI', 'Small one-off amounts when someone asks', 'Budget for specific pilots or projects', 'A dedicated, recurring AI budget'] }
      ] },
      { key: 'tech', name: 'Technology and infrastructure', qs: [
        { q: 'Which AI tools do employees use today?', a: ['None that we know of', 'Free public tools, on personal accounts', 'A few approved business tools in some teams', 'Approved AI tools, available across the company'] },
        { q: 'How well can your core systems (ERP, CRM, documents) connect to new tools?', a: ['They are mostly closed, or still on paper', 'Only through manual exports and imports', 'Some systems have APIs or integrations', 'Most systems connect easily through APIs'] },
        { q: 'Where can AI workloads run for your organization?', a: ['We haven’t looked into it', 'Only on public cloud tools, with no clear rules', 'In approved cloud services with agreed controls', 'Cloud, hybrid or on our own servers, depending on the data'] }
      ] },
      { key: 'data', name: 'Data and governance', qs: [
        { q: 'How organized is the information AI would need to use?', a: ['Scattered across emails, desktops and paper', 'Partly in shared folders, and hard to find', 'Mostly in central systems, with some gaps', 'Organized, up to date and easy to search'] },
        { q: 'Do you have a policy for how employees may use AI with company data?', a: ['No policy', 'Informal guidance that isn’t written down', 'A written policy that few people know about', 'A clear policy that everyone knows and follows'] },
        { q: 'How is access to sensitive information controlled?', a: ['Most people can see most things', 'Basic controls on some systems', 'Role-based access on key systems', 'Role-based access everywhere, reviewed regularly'] }
      ] },
      { key: 'process', name: 'Processes and automation', qs: [
        { q: 'How well documented are your key business processes?', a: ['They live in people’s heads', 'A few are written down', 'Most key processes are documented', 'Documented, measured and kept up to date'] },
        { q: 'How much routine work is automated today?', a: ['Almost none', 'A few simple automations', 'Several processes are partly automated', 'Routine work is automated wherever it makes sense'] },
        { q: 'How do you choose where to apply AI?', a: ['We haven’t started choosing', 'Whatever tool someone happens to try', 'We pick use cases department by department', 'We rank use cases by value and effort, across the company'] }
      ] },
      { key: 'people', name: 'People and culture', qs: [
        { q: 'How would you describe AI skills across your workforce?', a: ['Very limited', 'A few enthusiasts teach themselves', 'Some teams have had training', 'Most people are trained and use AI well'] },
        { q: 'How do employees feel about AI at work?', a: ['Worried or unsure', 'Curious, but hesitant', 'Mostly positive', 'Keen, and asking for more'] },
        { q: 'How is the adoption of new technology usually managed?', a: ['Tools are rolled out with little support', 'Some training at launch, then nothing', 'Training and support for the main rollouts', 'A clear change plan, with champions and follow-up'] }
      ] }
    ],
    recs: {
      strategy: { start: 'Name one senior owner for AI and agree two or three business goals it should support.', build: 'Turn your ideas into a written 12-month AI roadmap with owners, budget and milestones.', advance: 'Review the roadmap every quarter against measured results, and put more budget behind what works.' },
      tech: { start: 'Choose one approved AI tool for business use, and stop work data going into personal accounts.', build: 'Connect AI to one core system, such as your CRM or document library, through a secure integration.', advance: 'Set up a mix of cloud, hybrid and private AI, so each workload runs where its data belongs.' },
      data: { start: 'Write a one-page AI usage policy that says what data can and cannot go into AI tools.', build: 'Clean up and centralize the documents and data behind your top use cases, with clear access rights.', advance: 'Add regular access reviews and audit logs for AI, and update your policy as the tools change.' },
      process: { start: 'List ten repetitive tasks across your departments and pick one to automate as a pilot.', build: 'Document your key processes and rank your AI use cases by value and effort.', advance: 'Move from single tasks to end-to-end workflows, with people approving the important steps.' },
      people: { start: 'Run a short AI awareness session for managers, so understanding replaces worry.', build: 'Train each department on AI for its own work, and appoint an AI champion in every team.', advance: 'Make AI skills part of onboarding and performance reviews, and share wins across teams.' }
    },
    moves: [
      ['Appoint an AI owner and set two clear goals.', 'Write a one-page AI usage policy.', 'Run one small pilot with one team.'],
      ['Agree a 12-month roadmap with clear priorities.', 'Roll out one approved AI tool, with training.', 'Organize the data behind your top use case.'],
      ['Connect AI to your core systems.', 'Scale your best pilots to more teams.', 'Measure results and report them to leadership.'],
      ['Run private or hybrid AI for sensitive work.', 'Automate end-to-end workflows, with human approval.', 'Keep testing new ideas in an innovation lab.']
    ]
  },
  individual: {
    levels: [
      { name: 'Observer', desc: 'You are aware of AI, but it isn’t part of your work yet. A little hands-on practice each week is the best way to start.' },
      { name: 'Explorer', desc: 'You have tried AI and you can see the potential. Better prompting habits and checking what it gives you will turn experiments into real results.' },
      { name: 'Practitioner', desc: 'You use AI regularly and get real value from it. Now go deeper: build repeatable ways of working, and help colleagues get there too.' },
      { name: 'AI-fluent', desc: 'AI is part of how you think and work, and you use it with good judgment. Share what you know, and keep testing new tools as they arrive.' }
    ],
    dims: [
      { key: 'mindset', name: 'Awareness and mindset', qs: [
        { q: 'How well do you understand what today’s AI tools can and cannot do?', a: ['Not really', 'I have a general idea', 'I know the main strengths and limits', 'Well. I know where AI helps and where it fails'] },
        { q: 'How do you feel about AI’s effect on your work?', a: ['Worried about it', 'Unsure', 'Mostly positive', 'Excited. I see clear chances to do more'] }
      ] },
      { key: 'tools', name: 'Tools and daily use', qs: [
        { q: 'How often do you use AI tools?', a: ['Never', 'Once in a while', 'Every week', 'Every day'] },
        { q: 'What do you use AI for?', a: ['I don’t use it yet', 'Quick questions, like a search engine', 'Writing, summarizing and ideas', 'Real parts of my work: analysis, content, planning and more'] }
      ] },
      { key: 'skills', name: 'Skills and prompting', qs: [
        { q: 'How do you usually write a request to an AI tool?', a: ['I haven’t tried', 'A short question', 'A few sentences with some context', 'Context, a clear task, examples and the format I want'] },
        { q: 'What do you do when the first answer is not good enough?', a: ['I give up', 'I ask the same thing again', 'I rephrase my request', 'I give feedback and refine it step by step'] }
      ] },
      { key: 'judgment', name: 'Judgment and responsible use', qs: [
        { q: 'How do you check what AI gives you?', a: ['I don’t check', 'I check if something looks wrong', 'I check the facts and figures that matter', 'I always verify before I use or share anything'] },
        { q: 'How careful are you with the information you share with AI tools?', a: ['I haven’t thought about it', 'I avoid anything obviously private', 'I follow my company’s rules', 'I never share confidential data with tools that aren’t approved'] }
      ] },
      { key: 'growth', name: 'Learning and growth', qs: [
        { q: 'How do you keep your AI skills current?', a: ['I don’t', 'I pick things up now and then', 'I follow a few sources and try new tools', 'I learn on purpose: courses, communities and practice'] },
        { q: 'Has AI changed how you do a regular task?', a: ['No', 'I tried, but it didn’t stick', 'Yes, one or two tasks', 'Yes, several tasks are now faster or better'] }
      ] }
    ],
    recs: {
      mindset: { start: 'Spend 30 minutes trying an AI assistant on a real task from your week, and note what it did well and badly.', build: 'Learn where AI tends to go wrong, such as facts, numbers and recent events, so you know when to rely on it.', advance: 'Follow how AI is changing your field, and look for the new work it opens up for you.' },
      tools: { start: 'Pick one AI assistant your company allows, and use it for one small task every day this week.', build: 'Use AI for a bigger part of your work, such as first drafts, summaries or research.', advance: 'Build repeatable routines: saved prompts, templates and tools that fit your daily work.' },
      skills: { start: 'Start every request with some context, the task, and the format you want back.', build: 'Add examples and limits to your requests, and ask for several options to choose from.', advance: 'Break big jobs into steps and chain your requests, refining the result at each step.' },
      judgment: { start: 'Never paste confidential company or personal data into public AI tools.', build: 'Check every important fact, figure and quote before you use what AI gives you.', advance: 'Keep a clear review habit for anything AI helps you make, and help your team do the same.' },
      growth: { start: 'Follow one reliable AI newsletter or community, and try one new thing each month.', build: 'Take a structured course or workshop on AI for your kind of work.', advance: 'Teach others: share your best prompts and ways of working with your team.' }
    },
    moves: [
      ['Try an AI assistant on a real task this week.', 'Learn the basics of writing a good request.', 'Check your company’s rules on using AI.'],
      ['Use AI every day for one type of task.', 'Practice giving context and examples.', 'Always check facts before you share.'],
      ['Save your best prompts as templates.', 'Automate one recurring task.', 'Show a colleague how you use AI.'],
      ['Lead an AI initiative in your team.', 'Test new tools as they come out.', 'Mentor others and share what works.']
    ]
  }
};
