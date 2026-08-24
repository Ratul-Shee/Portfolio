/* =========================================================
   RATUL SHEE — PORTFOLIO ENGINE & MOTION SUITE
   Full Interactive Motion, Sound FX, Terminal & Command Hub
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* =========================================================
     1. Web Audio API Sci-Fi Synthesizer (Zero Dependencies)
     ========================================================= */
  let audioCtx = null;
  let sfxEnabled = localStorage.getItem('ratul_sfx_enabled') === 'true';

  function initAudio() {
    if (!audioCtx && (window.AudioContext || window.webkitAudioContext)) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playSynthSound(type) {
    if (!sfxEnabled) return;
    try {
      initAudio();
      if (!audioCtx) return;

      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      if (type === 'click') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(400, now + 0.05);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
      } else if (type === 'hover') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(520, now);
        osc.frequency.exponentialRampToValueAtTime(780, now + 0.04);
        gain.gain.setValueAtTime(0.02, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
        osc.start(now);
        osc.stop(now + 0.04);
      } else if (type === 'open') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.12);
        gain.gain.setValueAtTime(0.07, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc.start(now);
        osc.stop(now + 0.12);
      } else if (type === 'success') {
        // High double-chime
        const osc2 = audioCtx.createOscillator();
        const gain2 = audioCtx.createGain();
        osc2.connect(gain2);
        gain2.connect(audioCtx.destination);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, now); // D5
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
        osc.start(now);
        osc.stop(now + 0.18);

        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(880, now + 0.09); // A5
        gain2.gain.setValueAtTime(0.08, now + 0.09);
        gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
        osc2.start(now + 0.09);
        osc2.stop(now + 0.28);
      } else if (type === 'packet') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.exponentialRampToValueAtTime(1200, now + 0.2);
        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
      }
    } catch (e) {
      console.warn('Audio FX error:', e);
    }
  }

  // Audio Toggle Button
  const soundToggleBtn = document.getElementById('soundToggleBtn');
  const soundLabel = document.getElementById('soundLabel');

  function updateSoundUI() {
    if (sfxEnabled) {
      soundToggleBtn.classList.add('sound-on');
      soundLabel.textContent = 'SFX: ON';
    } else {
      soundToggleBtn.classList.remove('sound-on');
      soundLabel.textContent = 'SFX: OFF';
    }
    localStorage.setItem('ratul_sfx_enabled', sfxEnabled);
  }
  updateSoundUI();

  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', () => {
      sfxEnabled = !sfxEnabled;
      initAudio();
      updateSoundUI();
      if (sfxEnabled) playSynthSound('success');
      showToast(sfxEnabled ? '🔊 Sci-Fi Sound Effects Enabled' : '🔇 Audio Muted');
    });
  }

  // Add click sound to interactive elements
  document.addEventListener('click', (e) => {
    if (e.target.closest('a, button, .cmd-item, .arch-node, .filter-tab')) {
      playSynthSound('click');
    }
  });

  /* =========================================================
     2. Toast Notification System
     ========================================================= */
  const toastContainer = document.getElementById('toastContainer');

  function showToast(message, duration = 3200) {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span>${message}</span>`;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('toast-out');
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }

  /* =========================================================
     3. Copy to Clipboard Trigger
     ========================================================= */
  document.querySelectorAll('.copy-email-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const email = btn.getAttribute('data-email') || 'ratulshee6@gmail.com';
      navigator.clipboard.writeText(email).then(() => {
        playSynthSound('success');
        showToast(`📋 Copied: <strong>${email}</strong>`);
      }).catch(() => {
        showToast(`📧 Email: ${email}`);
      });
    });
  });

  /* =========================================================
     4. Boot Preloader Sequence
     ========================================================= */
  const bootScreen = document.getElementById('bootScreen');
  const bootLine1 = document.getElementById('bootLine1');
  const bootLine2Wrap = document.getElementById('bootLine2Wrap');
  const bootLine2 = document.getElementById('bootLine2');
  const bootLine3Wrap = document.getElementById('bootLine3Wrap');
  const bootLine3 = document.getElementById('bootLine3');
  const bootFill = document.getElementById('bootFill');
  const bootStatusText = document.getElementById('bootStatusText');
  const heroTyped = document.getElementById('heroTyped');
  const bootSkipBtn = document.getElementById('bootSkipBtn');

  if (bootLine2Wrap) bootLine2Wrap.style.opacity = '0';
  if (bootLine3Wrap) bootLine3Wrap.style.opacity = '0';

  function typeWriter(el, text, speed, cb) {
    let i = 0;
    function step() {
      if (i <= text.length) {
        el.textContent = text.slice(0, i);
        i++;
        setTimeout(step, speed);
      } else if (cb) {
        cb();
      }
    }
    step();
  }

  function finishBoot() {
    if (!bootScreen) return;
    bootScreen.classList.add('done');
    if (heroTyped) {
      typeWriter(heroTyped, 'Full-Stack MERN Developer based in Chandannagar, India. Specializing in high-performance web systems and AI workflows.', 24);
    }
  }

  if (bootSkipBtn) {
    bootSkipBtn.addEventListener('click', finishBoot);
  }

  function runBoot() {
    const hasBooted = sessionStorage.getItem('ratul_boot_done');
    if (prefersReduced || hasBooted) {
      if (bootScreen) bootScreen.classList.add('done');
      if (heroTyped) heroTyped.textContent = 'Full-Stack MERN Developer based in Chandannagar, India. Specializing in high-performance web systems and AI workflows.';
      return;
    }

    sessionStorage.setItem('ratul_boot_done', 'true');

    typeWriter(bootLine1, 'load_environment --profile ratul_shee', 22, () => {
      if (bootLine2Wrap) bootLine2Wrap.style.opacity = '1';
      typeWriter(bootLine2, 'initializing MERN core (React, Node, Express, MongoDB)...', 20, () => {
        if (bootLine3Wrap) bootLine3Wrap.style.opacity = '1';
        typeWriter(bootLine3, 'system status: 100% operational. welcome.', 20, () => {
          let p = 0;
          const timer = setInterval(() => {
            p += 5;
            if (bootFill) bootFill.style.width = Math.min(p, 100) + '%';
            if (bootStatusText) bootStatusText.textContent = `MOUNTING ASSETS... ${Math.min(p, 100)}%`;
            if (p >= 100) {
              clearInterval(timer);
              setTimeout(finishBoot, 280);
            }
          }, 20);
        });
      });
    });
  }
  runBoot();

  /* =========================================================
     5. Interactive Developer Terminal in Hero
     ========================================================= */
  const termInput = document.getElementById('termInput');
  const termHistory = document.getElementById('termHistory');

  const termCommands = {
    help: () => `Available commands:
• <span class="text-green">skills</span>      - List technical competencies
• <span class="text-green">projects</span>    - View featured full-stack projects
• <span class="text-green">about</span>       - Print bio & background overview
• <span class="text-green">contact</span>     - View contact coordinates
• <span class="text-green">time</span>        - Get live Chandannagar IST time
• <span class="text-green">hire</span>        - Generate collaboration handshake 🤝
• <span class="text-green">repo</span>        - Link to GitHub profile
• <span class="text-green">clear</span>       - Wipe terminal screen`,

    whoami: () => `Full-Stack MERN Developer | B.Tech Student | Chandannagar, West Bengal, India.`,

    skills: () => `Frontend: React.js, HTML5, CSS3, Tailwind, Redux
Backend:  Node.js, Express.js, RESTful APIs, JWT
Database: MongoDB Atlas, Mongoose
Tools:    Git, Postman, AI Prompt Eng, Vite`,

    projects: () => `1. <a href="#projects" class="text-green">FinTrack</a> — Personal Expense & Budget Manager (MERN)
2. <a href="#projects" class="text-green">DevPulse</a> — Content Studio & Markdown CMS (MERN)
3. <a href="#projects" class="text-green">PromptMatrix</a> — AI Prompt Workbench`,

    about: () => `Pursuing B.Tech at Supreme Knowledge Foundation Group of Institutions (Graduating 2027). Focused on full-stack web applications and AI tools.`,

    contact: () => `Email:    <a href="mailto:ratulshee6@gmail.com" class="text-green">ratulshee6@gmail.com</a>
GitHub:   <a href="https://github.com/Ratul-Shee/" target="_blank" class="text-green">github.com/Ratul-Shee</a>
LinkedIn: <a href="https://www.linkedin.com/in/ratul-shee/" target="_blank" class="text-green">linkedin.com/in/ratul-shee</a>`,

    time: () => `Current Local Time (IST): ${new Date().toLocaleTimeString('en-US', { timeZone: 'Asia/Kolkata' })}`,

    hire: () => {
      playSynthSound('success');
      showToast('🎉 Let\'s build together! Opening contact section...');
      setTimeout(() => {
        document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
      }, 600);
      return `<span class="text-green">✨ OFFER ACCEPTED:</span> Let's engineer something great together! Redirecting to contact...`;
    },

    repo: () => {
      window.open('https://github.com/Ratul-Shee/', '_blank');
      return `Opening https://github.com/Ratul-Shee/...`;
    },

    sudo: () => `<span style="color:#ef4444;">Permission denied:</span> Ratul Shee is the only root user in this environment.`,

    clear: () => '__CLEAR__'
  };

  if (termInput) {
    termInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const raw = termInput.value.trim();
        const cmd = raw.toLowerCase();
        termInput.value = '';

        if (!raw) return;

        playSynthSound('click');

        if (cmd === 'clear') {
          termHistory.innerHTML = '';
          return;
        }

        const userLine = document.createElement('p');
        userLine.className = 'term-line';
        userLine.innerHTML = `<span class="prompt">guest@ratul-dev:~$</span> <span class="cmd-text">${escapeHtml(raw)}</span>`;
        termHistory.appendChild(userLine);

        const responseLine = document.createElement('p');
        responseLine.className = 'term-response';

        if (termCommands[cmd]) {
          responseLine.innerHTML = termCommands[cmd]();
        } else {
          responseLine.innerHTML = `<span style="color:#f59e0b;">Command not recognized:</span> '${escapeHtml(raw)}'. Type <span class="text-green">"help"</span> for a list of available commands.`;
        }

        termHistory.appendChild(responseLine);

        const termBody = document.getElementById('termBody');
        if (termBody) termBody.scrollTop = termBody.scrollHeight;
      }
    });
  }

  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  /* =========================================================
     6. Command Palette (Ctrl + K / ⌘K)
     ========================================================= */
  const cmdBackdrop = document.getElementById('cmdBackdrop');
  const cmdInput = document.getElementById('cmdInput');
  const cmdTriggerBtn = document.getElementById('cmdTriggerBtn');
  const heroQuickLookBtn = document.getElementById('heroQuickLookBtn');
  const cmdResults = document.getElementById('cmdResults');

  function openCmdPalette() {
    if (!cmdBackdrop) return;
    cmdBackdrop.classList.add('open');
    playSynthSound('open');
    setTimeout(() => {
      if (cmdInput) {
        cmdInput.value = '';
        cmdInput.focus();
        filterCmdItems('');
      }
    }, 50);
  }

  function closeCmdPalette() {
    if (!cmdBackdrop) return;
    cmdBackdrop.classList.remove('open');
  }

  if (cmdTriggerBtn) cmdTriggerBtn.addEventListener('click', openCmdPalette);
  if (heroQuickLookBtn) heroQuickLookBtn.addEventListener('click', openCmdPalette);

  if (cmdBackdrop) {
    cmdBackdrop.addEventListener('click', (e) => {
      if (e.target === cmdBackdrop) closeCmdPalette();
    });
  }

  // Keyboard Shortcuts: Ctrl+K / Cmd+K / Esc
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (cmdBackdrop.classList.contains('open')) {
        closeCmdPalette();
      } else {
        openCmdPalette();
      }
    } else if (e.key === 'Escape') {
      closeCmdPalette();
      closeProjectModal();
    }
  });

  // Filter Command Items
  function filterCmdItems(query) {
    const q = query.toLowerCase().trim();
    const items = cmdResults.querySelectorAll('.cmd-item');
    items.forEach(item => {
      const text = item.textContent.toLowerCase();
      if (!q || text.includes(q)) {
        item.style.display = 'flex';
      } else {
        item.style.display = 'none';
      }
    });
  }

  if (cmdInput) {
    cmdInput.addEventListener('input', () => filterCmdItems(cmdInput.value));
  }

  // Handle Command Item Execution
  cmdResults?.addEventListener('click', (e) => {
    const item = e.target.closest('.cmd-item');
    if (!item) return;

    const action = item.getAttribute('data-action');
    const target = item.getAttribute('data-target');

    closeCmdPalette();

    if (action === 'goto' && target) {
      const el = document.querySelector(target);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (action === 'copy-email') {
      navigator.clipboard.writeText('ratulshee6@gmail.com').then(() => {
        playSynthSound('success');
        showToast('📋 Email copied: ratulshee6@gmail.com');
      });
    } else if (action === 'toggle-sound') {
      sfxEnabled = !sfxEnabled;
      updateSoundUI();
      showToast(sfxEnabled ? '🔊 SFX Enabled' : '🔇 SFX Muted');
    } else if (action === 'open-github') {
      window.open('https://github.com/Ratul-Shee/', '_blank');
    } else if (action === 'open-linkedin') {
      window.open('https://www.linkedin.com/in/ratul-shee/', '_blank');
    }
  });

  /* =========================================================
     7. Project Quick-Look Modal
     ========================================================= */
  const projectModal = document.getElementById('projectModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalImg = document.getElementById('modalImg');
  const modalCategory = document.getElementById('modalCategory');
  const modalTitle = document.getElementById('modalTitle');
  const modalSubtitle = document.getElementById('modalSubtitle');
  const modalFeatures = document.getElementById('modalFeatures');
  const modalStack = document.getElementById('modalStack');
  const modalLiveBtn = document.getElementById('modalLiveBtn');
  const modalRepoBtn = document.getElementById('modalRepoBtn');

  const projectData = {
    fintrack: {
      title: 'FinTrack — Personal Expense & Wealth Manager',
      category: 'Full-Stack MERN',
      image: 'fintrack.jpg',
      subtitle: 'Complete financial health tracker with secure JWT auth, category budgets, and spending analytics.',
      features: [
        'JWT-based secure authentication with session expiry and bcrypt password hashing.',
        'Interactive spending charts and monthly budget burn-down visualization.',
        'Category-wise expenditure breakdown with real-time balance calculations.',
        'Mongoose schema optimized for high-volume transaction indexing and querying.'
      ],
      stack: ['React', 'Node.js', 'Express', 'MongoDB', 'Chart.js', 'JWT', 'REST API'],
      liveUrl: 'https://github.com/Ratul-Shee/',
      repoUrl: 'https://github.com/Ratul-Shee/'
    },
    devpulse: {
      title: 'DevPulse — MERN Content Studio & Markdown CMS',
      category: 'Publishing Platform',
      image: 'devpulse.jpg',
      subtitle: 'Developer-focused publishing suite with live Markdown preview, author permissions, and SEO slugs.',
      features: [
        'Real-time split-pane Markdown editor with syntax highlighted code blocks.',
        'Role-based access control (RBAC) preventing unauthorized post mutations.',
        'Fast full-text search indexing on MongoDB with category & tag aggregations.',
        'Responsive reading interface optimized for mobile and desktop screens.'
      ],
      stack: ['React', 'Node.js', 'Express', 'MongoDB', 'Markdown Editor', 'REST API'],
      liveUrl: 'https://github.com/Ratul-Shee/',
      repoUrl: 'https://github.com/Ratul-Shee/'
    },
    promptmatrix: {
      title: 'PromptMatrix — LLM Prompt Studio & API Hub',
      category: 'AI Developer Tool',
      image: 'fintrack.jpg',
      subtitle: 'Prompt engineering suite for testing, versioning, and benchmarking LLM system prompts.',
      features: [
        'Server-Sent Events (SSE) streaming integration for low-latency AI token responses.',
        'Prompt version comparison and token cost calculators across LLM providers.',
        'Preset prompt collections organized in MongoDB with tag filtering.',
        'Custom hook architecture in React for resilient API retry logic.'
      ],
      stack: ['React', 'Node.js', 'OpenAI API', 'MongoDB', 'Tailwind', 'SSE'],
      liveUrl: 'https://github.com/Ratul-Shee/',
      repoUrl: 'https://github.com/Ratul-Shee/'
    }
  };

  function openProjectModal(key) {
    const data = projectData[key];
    if (!data || !projectModal) return;

    modalImg.src = data.image;
    modalImg.alt = data.title;
    modalCategory.textContent = data.category;
    modalTitle.textContent = data.title;
    modalSubtitle.textContent = data.subtitle;

    modalFeatures.innerHTML = data.features.map(f => `<li>${f}</li>`).join('');
    modalStack.innerHTML = data.stack.map(s => `<span>${s}</span>`).join('');

    modalLiveBtn.href = data.liveUrl;
    modalRepoBtn.href = data.repoUrl;

    projectModal.classList.add('open');
    playSynthSound('open');
  }

  function closeProjectModal() {
    if (projectModal) projectModal.classList.remove('open');
  }

  document.querySelectorAll('.quick-view-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.getAttribute('data-project');
      openProjectModal(key);
    });
  });

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeProjectModal);
  if (projectModal) {
    projectModal.addEventListener('click', (e) => {
      if (e.target === projectModal) closeProjectModal();
    });
  }

  /* =========================================================
     8. Project Category Filtering
     ========================================================= */
  const filterTabs = document.querySelectorAll('.filter-tab');
  const projectCards = document.querySelectorAll('.project-card');

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.getAttribute('data-filter');

      projectCards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter || (filter === 'react' && (cat === 'mern' || cat === 'react'))) {
          card.style.display = 'flex';
          setTimeout(() => card.classList.add('in'), 50);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  /* =========================================================
     9. Interactive MERN Architecture Simulator
     ========================================================= */
  const archNodes = document.querySelectorAll('.arch-node');
  const packet1 = document.getElementById('packet1');
  const packet2 = document.getElementById('packet2');
  const simulateReqBtn = document.getElementById('simulateReqBtn');
  const archStatusMsg = document.getElementById('archStatusMsg');
  const archDetailBadge = document.getElementById('archDetailBadge');
  const archDetailTitle = document.getElementById('archDetailTitle');
  const archDetailDesc = document.getElementById('archDetailDesc');
  const archDetailCode = document.getElementById('archDetailCode');

  const archDetails = {
    client: {
      badge: 'Frontend Layer: React 18 & State',
      title: 'Client-Side Architecture (React)',
      desc: 'Single Page Application with declarative component tree, reactive state hooks (useState, useReducer), custom Axios interceptors for JWT bearer tokens, and modern responsive CSS styling.',
      code: `// Sample Client API Dispatch\nconst loginUser = async (credentials) => {\n  const res = await api.post('/api/v1/auth/login', credentials);\n  localStorage.setItem('token', res.data.token);\n  setUser(res.data.user);\n};`
    },
    server: {
      badge: 'API & Middleware Layer: Node.js / Express',
      title: 'Backend API Gateway & Business Logic',
      desc: 'High-concurrency Node.js runtime executing Express routing middleware, JWT authentication guards, input sanitization, rate limiting, and centralized error handling.',
      code: `// Express REST Route & JWT Guard\nrouter.post('/login', authLimiter, async (req, res, next) => {\n  const { email, password } = req.body;\n  const user = await User.findOne({ email }).select('+password');\n  const token = user.generateJWT();\n  res.status(200).json({ success: true, token });\n});`
    },
    database: {
      badge: 'Persistence Layer: MongoDB Atlas & Mongoose',
      title: 'Database Schema & Aggregation Pipeline',
      desc: 'Scalable NoSQL document store with strict Mongoose schema validation, multi-field compound indexes for high-speed queries, and aggregation pipelines for analytics.',
      code: `// Mongoose Monthly Spending Aggregation\nconst stats = await Transaction.aggregate([\n  { $match: { userId: user._id } },\n  { $group: { _id: '$category', total: { $sum: '$amount' } } },\n  { $sort: { total: -1 } }\n]);`
    }
  };

  archNodes.forEach(node => {
    node.addEventListener('click', () => {
      archNodes.forEach(n => n.classList.remove('active'));
      node.classList.add('active');

      const key = node.getAttribute('data-node');
      const d = archDetails[key];
      if (d) {
        archDetailBadge.textContent = d.badge;
        archDetailTitle.textContent = d.title;
        archDetailDesc.textContent = d.desc;
        archDetailCode.textContent = d.code;
      }
    });
  });

  if (simulateReqBtn) {
    simulateReqBtn.addEventListener('click', () => {
      playSynthSound('packet');
      archStatusMsg.textContent = '⚡ Transmitting HTTPS POST /api/v1/transactions...';

      packet1.classList.remove('firing');
      packet2.classList.remove('firing');
      void packet1.offsetWidth; // trigger reflow

      packet1.classList.add('firing');

      setTimeout(() => {
        archNodes.forEach(n => n.classList.remove('active'));
        document.getElementById('nodeServer')?.classList.add('active');
        archStatusMsg.textContent = '⚡ Node/Express: Validating JWT & processing request...';
        packet2.classList.add('firing');
      }, 500);

      setTimeout(() => {
        archNodes.forEach(n => n.classList.remove('active'));
        document.getElementById('nodeDatabase')?.classList.add('active');
        archStatusMsg.textContent = '⚡ MongoDB Atlas: Executing aggregation query...';
      }, 1000);

      setTimeout(() => {
        playSynthSound('success');
        archNodes.forEach(n => n.classList.remove('active'));
        document.getElementById('nodeClient')?.classList.add('active');
        archStatusMsg.textContent = '✅ HTTP 200 OK (Round-trip: 22ms) — State synchronized!';
        showToast('🚀 Pipeline Transaction Completed: 200 OK (22ms)');
      }, 1500);
    });
  }

  /* =========================================================
     10. Dynamic Real-Time IST Clock
     ========================================================= */
  const istClock = document.getElementById('istClock');
  const solarStatus = document.getElementById('solarStatus');

  function updateClock() {
    if (!istClock) return;
    const options = {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    };
    const now = new Date();
    istClock.textContent = now.toLocaleTimeString('en-US', options);

    const istHour = parseInt(now.toLocaleTimeString('en-US', { timeZone: 'Asia/Kolkata', hour: '2-digit', hour12: false }), 10);
    if (solarStatus) {
      if (istHour >= 6 && istHour < 18) {
        solarStatus.textContent = '☀️ Day Shift';
      } else {
        solarStatus.textContent = '🌙 Night Owl Coding';
      }
    }
  }
  updateClock();
  setInterval(updateClock, 1000);

  /* =========================================================
     11. GitHub Commit Matrix Heatmap Generator
     ========================================================= */
  const commitMatrix = document.getElementById('commitMatrix');
  if (commitMatrix) {
    const totalCells = 64;
    const levels = ['', 'l1', 'l2', 'l3'];
    let html = '';
    for (let i = 0; i < totalCells; i++) {
      const rand = Math.random();
      let lvl = '';
      if (rand > 0.7) lvl = 'l3';
      else if (rand > 0.45) lvl = 'l2';
      else if (rand > 0.2) lvl = 'l1';
      html += `<div class="matrix-cell ${lvl}" title="Day ${i + 1}: Active Commits"></div>`;
    }
    commitMatrix.innerHTML = html;
  }

  /* =========================================================
     12. Animated Count-Up Numbers
     ========================================================= */
  const counterEls = document.querySelectorAll('.counter-num');
  let animatedCounters = false;

  function runCounters() {
    if (animatedCounters) return;
    animatedCounters = true;

    counterEls.forEach(el => {
      const target = parseInt(el.getAttribute('data-target'), 10) || 0;
      let count = 0;
      const step = Math.max(1, Math.floor(target / 30));
      const interval = setInterval(() => {
        count += step;
        if (count >= target) {
          el.textContent = target;
          clearInterval(interval);
        } else {
          el.textContent = count;
        }
      }, 35);
    });
  }

  /* =========================================================
     13. Scroll Progress Bar & Nav Scrollspy
     ========================================================= */
  const scrollBar = document.getElementById('scrollBar');
  const nav = document.getElementById('nav');
  let lastScroll = 0;

  function onScroll() {
    const doc = document.documentElement;
    const scrollTop = doc.scrollTop || document.body.scrollTop;
    const height = doc.scrollHeight - doc.clientHeight;
    const pct = height > 0 ? (scrollTop / height) * 100 : 0;

    if (scrollBar) scrollBar.style.width = pct + '%';
    if (nav) {
      nav.classList.toggle('scrolled', scrollTop > 40);
      if (scrollTop > lastScroll && scrollTop > 250) {
        nav.classList.add('hide');
      } else {
        nav.classList.remove('hide');
      }
    }
    lastScroll = scrollTop;
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  /* =========================================================
     14. Mobile Navigation Toggle
     ========================================================= */
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen);
    });
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', false);
      });
    });
  }

  /* =========================================================
     15. IntersectionObserver Scroll Reveal
     ========================================================= */
  const revealEls = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('in');
            if (entry.target.querySelector('.counter-num')) {
              runCounters();
            }
          }, i * 40);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in'));
    runCounters();
  }

  /* =========================================================
     16. Custom Magnetic Cursor
     ========================================================= */
  const cursorDot = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');
  const isTouch = window.matchMedia('(max-width:860px)').matches;

  if (!isTouch && !prefersReduced && cursorDot && cursorRing) {
    let mx = -100, my = -100, rx = -100, ry = -100;

    window.addEventListener('mousemove', (e) => {
      mx = e.clientX;
      my = e.clientY;
      cursorDot.style.left = mx + 'px';
      cursorDot.style.top = my + 'px';
    });

    window.addEventListener('mousedown', () => cursorRing.classList.add('active-click'));
    window.addEventListener('mouseup', () => cursorRing.classList.remove('active-click'));

    (function loopCursor() {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      cursorRing.style.left = rx + 'px';
      cursorRing.style.top = ry + 'px';
      requestAnimationFrame(loopCursor);
    })();

    document.querySelectorAll('a, button, .tilt-card, .arch-node, .cmd-item, .contact-card-modern').forEach(el => {
      el.addEventListener('mouseenter', () => cursorRing.classList.add('hover'));
      el.addEventListener('mouseleave', () => cursorRing.classList.remove('hover'));
    });
  }

  /* =========================================================
     17. 3D Tilt Cards with Dynamic Cursor Spotlight
     ========================================================= */
  if (!isTouch && !prefersReduced) {
    document.querySelectorAll('.tilt-card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        const x = e.clientX - r.left;
        const y = e.clientY - r.top;
        const rotX = ((y / r.height) - 0.5) * -10;
        const rotY = ((x / r.width) - 0.5) * 12;
        card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-4px)`;
        card.style.setProperty('--mx', x + 'px');
        card.style.setProperty('--my', y + 'px');
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateY(0)';
      });
    });
  }

  /* =========================================================
     18. Magnetic Buttons
     ========================================================= */
  if (!isTouch && !prefersReduced) {
    document.querySelectorAll('.magnetic').forEach(el => {
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        el.style.transform = `translate(${x * 0.22}px, ${y * 0.25}px)`;
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = 'translate(0,0)';
      });
    });
  }

  /* =========================================================
     19. Ambient Gravity Constellation Canvas
     ========================================================= */
  const canvas = document.getElementById('net-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let w, h;
    let particles = [];
    const count = prefersReduced ? 0 : (window.innerWidth < 768 ? 30 : 65);
    let mousePos = { x: -1000, y: -1000 };

    function resizeCanvas() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    window.addEventListener('mousemove', (e) => {
      mousePos.x = e.clientX;
      mousePos.y = e.clientY;
    });

    function initParticles() {
      particles = [];
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          r: Math.random() * 1.5 + 0.6
        });
      }
    }
    initParticles();
    window.addEventListener('resize', initParticles);

    function drawConstellation() {
      ctx.clearRect(0, 0, w, h);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;

        // Subtle mouse attraction
        const mdx = mousePos.x - p.x;
        const mdy = mousePos.y - p.y;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mdist < 160) {
          p.x += mdx * 0.008;
          p.y += mdy * 0.008;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(57, 255, 156, 0.45)';
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(56, 189, 248, ${0.14 * (1 - dist / 130)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(drawConstellation);
    }

    if (!prefersReduced) drawConstellation();
  }

  /* =========================================================
     20. Interactive Contact Form Validation & Dispatch
     ========================================================= */
  const contactForm = document.getElementById('contactForm');
  const formMsg = document.getElementById('formMsg');
  const charCount = document.getElementById('charCount');
  const submitBtn = document.getElementById('submitBtn');
  const formAlert = document.getElementById('formAlert');

  if (formMsg && charCount) {
    formMsg.addEventListener('input', () => {
      charCount.textContent = formMsg.value.length;
    });
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('formName')?.value.trim();
      const email = document.getElementById('formEmail')?.value.trim();
      const message = formMsg?.value.trim();

      if (!name || !email || !message) {
        if (formAlert) {
          formAlert.className = 'form-status-alert error';
          formAlert.textContent = 'Please fill out all required fields (*).';
        }
        return;
      }

      // Show spinner state
      submitBtn.disabled = true;
      const btnText = submitBtn.querySelector('.btn-text');
      const btnSpinner = submitBtn.querySelector('.btn-loading-spinner');
      if (btnText) btnText.textContent = 'Transmitting Message...';
      if (btnSpinner) btnSpinner.style.display = 'inline-block';

      setTimeout(() => {
        submitBtn.disabled = false;
        if (btnText) btnText.textContent = 'Send Message 🚀';
        if (btnSpinner) btnSpinner.style.display = 'none';

        playSynthSound('success');
        if (formAlert) {
          formAlert.className = 'form-status-alert success';
          formAlert.innerHTML = `✅ Thank you, <strong>${escapeHtml(name)}</strong>! Your message has been dispatched. I'll get back to you shortly.`;
        }
        showToast('🚀 Message sent successfully!');
        contactForm.reset();
        if (charCount) charCount.textContent = '0';
      }, 1200);
    });
  }

  /* =========================================================
     21. Auto Year Updater
     ========================================================= */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

});
