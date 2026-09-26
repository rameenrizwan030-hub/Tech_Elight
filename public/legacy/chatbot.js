/**
 * BudgetBasics - Persistent Floating BudgetBee Assistant
 * Strict 1-to-1 suggested question matching & guarded custom query scope
 * Strictly NO emojis - Professional and Educational
 */

function initBudgetBeeChatbot() {
  const launcher = document.getElementById('budgetBeeLauncher');
  const chatWindow = document.getElementById('budgetBeeChatWindow');
  const btnClose = document.getElementById('chatBtnClose');
  const btnMinimize = document.getElementById('chatBtnMinimize');
  const messagesContainer = document.getElementById('chatMessagesBody');
  const inputEl = document.getElementById('chatTextInput');
  const sendBtn = document.getElementById('chatBtnSend');
  const suggestionsContainer = document.getElementById('chatSuggestionsList');

  if (!launcher || !chatWindow) return;

  // Toggle chat window
  function toggleChat(open) {
    if (open === undefined) {
      chatWindow.classList.toggle('active');
    } else if (open) {
      chatWindow.classList.add('active');
    } else {
      chatWindow.classList.remove('active');
    }

    if (chatWindow.classList.contains('active')) {
      setTimeout(() => {
        if (inputEl) inputEl.focus();
        scrollToBottom();
      }, 200);
    }
  }

  launcher.addEventListener('click', () => toggleChat());
  if (btnClose) btnClose.addEventListener('click', () => toggleChat(false));
  if (btnMinimize) btnMinimize.addEventListener('click', () => toggleChat(false));

  // Initialize 8+ Suggestions directly from chatbot.json dataset
  if (suggestionsContainer && BB_DATA.chatbot && BB_DATA.chatbot.suggestedQuestions) {
    suggestionsContainer.innerHTML = BB_DATA.chatbot.suggestedQuestions.map(item => `
      <button class="bb-suggestion-chip" type="button" data-qid="${item.id || ''}">${item.question}</button>
    `).join('');

    suggestionsContainer.querySelectorAll('.bb-suggestion-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const questionText = chip.textContent.trim();
        // Look up corresponding exact answer from the same JSON dataset
        const matchedItem = BB_DATA.chatbot.suggestedQuestions.find(sq => sq.question === questionText);
        if (matchedItem) {
          askBudgetBeeDirect(matchedItem.question, matchedItem.answer);
        } else {
          askBudgetBeeCustom(questionText);
        }
      });
    });
  }

  // Handle User Input Submission
  function handleSend() {
    const text = (inputEl.value || '').trim();
    if (!text) return;
    inputEl.value = '';
    askBudgetBeeCustom(text);
  }

  if (sendBtn) sendBtn.addEventListener('click', handleSend);
  if (inputEl) {
    inputEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleSend();
      }
    });
  }

  // 1-to-1 Direct Match from Clicked Suggestion
  function askBudgetBeeDirect(question, specificAnswer) {
    appendMessage(question, 'user');
    setTimeout(() => {
      appendMessage(specificAnswer, 'bot');
    }, 240);
  }

  // Typed Custom Question Matching with Scope Guard
  function askBudgetBeeCustom(userQuery) {
    appendMessage(userQuery, 'user');
    setTimeout(() => {
      const answer = resolveCustomQuery(userQuery);
      appendMessage(answer, 'bot');
    }, 280);
  }

  function appendMessage(text, sender) {
    const bubble = document.createElement('div');
    bubble.className = `bb-chat-bubble ${sender}`;
    bubble.textContent = text;
    messagesContainer.appendChild(bubble);
    scrollToBottom();
  }

  function scrollToBottom() {
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  }

  // Intelligent resolution & scope enforcement
  function resolveCustomQuery(rawQuery) {
    const q = rawQuery.toLowerCase().trim();

    // 1. Direct exact or substring match in suggestedQuestions
    const suggestions = (BB_DATA.chatbot && BB_DATA.chatbot.suggestedQuestions) || [];
    for (const sq of suggestions) {
      if (q === sq.question.toLowerCase() || sq.question.toLowerCase().includes(q)) {
        return sq.answer;
      }
    }

    // 2. Keyword scoring across suggestions + FAQ
    let bestAnswer = null;
    let highestScore = 0;

    const allKnowledge = [
      ...suggestions,
      ...((BB_DATA.chatbot && BB_DATA.chatbot.faq) || [])
    ];

    for (const item of allKnowledge) {
      if (!item.keywords) continue;
      let score = 0;
      for (const kw of item.keywords) {
        const kwLower = kw.toLowerCase();
        if (q.includes(kwLower)) {
          // Boost longer matching phrases
          score += kwLower.split(' ').length * 2;
        }
      }
      if (score > highestScore) {
        highestScore = score;
        bestAnswer = item.answer;
      }
    }

    if (bestAnswer && highestScore >= 2) {
      return bestAnswer;
    }

    // 3. Greetings
    if (/^(hi|hello|hey|greetings|good morning|good afternoon|good evening)/i.test(q)) {
      return "Hello. I am BudgetBee, your educational budgeting assistant. How can I assist your financial learning journey today? Feel free to ask about savings, expenses, needs vs wants, or budgeting rules.";
    }

    // 4. Out-of-scope question guard (prevents hallucination)
    const scopeMsg = (BB_DATA.chatbot && BB_DATA.chatbot.scopeExplanation) ||
      "I’m BudgetBee, your budgeting assistant. I can help you with the topics covered in my suggested questions, such as income, expenses, savings, needs vs wants, budgeting, the 50/30/20 rule and saving goals. Try asking me about one of these topics.";

    return scopeMsg;
  }
}
