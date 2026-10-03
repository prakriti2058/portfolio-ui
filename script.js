(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];

  $('#year').textContent = new Date().getFullYear();

  /* ---------- Nav: solid past the hero, hide on scroll down, mobile menu, active link ---------- */
  const nav = $('#nav'), toggle = $('#navToggle'), menu = $('#menu');
  let lastY = scrollY;
  const onScroll = () => {
    const y = scrollY;
    nav.classList.toggle('is-hidden', y > lastY && y > 400 && menu.hidden);
    lastY = y;
  };
  addEventListener('scroll', onScroll, { passive: true });

  const setMenu = (open) => {
    menu.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.classList.toggle('menu-open', open);
    onScroll();
  };
  toggle.addEventListener('click', () => setMenu(menu.hidden));
  menu.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && !menu.hidden) setMenu(false); });
  matchMedia('(min-width: 769px)').addEventListener('change', (e) => { if (e.matches) setMenu(false); });
  onScroll();

  const links = $$('.nav__links a');
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      links.forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === '#' + e.target.id));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  $$('main section[id]').forEach((s) => spy.observe(s));

  /* ---------- Hero: typed role ---------- */
  const typed = $('#typedRole');
  if (typed && !reduced) {
    const roles = ['QA Engineer', 'Business Analyst', 'Data Analyst'];
    let r = 0, n = roles[0].length, deleting = true;
    const type = () => {
      const role = roles[r];
      n += deleting ? -1 : 1;
      typed.textContent = role.slice(0, n);
      let delay = deleting ? 50 : 100;
      if (!deleting && n === role.length) { deleting = true; delay = 2000; }
      else if (deleting && n === 0) { deleting = false; r = (r + 1) % roles.length; delay = 500; }
      setTimeout(type, delay);
    };
    setTimeout(type, 2500);
  }

  /* ---------- Experience: fold / unfold job details ---------- */
  $$('.tl__toggle').forEach((btn) => {
    const card = btn.closest('.tl__card'), more = $('.tl__more', card);
    const set = (open) => {
      card.classList.toggle('is-open', open);
      btn.setAttribute('aria-expanded', String(open));
      $('span', btn).textContent = open ? 'Hide details' : 'Show details';
      more.inert = !open;
    };
    set(card.classList.contains('is-open'));
    btn.addEventListener('click', () => set(!card.classList.contains('is-open')));
  });

  /* ---------- Scroll reveal ---------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add('in');
      io.unobserve(e.target);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -5% 0px' });
  $$('.reveal').forEach((el) => io.observe(el));

  /* ---------- Pointer effects ---------- */
  // button fill originates from where the pointer enters
  $$('.btn').forEach((btn) => {
    btn.addEventListener('pointerenter', (e) => {
      const r = btn.getBoundingClientRect();
      btn.style.setProperty('--x', `${e.clientX - r.left}px`);
      btn.style.setProperty('--y', `${e.clientY - r.top}px`);
    });
  });

  if (finePointer && !reduced) {
    $$('[data-magnetic]').forEach((el) => {
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) * 0.2;
        const y = (e.clientY - r.top - r.height / 2) * 0.3;
        el.style.transform = `translate(${x}px, ${y}px)`;
      });
      el.addEventListener('pointerleave', () => { el.style.transform = ''; });
    });

    $$('.glow').forEach((el) => {
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        el.style.setProperty('--mx', `${e.clientX - r.left}px`);
        el.style.setProperty('--my', `${e.clientY - r.top}px`);
      });
    });
  }

  /* ---------- Copy email ---------- */
  const copyBtn = $('#copyEmail');
  if (copyBtn) {
    const label = $('.btn__text', copyBtn);
    copyBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText('prakriti.thapa1290@gmail.com');
        label.textContent = 'Copied ✓';
      } catch {
        label.textContent = 'Press Ctrl/Cmd + C';
      }
      setTimeout(() => { label.textContent = 'Copy email'; }, 1800);
    });
  }
})();
