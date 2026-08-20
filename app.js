const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const header = document.querySelector('[data-header]');
const navToggle = document.querySelector('[data-nav-toggle]');
const navLinks = document.querySelector('[data-nav-links]');
const hero = document.querySelector('[data-hero]');
const story = document.querySelector('[data-scroll-story]');
const difference = document.querySelector('.difference');

const reelTrack = document.querySelector('.reel-track');
if (reelTrack) {
  reelTrack.querySelectorAll('[aria-hidden="true"]').forEach((duplicate) => duplicate.remove());
  [...reelTrack.children].forEach((card) => {
    const clone = card.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    reelTrack.append(clone);
  });
}

const closeMenu = () => {
  if (!navToggle || !navLinks) return;
  navToggle.setAttribute('aria-expanded', 'false');
  navLinks.classList.remove('is-open');
  document.body.classList.remove('menu-open');
};

navToggle?.addEventListener('click', () => {
  const willOpen = navToggle.getAttribute('aria-expanded') !== 'true';
  navToggle.setAttribute('aria-expanded', String(willOpen));
  navLinks?.classList.toggle('is-open', willOpen);
  document.body.classList.toggle('menu-open', willOpen);
});

navLinks?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeMenu();
});

const storyStates = [
  {
    lede: 'Describe the product in plain language. Looop turns the intent into a constrained build plan.',
    pill: 'Ready',
    attempt: '1',
    score: 0,
    checks: { type: ['waiting', 'Waiting'], unit: ['waiting', 'Waiting'], e2e: ['waiting', 'Waiting'] },
  },
  {
    lede: 'A tested blueprint materialises at zero token cost. The model writes only inside marked slots.',
    pill: 'Writing slots',
    attempt: '1',
    score: 0,
    checks: { type: ['waiting', 'Queued'], unit: ['waiting', 'Queued'], e2e: ['waiting', 'Queued'] },
  },
  {
    lede: 'The oracle runs tsc, unit tests, and browser journeys on the real workspace—without asking a model.',
    pill: 'Verifying',
    attempt: '2',
    score: 73,
    checks: { type: ['pass', 'Passed · 0.7s'], unit: ['pass', '42 passed'], e2e: ['running', 'Running 8 journeys'] },
  },
  {
    lede: 'Failures become the next repair instruction. Passing every blocking check is the only success state.',
    pill: 'Converged',
    attempt: '2',
    score: 100,
    checks: { type: ['pass', 'Passed · 0.7s'], unit: ['pass', '42 passed'], e2e: ['pass', '8 passed · 2.3s'] },
  },
];

let activeStoryStep = -1;

const renderStoryStep = (step) => {
  if (!story || step === activeStoryStep) return;
  activeStoryStep = step;
  const state = storyStates[step];
  story.dataset.step = String(step);
  story.style.setProperty('--story-offset', String((step - 1.5) / 1.5));

  const lede = story.querySelector('[data-story-lede]');
  if (lede) lede.textContent = state.lede;

  story.querySelectorAll('[data-story-step]').forEach((button, index) => {
    const active = index === step;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-selected', String(active));
  });

  const runPill = story.querySelector('[data-run-pill]');
  if (runPill) runPill.lastChild.textContent = ` ${state.pill}`;
  const attempt = story.querySelector('[data-attempt-number]');
  const score = story.querySelector('[data-oracle-score]');
  const bar = story.querySelector('[data-oracle-bar]');
  if (attempt) attempt.textContent = state.attempt;
  if (score) score.textContent = `${state.score}%`;
  if (bar) bar.style.width = `${state.score}%`;

  Object.entries(state.checks).forEach(([name, [status, value]]) => {
    const row = story.querySelector(`[data-check-row="${name}"]`);
    const label = story.querySelector(`[data-check-value="${name}"]`);
    if (row) row.dataset.state = status;
    if (label) label.textContent = value;
  });
};

renderStoryStep(0);

story?.querySelectorAll('[data-story-step]').forEach((button) => {
  button.addEventListener('click', () => {
    const step = Number(button.dataset.storyStep);
    renderStoryStep(step);
    if (reducedMotion) return;
    const scrollable = story.offsetHeight - window.innerHeight;
    const destination = story.offsetTop + scrollable * ((step + 0.12) / storyStates.length);
    window.scrollTo({ top: destination, behavior: 'smooth' });
  });
});

let lastScrollY = window.scrollY;
let scrollTicking = false;
let manualHeroPhase = null;

const syncScrollScene = () => {
  const scrollY = window.scrollY;
  header?.classList.toggle('is-scrolled', scrollY > 24);
  header?.classList.toggle('is-hidden', scrollY > lastScrollY && scrollY > 220 && !document.body.classList.contains('menu-open'));

  if (hero && !reducedMotion) {
    const scrollable = Math.max(1, hero.offsetHeight - window.innerHeight);
    const progress = clamp((scrollY - hero.offsetTop) / scrollable);
    hero.style.setProperty('--hero-progress', progress.toFixed(4));
    const phase = manualHeroPhase ?? Math.min(3, Math.floor(progress * 4.01));
    hero.dataset.phase = String(phase);
  }

  if (story && !reducedMotion) {
    const rect = story.getBoundingClientRect();
    const scrollable = Math.max(1, story.offsetHeight - window.innerHeight);
    const progress = clamp(-rect.top / scrollable);
    const step = Math.min(storyStates.length - 1, Math.floor(progress * storyStates.length));
    renderStoryStep(step);
  }

  if (difference && !reducedMotion) {
    const rect = difference.getBoundingClientRect();
    const progress = clamp((window.innerHeight - rect.top) / (window.innerHeight + rect.height));
    difference.style.setProperty('--difference-progress', progress.toFixed(4));
  }

  lastScrollY = scrollY;
  scrollTicking = false;
};

window.addEventListener('scroll', () => {
  if (scrollTicking) return;
  scrollTicking = true;
  window.requestAnimationFrame(syncScrollScene);
}, { passive: true });

window.addEventListener('resize', syncScrollScene, { passive: true });
syncScrollScene();

if (!reducedMotion && window.matchMedia('(pointer: fine)').matches) {
  window.addEventListener('pointermove', (event) => {
    document.body.style.setProperty('--pointer-x', `${event.clientX}px`);
    document.body.style.setProperty('--pointer-y', `${event.clientY}px`);
    hero?.style.setProperty('--hero-x', ((event.clientX / window.innerWidth) * 2 - 1).toFixed(3));
  }, { passive: true });
}

const revealItems = document.querySelectorAll('.reveal');
if (reducedMotion || !('IntersectionObserver' in window)) {
  revealItems.forEach((item) => item.classList.add('is-visible'));
} else {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -7% 0px' });
  revealItems.forEach((item) => revealObserver.observe(item));
}

const promptForm = document.querySelector('[data-prompt-form]');
const promptInput = document.querySelector('[data-prompt-input]');
const promptStatus = document.querySelector('[data-composer-status]');
let promptTimers = [];
let promptEdited = false;

promptInput?.addEventListener('input', () => { promptEdited = true; });

if (promptInput && !reducedMotion) {
  const sample = promptInput.value;
  promptInput.value = '';
  [...sample].forEach((character, index) => {
    window.setTimeout(() => {
      if (!promptEdited) promptInput.value += character;
    }, 350 + index * 18);
  });
}

const runPromptSequence = () => {
  promptTimers.forEach((timer) => window.clearTimeout(timer));
  promptTimers = [];
  promptForm?.classList.add('is-running');
  const sequence = [
    ['Materialising blueprint', 0],
    ['Writing safe slots', 1],
    ['Running real checks', 2],
    ['All checks passed', 3],
  ];

  sequence.forEach(([label, phase], index) => {
    promptTimers.push(window.setTimeout(() => {
      manualHeroPhase = phase;
      if (promptStatus) promptStatus.textContent = label;
      if (hero) hero.dataset.phase = String(phase);
      if (index === sequence.length - 1) {
        promptForm?.classList.remove('is-running');
        promptTimers.push(window.setTimeout(() => {
          manualHeroPhase = null;
          syncScrollScene();
        }, 1800));
      }
    }, reducedMotion ? 0 : index * 760));
  });
};

promptForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!promptInput?.value.trim()) {
    promptInput?.focus();
    return;
  }
  runPromptSequence();
});

const cycleWord = document.querySelector('[data-word-cycle]');
if (cycleWord && !reducedMotion) {
  const words = ['Checked.', 'Repaired.', 'Verified.'];
  let wordIndex = 0;
  window.setInterval(() => {
    cycleWord.animate([
      { opacity: 1, filter: 'blur(0)', transform: 'translateY(0)' },
      { opacity: 0, filter: 'blur(8px)', transform: 'translateY(-12px)' },
    ], { duration: 260, easing: 'ease-in', fill: 'forwards' }).finished.then(() => {
      wordIndex = (wordIndex + 1) % words.length;
      cycleWord.textContent = words[wordIndex];
      cycleWord.animate([
        { opacity: 0, filter: 'blur(8px)', transform: 'translateY(12px)' },
        { opacity: 1, filter: 'blur(0)', transform: 'translateY(0)' },
      ], { duration: 420, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'forwards' });
    }).catch(() => {});
  }, 2600);
}

const terminalOutputs = {
  converged: `
    <div class="terminal-command"><span>→</span> npm run demo</div>
    <div class="terminal-attempt"><span>attempt 1</span><i><em style="width:0%"></em></i><b>0%</b><small>$0.0120 · 1.5s</small></div>
    <div class="terminal-check is-fail"><span>×</span> typecheck <small>1 problem</small></div>
    <div class="terminal-check is-muted"><span>·</span> unit <small>Skipped — dependency failed.</small></div>
    <div class="terminal-attempt"><span>attempt 2</span><i><em style="width:100%"></em></i><b>100%</b><small>$0.0120 · 2.6s</small></div>
    <div class="terminal-check is-pass"><span>✓</span> typecheck</div>
    <div class="terminal-check is-pass"><span>✓</span> unit</div>
    <div class="terminal-result"><span>✓</span><b>converged</b><small>2 attempts · $0.0240 · 4.1s</small></div>`,
  stuck: `
    <div class="terminal-command"><span>→</span> npm run demo:stuck</div>
    <div class="terminal-attempt"><span>attempt 3</span><i><em style="width:54%"></em></i><b>54%</b><small>$0.0360 · 6.8s</small></div>
    <div class="terminal-check is-fail"><span>×</span> typecheck <small>failure fingerprint A returned</small></div>
    <div class="terminal-check is-pass"><span>✓</span> unit <small>12 passed</small></div>
    <div class="terminal-attempt"><span>pattern</span><i><em style="width:54%"></em></i><b>A→B→A</b><small>no progress</small></div>
    <div class="terminal-check is-muted"><span>·</span> score <small>unchanged across attempts</small></div>
    <div class="terminal-check is-muted"><span>·</span> decision <small>more attempts will not help</small></div>
    <div class="terminal-result is-warning"><span>↗</span><b>oscillating</b><small>stopped · escalate with evidence</small></div>`,
};

document.querySelectorAll('[data-terminal-tab]').forEach((button) => {
  button.addEventListener('click', () => {
    const mode = button.dataset.terminalTab;
    document.querySelectorAll('[data-terminal-tab]').forEach((tab) => tab.setAttribute('aria-selected', String(tab === button)));
    const output = document.querySelector('[data-terminal-output]');
    if (!output) return;
    output.innerHTML = terminalOutputs[mode];
    output.setAttribute('aria-labelledby', button.id);
    const copyButton = document.querySelector('[data-copy]');
    if (copyButton) copyButton.dataset.copy = mode === 'stuck' ? 'npm run demo:stuck' : 'npm run demo';
  });
});

document.querySelectorAll('[data-copy]').forEach((button) => {
  button.addEventListener('click', async () => {
    const label = button.querySelector('span');
    try {
      await navigator.clipboard.writeText(button.dataset.copy);
      if (label) label.textContent = 'copied';
    } catch {
      if (label) label.textContent = button.dataset.copy;
    }
    window.setTimeout(() => {
      if (label) label.textContent = 'copy';
    }, 1600);
  });
});

document.querySelectorAll('.faq-list details').forEach((detail) => {
  detail.addEventListener('toggle', () => {
    if (!detail.open) return;
    document.querySelectorAll('.faq-list details').forEach((other) => {
      if (other !== detail) other.open = false;
    });
  });
});

const counterItems = document.querySelectorAll('[data-count]');
if (reducedMotion || !('IntersectionObserver' in window)) {
  counterItems.forEach((counter) => { counter.textContent = counter.dataset.count; });
} else {
  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const target = Number(entry.target.dataset.count);
      const start = performance.now();
      const duration = 1200;
      const tick = (now) => {
        const progress = clamp((now - start) / duration);
        const eased = 1 - (1 - progress) ** 4;
        entry.target.textContent = String(Math.round(target * eased));
        if (progress < 1) window.requestAnimationFrame(tick);
      };
      window.requestAnimationFrame(tick);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.5 });
  counterItems.forEach((counter) => {
    counter.textContent = '0';
    counterObserver.observe(counter);
  });
}

if (!reducedMotion && window.matchMedia('(pointer: fine)').matches) {
  document.querySelectorAll('[data-tilt]').forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      const bounds = card.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - 0.5;
      const y = (event.clientY - bounds.top) / bounds.height - 0.5;
      card.style.setProperty('--tilt-x', `${(-y * 4).toFixed(2)}deg`);
      card.style.setProperty('--tilt-y', `${(x * 4).toFixed(2)}deg`);
    });
    card.addEventListener('pointerleave', () => {
      card.style.setProperty('--tilt-x', '0deg');
      card.style.setProperty('--tilt-y', '0deg');
    });
  });

  document.querySelectorAll('[data-magnetic]').forEach((button) => {
    button.addEventListener('pointermove', (event) => {
      const bounds = button.getBoundingClientRect();
      const x = event.clientX - (bounds.left + bounds.width / 2);
      const y = event.clientY - (bounds.top + bounds.height / 2);
      button.style.transform = `translate(${(x * 0.08).toFixed(1)}px, ${(y * 0.12).toFixed(1)}px)`;
    });
    button.addEventListener('pointerleave', () => { button.style.transform = ''; });
  });
}

const year = document.querySelector('[data-year]');
if (year) year.textContent = new Date().getFullYear();
