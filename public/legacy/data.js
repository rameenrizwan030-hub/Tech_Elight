/**
 * BudgetBasics - Data Loader & State Store
 * Handles dynamic JSON loading with graceful offline fallbacks and error prevention
 * Strictly NO emojis
 */

const BB_DATA = {
  learning: null,
  planning: null,
  resources: null,
  gallery: null,
  chatbot: null,
  games: null,
  tips: null,
  mistakes: null,
  checklist: null,
  budgeting: null,
  needsWants: null,
  activePlanningTool: 'rule-503020',
  budgetItems: [
    { id: 1, name: 'Hostel / Rent Share', category: 'Housing / Rent', type: 'Needs', amount: 16000 },
    { id: 2, name: 'Campus Meal Plan & Staples', category: 'Groceries & Staples', type: 'Needs', amount: 8000 },
    { id: 3, name: 'Metro / Bus Monthly Pass', category: 'Required Transit', type: 'Needs', amount: 2500 },
    { id: 4, name: 'Weekend Dining with Friends', category: 'Dining Out & Takeaway', type: 'Wants', amount: 4000 },
    { id: 5, name: 'Streaming & Music Service', category: 'Streaming & Gaming', type: 'Wants', amount: 1200 },
    { id: 6, name: 'Emergency Reserve Deposit', category: 'Emergency Buffer', type: 'Savings', amount: 5000 }
  ]
};

// Formatter for currency
const formatMoney = (amount) => {
  const num = Number(amount) || 0;
  return 'Rs. ' + num.toLocaleString('en-PK', { maximumFractionDigits: 0 });
};

// Robust JSON loader
async function fetchJSON(endpoint) {
  try {
    const res = await fetch(`data/${endpoint}`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data = await res.json();
    return data;
  } catch (err) {
    console.warn(`Notice: Could not load data/${endpoint}, applying built-in offline dataset.`);
    return null;
  }
}

// Master init data
async function initAppData() {
  let learningRes = null, planningRes = null, resourcesRes = null, galleryRes = null;
  let chatbotRes = null, gamesRes = null, tipsRes = null, mistakesRes = null;
  let checklistRes = null, budgetingRes = null, needsWantsRes = null, visualLearningRes = null;

  // Only attempt network fetches if not running via file:// protocol
  if (typeof window !== 'undefined' && window.location && window.location.protocol !== 'file:') {
    try {
      const results = await Promise.all([
        fetchJSON('learning.json'),
        fetchJSON('planning.json'),
        fetchJSON('resources.json'),
        fetchJSON('gallery.json'),
        fetchJSON('chatbot.json'),
        fetchJSON('games.json'),
        fetchJSON('tips.json'),
        fetchJSON('mistakes.json'),
        fetchJSON('checklist.json'),
        fetchJSON('budgeting.json'),
        fetchJSON('needs-wants.json'),
        fetchJSON('visual-learning.json')
      ]);
      [
        learningRes, planningRes, resourcesRes, galleryRes,
        chatbotRes, gamesRes, tipsRes, mistakesRes,
        checklistRes, budgetingRes, needsWantsRes, visualLearningRes
      ] = results;
    } catch (e) {
      console.warn('Network fetch encountered notice, using local offline dataset.', e);
    }
  }

  BB_DATA.learning = learningRes || getDefaultLearning();
  BB_DATA.planning = planningRes || getDefaultPlanning();
  BB_DATA.resources = resourcesRes || getDefaultResources();
  BB_DATA.gallery = galleryRes || getDefaultGallery();
  BB_DATA.chatbot = chatbotRes || getDefaultChatbot();
  BB_DATA.games = gamesRes || getDefaultGames();
  BB_DATA.tips = tipsRes || getDefaultTips();
  BB_DATA.mistakes = mistakesRes || getDefaultMistakes();
  BB_DATA.checklist = (checklistRes && checklistRes.checklist) ? checklistRes.checklist : getDefaultChecklist();
  BB_DATA.budgeting = budgetingRes || getDefaultBudgeting();
  BB_DATA.needsWants = needsWantsRes || getDefaultNeedsWants();
  BB_DATA.visualLearning = visualLearningRes || getDefaultVisualLearning();

  return BB_DATA;
}

// Embedded Fallback Datasets (Ensures 100% offline functionality if file:// CORS triggers)
function getDefaultLearning() {
  return {
  "modules": [
    {
      "id": "what-is-income",
      "title": "Income",
      "eyebrow": "EARNING FOUNDATION",
      "icon": "bi-cash-stack",
      "image": "assets/images/income-hd.jpg",
      "description": "Income is the total cash inflow you receive over a specific period, serving as the starting fuel for every financial plan.",
      "keyPoints": [
        "Gross income is what you earn before deductions; net income is the take-home money you can actually budget.",
        "Income can be active (time-for-money like salary, hourly wages, tutoring) or passive (dividends, creator royalties, interest).",
        "Irregular income (freelance, gig work, gifts) requires a conservative baseline budgeting strategy."
      ],
      "examples": [
        "Monthly stipend or allowance from family: Rs. 15,000",
        "Part-time campus internship or tutoring: Rs. 20,000",
        "Occasional freelance web or design gig: Rs. 12,000"
      ],
      "tips": [
        "Always base your monthly budget strictly on your guaranteed net income, never on anticipated bonuses.",
        "Track every inflow in a single ledger to understand your true monthly earning baseline.",
        "If your income fluctuates, create a low-earning month baseline and store the surplus in high-earning months."
      ],
      "deepDive": {
        "summary": "Understanding your cash inflows is the essential starting point for all financial stability. Without knowing your predictable take-home income, any spending plan is guesswork.",
        "rules": [
          "Differentiate between reliable recurrent income and one-time windfalls.",
          "Deduct taxes and mandatory fees before deciding your spending allocations.",
          "Keep an income tracking habit to spot patterns in irregular earnings."
        ]
      }
    },
    {
      "id": "what-are-expenses",
      "title": "Expenses",
      "eyebrow": "OUTFLOW MANAGEMENT",
      "icon": "bi-receipt",
      "image": "assets/images/expenses-hd.jpg",
      "description": "Expenses are the money spent to purchase goods, services, and maintain daily living, categorized into fixed and variable outflows.",
      "keyPoints": [
        "Fixed expenses remain constant every cycle (rent, hostel fees, recurring internet subscription).",
        "Variable expenses change with consumption (food, entertainment, public transit, personal care).",
        "Hidden micro-transactions (daily cafe runs, unattended app subscriptions) silently erode savings."
      ],
      "examples": [
        "Fixed: Semester hostel fee & utility split (Rs. 18,000/month)",
        "Variable: Groceries, dining with friends & canteen snacks (Rs. 8,500/month)",
        "Periodic: Textbooks, semester supplies & exam registrations (Rs. 4,000/quarter)"
      ],
      "tips": [
        "Audit subscriptions every 90 days and cancel anything unused for over 30 days.",
        "Log every purchase on the day it happens to eliminate end-of-month surprises.",
        "Group variable expenses into weekly caps rather than one large monthly pool."
      ],
      "deepDive": {
        "summary": "Expenses are not inherently bad; uncontrolled expenses are what destabilize your financial health. Categorizing your outflows gives you the power to optimize without depriving yourself.",
        "rules": [
          "Fixed expenses should ideally stay within 40-50% of your net income.",
          "Focus cost-cutting on top two expenditure categories for maximum impact.",
          "Use the cash-envelope or sub-account method to cap variable categories."
        ]
      }
    },
    {
      "id": "common-money-mistakes",
      "title": "Common Money Mistakes",
      "eyebrow": "PITFALL PREVENTION",
      "icon": "bi-exclamation-triangle",
      "image": "assets/images/mistakes-hd.jpg",
      "description": "Avoid the frequent behavioral traps that undermine financial progress for students and young professionals.",
      "keyPoints": [
        "Spending first and attempting to save whatever remains at month-end.",
        "Failing to track small daily micro-expenses that accumulate into massive leakages.",
        "Relying on short-term high-interest borrowing or Buy Now Pay Later (BNPL) schemes.",
        "Not establishing an emergency fund before taking speculative risks."
      ],
      "examples": [
        "The Subscription Trap: Paying Rs. 1,800/mo for three streaming services watched once a month.",
        "The Upgrade Cycle: Replacing a working smartphone every release cycle on high-interest installments.",
        "Zero Cushion: Facing a sudden Rs. 8,000 repair cost with zero savings and borrowing from peers."
      ],
      "tips": [
        "Conduct a weekly 5-minute money check-in to catch budget drifts early.",
        "Treat Buy Now Pay Later with extreme caution; debt is debt regardless of marketing slogans.",
        "Compare prices and check student discounts before committing to major software or hardware purchases."
      ],
      "deepDive": {
        "summary": "Financial mistakes in early adulthood carry disproportionate compounding penalties. Recognizing these behavioral blind spots transforms financial anxiety into confident mastery.",
        "rules": [
          "Rule 1: If you cannot buy it twice in cash without touching savings, you cannot comfortably afford it.",
          "Rule 2: Never lend money you cannot afford to write off as an unconditional gift.",
          "Rule 3: Financial literacy is a daily habit, not a one-time test."
        ]
      }
    },
    {
      "id": "what-are-savings",
      "title": "Saving",
      "eyebrow": "WEALTH PRESERVATION",
      "icon": "bi-piggy-bank",
      "image": "assets/images/savings-hd.jpg",
      "description": "Savings is the unspent portion of income preserved for future goals, emergency security, and long-term peace of mind.",
      "keyPoints": [
        "Paying yourself first ensures savings happen automatically rather than relying on whatever scraps are left over.",
        "Emergency reserves protect you from debt when surprise expenses strike.",
        "Targeted sinking funds turn overwhelming future purchases into manageable monthly increments."
      ],
      "examples": [
        "Starter emergency fund: Rs. 25,000 kept in a liquid, high-yield account",
        "Sinking fund for annual certification exam: Rs. 2,000 saved per month for 6 months",
        "Laptop upgrade goal: Rs. 5,000 monthly contribution toward a Rs. 60,000 target"
      ],
      "tips": [
        "Automate your transfer to savings on the day income arrives.",
        "Keep your emergency fund separated from your everyday transactional account.",
        "Start small; even 5% or 10% consistent savings builds the neural habit of wealth preservation."
      ],
      "deepDive": {
        "summary": "Saving is an active financial decision, not a passive byproduct. Developing a high savings rate early in your career creates exponential financial freedom through compounding and peace of mind.",
        "rules": [
          "Target at least 3 months of basic living expenses before investing aggressively.",
          "Never treat credit cards or loans as a substitute for an emergency fund.",
          "Celebrate milestones when reaching 25%, 50%, and 100% of your targets."
        ]
      }
    },
    {
      "id": "needs-vs-wants",
      "title": "Needs vs Wants",
      "eyebrow": "DECISION FRAMEWORK",
      "icon": "bi-signpost-split",
      "image": "assets/images/needs-wants-comparison.jpg",
      "description": "A core cognitive skill distinguishing biological and functional essentials from lifestyle comfort and luxury upgrades.",
      "keyPoints": [
        "Needs are non-negotiable for health, basic shelter, nutrition, and meeting basic academic or job commitments.",
        "Wants enrich life and bring joy, but survival and legal obligations do not depend on them.",
        "Lifestyle creep gradually reclassifies luxury wants as perceived necessities."
      ],
      "examples": [
        "Need: Nutritious home-cooked meals and staple groceries vs. Want: Weekend food deliveries",
        "Need: Reliable transit card to attend university vs. Want: Daily rideshare surges",
        "Need: A functional laptop capable of coursework vs. Want: The flagship high-tier gaming rig"
      ],
      "tips": [
        "Use the 24-Hour Rule: Wait a full day before purchasing any non-essential item over Rs. 2,000.",
        "Ask yourself: 'Would my life, health, or academic progress halt without this tomorrow?'",
        "Budget for wants deliberately so you enjoy them completely guilt-free."
      ],
      "deepDive": {
        "summary": "Living frugally does not mean eliminating all enjoyment. Rather, it means spending lavishly on things you genuinely care about while ruthlessly cutting back on things you do not.",
        "rules": [
          "Never borrow money or swipe credit to finance a want.",
          "Identify emotional spending triggers (stress, peer pressure, boredom).",
          "Re-evaluate recurring subscriptions as optional wants rather than utility needs."
        ]
      }
    },
    {
      "id": "emergency-savings",
      "title": "Emergency Savings",
      "eyebrow": "RISK RESILIENCE",
      "icon": "bi-shield-check",
      "image": "assets/images/emergency-hd.jpg",
      "description": "Create an impenetrable safety cushion that protects your life plans from unexpected medical, family, or equipment shocks.",
      "keyPoints": [
        "An emergency fund is insurance, not an investment; prioritize liquidity and zero volatility.",
        "Aim for a progressive milestone strategy: start with Rs. 10,000, then 1 month of needs, then 3 months.",
        "Clear criteria define what constitutes an emergency: unexpected, urgent, and strictly necessary."
      ],
      "examples": [
        "True Emergency: Sudden medical prescription, broken laptop screen during exams, urgent family travel.",
        "Not an Emergency: Flash weekend sale, concert tickets, upgrading shoes for a party."
      ],
      "tips": [
        "Store the buffer in a dedicated savings account without a debit card linked to digital payment apps.",
        "Replenish your buffer immediately after a genuine emergency withdrawal before resuming discretionary spending.",
        "Keep 10-15% of your buffer in accessible cash at home for sudden localized outages."
      ],
      "deepDive": {
        "summary": "Having an emergency fund is the single biggest psychological shift in personal finance. It turns a potential life crisis into a mere temporary inconvenience.",
        "rules": [
          "Never invest emergency funds in volatile stocks, crypto, or locked fixed deposits with penalties.",
          "Review your target buffer annually as your living costs and responsibilities evolve.",
          "Maintain absolute honesty when assessing whether a cost is a genuine emergency."
        ]
      }
    }
  ]
};
}

function getDefaultPlanning() {
  return {
  "tools": [
    {
      "id": "rule-503020",
      "navId": "tool503020",
      "title": "50/30/20 Rule",
      "eyebrow": "ALLOCATION FRAMEWORK",
      "icon": "bi-pie-chart",
      "description": "Divide net income into 50% essentials (Needs), 30% lifestyle (Wants), and 20% future security (Savings).",
      "badge": "Core Guideline"
    },
    {
      "id": "budget-calculator",
      "navId": "toolBudgetCalc",
      "title": "Budget Calculator",
      "eyebrow": "SURPLUS & DEFICIT",
      "icon": "bi-calculator",
      "description": "Input real income, planned fixed expenses, flexible expenses, and savings targets to analyze your monthly financial health.",
      "badge": "Health Analysis"
    },
    {
      "id": "guiding-questions",
      "navId": "toolGuidingQuestions",
      "title": "Guiding Questions",
      "eyebrow": "SELF-ASSESSMENT",
      "icon": "bi-question-circle",
      "description": "Answer 5 strategic diagnostic questions to identify your financial posture, key leakage points, and immediate next steps.",
      "badge": "Interactive Wizard"
    },
    {
      "id": "budget-planner",
      "navId": "toolBudgetPlanner",
      "title": "Budget Planner",
      "eyebrow": "CLIENT-SIDE PLANNER",
      "icon": "bi-journal-check",
      "description": "Build and customize your monthly line-item budget table. Add entries, categorize them, and track remaining allocations live.",
      "badge": "Interactive Workspace"
    },
    {
      "id": "saving-goals",
      "navId": "toolSavingGoals",
      "title": "Saving Goals",
      "eyebrow": "MILESTONE TRACKER",
      "icon": "bi-bullseye",
      "description": "Define specific targets, track current funds, calculate time to completion, and see visual progress meters.",
      "badge": "Progress Meter"
    }
  ],
  "guidingQuestions": [
    {
      "id": "q1",
      "question": "What is your typical monthly net income?",
      "subtitle": "Include all regular take-home earnings (allowance, salary, stipend, predictable gigs).",
      "inputType": "number",
      "placeholder": "e.g. 50000",
      "field": "income",
      "hint": "Be conservative: only enter money you are sure to receive."
    },
    {
      "id": "q2",
      "question": "What are your total essential expenses (Needs)?",
      "subtitle": "Rent/hostel, basic groceries, utilities, tuition, and required transportation.",
      "inputType": "number",
      "placeholder": "e.g. 25000",
      "field": "needs",
      "hint": "Items your daily survival or academic commitments rely upon."
    },
    {
      "id": "q3",
      "question": "What do you typically spend on lifestyle choices (Wants)?",
      "subtitle": "Cafe visits, food delivery, streaming entertainment, shopping, hobby gear.",
      "inputType": "number",
      "placeholder": "e.g. 15000",
      "field": "wants",
      "hint": "Be honest about discretionary purchases."
    },
    {
      "id": "q4",
      "question": "How much do you currently manage to save each month?",
      "subtitle": "Money set aside into an account or cash envelope that is not spent.",
      "inputType": "number",
      "placeholder": "e.g. 10000",
      "field": "savings",
      "hint": "Even small recurring sums count toward this total."
    },
    {
      "id": "q5",
      "question": "What is your primary savings goal right now?",
      "subtitle": "Select the immediate milestone you are working toward.",
      "inputType": "select",
      "options": [
        "Building an Emergency Fund (Rs. 25,000 - 50,000)",
        "Tech / Study Equipment (Laptop, tablet, course tools)",
        "Certification / Course Tuition fees",
        "Travel or Life Event milestone",
        "Investing for long-term growth"
      ],
      "field": "primaryGoal",
      "hint": "Focusing on one primary goal prevents dilution of effort."
    }
  ],
  "categories": {
    "needs": [
      "Housing / Rent",
      "Groceries & Staples",
      "Utilities & Phone",
      "Required Transit",
      "Health & Medicines",
      "Tuition & Books"
    ],
    "wants": [
      "Dining Out & Takeaway",
      "Streaming & Gaming",
      "Personal Shopping",
      "Social & Events",
      "Hobbies & Tech Upgrades"
    ],
    "savings": [
      "Emergency Buffer",
      "Laptop / Tool Goal",
      "Tuition Sinking Fund",
      "General Savings"
    ]
  }
};
}

function getDefaultResources() {
  return {
  "categories": [
    "All",
    "Guidance",
    "Introduction",
    "Money Tips",
    "Financial Resources",
    "Learning",
    "Family",
    "Needs & Wants Visual",
    "20/30/50 Budget Visual",
    "Money Budget Cycle",
    "Saving Challenges"
  ],
  "items": [
    {
      "id": "res-guidance-1",
      "category": "Guidance",
      "type": "BLUEPRINT",
      "title": "Build Your First Budget: Step-by-Step Architecture",
      "description": "Establish a baseline money blueprint by categorizing predictable cash inflows and standardizing fixed student obligations. Master how to allocate funds before the calendar month begins.",
      "image": "assets/images/resources/res-1.jpg",
      "keyTakeaway": "Pre-planning cash flow eliminates mid-month shortfalls and reduces unnecessary debt reliance.",
      "tips": "Write down fixed commitments on the 1st of every month to establish your available spending ceiling.",
      "content": "A successful student budget does not restrict life; it provides clarity and freedom. By identifying your exact non-negotiable living obligations first, you can spend guilt-free from your discretionary allocation without compromising semester tuition or rent.",
      "tags": [
        "Guidance",
        "Budgeting",
        "Planning",
        "Student Finance"
      ],
      "keywords": [
        "build budget",
        "first budget",
        "budget architecture",
        "step by step"
      ],
      "date": "2026-02-15"
    },
    {
      "id": "res-guidance-2",
      "category": "Guidance",
      "type": "HABIT GUIDE",
      "title": "How to Track Your Daily Spending Without Burnout",
      "description": "Learn lightweight tracking techniques using digital logs or receipt batches that take under 90 seconds a day. Eliminate the friction that causes students to abandon expense tracking.",
      "image": "assets/images/resources/res-2.jpg",
      "keyTakeaway": "Consistency matters more than perfection; logging daily micro-expenses builds automatic financial intuition.",
      "tips": "Set a daily phone reminder at 9:00 PM to record today's receipts in under two minutes.",
      "content": "Many students fail at budgeting because their tracking systems are overly complex. Simple batching and category approximations produce 95% of the benefits with a fraction of the mental fatigue.",
      "tags": [
        "Guidance",
        "Expense Tracking",
        "Habits",
        "Daily Routine"
      ],
      "keywords": [
        "track spending",
        "expense tracking",
        "avoid burnout",
        "daily expenses"
      ],
      "date": "2026-02-18"
    },
    {
      "id": "res-guidance-3",
      "category": "Guidance",
      "type": "GOAL STRATEGY",
      "title": "Set Realistic Financial Goals: The SMART Milestone Method",
      "description": "Transform vague ambitions like 'saving more' into time-bound milestones with calculated monthly deposits. Bridge the gap between student allowances and significant equipment purchases.",
      "image": "assets/images/resources/res-3.jpg",
      "keyTakeaway": "Breaking targets into weekly automated quotas boosts savings milestone completion by over 70%.",
      "tips": "Pair each savings goal with a visual progress bar or tracker to maintain emotional momentum.",
      "content": "A goal without a timeline is merely a wish. Specifying exact amounts, target deadlines, and weekly required contributions transforms daunting financial hurdles into manageable daily choices.",
      "tags": [
        "Guidance",
        "Goals",
        "Milestones",
        "SMART"
      ],
      "keywords": [
        "financial goals",
        "realistic goals",
        "smart goals",
        "milestone planning"
      ],
      "date": "2026-02-22"
    },
    {
      "id": "res-intro-1",
      "category": "Introduction",
      "type": "ORIENTATION",
      "title": "Understanding Personal Finance: The Modern Student Foundation",
      "description": "Demystify personal money management through core literacy concepts: cash flow velocity, compound interest, and debt avoidance. Lay the bedrock for lifelong wealth resilience.",
      "image": "assets/images/resources/res-4.jpg",
      "keyTakeaway": "Money management is a learnable skill, not an innate trait; early habits shape decades of financial security.",
      "tips": "Focus first on cash flow control before worrying about complex market investing.",
      "content": "Financial education empowers you to make informed trade-offs. Understanding the relationship between earning, spending, saving, and investing creates immediate peace of mind and long-term autonomy.",
      "tags": [
        "Introduction",
        "Literacy",
        "Foundation",
        "Basics"
      ],
      "keywords": [
        "personal finance",
        "finance basics",
        "student foundation",
        "understanding money"
      ],
      "date": "2026-01-10"
    },
    {
      "id": "res-intro-2",
      "category": "Introduction",
      "type": "AWARENESS",
      "title": "Where Your Money Goes: Auditing the Hidden Leaks",
      "description": "Identify subtle lifestyle leaks including recurring convenience markups, delivery charges, and auto-renewals. Gain total clarity on where your income actually disperses each week.",
      "image": "assets/images/resources/res-5.jpg",
      "keyTakeaway": "Unconscious spending accounts for up to 25% of student monthly outlays; visibility restores control.",
      "tips": "Print or view your last 30 days of bank or mobile wallet transactions and highlight mystery charges.",
      "content": "Most financial stress does not originate from major capital purchases; it stems from unmonitored micro-transactions that quietly bleed capital. Auditing recurring outflows plugs these leaks immediately.",
      "tags": [
        "Introduction",
        "Money Leaks",
        "Spending Audit",
        "Awareness"
      ],
      "keywords": [
        "where money goes",
        "hidden leaks",
        "spending audit",
        "convenience fees"
      ],
      "date": "2026-01-14"
    },
    {
      "id": "res-intro-3",
      "category": "Introduction",
      "type": "FOUNDATION",
      "title": "Start With the Basics: Income, Outflow & Net Cushion",
      "description": "A beginner-friendly overview of how net take-home earnings split into mandatory expenditures and discretionary reserves. Understand your bottom-line cushion from day one.",
      "image": "assets/images/resources/res-6.jpg",
      "keyTakeaway": "Maintaining even a tiny positive surplus each month shields you from emergency borrowing.",
      "tips": "Always calculate monthly budget numbers using net take-home earnings rather than gross estimates.",
      "content": "The fundamental formula of personal wealth is straightforward: Income minus Outflows equals Net Surplus. Growing that surplus through prudent management is the central goal of BudgetBasics.",
      "tags": [
        "Introduction",
        "Income",
        "Outflow",
        "Net Surplus"
      ],
      "keywords": [
        "start basics",
        "inflow outflow",
        "net cushion",
        "beginner finance"
      ],
      "date": "2026-01-20"
    },
    {
      "id": "res-tips-1",
      "category": "Money Tips",
      "type": "TACTICS",
      "title": "Small Ways to Save More: Practical Student Hacks",
      "description": "Actionable micro-saving strategies: campus library textbook reserves, batch meal prep, student transport passes, and off-peak utility usage that quietly accumulate substantial reserves.",
      "image": "assets/images/resources/res-7.jpg",
      "keyTakeaway": "Saving small amounts consistently creates substantial capital reserves without degrading quality of life.",
      "tips": "Meal prepping three lunches each week can preserve over Rs. 6,000 monthly for average students.",
      "content": "Saving money does not require monastic deprivation. Strategic substitution—such as university transit discounts and group grocery purchases—yields massive compounding savings without lifestyle harm.",
      "tags": [
        "Money Tips",
        "Saving Hacks",
        "Frugal",
        "Student Living"
      ],
      "keywords": [
        "small ways to save",
        "save more",
        "student hacks",
        "micro savings"
      ],
      "date": "2026-02-05",
      "visualData": {
        "type": "rule",
        "title": "Action Rule",
        "value": "Pay Yourself First"
      }
    },
    {
      "id": "res-tips-2",
      "category": "Money Tips",
      "type": "BEHAVIORAL",
      "title": "Avoid Impulse Spending: The 24-Hour Cooling-Off Rule",
      "description": "Defeat algorithm-driven marketing and peer pressure by enforcing a mandatory 24-to-48 hour buffer on non-essential purchases over Rs. 2,000. Give emotional impulses time to cool.",
      "image": "assets/images/resources/res-8.jpg",
      "keyTakeaway": "Over 60% of impulse buying desires fade completely when delayed by just 24 hours.",
      "tips": "Add desired online shopping items to a wish list rather than the immediate checkout cart.",
      "content": "E-commerce apps are engineered to trigger instant dopamine responses. Introducing artificial friction between impulse and payment restores rational prefrontal cortex decision making.",
      "tags": [
        "Money Tips",
        "Impulse Buying",
        "Cooling Off",
        "Psychology"
      ],
      "keywords": [
        "avoid impulse",
        "impulse spending",
        "cooling off rule",
        "delayed gratification"
      ],
      "date": "2026-02-08",
      "visualData": {
        "type": "rule",
        "title": "Action Rule",
        "value": "Wait 24 Hours"
      }
    },
    {
      "id": "res-tips-3",
      "category": "Money Tips",
      "type": "OPTIMIZATION",
      "title": "Smart Spending Habits: Maximizing Value Per Rupee",
      "description": "Shift focus from extreme deprivation to intentional spending. Prioritize high-utility purchases that improve education and health while ruthlessly pruning low-value social obligations.",
      "image": "assets/images/resources/res-9.jpg",
      "keyTakeaway": "Frugality is not about spending nothing; it is about allocating intentionally to what brings genuine value.",
      "tips": "Before purchasing, evaluate how many hours of work or study the item cost to earn.",
      "content": "Smart spenders know that cheap goods often cost more in the long run through frequent replacements. Investing in quality essentials while trimming mindless wants creates superior life satisfaction.",
      "tags": [
        "Money Tips",
        "Smart Spending",
        "Value Optimization",
        "Intentionality"
      ],
      "keywords": [
        "smart spending",
        "habits",
        "value per rupee",
        "intentional spending"
      ],
      "date": "2026-02-12",
      "visualData": {
        "type": "rule",
        "title": "Action Rule",
        "value": "Value Per Rupee"
      }
    },
    {
      "id": "res-resources-1",
      "category": "Financial Resources",
      "type": "CHECKLIST",
      "title": "Student Budget Planning Checklist: Monthly Routine",
      "description": "A comprehensive periodic audit checklist designed for university schedules: fee schedules, textbook cycles, hostel rent deadlines, and exam-season emergency buffers.",
      "image": "assets/images/resources/res-10.jpg",
      "keyTakeaway": "Reviewing commitments on a fixed calendar schedule stops surprise fees and late charges.",
      "tips": "Check off each item sequentially during the final weekend of every month.",
      "content": "Student financial schedules differ fundamentally from corporate calendars due to semester peaks, exam fee deadlines, and holiday travel. This checklist provides a tailored academic financial workflow.",
      "tags": [
        "Financial Resources",
        "Checklist",
        "Routine",
        "Audit"
      ],
      "keywords": [
        "budget checklist",
        "planning checklist",
        "monthly routine",
        "student audit"
      ],
      "date": "2026-01-25"
    },
    {
      "id": "res-resources-2",
      "category": "Financial Resources",
      "type": "FRAMEWORK",
      "title": "Savings Goal Planner: Milestone Tracking Framework",
      "description": "Structured roadmap templates to divide major milestones—laptop replacement, emergency funds, certification courses—into realistic monthly and weekly savings deposits.",
      "image": "assets/images/resources/res-11.jpg",
      "keyTakeaway": "Concrete targets paired with calculated timelines turn abstract hopes into realistic financial outcomes.",
      "tips": "Always maintain a primary liquid emergency buffer before funding secondary luxury milestones.",
      "content": "Whether targeting Rs. 20,000 for emergency security or Rs. 85,000 for engineering coursework hardware, this milestone framework maps exact deposit tempos so you never fall behind.",
      "tags": [
        "Financial Resources",
        "Savings Planner",
        "Milestones",
        "Goals"
      ],
      "keywords": [
        "goal planner",
        "savings framework",
        "milestone tracking",
        "financial roadmap"
      ],
      "date": "2026-01-28"
    },
    {
      "id": "res-resources-3",
      "category": "Financial Resources",
      "type": "TEMPLATE",
      "title": "Monthly Expense Tracker: Category Logging Standards",
      "description": "Clear taxonomy standards for student expenses across Food, Transport, Academic Supplies, Connectivity, and Discretionary Leisure to ensure clean category separation.",
      "image": "assets/images/resources/res-12.jpg",
      "keyTakeaway": "Standardized categorization reveals spending spikes immediately before they turn into deficits.",
      "tips": "Group miscellaneous cash transactions under 'Other' but review weekly to prevent category inflation.",
      "content": "Accurate reporting is the foundation of financial control. Standardizing category definitions ensures your monthly expense logs yield actionable comparisons across all university terms.",
      "tags": [
        "Financial Resources",
        "Expense Tracker",
        "Taxonomy",
        "Categories"
      ],
      "keywords": [
        "expense tracker",
        "monthly tracker",
        "category standards",
        "logging template"
      ],
      "date": "2026-02-02"
    },
    {
      "id": "res-learning-1",
      "category": "Learning",
      "type": "CORE CONCEPT",
      "title": "Budgeting Basics: Zero-Based Allocation Mechanics",
      "description": "Explore the zero-based budgeting principle where every single rupee is assigned a specific job—tuition, groceries, transit, or savings—before the month begins, ensuring zero unallocated drift.",
      "image": "assets/images/resources/res-13.jpg",
      "keyTakeaway": "Giving every rupee a deliberate purpose prevents money from slipping away untracked.",
      "tips": "A zero-based balance means (Income - Outflows - Savings = 0), not an empty bank balance.",
      "content": "In zero-based budgeting, unallocated surplus is forbidden. Any leftover money is intentionally assigned to an emergency buffer, milestone fund, or debt reduction, eliminating accidental waste.",
      "tags": [
        "Learning",
        "Zero-Based",
        "Budgeting Basics",
        "Allocation"
      ],
      "keywords": [
        "budgeting basics",
        "zero based",
        "allocation mechanics",
        "financial learning"
      ],
      "date": "2026-01-05"
    },
    {
      "id": "res-learning-2",
      "category": "Learning",
      "type": "PRINCIPLE",
      "title": "Understanding Income & Expenses: Cash Flow Velocity",
      "description": "Deep dive into fixed vs variable expenditures and active vs passive inflows. Understand how timing mismatches between income arrival and bill due dates affect student liquidity.",
      "image": "assets/images/resources/res-14.jpg",
      "keyTakeaway": "Aligning payment schedules with income arrival prevents temporary liquidity crunches.",
      "tips": "Negotiate fixed bill payment dates to occur 2-3 days after your primary income deposit date.",
      "content": "Cash flow velocity measures how rapidly money enters and exits your ecosystem. Knowing when bills mature relative to your allowances avoids costly overdrafts and emergency borrowing.",
      "tags": [
        "Learning",
        "Income",
        "Expenses",
        "Cash Flow"
      ],
      "keywords": [
        "income and expenses",
        "cash flow velocity",
        "fixed expenses",
        "variable expenses"
      ],
      "date": "2026-01-08"
    },
    {
      "id": "res-learning-3",
      "category": "Learning",
      "type": "THEORY",
      "title": "Saving vs Spending: Opportunity Cost & Compound Growth",
      "description": "Learn the economic concept of opportunity cost: how spending Rs. 5,000 today on short-term wants trades away future security, investment yields, and emergency resilience.",
      "image": "assets/images/resources/res-15.jpg",
      "keyTakeaway": "Every purchase decision is a conscious trade-off between present satisfaction and future independence.",
      "tips": "Visualize compound interest growth over 5 years when deciding whether to make large discretionary buys.",
      "content": "Money has time value. When capital is preserved in high-yield vehicles, it generates passive returns that multiply over decades. Understanding this trade-off is the pinnacle of financial maturity.",
      "tags": [
        "Learning",
        "Opportunity Cost",
        "Saving vs Spending",
        "Compounding"
      ],
      "keywords": [
        "saving vs spending",
        "opportunity cost",
        "compound interest",
        "future wealth"
      ],
      "date": "2026-01-12"
    },
    {
      "id": "res-family-1",
      "category": "Family",
      "type": "HOUSEHOLD",
      "title": "Family Budget Basics: Household Resource Collaboration",
      "description": "Explore collaborative family budgeting techniques: pooled utility obligations, shared bulk grocery purchasing, and transparent discussion around collective financial priorities.",
      "image": "assets/images/resources/res-16.jpg",
      "keyTakeaway": "Open household financial communication prevents misunderstandings and maximizes collective buying power.",
      "tips": "Hold a 15-minute monthly family money sync to review upcoming shared seasonal expenses.",
      "content": "Family financial wellness is a team discipline. When parents, students, and siblings align on household utility goals and grocery planning, collective stress drops and overall savings rates surge.",
      "tags": [
        "Family",
        "Household",
        "Collaboration",
        "Shared Budget"
      ],
      "keywords": [
        "family budget",
        "household finance",
        "family basics",
        "shared expenses"
      ],
      "date": "2026-02-10"
    },
    {
      "id": "res-family-2",
      "category": "Family",
      "type": "PEDAGOGY",
      "title": "Teaching Kids About Money: Practical Early Habits",
      "description": "Age-appropriate methods for teaching siblings and children foundational money concepts: the three-jar system (Save, Spend, Give), delayed gratification, and earned allowances.",
      "image": "assets/images/resources/res-17.jpg",
      "keyTakeaway": "Tangible tactile budgeting experiences in childhood cultivate responsible lifelong financial behavior.",
      "tips": "Use physical clear jars so children can visually watch currency accumulation grow over weeks.",
      "content": "Early financial habits dictate adult money psychology. By turning budgeting into an interactive, rewarding game of goal progression, young family members develop natural resilience against impulse buys.",
      "tags": [
        "Family",
        "Kids Finance",
        "Allowance",
        "Three Jars"
      ],
      "keywords": [
        "teaching kids",
        "kids money",
        "early habits",
        "money jars"
      ],
      "date": "2026-02-14"
    },
    {
      "id": "res-family-3",
      "category": "Family",
      "type": "RESILIENCE",
      "title": "Planning Household Expenses: Sinking Funds for Crises",
      "description": "How families prepare for irregular cyclical costs—annual vehicle insurance, school registration, appliance repairs, and medical checks—using dedicated household sinking funds.",
      "image": "assets/images/resources/res-18.jpg",
      "keyTakeaway": "Anticipating predictable irregular costs removes the crisis feeling from family life.",
      "tips": "Divide annual household lump sums by 12 and transfer that amount monthly into a designated sinking fund.",
      "content": "Car maintenance and home appliance failures are not unforeseen surprises; their exact timing is uncertain, but their occurrence is guaranteed. Sinking funds absorb these shocks seamlessly.",
      "tags": [
        "Family",
        "Sinking Funds",
        "Household Crises",
        "Emergency Cushion"
      ],
      "keywords": [
        "household expenses",
        "sinking funds",
        "irregular expenses",
        "family planning"
      ],
      "date": "2026-02-16"
    },
    {
      "id": "res-nvw-1",
      "category": "Needs & Wants Visual",
      "type": "INFOGRAPHIC",
      "title": "Needs vs Wants: The 4-Quadrant Visual Filter",
      "description": "A visual classification matrix sorting purchases into Essential Needs, Quality-of-Life Boosters, Discretionary Wants, and Pure Waste Leaks with actionable boundary lines.",
      "image": "assets/images/resources/res-19.jpg",
      "keyTakeaway": "Visualizing purchase trade-offs on a 2x2 grid strips emotional justification from impulsive purchases.",
      "tips": "Ask yourself: 'Will my health, studies, or safety suffer if I do not buy this today?'",
      "content": "Needs sustain baseline human existence and academic survival. Wants enrich experience but are non-essential. Learning to see where items fall on the visual matrix prevents lifestyle creep.",
      "tags": [
        "Needs & Wants Visual",
        "Matrix",
        "Classification",
        "Infographic"
      ],
      "keywords": [
        "needs vs wants",
        "visual filter",
        "four quadrants",
        "smart purchases"
      ],
      "date": "2026-01-16",
      "visualData": {
        "type": "comparison",
        "left": "50% Essentials",
        "right": "30% Lifestyle"
      }
    },
    {
      "id": "res-nvw-2",
      "category": "Needs & Wants Visual",
      "type": "DECISION TOOL",
      "title": "Smart Purchase Decisions: The Cost-Per-Use Calculation",
      "description": "Evaluate big-ticket student acquisitions by dividing total retail cost by expected usage days. Learn why a durable laptop has a lower true cost than fast-fashion clothing.",
      "image": "assets/images/resources/res-20.jpg",
      "keyTakeaway": "Cost-per-use shifts focus from initial price tags to true long-term value delivered.",
      "tips": "A Rs. 60,000 laptop used daily for 3 years costs only Rs. 55 per day, making it an exceptional investment.",
      "content": "Price is what you pay; value is what you get. Evaluating purchases through frequency of practical utility stops you from buying cheap items that break immediately and drain capital repeatedly.",
      "tags": [
        "Needs & Wants Visual",
        "Cost Per Use",
        "Decision Tool",
        "Value"
      ],
      "keywords": [
        "smart purchase",
        "cost per use",
        "purchase decisions",
        "durable value"
      ],
      "date": "2026-01-18",
      "visualData": {
        "type": "comparison",
        "left": "50% Essentials",
        "right": "30% Lifestyle"
      }
    },
    {
      "id": "res-nvw-3",
      "category": "Needs & Wants Visual",
      "type": "DIAGNOSTIC",
      "title": "Before You Buy Checklist: 5-Question Gatekeeper",
      "description": "A 5-point mental check before checkout: Can I pay in cash today? Do I own a functional equivalent? Will this matter in 30 days? Is it tied to genuine necessity?",
      "image": "assets/images/resources/res-21.jpg",
      "keyTakeaway": "Applying a simple friction gatekeeper prevents checkout remorse on 4 out of 5 non-essential buys.",
      "tips": "Print or save this 5-question visual graphic on your smartphone lock screen as a spending shield.",
      "content": "Friction is the ultimate defense against marketing manipulation. By establishing a 5-point checkpoint before clicking buy, you preserve cash for what genuinely matters to your future.",
      "tags": [
        "Needs & Wants Visual",
        "Before You Buy",
        "Gatekeeper",
        "Checklist"
      ],
      "keywords": [
        "before buy",
        "purchase checklist",
        "5 questions",
        "spending filter"
      ],
      "date": "2026-01-22",
      "visualData": {
        "type": "comparison",
        "left": "50% Essentials",
        "right": "30% Lifestyle"
      }
    },
    {
      "id": "res-503020-1",
      "category": "20/30/50 Budget Visual",
      "type": "FRAMEWORK",
      "title": "20/30/50 Rule Explained: Proportional Split Visual",
      "description": "Visual breakdown of the classic balanced allocation: 50% for non-negotiable living needs, 30% for flexible lifestyle wants, and 20% reserved for savings and debt reduction.",
      "image": "assets/images/resources/res-22.jpg",
      "keyTakeaway": "Percentages scale dynamically whether earning a modest student stipend or a full graduate salary.",
      "tips": "If your fixed living needs exceed 50%, compress lifestyle wants first rather than eliminating savings.",
      "content": "The 20/30/50 allocation framework provides instant intuitive boundaries. By capping lifestyle wants at 30% and locking 20% into savings, financial progress becomes mathematical and certain.",
      "tags": [
        "20/30/50 Budget Visual",
        "Allocation",
        "Split Visual",
        "Framework"
      ],
      "keywords": [
        "20/30/50 rule",
        "50 30 20",
        "budget visual",
        "proportional split"
      ],
      "date": "2026-01-26",
      "visualData": {
        "type": "chart-bar",
        "label": "50/30/20 Allocation Rule",
        "segments": [
          {
            "name": "Needs (50%)",
            "pct": 50,
            "color": "#583397"
          },
          {
            "name": "Wants (30%)",
            "pct": 30,
            "color": "#8E44AD"
          },
          {
            "name": "Savings (20%)",
            "pct": 20,
            "color": "#D4AF37"
          }
        ]
      }
    },
    {
      "id": "res-503020-2",
      "category": "20/30/50 Budget Visual",
      "type": "VISUAL GUIDE",
      "title": "Needs, Wants & Savings: Color-Coded Target Allocation",
      "description": "Graphic visualization contrasting healthy proportional allocations against overextended budgets where lifestyle wants exceed 50%, highlighting correction strategies.",
      "image": "assets/images/resources/res-23.jpg",
      "keyTakeaway": "Keeping lifestyle wants strictly capped under 30% guarantees headroom for emergency resilience.",
      "tips": "Color-code your monthly spreadsheet to immediately visualize category boundary violations.",
      "content": "Visualizing allocation proportions reveals financial imbalances far faster than scanning columns of ledger numbers. This guide demonstrates how to rebalance spending back to baseline.",
      "tags": [
        "20/30/50 Budget Visual",
        "Color Coded",
        "Targets",
        "Rebalancing"
      ],
      "keywords": [
        "needs wants savings",
        "target allocation",
        "visual guide",
        "balanced budget"
      ],
      "date": "2026-01-30",
      "visualData": {
        "type": "chart-bar",
        "label": "50/30/20 Allocation Rule",
        "segments": [
          {
            "name": "Needs (50%)",
            "pct": 50,
            "color": "#583397"
          },
          {
            "name": "Wants (30%)",
            "pct": 30,
            "color": "#8E44AD"
          },
          {
            "name": "Savings (20%)",
            "pct": 20,
            "color": "#D4AF37"
          }
        ]
      }
    },
    {
      "id": "res-503020-3",
      "category": "20/30/50 Budget Visual",
      "type": "CASE STUDY",
      "title": "Example Monthly Budget: Real Student Cash Flow Model",
      "description": "A realistic case study modeling a Rs. 50,000 monthly student inflow: Rs. 25,000 for essentials, Rs. 15,000 for social/hobbies, and Rs. 10,000 systematically banked into emergency savings.",
      "image": "assets/images/resources/res-24.jpg",
      "keyTakeaway": "Seeing concrete numbers proves that disciplined allocation accommodates both fun and future security.",
      "tips": "Automate the 20% savings transfer on payday so you only ever look at available funds.",
      "content": "Abstract percentages become powerful when translated into real rupees. This case study demonstrates how an everyday student balances hostel rent, social outings, and emergency funds seamlessly.",
      "tags": [
        "20/30/50 Budget Visual",
        "Case Study",
        "Real Numbers",
        "Student Budget"
      ],
      "keywords": [
        "example monthly budget",
        "student cash flow",
        "budget model",
        "50000 budget"
      ],
      "date": "2026-02-04",
      "visualData": {
        "type": "chart-bar",
        "label": "50/30/20 Allocation Rule",
        "segments": [
          {
            "name": "Needs (50%)",
            "pct": 50,
            "color": "#583397"
          },
          {
            "name": "Wants (30%)",
            "pct": 30,
            "color": "#8E44AD"
          },
          {
            "name": "Savings (20%)",
            "pct": 20,
            "color": "#D4AF37"
          }
        ]
      }
    },
    {
      "id": "res-cycle-1",
      "category": "Money Budget Cycle",
      "type": "STAGE 1 & 2",
      "title": "Earn & Plan: Inflow Architecture & Forward Allocation",
      "description": "The initial phases of the monthly cycle: logging gross earnings, deducting mandatory tax/fees, and establishing predetermined spending ceilings before cash leaves the account.",
      "image": "assets/images/resources/res-25.jpg",
      "keyTakeaway": "Directing funds on the first day of receipt removes the temptation of artificial surplus.",
      "tips": "Never consider an allowance 'free money' until fixed upcoming commitments are deducted.",
      "content": "The financial cycle begins the moment income is received. Setting category envelopes before incurring outflows guarantees that every financial priority is secured in advance.",
      "tags": [
        "Money Budget Cycle",
        "Earn",
        "Plan",
        "Cycle Architecture"
      ],
      "keywords": [
        "earn and plan",
        "budget cycle",
        "forward allocation",
        "inflow planning"
      ],
      "date": "2026-02-11",
      "visualData": {
        "type": "flowchart",
        "steps": [
          "Inflow",
          "Needs",
          "Wants",
          "Savings"
        ]
      }
    },
    {
      "id": "res-cycle-2",
      "category": "Money Budget Cycle",
      "type": "STAGE 3 & 4",
      "title": "Spend & Save: Controlled Outflow & Automated Siphoning",
      "description": "Execution phases of the cycle: tracking active purchases against category allowances while automatically routing savings deposits into locked or high-yield accounts.",
      "image": "assets/images/resources/res-26.jpg",
      "keyTakeaway": "Automation bridges the gap between good intentions and actual money banked.",
      "tips": "Pay yourself first: route savings into a secondary account before funding discretionary wants.",
      "content": "Mid-month discipline requires monitoring remaining category envelopes. Knowing you have Rs. 3,500 left for dining out allows intentional choices rather than panic at month-end.",
      "tags": [
        "Money Budget Cycle",
        "Spend",
        "Save",
        "Automation"
      ],
      "keywords": [
        "spend and save",
        "controlled outflow",
        "automated savings",
        "cycle execution"
      ],
      "date": "2026-02-15",
      "visualData": {
        "type": "flowchart",
        "steps": [
          "Inflow",
          "Needs",
          "Wants",
          "Savings"
        ]
      }
    },
    {
      "id": "res-cycle-3",
      "category": "Money Budget Cycle",
      "type": "STAGE 5",
      "title": "Review & Optimize: Month-End Variance Analysis",
      "description": "The essential closing loop: comparing actual outflows against projections, calculating variances, and rebalancing category caps for the upcoming monthly cycle.",
      "image": "assets/images/resources/res-27.jpg",
      "keyTakeaway": "A budget is a living document; monthly calibration turns financial tracking into an effortless reflex.",
      "tips": "Celebrate staying under budget by allocating a small 10% bonus reward toward personal enjoyment.",
      "content": "Without review, budgeting remains guesswork. Analyzing variances teaches you where your estimates were too tight or loose, refining your financial intuition month after month.",
      "tags": [
        "Money Budget Cycle",
        "Review",
        "Optimize",
        "Variance Analysis"
      ],
      "keywords": [
        "review and optimize",
        "month end audit",
        "variance analysis",
        "budget cycle"
      ],
      "date": "2026-02-19",
      "visualData": {
        "type": "flowchart",
        "steps": [
          "Inflow",
          "Needs",
          "Wants",
          "Savings"
        ]
      }
    },
    {
      "id": "res-challenge-1",
      "category": "Saving Challenges",
      "type": "SPRINT",
      "title": "7-Day Spending Detox Challenge: Resetting Purchase Urges",
      "description": "A 1-week behavioral sprint committing to zero non-essential spending. Cook exclusively at home, utilize free transit options, and uncover how much cash is saved in just seven days.",
      "image": "assets/images/resources/res-28.jpg",
      "keyTakeaway": "A short spending freeze breaks automatic buying dopamine loops and reveals true baseline costs.",
      "tips": "Stock up on pantry staples prior to Day 1 so temptation to order take-out food is eliminated.",
      "content": "Spending habits often run on autopilot. Pausing all discretionary purchases for 7 days acts as a financial palate cleanser, highlighting just how much money is spent purely out of boredom.",
      "tags": [
        "Saving Challenges",
        "7-Day Challenge",
        "Detox",
        "Sprint"
      ],
      "keywords": [
        "7 day challenge",
        "spending detox",
        "saving challenge",
        "no spend sprint"
      ],
      "date": "2026-02-21",
      "visualData": {
        "type": "milestone",
        "target": "7-Day Detox",
        "progress": 100,
        "note": "Completion Rate: High"
      }
    },
    {
      "id": "res-challenge-2",
      "category": "Saving Challenges",
      "type": "30-DAY PROGRAM",
      "title": "30-Day Milestone Saving Challenge: The Compound Booster",
      "description": "A structured monthly program starting with saving Rs. 100 on Day 1, Rs. 200 on Day 2, and scaling up to amass an immediate Rs. 15,000+ starter emergency reserve within 30 days.",
      "image": "assets/images/resources/res-29.jpg",
      "keyTakeaway": "Graduated progressive challenges build savings stamina with psychological wins every single day.",
      "tips": "Keep a physical calendar on your desk and cross off each daily transfer with pride.",
      "content": "Large savings numbers feel intimidating to students. Breaking milestones into micro-increments that scale gently proves that saving substantial sums is completely achievable on any budget.",
      "tags": [
        "Saving Challenges",
        "30-Day Challenge",
        "Compound Booster",
        "Emergency Reserve"
      ],
      "keywords": [
        "30 day challenge",
        "milestone challenge",
        "emergency reserve",
        "daily saving"
      ],
      "date": "2026-02-23",
      "visualData": {
        "type": "milestone",
        "target": "30-Day Boost",
        "progress": 80,
        "note": "Completion Rate: High"
      }
    },
    {
      "id": "res-challenge-3",
      "category": "Saving Challenges",
      "type": "WEEKEND SPRINT",
      "title": "No-Spend Weekend Challenge: Zero-Cost Leisure Mastery",
      "description": "Challenge yourself to spend exactly Rs. 0 from Friday evening to Sunday night. Rediscover campus public spaces, book clubs, cooking challenges, and free educational documentaries.",
      "image": "assets/images/resources/res-30.jpg",
      "keyTakeaway": "Enjoyable social connection and restorative leisure do not require commercial price tags.",
      "tips": "Invite friends or roommates to participate so social pressure works in your favor.",
      "content": "Weekends are typically the highest-outflow period for students. Conquering a single weekend with zero spend preserves thousands of rupees while fostering creative, non-commercial leisure.",
      "tags": [
        "Saving Challenges",
        "No-Spend Weekend",
        "Zero-Cost",
        "Weekend Challenge"
      ],
      "keywords": [
        "no spend challenge",
        "weekend challenge",
        "zero spend",
        "free leisure"
      ],
      "date": "2026-02-25",
      "visualData": {
        "type": "milestone",
        "target": "Zero-Cost Weekend",
        "progress": 65,
        "note": "Completion Rate: High"
      }
    }
  ]
};
}

function getDefaultGallery() {
  return {
  "categories": [
    "All",
    "Saving",
    "Planning",
    "Smart Spending",
    "Habits & Goals"
  ],
  "items": [
    {
      "id": "gal-saving",
      "title": "Saving Money & Wealth Preservation",
      "category": "Saving",
      "image": "assets/images/gal-1.jpg",
      "tag": "PRESERVATION",
      "summary": "Building resilient buffers before lifestyle upgrades.",
      "description": "True financial freedom begins not with how much you earn, but how much you retain. Keeping a dedicated savings reserve shields you from high-interest debt and sudden emergencies.",
      "takeaway": "Pay yourself first by reserving 20% on the day your income arrives."
    },
    {
      "id": "gal-planning",
      "title": "Proactive Budget Planning",
      "category": "Planning",
      "image": "assets/images/gal-2.jpg",
      "tag": "STRATEGY",
      "summary": "Assigning every rupee a purpose before spending begins.",
      "description": "Proactive budget planning means writing down your expected income and allocating it across fixed essentials, flexible needs, and savings before the calendar month starts.",
      "takeaway": "A written plan eliminates the mid-month stress of wondering where money went."
    },
    {
      "id": "gal-coins",
      "title": "Coins, Currency & Growth",
      "category": "Saving",
      "image": "assets/images/gal-3.jpg",
      "tag": "COMPOUNDING",
      "summary": "Small consistent sums multiply through disciplined habits.",
      "description": "Financial success is rarely a single windfall event. It is the cumulative effect of small, repeated choices: choosing affordable transit, packing lunch, and saving regular sums.",
      "takeaway": "Small daily savings of Rs. 100 accumulate to over Rs. 36,000 in a year."
    },
    {
      "id": "gal-needs-wants",
      "title": "Evaluating Needs vs Wants",
      "category": "Smart Spending",
      "image": "assets/images/gal-4.jpg",
      "tag": "DISCERNMENT",
      "summary": "Distinguishing survival essentials from fleeting desires.",
      "description": "Conscious consumers recognize that marketing constantly dresses wants as urgent needs. Pausing to assess utility protects your cash flow without diminishing quality of life.",
      "takeaway": "Apply the 24-hour waiting rule for any non-essential purchase."
    },
    {
      "id": "gal-tracking",
      "title": "Real-Time Expense Tracking",
      "category": "Planning",
      "image": "assets/images/gal-5.jpg",
      "tag": "AWARENESS",
      "summary": "Monitoring outflows to eliminate invisible cash drains.",
      "description": "Tracking expenses does not restrict your freedom—it restores control. Looking at factual numbers reveals unseen subscription drains, dining surges, and impulse splurges.",
      "takeaway": "Record expenses immediately using a simple digital ledger or notebook."
    },
    {
      "id": "gal-goals",
      "title": "Targeted Saving Goals",
      "category": "Habits & Goals",
      "image": "assets/images/gal-6.jpg",
      "tag": "MILESTONES",
      "summary": "Converting big financial dreams into bite-sized monthly steps.",
      "description": "Whether saving for a laptop, certification course, or emergency buffer, breaking large numbers into monthly targets prevents demotivation and keeps momentum alive.",
      "takeaway": "Attach a visual reminder and a specific date deadline to your savings target."
    },
    {
      "id": "gal-spending",
      "title": "Smart & Conscious Spending",
      "category": "Smart Spending",
      "image": "assets/images/gal-7.jpg",
      "tag": "EFFICIENCY",
      "summary": "Maximizing personal utility while minimizing unnecessary waste.",
      "description": "Smart spending is about intentionality. Spending generously on health, education, and genuine priorities while ruthlessly cutting back on superficial status purchases.",
      "takeaway": "Check student discounts, compare alternatives, and buy quality over quantity."
    },
    {
      "id": "gal-roadmap",
      "title": "Long-Term Financial Roadmap",
      "category": "Habits & Goals",
      "image": "assets/images/gal-8.jpg",
      "tag": "VISION",
      "summary": "Designing a steady progression toward zero debt and independence.",
      "description": "Your student and early career phase sets the tone for your decades ahead. Mastering basic budgeting now guarantees you enter adulthood with confidence and zero bad debt.",
      "takeaway": "Review and update your financial roadmap every semester or fiscal quarter."
    }
  ]
};
}

function getDefaultChatbot() {
  return {
  "welcomeMessage": "Hello. I am BudgetBee, your educational personal finance assistant. Select any of the suggested inquiries below or type your own question regarding budgeting, expenses, savings, needs vs wants, or financial planning.",
  "scopeExplanation": "I am BudgetBee, a student budgeting guide. I can help with fundamental financial topics such as income, fixed and variable expenses, savings strategies, needs vs wants, the 50/30/20 rule, setting saving goals, expense tracking, and common money pitfalls.",
  "outOfScopeMessage": "I am BudgetBee, an educational budgeting assistant. I focus on student money habits, savings strategies, expense tracking, and personal finance fundamentals. How can I help you with your budget?",
  "suggestedQuestions": [
    {
      "id": "q-income",
      "question": "What is income?",
      "keywords": [
        "income",
        "earn",
        "earning",
        "salary",
        "stipend",
        "gross",
        "net",
        "inflow",
        "take-home"
      ],
      "answer": "Income is money received from sources such as employment, scholarships, student allowances, or freelance projects. Always budget based on Net Take-Home Income (money received after mandatory deductions), not Gross Income. If your income fluctuates, use your conservative baseline monthly figure to build your core budget."
    },
    {
      "id": "q-fixed-expenses",
      "question": "What are fixed expenses?",
      "keywords": [
        "fixed expenses",
        "fixed expense",
        "fixed costs",
        "fixed outflow",
        "rent",
        "tuition",
        "bills"
      ],
      "answer": "Fixed expenses are predictable financial obligations that remain consistent in cost and occur at regular intervals. Examples include apartment or hostel rent, semester tuition, fixed internet subscriptions, and public transit passes. Because fixed expenses are non-negotiable in the short term, budgeting around them first guarantees housing and academic security."
    },
    {
      "id": "q-variable-expenses",
      "question": "What are variable expenses?",
      "keywords": [
        "variable expenses",
        "variable expense",
        "variable costs",
        "flexible spending",
        "groceries",
        "dining"
      ],
      "answer": "Variable expenses are day-to-day outlays that fluctuate based on your decisions and lifestyle. Examples include staple groceries, cafe coffee, dining out, recreation, and textbook supplies. Because variable expenses are flexible, they are the primary area where students can quickly trim spending to free up surplus cash for savings."
    },
    {
      "id": "q-saving",
      "question": "What is saving?",
      "keywords": [
        "saving",
        "savings",
        "save",
        "save money",
        "reserve",
        "put aside",
        "stash"
      ],
      "answer": "Saving is the intentional practice of setting aside a portion of current income for future objectives, emergencies, or investments rather than spending it immediately. The most effective rule is 'Pay Yourself First': automatically transfer your target savings percentage into a dedicated secondary account on the day income arrives."
    },
    {
      "id": "q-50-30-20",
      "question": "What is the 50-30-20 rule?",
      "keywords": [
        "50-30-20 rule",
        "50/30/20",
        "50 30 20",
        "50-30-20",
        "split",
        "percentage ratio",
        "budget rule"
      ],
      "answer": "The 50-30-20 rule is an intuitive budgeting framework that divides your take-home net income into three distinct buckets: 50% for essential Needs (housing, groceries, utilities, tuition), 30% for discretionary Wants (entertainment, dining out, hobbies), and 20% for Savings and debt prepayment."
    },
    {
      "id": "q-needs-vs-wants",
      "question": "What is the difference between needs and wants?",
      "keywords": [
        "difference between needs and wants",
        "needs and wants",
        "needs vs wants",
        "need",
        "needs",
        "want",
        "wants"
      ],
      "answer": "Needs are mandatory essentials vital for basic survival, physical health, shelter, and active coursework (such as staple food, modest lodging, prescription medicine, and transit). Wants are discretionary choices that elevate comfort, entertainment, or status (such as daily specialty drinks, gaming subscriptions, and brand clothes). Applying a 24-hour waiting rule before purchasing a want prevents impulse spending."
    },
    {
      "id": "q-create-budget",
      "question": "How can I create a budget?",
      "keywords": [
        "create a budget",
        "how can i create a budget",
        "start a budget",
        "make a budget",
        "build a budget",
        "beginner budget"
      ],
      "answer": "To create a student budget: 1) Record your guaranteed monthly net take-home income. 2) List all non-negotiable fixed expenses (rent, tuition, transit). 3) Immediately allocate at least 15% to 20% toward savings. 4) Set a weekly spending cap for variable food and leisure. 5) Use the BudgetBasics Expense Planner to monitor transactions weekly."
    },
    {
      "id": "q-saving-goal",
      "question": "How can I set a saving goal?",
      "keywords": [
        "set a saving goal",
        "saving goal",
        "save for",
        "goal setting",
        "milestone",
        "target amount"
      ],
      "answer": "To set an actionable saving goal: 1) Define a clear purpose (e.g., Academic Laptop or Emergency Buffer). 2) Establish the exact target cost (e.g., Rs. 60,000). 3) Determine a manageable monthly contribution (e.g., Rs. 5,000). 4) Calculate the timeline (Rs. 60,000 / Rs. 5,000 = 12 months). Breaking high-level ambitions into monthly milestones sustains focus."
    },
    {
      "id": "q-track-expenses",
      "question": "How can I track expenses?",
      "keywords": [
        "track expenses",
        "how can i track expenses",
        "tracking spending",
        "expense tracking",
        "log spending",
        "audit expenses"
      ],
      "answer": "To track expenses effectively: 1) Group spending into distinct categories (Food, Transit, Education, Bills, Entertainment). 2) Log transactions as they occur using our Interactive Expense Planner. 3) Review your total outlays at the end of each week to catch micro-spending leaks. 4) Compare actual spending against your initial 50/30/20 target to adjust behavior early."
    },
    {
      "id": "q-common-mistakes",
      "question": "What are common budgeting mistakes?",
      "keywords": [
        "common budgeting mistakes",
        "money mistakes",
        "mistakes",
        "pitfalls",
        "debt trap",
        "overspending"
      ],
      "answer": "Common student budgeting mistakes include: 1) Spending first and attempting to save whatever remains at month-end. 2) Ignoring small repeated purchases (micro-transactions accumulate rapidly). 3) Leaving unused subscriptions on auto-renewal. 4) Relying on Buy Now Pay Later installments. 5) Operating without an initial liquid emergency cushion of Rs. 15,000 to Rs. 25,000."
    }
  ],
  "faq": [
    {
      "keywords": [
        "emergency",
        "buffer",
        "crisis",
        "fund",
        "cushion"
      ],
      "topic": "Emergency Fund",
      "answer": "An emergency cushion is dedicated liquid savings intended solely for urgent, unforeseen necessities like medical care or urgent hardware repairs. For students, starting with Rs. 15,000 to Rs. 25,000 prevents borrowing under stress."
    },
    {
      "keywords": [
        "calculator",
        "tool",
        "planner",
        "503020"
      ],
      "topic": "Planning Tools",
      "answer": "BudgetBasics provides client-side interactive tools in the Planning section: the 50/30/20 Rule Calculator, Comprehensive Cash Flow Auditor, Guiding Questions Diagnostic, and Interactive Expense Planner."
    },
    {
      "keywords": [
        "hello",
        "hi",
        "hey",
        "greetings"
      ],
      "topic": "Greeting",
      "answer": "Hello. I am BudgetBee, your educational budgeting assistant. Click any suggested question below or ask about income, expenses, savings, needs vs wants, or budgeting rules."
    }
  ],
  "fallback": "I am BudgetBee, your budgeting guide. I can help with core financial education topics such as income, fixed and variable expenses, savings, the 50/30/20 rule, needs vs wants, setting goals, tracking expenses, and common money mistakes. Please select one of the suggested inquiries or ask about these topics."
};
}

function getDefaultGames() {
  return {
  "needsVsWants": [
    {
      "id": 1,
      "item": "Nutritious Groceries & Cooking Staples",
      "question": "Is nutritious grocery shopping considered a Need or a Want?",
      "options": [
        "Need",
        "Want"
      ],
      "correctAnswer": "Need",
      "explanation": "Wholesome food and balanced nutrition are biological essentials required for daily energy, physical health, and cognitive function."
    },
    {
      "id": 2,
      "item": "Daily Takeaway Cafe Latte",
      "question": "Is ordering a specialty takeaway coffee every morning a Need or a Want?",
      "options": [
        "Need",
        "Want"
      ],
      "correctAnswer": "Want",
      "explanation": "While caffeine or warmth may be desired, brewing coffee at home fulfills hydration at a tiny fraction of the cost, making cafe delivery a discretionary lifestyle want."
    },
    {
      "id": 3,
      "item": "Monthly Apartment Rent / Student Hostel Fee",
      "question": "Is paying your monthly room rent or hostel fee a Need or a Want?",
      "options": [
        "Need",
        "Want"
      ],
      "correctAnswer": "Need",
      "explanation": "Safe, stable shelter is a fundamental physiological necessity and a non-negotiable legal commitment."
    },
    {
      "id": 4,
      "item": "Premium Wireless Noise-Cancelling Headphones",
      "question": "When your current basic earphones work, is upgrading to flagship headphones a Need or a Want?",
      "options": [
        "Need",
        "Want"
      ],
      "correctAnswer": "Want",
      "explanation": "If your existing audio gear functions for lectures and calls, buying premium luxury headphones is a comfort upgrade."
    },
    {
      "id": 5,
      "item": "Required University Course Textbooks",
      "question": "Are mandatory course books and required lab materials a Need or a Want?",
      "options": [
        "Need",
        "Want"
      ],
      "correctAnswer": "Need",
      "explanation": "Academic materials directly mandated to complete your degree or certification fall under essential educational obligations."
    },
    {
      "id": 6,
      "item": "Multiple Concurrent Video Streaming Subscriptions",
      "question": "Are paying for three or four entertainment streaming services simultaneously a Need or a Want?",
      "options": [
        "Need",
        "Want"
      ],
      "correctAnswer": "Want",
      "explanation": "Recreational video entertainment is optional. Rotating one service at a time saves significant money without impacting daily living."
    },
    {
      "id": 7,
      "item": "Prescription Antibiotics & Essential Medicine",
      "question": "Is purchasing prescribed medication for an illness a Need or a Want?",
      "options": [
        "Need",
        "Want"
      ],
      "correctAnswer": "Need",
      "explanation": "Healthcare and prescription medicines protect your life, recovery, and long-term well-being and must always be prioritized."
    },
    {
      "id": 8,
      "item": "Electricity, Heating & Basic Water Utility",
      "question": "Is paying for household electricity and clean running water a Need or a Want?",
      "options": [
        "Need",
        "Want"
      ],
      "correctAnswer": "Need",
      "explanation": "Electricity and water are essential infrastructure for hygienic living, lighting, cooking, and temperature control."
    }
  ],
  "challenge503020": [
    {
      "id": 1,
      "title": "Entry-Level Campus Intern",
      "income": 40000,
      "targetNeeds": 20000,
      "targetWants": 12000,
      "targetSavings": 8000,
      "description": "You earn a monthly stipend of Rs. 40,000. Balance your budget into 50% Needs, 30% Wants, and 20% Savings."
    },
    {
      "id": 2,
      "title": "Junior Software Associate",
      "income": 60000,
      "targetNeeds": 30000,
      "targetWants": 18000,
      "targetSavings": 12000,
      "description": "Your starting net salary is Rs. 60,000. Allocate your funds according to the 50/30/20 guideline."
    },
    {
      "id": 3,
      "title": "Mid-Level Professional",
      "income": 85000,
      "targetNeeds": 42500,
      "targetWants": 25500,
      "targetSavings": 17000,
      "description": "With a monthly take-home income of Rs. 85,000, model the 50/30/20 split to maximize future wealth preservation."
    }
  ],
  "savingGoalGame": [
    {
      "id": 1,
      "title": "University Coding Laptop",
      "cost": 60000,
      "startingSaved": 10000,
      "description": "You need a dependable laptop for computer science coursework costing Rs. 60,000 with Rs. 10,000 already saved.",
      "options": [
        {
          "label": "Steady Pace",
          "monthly": 5000,
          "months": 10,
          "advice": "Highly sustainable contribution that easily accommodates typical student allowances."
        },
        {
          "label": "Accelerated Track",
          "monthly": 10000,
          "months": 5,
          "advice": "Rapid progress: reaches the goal in just 5 months, but requires trimming discretionary dining out."
        },
        {
          "label": "Low-Impact Track",
          "monthly": 2500,
          "months": 20,
          "advice": "Gentle on cash flow, but takes nearly two years to acquire the required machine."
        }
      ]
    },
    {
      "id": 2,
      "title": "Starter Emergency Reserve",
      "cost": 30000,
      "startingSaved": 6000,
      "description": "Establish a liquid safety buffer of Rs. 30,000 to handle unexpected dental, transit, or repair surprises.",
      "options": [
        {
          "label": "Fast Cushion",
          "monthly": 8000,
          "months": 3,
          "advice": "Completes the emergency buffer in only 3 months, offering rapid peace of mind."
        },
        {
          "label": "Balanced Plan",
          "monthly": 4000,
          "months": 6,
          "advice": "Steady 6-month timeline that comfortably aligns with a standard 20% savings rule."
        },
        {
          "label": "Micro-Saver",
          "monthly": 2000,
          "months": 12,
          "advice": "Takes 12 months. Useful if income is temporarily tight, but leaves you vulnerable longer."
        }
      ]
    },
    {
      "id": 3,
      "title": "Professional Cloud Certification",
      "cost": 40000,
      "startingSaved": 5000,
      "description": "Fund industry-recognized developer certification exam vouchers and official preparation materials.",
      "options": [
        {
          "label": "Targeted Sprint",
          "monthly": 7000,
          "months": 5,
          "advice": "Timed perfectly to prepare and sit for the exam within a single academic semester."
        },
        {
          "label": "Standard Cadence",
          "monthly": 5000,
          "months": 7,
          "advice": "Smooth 7-month horizon with plenty of runway for comprehensive study."
        },
        {
          "label": "Extended Plan",
          "monthly": 3500,
          "months": 10,
          "advice": "Minimal monthly impact, but may delay career advancement opportunities."
        }
      ]
    }
  ],
  "budgetDetective": [
    {
      "id": 1,
      "caseName": "Ali's Overspending Mystery",
      "scenario": "Ali earns Rs. 55,000 net monthly, but finishes each month with zero buffer. Examine his monthly ledger below:",
      "income": 55000,
      "ledger": [
        {
          "item": "Apartment Share & Electricity",
          "amount": 20000,
          "category": "Housing",
          "nature": "Need"
        },
        {
          "item": "Basic Cooking Staples & Milk",
          "amount": 9000,
          "category": "Groceries",
          "nature": "Need"
        },
        {
          "item": "Public Transit Bus Card",
          "amount": 3000,
          "category": "Transit",
          "nature": "Need"
        },
        {
          "item": "Unused Gym Membership + 4 Video Apps",
          "amount": 6500,
          "category": "Subscriptions",
          "nature": "Want (Leak)"
        },
        {
          "item": "Food Delivery Apps (12 orders/month)",
          "amount": 13500,
          "category": "Dining Out",
          "nature": "Want (Leak)"
        },
        {
          "item": "Transferred to Savings",
          "amount": 3000,
          "category": "Savings",
          "nature": "Savings (Only 5.4%!)"
        }
      ],
      "questions": [
        {
          "question": "Which category represents the largest discretionary leak in Ali's budget?",
          "options": [
            "Food Delivery Apps (Rs. 13,500)",
            "Apartment Share (Rs. 20,000)",
            "Transit Card (Rs. 3,000)"
          ],
          "correctAnswer": "Food Delivery Apps (Rs. 13,500)",
          "explanation": "Food delivery apps are charging premium restaurant prices and courier surcharges, accounting for nearly 25% of Ali's entire take-home pay."
        },
        {
          "question": "If Ali cooks at home more often and cancels unused subscriptions, how much could he realistically reclaim each month?",
          "options": [
            "Around Rs. 10,000 - 12,000",
            "Less than Rs. 1,000",
            "Nothing without moving home"
          ],
          "correctAnswer": "Around Rs. 10,000 - 12,000",
          "explanation": "Cutting 8 takeout orders saves Rs. 8,000, and trimming unused apps saves Rs. 4,000—freeing up Rs. 12,000 each month to boost his savings rate to 27%."
        }
      ]
    },
    {
      "id": 2,
      "caseName": "Zara's Tech Upgrade Dilemma",
      "scenario": "Zara earns Rs. 65,000 net monthly. She wants to start an emergency fund, but feels squeezed every payday. Examine her ledger:",
      "income": 65000,
      "ledger": [
        {
          "item": "Hostel Rent & Meal Plan",
          "amount": 26000,
          "category": "Essentials",
          "nature": "Need"
        },
        {
          "item": "Smartphone Buy-Now-Pay-Later Installment",
          "amount": 16000,
          "category": "Debt",
          "nature": "Want (Debt Trap)"
        },
        {
          "item": "Daily Peak Rideshare Cabs to Work",
          "amount": 13000,
          "category": "Transport",
          "nature": "Want (Surge Leak)"
        },
        {
          "item": "Course Materials & Cloud Lab",
          "amount": 4000,
          "category": "Education",
          "nature": "Need"
        },
        {
          "item": "Weekend Coffee & Brunches",
          "amount": 6000,
          "category": "Social",
          "nature": "Want"
        },
        {
          "item": "Actual Savings Buffer",
          "amount": 0,
          "category": "Savings",
          "nature": "Deficit Risk (0% Saved)"
        }
      ],
      "questions": [
        {
          "question": "What is the primary factor preventing Zara from building an emergency reserve?",
          "options": [
            "High-interest installment debt & daily rideshares",
            "Course materials fee",
            "Her basic hostel rent"
          ],
          "correctAnswer": "High-interest installment debt & daily rideshares",
          "explanation": "Smartphone installment (Rs. 16,000) combined with daily peak cab rides (Rs. 13,000) consume Rs. 29,000 (45% of her net income) on lifestyle choices."
        },
        {
          "question": "Which immediate habit shift would have the highest immediate impact on Zara's cash flow?",
          "options": [
            "Switching to university transit shuttle instead of peak cabs",
            "Stopping course material purchases",
            "Eating only once a day"
          ],
          "correctAnswer": "Switching to university transit shuttle instead of peak cabs",
          "explanation": "Switching from peak cab surges to an affordable transit pass immediately recaptures Rs. 9,000 to Rs. 10,000 each month without harming health or studies."
        }
      ]
    }
  ],
  "smartSpendingQuiz": [
    {
      "id": 1,
      "question": "What is the primary purpose of the '24-Hour Rule' in mindful budgeting?",
      "options": [
        "To delay non-essential purchases and curb emotional impulse spending",
        "To ensure all bills are paid exactly within 24 hours of arrival",
        "To check store discounts every single day",
        "To spend your daily earnings before midnight"
      ],
      "correctAnswer": "To delay non-essential purchases and curb emotional impulse spending",
      "explanation": "The 24-Hour Rule introduces a cooling-off period between the emotional impulse to buy and the financial transaction, reducing buyer's remorse."
    },
    {
      "id": 2,
      "question": "According to the 50/30/20 guideline, what percentage of your net income should go to essential Needs?",
      "options": [
        "50%",
        "30%",
        "20%",
        "70%"
      ],
      "correctAnswer": "50%",
      "explanation": "50% is the recommended ceiling for essential obligations including housing, groceries, utilities, tuition, and required transit."
    },
    {
      "id": 3,
      "question": "What does the financial principle 'Pay Yourself First' mean?",
      "options": [
        "Transferring money to your savings on the day income arrives before spending on other items",
        "Buying yourself a luxury reward on payday before paying rent",
        "Waiting until the last day of the month to save whatever cash is left",
        "Borrowing from friends to fund personal hobbies"
      ],
      "correctAnswer": "Transferring money to your savings on the day income arrives before spending on other items",
      "explanation": "'Pay Yourself First' treats your future security as an essential bill that must be funded automatically on payday rather than relying on leftover change."
    },
    {
      "id": 4,
      "question": "Which of the following is considered a genuine financial emergency?",
      "options": [
        "A sudden medical prescription or broken prescription glasses",
        "A flash weekend 50% discount sale on designer sneakers",
        "Buying tickets to a sold-out concert with friends",
        "Upgrading a working phone to the newly released model"
      ],
      "correctAnswer": "A sudden medical prescription or broken prescription glasses",
      "explanation": "Genuine emergencies must be unexpected, urgent, and strictly necessary for physical health, essential mobility, or primary obligations."
    },
    {
      "id": 5,
      "question": "Why can 'Buy Now Pay Later' (BNPL) schemes be dangerous for student budgets?",
      "options": [
        "They obscure total costs and encourage purchasing items you cannot currently afford in cash",
        "They automatically donate your money to charity",
        "They only work in foreign currencies",
        "They prevent you from receiving discounts"
      ],
      "correctAnswer": "They obscure total costs and encourage purchasing items you cannot currently afford in cash",
      "explanation": "BNPL micro-installments disconnect the pain of paying from the acquisition of goods, frequently leading to accumulated debt commitments."
    },
    {
      "id": 6,
      "question": "What is the ideal first milestone when establishing an emergency buffer?",
      "options": [
        "A starter liquid reserve of Rs. 15,000 to Rs. 25,000",
        "Five years of total living expenses locked in property",
        "A zero-rupee balance while relying on credit cards",
        "Investing everything in speculative cryptocurrencies"
      ],
      "correctAnswer": "A starter liquid reserve of Rs. 15,000 to Rs. 25,000",
      "explanation": "A starter fund of Rs. 15,000 to Rs. 25,000 covers typical student shocks (medical visit, phone repair, textbook change) without incurring high-interest debt."
    }
  ]
};
}

function getDefaultTips() {
  return {
  "tips": [
    {
      "id": "tip-1",
      "category": "Saving Habit",
      "text": "Pay Yourself First: Transfer at least 15% to 20% of any income directly to your savings account before paying discretionary expenses.",
      "author": "BudgetBasics Foundation"
    },
    {
      "id": "tip-2",
      "category": "Mindful Spending",
      "text": "The 24-Hour Buffer Rule: For any non-essential purchase over Rs. 2,000, wait 24 hours to eliminate impulse dopamine spending.",
      "author": "Behavioral Finance Standard"
    },
    {
      "id": "tip-3",
      "category": "Expense Audit",
      "text": "The Ghost Subscription Check: Review bank statements monthly to cancel forgotten app free trials and unused entertainment tiers.",
      "author": "Student Cash Flow Guide"
    },
    {
      "id": "tip-4",
      "category": "Emergency Preparedness",
      "text": "Starter Emergency Cushion: Aim for a starter emergency reserve of Rs. 15,000 to insulate yourself against sudden device repairs.",
      "author": "Financial Resilience Standard"
    },
    {
      "id": "tip-5",
      "category": "50/30/20 Rule",
      "text": "Essential Needs Ceiling: Ensure that your essential survival costs (housing, groceries, transport) never exceed 50% of net income.",
      "author": "Macro Allocation Principle"
    },
    {
      "id": "tip-6",
      "category": "Debt Prevention",
      "text": "Beware of 'Pay Later' Traps: Zero-interest BNPL schemes encourage lifestyle inflation and commit future income before it is earned.",
      "author": "Credit Education Advisory"
    }
  ]
};
}

function getDefaultMistakes() {
  return {
  "mistakes": [
    {
      "id": "mistake-1",
      "topic": "Impulse Buying & Sales Hype",
      "icon": "bi-bag-x",
      "situation": "Purchasing clothing, gadgets, or accessories impulsively during flash discount sales simply because they are advertised at a discount.",
      "whyProblem": "Discounts deceive buyers into believing they saved money, when in reality 100% of the money spent was an unplanned cash outflow for a non-essential want.",
      "betterAction": "Enforce a mandatory 48-hour cooling period. Place the item on a wish list. If you still genuinely require it after 48 hours and have discretionary funds allocated, purchase it mindfully."
    },
    {
      "id": "mistake-2",
      "topic": "Small Repeated Expenses (The Latte Effect)",
      "icon": "bi-cup-hot",
      "situation": "Buying daily Rs. 400 specialty drinks, canteen snacks, or ride-share trips for short walkable distances without logging them.",
      "whyProblem": "Micro-transactions feel insignificant in isolation, but spending Rs. 600 daily accumulates to over Rs. 18,000 monthly—often exceeding a student's entire monthly savings target.",
      "betterAction": "Set a dedicated weekly petty cash or digital wallet allowance (e.g., Rs. 2,000/week) strictly for casual daily conveniences. When the wallet balance hits zero, hold off until the next week."
    },
    {
      "id": "mistake-3",
      "topic": "Late Fee Penalties & Due Date Neglect",
      "icon": "bi-clock-history",
      "situation": "Postponing utility bills, hostel dues, library fines, or phone payments until after deadlines, incurring recurring late penalty surcharges.",
      "whyProblem": "Late fees are pure deadweight loss—you forfeit money for zero return, and consistent late repayments negatively affect future financial credibility.",
      "betterAction": "Synchronize all recurring payment dates to the first week of the month immediately following your income or stipend deposit. Enable automated calendar reminders 3 days ahead."
    },
    {
      "id": "mistake-4",
      "topic": "Unused Recurring Subscriptions",
      "icon": "bi-credit-card-2-front",
      "situation": "Signing up for 14-day free trials of streaming platforms, cloud tools, or gym tiers with credit/debit card credentials and never canceling.",
      "whyProblem": "Companies build their business models on billing inertia. An unreviewed subscription list quietly leeches Rs. 3,000 to Rs. 7,000 each month for services you rarely open.",
      "betterAction": "Audit your active subscription list on the 1st of every month. Adopt a 'One In, One Out' policy: never activate a new media service without canceling an existing one."
    },
    {
      "id": "mistake-5",
      "topic": "Spending Without a Pre-Allocated Plan",
      "icon": "bi-compass",
      "situation": "Treating your bank account balance as disposable cash and attempting to save 'whatever remains' at the end of the month.",
      "whyProblem": "Parkinson's Law dictates that expenses naturally expand to consume all available resources. Without intentional pre-allocation, month-end remaining balance is almost always zero.",
      "betterAction": "Execute the 'Pay Yourself First' doctrine: the moment income arrives, immediately transfer your 20% savings quota into a dedicated secondary account before spending a single rupee."
    }
  ]
};
}

function getDefaultChecklist() {
  return [
  {
    "id": "chk-income",
    "title": "I Understand Income",
    "desc": "I can differentiate between gross income and take-home net income, and I budget strictly based on my reliable net baseline.",
    "done": false
  },
  {
    "id": "chk-expenses",
    "title": "I Can Identify Expenses",
    "desc": "I distinguish between recurring fixed obligations (rent, tuition) and flexible variable spending (groceries, leisure).",
    "done": false
  },
  {
    "id": "chk-needs-wants",
    "title": "I Understand Needs vs Wants",
    "desc": "I apply the 24-hour buffer before discretionary purchases to ensure essential survival needs always take priority.",
    "done": false
  },
  {
    "id": "chk-503020",
    "title": "I Understand 50/30/20",
    "desc": "I know how to divide my monthly cash flow into 50% Needs, 30% Wants, and 20% dedicated Savings or debt reduction.",
    "done": false
  },
  {
    "id": "chk-goal",
    "title": "I Have a Savings Goal",
    "desc": "I have identified a specific target with an estimated timeline, realistic monthly contributions, and an emergency buffer.",
    "done": false
  },
  {
    "id": "chk-tracking",
    "title": "I Can Track My Spending",
    "desc": "I review my transactions weekly to audit recurring leaks, eliminate subscription creep, and record net balance.",
    "done": false
  }
];
}

function getDefaultBudgeting() {
  return {
  "curriculum": {
    "title": "Budgeting Basics for Students",
    "subtitle": "Master the core components of cash flow before building complex projections.",
    "pillars": [
      {
        "id": "pillar-income",
        "title": "Income",
        "tag": "CASH INFLOW",
        "icon": "bi-cash-coin",
        "description": "Money received through stipends, hourly jobs, parental allowances, or freelance projects. Always calculate using net take-home pay, not gross projections."
      },
      {
        "id": "pillar-fixed",
        "title": "Fixed Expenses",
        "tag": "PREDICTABLE OUTFLOW",
        "icon": "bi-building-lock",
        "description": "Obligations that remain constant each billing cycle: apartment or hostel rent, semester tuition, fixed internet subscriptions, and public transit passes."
      },
      {
        "id": "pillar-variable",
        "title": "Variable Expenses",
        "tag": "FLEXIBLE OUTFLOW",
        "icon": "bi-cart3",
        "description": "Costs that fluctuate depending on daily lifestyle and choices: staple groceries, dining takeaway, utility consumption, books, and social outings."
      },
      {
        "id": "pillar-savings",
        "title": "Savings & Buffer",
        "tag": "WEALTH PRESERVATION",
        "icon": "bi-shield-check",
        "description": "Money transferred into separate accounts immediately upon income arrival to build an emergency fund, purchase durable tools, or invest for the future."
      }
    ],
    "studentExample": {
      "scenario": "Undergraduate Student Monthly Budget Profile",
      "monthlyIncome": 45000,
      "fixedExpenses": [
        {
          "name": "Hostel / Room Share Rent",
          "amount": 16000
        },
        {
          "name": "Semester Transport Pass",
          "amount": 3500
        },
        {
          "name": "Mobile & Internet Package",
          "amount": 1500
        }
      ],
      "variableExpenses": [
        {
          "name": "Staple Groceries & Mess Meals",
          "amount": 9000
        },
        {
          "name": "Academic Supplies & Printing",
          "amount": 2000
        },
        {
          "name": "Discretionary Dining & Coffee",
          "amount": 4000
        }
      ],
      "savingsAllocation": [
        {
          "name": "Emergency Cushion Reserve",
          "amount": 5000
        },
        {
          "name": "Tech Replacement Fund",
          "amount": 4000
        }
      ],
      "summary": {
        "totalIncome": 45000,
        "totalFixed": 21000,
        "totalVariable": 15000,
        "totalSavings": 9000,
        "remainingBalance": 0,
        "keyTakeaway": "A balanced zero-based student budget where every single rupee has an assigned purpose before the month begins."
      }
    }
  }
};
}

function getDefaultNeedsWants() {
  return {
  "curriculum": {
    "definitionNeeds": "Non-negotiable goods and services required for biological survival, physical health, shelter, and completing fundamental academic or employment obligations.",
    "definitionWants": "Purchases that improve lifestyle comfort, aesthetic preference, entertainment, or status, but whose absence does not halt health, housing, or academic continuity.",
    "decisionGuide": [
      {
        "step": 1,
        "question": "Is this purchase required for survival, shelter, basic health, or academic enrollment?",
        "ifYes": "Classify as an essential NEED.",
        "ifNo": "Proceed to Step 2."
      },
      {
        "step": 2,
        "question": "Does a basic, affordable alternative already satisfy this requirement?",
        "ifYes": "The upgrade delta is a discretionary WANT. Buy the basic version.",
        "ifNo": "Proceed to Step 3."
      },
      {
        "step": 3,
        "question": "Can I wait 48 hours without compromising my health, safety, or academic performance?",
        "ifYes": "Classify as a WANT and enforce the 48-hour cooling period.",
        "ifNo": "Classify as a time-sensitive NEED."
      }
    ],
    "quickQuiz": [
      {
        "id": 1,
        "item": "Prescription eye lenses or spectacles",
        "category": "Need",
        "rationale": "Clear vision is an indispensable medical and academic requirement to perform coursework and daily tasks safely."
      },
      {
        "id": 2,
        "item": "Daily Rs. 450 flavored cold brew coffee",
        "category": "Want",
        "rationale": "While caffeine is a preference, home-brewed coffee or water meets hydration needs at 90% lower cost."
      },
      {
        "id": 3,
        "item": "Monthly high-speed home internet for academic coursework",
        "category": "Need",
        "rationale": "Reliable connectivity is mandatory for modern university portals, research submissions, and remote classes."
      },
      {
        "id": 4,
        "item": "Flagship smartphone upgrade while current phone functions normally",
        "category": "Want",
        "rationale": "Desiring newer camera sensors is a lifestyle wish when your existing device handles calls and coursework."
      },
      {
        "id": 5,
        "item": "Nutritious grocery staples: rice, legumes, produce, and milk",
        "category": "Need",
        "rationale": "Baseline nutritional sustenance is non-negotiable for human health, energy, and cognitive focus."
      },
      {
        "id": 6,
        "item": "Front-row tickets to a touring music festival",
        "category": "Want",
        "rationale": "Live entertainment is enjoyable, but your shelter, health, and academic requirements do not depend on it."
      }
    ]
  }
};
}


function getDefaultVisualLearning() {
  return {
  "categories": [
    "All",
    "Saving",
    "Planning",
    "Habit and Goals",
    "Mistakes",
    "20-30-50 Rule",
    "Needs and Wants"
  ],
  "visuals": {
    "rule503020": {
      "id": "visual-rule-503020",
      "category": "20-30-50 Rule",
      "title": "50-30-20 Allocation Framework",
      "subtitle": "A simple visual way to divide your monthly take-home income.",
      "image": "assets/images/visual-503020-chart.jpg",
      "tagline": "Balance today, freedom tomorrow!",
      "slices": [
        {
          "name": "Needs",
          "percent": 50,
          "color": "#583397",
          "icon": "bi-house-door-fill",
          "description": "Essential obligations: housing, food, transport, tuition, utilities, and healthcare."
        },
        {
          "name": "Wants",
          "percent": 30,
          "color": "#7C4DFF",
          "icon": "bi-cart-fill",
          "description": "Discretionary lifestyle: dining out, streaming subscriptions, hobbies, shopping, and travel."
        },
        {
          "name": "Savings",
          "percent": 20,
          "color": "#388E67",
          "icon": "bi-piggy-bank-fill",
          "description": "Wealth preservation: emergency fund buffer, sinking funds, and future financial milestones."
        }
      ]
    },
    "saving": {
      "id": "visual-saving",
      "category": "Saving",
      "title": "Comprehensive Student Savings Ecosystem",
      "subtitle": "Small steps equal big dreams. Discover how regular saving builds lasting peace of mind.",
      "challenge": {
        "title": "Monthly Saving Challenge",
        "tagline": "Save a little, achieve a lot! 30 Days = Bigger Savings",
        "milestones": [
          {
            "day": "Day 1",
            "amount": 50,
            "label": "Starter Habit"
          },
          {
            "day": "Day 7",
            "amount": 100,
            "label": "Weekly Boost"
          },
          {
            "day": "Day 14",
            "amount": 150,
            "label": "Mid-Month Flow"
          },
          {
            "day": "Day 21",
            "amount": 200,
            "label": "Sprint Target"
          },
          {
            "day": "Day 30",
            "amount": 300,
            "label": "Milestone Victory"
          }
        ],
        "totalSavings": 4500
      },
      "benefits": {
        "title": "How Saving Helps You?",
        "tagline": "It's not just about money, it's about freedom.",
        "points": [
          {
            "icon": "bi-shield-check",
            "title": "Handles Emergencies",
            "desc": "Turns sudden unexpected repairs into minor bumps rather than debt."
          },
          {
            "icon": "bi-bullseye",
            "title": "Achieves Your Goals",
            "desc": "Turns overwhelming future purchases into manageable monthly steps."
          },
          {
            "icon": "bi-emoji-smile",
            "title": "Reduces Stress",
            "desc": "Eliminates late-night anxiety about month-end balances."
          },
          {
            "icon": "bi-signpost-split",
            "title": "Gives You More Choices",
            "desc": "Allows you to say yes to career opportunities and personal growth."
          },
          {
            "icon": "bi-bar-chart-line",
            "title": "Builds Financial Freedom",
            "desc": "Establishes long-term independence and investment readiness."
          }
        ]
      },
      "goalsJar": {
        "title": "Saving Goals Tracker",
        "tagline": "Turn your dreams into achievable savings goals!",
        "goals": [
          {
            "name": "New Laptop",
            "saved": 15000,
            "target": 50000,
            "icon": "bi-laptop"
          },
          {
            "name": "Travel",
            "saved": 8000,
            "target": 40000,
            "icon": "bi-airplane"
          },
          {
            "name": "Course / Skills",
            "saved": 5000,
            "target": 30000,
            "icon": "bi-mortarboard"
          },
          {
            "name": "Emergency Fund",
            "saved": 10000,
            "target": 50000,
            "icon": "bi-shield-shaded"
          }
        ]
      },
      "studentTips": [
        {
          "num": 1,
          "tip": "Track your expenses: Know exactly where your money goes every week."
        },
        {
          "num": 2,
          "tip": "Avoid impulse buying: Think, wait 24 hours, then decide."
        },
        {
          "num": 3,
          "tip": "Use the 50-30-20 rule: Balance needs, wants, and savings intentionally."
        },
        {
          "num": 4,
          "tip": "Try a saving challenge: Even small daily amounts make a massive difference."
        },
        {
          "num": 5,
          "tip": "Keep your goals in mind: Save for what truly matters to your future."
        }
      ]
    },
    "planning": {
      "id": "visual-planning",
      "category": "Planning",
      "title": "Monthly Budget Cycle Diagram",
      "subtitle": "Plan \u2022 Spend \u2022 Track \u2022 Save \u2022 Grow. A continuous 6-phase money management roadmap.",
      "image": "assets/images/visual-budget-cycle.jpg",
      "phases": [
        {
          "step": 1,
          "title": "Set Income",
          "icon": "bi-cash-coin",
          "action": "Calculate guaranteed take-home pay before planning allocations.",
          "rule": "Only count net, reliable cash inflow for the month."
        },
        {
          "step": 2,
          "title": "Plan Budget",
          "icon": "bi-journal-check",
          "action": "Assign every rupee a role using the 50/30/20 benchmark guideline.",
          "rule": "Allocate 50% needs, 30% wants, and reserve 20% savings first."
        },
        {
          "step": 3,
          "title": "Spend Wisely",
          "icon": "bi-credit-card-2-front",
          "action": "Prioritize essential payments and pause before discretionary splurges.",
          "rule": "Apply the 24-Hour Rule for non-essential purchases over Rs. 2,000."
        },
        {
          "step": 4,
          "title": "Track Expenses",
          "icon": "bi-clipboard-data",
          "action": "Log daily transactions in your planner or expense tracker.",
          "rule": "Record daily outflows to eliminate month-end budget surprises."
        },
        {
          "step": 5,
          "title": "Save Regularly",
          "icon": "bi-piggy-bank",
          "action": "Automate transfers into your emergency reserve and goal sinking funds.",
          "rule": "Pay yourself first as soon as your income arrives."
        },
        {
          "step": 6,
          "title": "Review & Adjust",
          "icon": "bi-graph-up-arrow",
          "action": "Audit category spending patterns at month-end and refine your plan.",
          "rule": "Celebrate milestones and adjust limits for seasonal demands."
        }
      ]
    },
    "habitAndGoals": {
      "id": "visual-habit-goals",
      "category": "Habit and Goals",
      "title": "Money Habits & Multi-Tier Financial Goals",
      "subtitle": "Small daily habits today create exponential financial freedom tomorrow.",
      "habits": {
        "title": "Core Money Habits",
        "tagline": "Better habits + Better choices = A brighter future",
        "items": [
          {
            "title": "Track Your Spending",
            "desc": "Know where your money goes. Use a notebook or app to maintain clean daily records.",
            "icon": "bi-journal-text"
          },
          {
            "title": "Save Regularly",
            "desc": "Even small consistent amounts compound into major security buffers over time.",
            "icon": "bi-piggy-bank"
          },
          {
            "title": "Avoid Impulse Buying",
            "desc": "Pause, think, and ask: 'Do I really need this item right now?'",
            "icon": "bi-clock-history"
          },
          {
            "title": "Pay Bills on Time",
            "desc": "Avoid punitive late penalty fees and build a spotless credit reputation.",
            "icon": "bi-calendar-check"
          },
          {
            "title": "Invest in Yourself",
            "desc": "Learn high-income digital skills, read finance books, and earn certifications.",
            "icon": "bi-laptop"
          },
          {
            "title": "Keep a Balance",
            "desc": "Enjoy your student life, but never forget to protect your baseline savings.",
            "icon": "bi-sliders"
          }
        ]
      },
      "goals": {
        "title": "Financial Goals Staircase",
        "tagline": "Dream it \u2022 Plan it \u2022 Achieve it",
        "tiers": [
          {
            "tier": 1,
            "heading": "Short Term Goals",
            "timeframe": "0 - 1 year",
            "tag": "Quick wins, build momentum!",
            "icon": "bi-lightning-charge-fill",
            "items": [
              "Save for a reliable study laptop",
              "Pay off small personal debts",
              "Build a starter Rs. 25,000 emergency fund"
            ]
          },
          {
            "tier": 2,
            "heading": "Mid Term Goals",
            "timeframe": "1 - 5 years",
            "tag": "Plan for bigger dreams!",
            "icon": "bi-mortarboard-fill",
            "items": [
              "Complete university degree debt-free",
              "Enroll in specialized professional certification",
              "Save for an educational travel experience"
            ]
          },
          {
            "tier": 3,
            "heading": "Long Term Goals",
            "timeframe": "5+ years",
            "tag": "Build the life you desire!",
            "icon": "bi-trophy-fill",
            "items": [
              "Save down-payment for own home",
              "Achieve career and financial independence",
              "Build an investment portfolio for lifelong security"
            ]
          }
        ]
      }
    },
    "mistakes": {
      "id": "visual-mistakes",
      "category": "Mistakes",
      "title": "Common Student Money Mistakes & Solutions",
      "subtitle": "Avoid these 5 common financial pitfalls \u2022 Build better habits \u2022 Secure your future.",
      "image": "assets/images/mistakes-hd.jpg",
      "cases": [
        {
          "num": 1,
          "name": "Impulse Buying",
          "tagline": "Want it now, regret it later.",
          "icon": "bi-bag-x",
          "scenario": "Riya went to the mall for stationery but bought expensive headphones because they were on sale.",
          "correction": "Pause before buying. Wait 24 hours and ask yourself: 'Do I really need this?'",
          "tip": "Think twice, buy smart!"
        },
        {
          "num": 2,
          "name": "Small Expenses Ignore Karna",
          "tagline": "Chhoti cheezen, bada asar.",
          "icon": "bi-cup-hot",
          "scenario": "Ayaan ignored daily micro-expenses like coffee (Rs. 300), snacks (Rs. 200), and cold drinks (Rs. 150). By month-end, small daily items totaled Rs. 19,500!",
          "correction": "Track every small expense in a planner or mobile app daily.",
          "tip": "Small steps save big!"
        },
        {
          "num": 3,
          "name": "Late Payments",
          "tagline": "Delay costs you extra.",
          "icon": "bi-alarm",
          "scenario": "Rizwan forgot to pay his student internet bill on time and had to pay punitive overdue charges.",
          "correction": "Note due dates and set phone calendar reminders to pay on time and avoid extra fees.",
          "tip": "On-time payments, zero stress!"
        },
        {
          "num": 4,
          "name": "Unused Subscriptions",
          "tagline": "Paying for what you don't use.",
          "icon": "bi-phone",
          "scenario": "Sara was paying monthly for 3 streaming apps and a gym membership she hardly used.",
          "correction": "Review all recurring subscriptions every 30 days. Cancel anything unused for over a month.",
          "tip": "Use only what you need!"
        },
        {
          "num": 5,
          "name": "Without Planning Spending",
          "tagline": "No plan = No control.",
          "icon": "bi-slash-circle",
          "scenario": "Usman received Rs. 10,000 monthly allowance and did not plan his spending. By mid-month, he had zero money left.",
          "correction": "Make a simple 50-30-20 budget: Income - Needs - Wants - Savings. Plan before you spend.",
          "tip": "Plan today, freedom tomorrow!"
        }
      ]
    },
    "needsAndWants": {
      "id": "visual-needs-wants",
      "category": "Needs and Wants",
      "title": "Needs vs Wants 3D Visual Comparison",
      "subtitle": "Both are a part of life, but not both are essential! Prioritise your needs, then enjoy your wants.",
      "image": "assets/images/needs-wants-comparison.jpg",
      "mascotMessage": "Needs keep you alive. Wants make life more fun! Prioritise your needs, then enjoy your wants!",
      "needs": [
        {
          "name": "Food",
          "desc": "Keeps you healthy and energetic with nutritious staple groceries.",
          "icon": "bi-egg-fried"
        },
        {
          "name": "Shelter",
          "desc": "Provides safe housing, dorm rent, and essential stability.",
          "icon": "bi-house-heart"
        },
        {
          "name": "Healthcare",
          "desc": "Prescription medicines, wellness care, and physical health.",
          "icon": "bi-heart-pulse"
        },
        {
          "name": "Education",
          "desc": "Tuition fees, required textbooks, and course skill materials.",
          "icon": "bi-mortarboard"
        },
        {
          "name": "Transport",
          "desc": "Transit card and safe commute to attend classes and job.",
          "icon": "bi-bus-front"
        },
        {
          "name": "Utilities",
          "desc": "Basic comforts: electricity, clean water, and study internet.",
          "icon": "bi-lightning-charge"
        }
      ],
      "wants": [
        {
          "name": "Shopping",
          "desc": "Designer trend outfits and impulse lifestyle retail therapy.",
          "icon": "bi-bag-heart"
        },
        {
          "name": "Gaming",
          "desc": "Fun relaxation, console upgrades, and in-game microtransactions.",
          "icon": "bi-controller"
        },
        {
          "name": "Dining Out",
          "desc": "Specialty cafes, restaurant deliveries, and takeout treats.",
          "icon": "bi-cup-straw"
        },
        {
          "name": "Travel",
          "desc": "Holiday resort vacations and spontaneous weekend getaways.",
          "icon": "bi-airplane-engines"
        },
        {
          "name": "Entertainment",
          "desc": "Concert tickets, cinema premieres, and entertainment packages.",
          "icon": "bi-film"
        },
        {
          "name": "Luxury Items",
          "desc": "Flagship gadgets, smart accessories, and status upgrades.",
          "icon": "bi-gem"
        }
      ]
    }
  }
};
}
