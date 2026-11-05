// ═══════════════════════════════════════════════════
// 9618 AS Level CS — Shared Revision Engine
// ═══════════════════════════════════════════════════

// ── ANSWER TOGGLE ──
function toggleAnswer(btn) {
  const box = btn.nextElementSibling;
  box.classList.toggle('visible');
  btn.textContent = box.classList.contains('visible') ? 'Hide Answer' : 'Show Answer';
}

// ── SMOOTH SCROLL ──
function scrollToId(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ── NAV HIGHLIGHT ──
function initNavHighlight(sectionIds) {
  const navItems = document.querySelectorAll('.nav-item');
  window.addEventListener('scroll', () => {
    let current = '';
    sectionIds.forEach(id => {
      const el = document.getElementById(id);
      if (el && el.getBoundingClientRect().top <= 90) current = id;
    });
    navItems.forEach(item => {
      item.classList.remove('active');
      const oc = item.getAttribute('onclick') || '';
      if (oc.includes("'" + current + "'")) item.classList.add('active');
    });
  });
}

// ── FLASHCARD ENGINE ──
function createFlashcardEngine(cards) {
  let deck = [...cards];
  let index = 0, correct = 0, wrong = 0, results = {}, flipped = false;

  function render() {
    if (index >= deck.length) { showDone(); return; }
    const card = deck[index];
    const cardEl = document.getElementById('fc-card');
    if (!cardEl) return;
    cardEl.classList.remove('flipped');
    flipped = false;
    document.getElementById('fc-front-label').textContent = card.label || 'TERM';
    document.getElementById('fc-front-text').textContent = card.q;
    const ansEl = document.getElementById('fc-back-text');
    if (card.a.includes('\n')) {
      const lines = card.a.split('\n');
      ansEl.innerHTML = '<ul>' + lines.map(l => '<li>' + l.replace(/^[•\-]\s*/, '') + '</li>').join('') + '</ul>';
    } else {
      ansEl.textContent = card.a;
    }
    document.getElementById('fc-counter').textContent = `Card ${index + 1} of ${deck.length}`;
    document.getElementById('fc-correct').textContent = correct;
    document.getElementById('fc-wrong').textContent = wrong;
    document.getElementById('fc-remain').textContent = deck.length - index;
    const pct = Math.round((index / deck.length) * 100);
    document.getElementById('fc-bar').style.width = pct + '%';
    document.getElementById('fc-done').classList.remove('visible');
  }

  function flip() {
    flipped = !flipped;
    document.getElementById('fc-card').classList.toggle('flipped', flipped);
  }

  function mark(knew) {
    if (knew) correct++; else wrong++;
    results[index] = knew;
    index++;
    setTimeout(render, 200);
  }

  function shuffle() {
    deck = [...deck].sort(() => Math.random() - .5);
    index = 0; correct = 0; wrong = 0; results = {};
    render();
  }

  function restart() {
    deck = [...cards];
    index = 0; correct = 0; wrong = 0; results = {};
    render();
  }

  function reviewMissed() {
    const missed = Object.keys(results).filter(i => !results[i]).map(i => deck[parseInt(i)]);
    if (!missed.length) { alert('No missed cards yet! Complete a session first.'); return; }
    deck = missed;
    index = 0; correct = 0; wrong = 0; results = {};
    render();
  }

  function showDone() {
    document.getElementById('fc-done').classList.add('visible');
    const pct = deck.length > 0 ? Math.round((correct / deck.length) * 100) : 0;
    document.getElementById('fc-done-stats').textContent =
      `You got ${correct} / ${deck.length} correct (${pct}%). ${wrong} missed.`;
    document.getElementById('fc-bar').style.width = '100%';
  }

  setTimeout(render, 100);
  return { flip, mark, shuffle, restart, reviewMissed };
}
