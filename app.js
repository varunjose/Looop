const navToggle = document.querySelector('[data-nav-toggle]');
const navLinks = document.querySelector('[data-nav-links]');
const header = document.querySelector('[data-header]');

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

let lastScrollY = window.scrollY;
const syncHeader = () => {
  const current = window.scrollY;
  header?.classList.toggle('is-scrolled', current > 24);
  header?.classList.toggle('is-hidden', current > lastScrollY && current > 240 && !document.body.classList.contains('menu-open'));
  lastScrollY = current;
};
window.addEventListener('scroll', syncHeader, { passive: true });
syncHeader();

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const revealItems = document.querySelectorAll('.reveal');

if (reducedMotion || !('IntersectionObserver' in window)) {
  revealItems.forEach((item) => item.classList.add('is-visible'));
} else {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -5% 0px' },
  );
  revealItems.forEach((item) => revealObserver.observe(item));
}

const demo = document.querySelector('[data-loop-demo]');
const replayButton = demo?.querySelector('[data-replay]');
let demoTimers = [];
let demoHasRun = false;

const demoStates = [
  {
    delay: 0,
    title: 'Attempt 1 of 4',
    run: 'Running oracle',
    badge: 'running',
    score: 0,
    cost: '$0.0120',
    elapsed: '1.5s',
    checks: {
      typecheck: ['running', 'Running tsc', '0.8s'],
      unit: ['waiting', 'Waiting on typecheck', '—'],
      e2e: ['waiting', 'Waiting on unit tests', '—'],
    },
    activity: 1,
  },
  {
    delay: 1150,
    title: 'Attempt 1 of 4',
    run: 'Repair needed',
    badge: 'repair',
    score: 0,
    cost: '$0.0120',
    elapsed: '1.5s',
    checks: {
      typecheck: ['fail', '1 problem found', '0.9s'],
      unit: ['skipped', 'Skipped — dependency failed', '—'],
      e2e: ['skipped', 'Skipped — dependency failed', '—'],
    },
    activity: 3,
  },
  {
    delay: 2450,
    title: 'Attempt 2 of 4',
    run: 'Repairing from failure',
    badge: 'running',
    score: 34,
    cost: '$0.0240',
    elapsed: '2.7s',
    checks: {
      typecheck: ['pass', 'Passed', '0.7s'],
      unit: ['running', 'Running 42 tests', '1.1s'],
      e2e: ['waiting', 'Waiting on unit tests', '—'],
    },
    activity: 2,
  },
  {
    delay: 3700,
    title: 'Attempt 2 of 4',
    run: 'Verifying browser flow',
    badge: 'running',
    score: 73,
    cost: '$0.0240',
    elapsed: '3.6s',
    checks: {
      typecheck: ['pass', 'Passed', '0.7s'],
      unit: ['pass', '42 tests passed', '1.1s'],
      e2e: ['running', 'Running 8 journeys', '1.8s'],
    },
    activity: 2,
  },
  {
    delay: 5100,
    title: 'Converged in 2 attempts',
    run: 'All checks passed',
    badge: 'pass',
    score: 100,
    cost: '$0.0240',
    elapsed: '4.1s',
    checks: {
      typecheck: ['pass', 'Passed', '0.7s'],
      unit: ['pass', '42 tests passed', '1.1s'],
      e2e: ['pass', '8 journeys passed', '2.3s'],
    },
    activity: 4,
  },
];

const renderDemoState = (state) => {
  if (!demo) return;
  demo.querySelector('[data-attempt-title]').textContent = state.title;
  demo.querySelector('[data-run-state]').textContent = state.run;
  demo.querySelector('[data-run-badge]').dataset.state = state.badge;
  demo.querySelector('[data-score]').textContent = `${state.score}%`;
  demo.querySelector('[data-score-bar]').style.width = `${state.score}%`;
  demo.querySelector('[data-cost]').textContent = state.cost;
  demo.querySelector('[data-elapsed]').textContent = state.elapsed;

  Object.entries(state.checks).forEach(([name, values]) => {
    const row = demo.querySelector(`[data-check="${name}"]`);
    row.dataset.state = values[0];
    demo.querySelector(`[data-check-detail="${name}"]`).textContent = values[1];
    demo.querySelector(`[data-check-time="${name}"]`).textContent = values[2];
  });

  demo.querySelectorAll('[data-activity] li').forEach((item, index) => {
    item.classList.toggle('is-done', index < state.activity - 1 || state.activity === 4);
    item.classList.toggle('is-active', index === state.activity - 1 && state.activity !== 4);
  });
};

const runDemo = () => {
  demoTimers.forEach((timer) => window.clearTimeout(timer));
  demoTimers = [];
  demoStates.forEach((state) => {
    demoTimers.push(window.setTimeout(() => renderDemoState(state), reducedMotion ? 0 : state.delay));
  });
};

replayButton?.addEventListener('click', runDemo);

if (demo) {
  if (reducedMotion || !('IntersectionObserver' in window)) {
    renderDemoState(demoStates.at(-1));
  } else {
    const demoObserver = new IntersectionObserver(
      (entries, observer) => {
        if (!entries[0].isIntersecting || demoHasRun) return;
        demoHasRun = true;
        runDemo();
        observer.disconnect();
      },
      { threshold: 0.35 },
    );
    demoObserver.observe(demo);
  }
}

const terminalOutputs = {
  converged: `
    <div class="terminal-command"><span>→</span> npm run demo</div>
    <div class="terminal-attempt"><span class="term-muted">attempt 1</span><span class="term-bar"><i style="width: 0%"></i></span><b>0%</b><small>$0.0120 · 1.5s</small></div>
    <div class="terminal-check term-fail"><span>×</span> typecheck <small>1 problem</small></div>
    <div class="terminal-check term-skip"><span>·</span> unit <small>Skipped — typecheck did not pass.</small></div>
    <div class="terminal-space"></div>
    <div class="terminal-attempt"><span class="term-muted">attempt 2</span><span class="term-bar"><i style="width: 100%"></i></span><b>100%</b><small>$0.0120 · 2.6s</small></div>
    <div class="terminal-check term-pass"><span>✓</span> typecheck</div>
    <div class="terminal-check term-pass"><span>✓</span> unit</div>
    <div class="terminal-result"><span>✓</span><strong>converged</strong><small>2 attempts · $0.0240 · 4.1s</small></div>`,
  stuck: `
    <div class="terminal-command"><span>→</span> npm run demo:stuck</div>
    <div class="terminal-attempt"><span class="term-muted">attempt 3</span><span class="term-bar warning"><i style="width: 54%"></i></span><b>54%</b><small>$0.0360 · 6.8s</small></div>
    <div class="terminal-check term-fail"><span>×</span> typecheck <small>fingerprint A returned</small></div>
    <div class="terminal-check term-pass"><span>✓</span> unit <small>12 passed</small></div>
    <div class="terminal-space"></div>
    <div class="terminal-check term-skip"><span>·</span> score <small>no improvement across attempts</small></div>
    <div class="terminal-check term-skip"><span>·</span> pattern <small>A → B → A</small></div>
    <div class="terminal-result terminal-result-warn"><span>↗</span><strong>oscillating</strong><small>stopped · escalate with evidence</small></div>`,
};

document.querySelectorAll('[data-terminal-tab]').forEach((button) => {
  button.addEventListener('click', () => {
    const mode = button.dataset.terminalTab;
    document.querySelectorAll('[data-terminal-tab]').forEach((tab) => tab.setAttribute('aria-selected', String(tab === button)));
    const output = document.querySelector('[data-terminal-output]');
    output.innerHTML = terminalOutputs[mode];
    output.setAttribute('aria-labelledby', button.id);
  });
});

document.querySelectorAll('[data-copy]').forEach((button) => {
  button.addEventListener('click', async () => {
    const label = button.querySelector('span');
    try {
      await navigator.clipboard.writeText(button.dataset.copy);
      label.textContent = 'copied';
    } catch {
      label.textContent = button.dataset.copy;
    }
    window.setTimeout(() => {
      label.textContent = 'copy';
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

const year = document.querySelector('[data-year]');
if (year) year.textContent = new Date().getFullYear();
