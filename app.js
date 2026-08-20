const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const header = document.querySelector('[data-header]');
const navToggle = document.querySelector('[data-nav-toggle]');
const navLinks = document.querySelector('[data-nav-links]');

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

let lastScrollY = window.scrollY;
let scrollFrame = 0;

const updateHeader = () => {
  const scrollY = window.scrollY;
  const menuOpen = document.body.classList.contains('menu-open');
  header?.classList.toggle('is-scrolled', scrollY > 24);
  header?.classList.toggle('is-hidden', scrollY > lastScrollY && scrollY > 220 && !menuOpen);
  lastScrollY = scrollY;
  scrollFrame = 0;
};

window.addEventListener('scroll', () => {
  if (scrollFrame) return;
  scrollFrame = window.requestAnimationFrame(updateHeader);
}, { passive: true });

updateHeader();

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

const loopDemo = document.querySelector('[data-loop-demo]');
const replayButton = loopDemo?.querySelector('[data-replay]');
const attemptLabel = loopDemo?.querySelector('[data-attempt]');
const scoreLabel = loopDemo?.querySelector('[data-score]');
const progressBar = loopDemo?.querySelector('[data-progress]');
const result = loopDemo?.querySelector('[data-result]');
const oracleStage = loopDemo?.querySelector('[data-demo-stage="oracle"]');
const resultStage = loopDemo?.querySelector('[data-demo-stage="result"]');
let demoTimers = [];
let demoHasPlayed = false;

const demoStates = [
  {
    delay: 0,
    attempt: 'Attempt 1',
    score: 10,
    checks: {
      build: ['running', 'Generating'],
      type: ['waiting', 'Waiting'],
      unit: ['waiting', 'Waiting'],
      e2e: ['waiting', 'Waiting'],
    },
  },
  {
    delay: 850,
    attempt: 'Attempt 1',
    score: 28,
    checks: {
      build: ['pass', 'Built'],
      type: ['running', 'Running tsc'],
      unit: ['waiting', 'Waiting'],
      e2e: ['waiting', 'Waiting'],
    },
  },
  {
    delay: 1700,
    attempt: 'Attempt 1',
    score: 28,
    checks: {
      build: ['pass', 'Built'],
      type: ['fail', '1 problem'],
      unit: ['waiting', 'Skipped'],
      e2e: ['waiting', 'Skipped'],
    },
  },
  {
    delay: 2700,
    attempt: 'Attempt 2',
    score: 70,
    checks: {
      build: ['pass', 'Repaired'],
      type: ['pass', 'Passed'],
      unit: ['running', 'Running 42'],
      e2e: ['waiting', 'Waiting'],
    },
  },
  {
    delay: 3850,
    attempt: 'Attempt 2',
    score: 100,
    complete: true,
    checks: {
      build: ['pass', 'Built'],
      type: ['pass', 'Passed'],
      unit: ['pass', '42 passed'],
      e2e: ['pass', '8 passed'],
    },
  },
];

const renderDemoState = (state) => {
  if (attemptLabel) attemptLabel.textContent = state.attempt;
  if (scoreLabel) scoreLabel.textContent = `${state.score}%`;
  if (progressBar) progressBar.style.width = `${state.score}%`;
  const complete = Boolean(state.complete);
  result?.classList.toggle('is-visible', complete);

  oracleStage?.classList.toggle('is-current', !complete);
  oracleStage?.classList.toggle('is-complete', complete);
  resultStage?.classList.toggle('is-complete', complete);
  const oracleIcon = oracleStage?.querySelector('i');
  const resultIcon = resultStage?.querySelector('i');
  const oracleStageLabel = oracleStage?.querySelector('[data-demo-stage-label]');
  const resultStageLabel = resultStage?.querySelector('[data-demo-stage-label]');
  if (oracleIcon) oracleIcon.textContent = complete ? '✓' : '03';
  if (resultIcon) resultIcon.textContent = complete ? '✓' : '04';
  if (oracleStageLabel) oracleStageLabel.textContent = complete ? 'Checks passed' : 'Running checks';
  if (resultStageLabel) resultStageLabel.textContent = complete ? 'Converged' : 'Waiting';

  Object.entries(state.checks).forEach(([name, [status, label]]) => {
    const check = loopDemo?.querySelector(`[data-check="${name}"]`);
    const checkLabel = loopDemo?.querySelector(`[data-check-label="${name}"]`);
    if (check) check.dataset.state = status;
    if (checkLabel) checkLabel.textContent = label;
  });
};

const playDemo = () => {
  demoTimers.forEach((timer) => window.clearTimeout(timer));
  demoTimers = [];
  result?.classList.remove('is-visible');

  if (reducedMotion) {
    renderDemoState(demoStates.at(-1));
    return;
  }

  demoStates.forEach((state) => {
    const timer = window.setTimeout(() => renderDemoState(state), state.delay);
    demoTimers.push(timer);
  });
};

if (loopDemo) {
  if (reducedMotion || !('IntersectionObserver' in window)) {
    playDemo();
  } else {
    const demoObserver = new IntersectionObserver((entries, observer) => {
      const visibleEntry = entries.find((entry) => entry.isIntersecting);
      if (!visibleEntry || demoHasPlayed) return;
      demoHasPlayed = true;
      playDemo();
      observer.unobserve(visibleEntry.target);
    }, { threshold: 0.4 });

    demoObserver.observe(loopDemo);
  }
}

replayButton?.addEventListener('click', playDemo);

const fallbackCopy = (value) => {
  const input = document.createElement('textarea');
  input.value = value;
  input.setAttribute('readonly', '');
  input.style.position = 'fixed';
  input.style.opacity = '0';
  document.body.append(input);
  input.select();
  document.execCommand('copy');
  input.remove();
};

document.querySelectorAll('[data-copy]').forEach((button) => {
  button.addEventListener('click', async () => {
    const label = button.querySelector('[data-copy-label]');

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(button.dataset.copy);
      } else {
        fallbackCopy(button.dataset.copy);
      }
      if (label) label.textContent = 'Copied';
    } catch {
      fallbackCopy(button.dataset.copy);
      if (label) label.textContent = 'Copied';
    }

    window.setTimeout(() => {
      if (label) label.textContent = 'Copy';
    }, 1600);
  });
});

const year = document.querySelector('[data-year]');
if (year) year.textContent = new Date().getFullYear();
