/**
 * DH NEXUS - JAVASCRIPT ENGINE 3.0
 * Multi-Page, Animações Multi-Direcionais & Experiência H2H
 */

document.addEventListener('DOMContentLoaded', () => {
  initNexusCanvas();
  initNavbar();
  initMultiDirectionalScroll();
  initSimulator();
  initComparator();
  initServiceTabs();
  initBookingForm();
  initSoundEngine();
  initRadarInteractions();
  highlightActiveNavLink();
});

/* ==========================================================================
   1. CANVAS NEXUS (PARTÍCULAS TEAL & LARANJA COM CONEXÃO VIVA)
   ========================================================================== */
function initNexusCanvas() {
  const canvas = document.getElementById('nexus-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const particles = [];
  const particleCount = Math.min(Math.floor((width * height) / 18000), 75);
  const maxDistance = 140;

  const mouse = {
    x: null,
    y: null,
    radius: 160
  };

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.7;
      this.vy = (Math.random() - 0.5) * 0.7;
      this.radius = Math.random() * 2 + 1.2;
      // 78% teal (Nexus / Tech), 22% warm orange (Human warmth H2H)
      this.isHuman = Math.random() < 0.22;
      this.color = this.isHuman ? 'rgba(249, 115, 22, ' : 'rgba(45, 212, 191, ';
      this.baseAlpha = Math.random() * 0.5 + 0.3;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Mouse soft interaction
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          this.x -= (dx / dist) * force * 1.4;
          this.y -= (dy / dist) * force * 1.4;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color + this.baseAlpha + ')';
      ctx.shadowBlur = this.isHuman ? 12 : 8;
      ctx.shadowColor = this.isHuman ? '#F97316' : '#2DD4BF';
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Connecting lines
    for (let a = 0; a < particles.length; a++) {
      for (let b = a + 1; b < particles.length; b++) {
        const dx = particles[a].x - particles[b].x;
        const dy = particles[a].y - particles[b].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDistance) {
          const opacity = (1 - dist / maxDistance) * 0.25;
          ctx.beginPath();
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.strokeStyle = `rgba(45, 212, 191, ${opacity})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    // Connect to mouse cursor
    if (mouse.x !== null && mouse.y !== null) {
      for (let i = 0; i < particles.length; i++) {
        const dx = mouse.x - particles[i].x;
        const dy = mouse.y - particles[i].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouse.radius) {
          const opacity = (1 - dist / mouse.radius) * 0.45;
          ctx.beginPath();
          ctx.moveTo(mouse.x, mouse.y);
          ctx.lineTo(particles[i].x, particles[i].y);
          ctx.strokeStyle = particles[i].isHuman
            ? `rgba(249, 115, 22, ${opacity})`
            : `rgba(61, 232, 211, ${opacity})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    particles.forEach((p) => {
      p.update();
      p.draw();
    });

    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================================
   2. ANIMAÇÕES MULTI-DIRECIONAIS DE ROLAGEM (UP, LEFT, RIGHT, SCALE)
   ========================================================================== */
function initMultiDirectionalScroll() {
  const elements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-scale');

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -50px 0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        obs.unobserve(entry.target);
      }
    });
  }, observerOptions);

  elements.forEach((el) => {
    observer.observe(el);
  });
}

/* ==========================================================================
   3. NAVBAR, MOBILE DRAWER & ACTIVE LINK
   ========================================================================== */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const mobileToggle = document.querySelector('.mobile-toggle');
  const drawer = document.querySelector('.mobile-drawer');
  const overlay = document.querySelector('.drawer-overlay');
  const drawerClose = document.querySelector('.drawer-close');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  const toggleDrawer = () => {
    drawer.classList.toggle('open');
    overlay.classList.toggle('open');
    document.body.style.overflow = drawer.classList.contains('open') ? 'hidden' : '';
  };

  if (mobileToggle) mobileToggle.addEventListener('click', toggleDrawer);
  if (drawerClose) drawerClose.addEventListener('click', toggleDrawer);
  if (overlay) overlay.addEventListener('click', toggleDrawer);

  const mobileLinks = document.querySelectorAll('.mobile-nav-links a');
  mobileLinks.forEach((link) => {
    link.addEventListener('click', () => {
      drawer.classList.remove('open');
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

function highlightActiveNavLink() {
  const currentPath = window.location.pathname;
  const page = currentPath.substring(currentPath.lastIndexOf('/') + 1) || 'index.html';
  const links = document.querySelectorAll('.nav-links a, .mobile-nav-links a');

  links.forEach((link) => {
    const href = link.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/* ==========================================================================
   4. RADAR INTERACTION
   ========================================================================== */
function initRadarInteractions() {
  const cards = document.querySelectorAll('.symptom-card');
  cards.forEach((c) => {
    c.addEventListener('click', () => {
      playTone(480, 'sine', 0.08);
      const simSection = document.getElementById('simulador');
      if (simSection) {
        simSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

/* ==========================================================================
   5. SIMULADOR DE FRIEZA DIGITAL (COM FIX DO STEP BADGE)
   ========================================================================== */
const simulatorQuestions = [
  {
    title: '1. Como a voz da sua empresa se apresenta nas redes e no site?',
    subtitle: 'Avalie a temperatura da mensagem que seu público consome diariamente.',
    options: [
      { text: 'Extremamente técnica ou formal', desc: 'Jargões corporativos, palavras difíceis e pouca proximidade com o leitor.', coldScore: 35 },
      { text: 'Genérica, criada por prompts básicos de IA', desc: 'Parece correta e polida, mas soa idêntica a dezenas de concorrentes.', coldScore: 30 },
      { text: 'Inconstante e sem tom definido', desc: 'Ora parece amigável, ora distante e fria; cada pessoa escreve de um jeito.', coldScore: 20 },
      { text: 'Autoral e com ponto de vista forte', desc: 'Temos clareza, geramos conexão real e mostramos as pessoas por trás da marca.', coldScore: 5 }
    ]
  },
  {
    title: '2. Como seus leads são atendidos no primeiro contato online?',
    subtitle: 'A primeira impressão define se o cliente se sente uma pessoa ou um número.',
    options: [
      { text: 'Chatbot impessoal com formulário longo', desc: 'O lead precisa responder dezenas de perguntas antes de qualquer calor humano.', coldScore: 35 },
      { text: 'Mensagem padronizada copiada e colada', desc: 'Template pronto de WhatsApp ou e-mail que não cita o contexto dele.', coldScore: 25 },
      { text: 'Atendimento manual, mas demorado e reativo', desc: 'Demoramos a responder e o time de vendas age apenas tirando dúvidas.', coldScore: 20 },
      { text: 'Abordagem consultiva e personalizada', desc: 'Escuta ativa, pesquisa prévia sobre a empresa e diálogo Human-to-Human.', coldScore: 5 }
    ]
  },
  {
    title: '3. Qual é o maior gargalo no marketing do seu negócio hoje?',
    subtitle: 'Onde o esforço está sendo drenado sem gerar receita sustentável?',
    options: [
      { text: 'Leads chegam, pedem orçamento e somem', desc: 'Alto tráfego ou contatos, mas conversão baixíssima no fechamento.', coldScore: 30 },
      { text: 'Investimos em conteúdo, mas ninguém engaja', desc: 'Posts informativos no LinkedIn ou blog que parecem falar para as paredes.', coldScore: 25 },
      { text: 'Nossa marca é vista como commodity', desc: 'O cliente sempre tenta barganhar preço porque não vê diferenciação.', coldScore: 25 },
      { text: 'Temos bons resultados, mas dependemos de boca a boca', desc: 'O digital ainda não reflete a reputação que temos no mundo real.', coldScore: 10 }
    ]
  },
  {
    title: '4. Como os líderes e fundadores se posicionam no digital?',
    subtitle: 'Pessoas compram de pessoas. A liderança tem voz ativa?',
    options: [
      { text: 'Perfis fantasmas ou inativos', desc: 'Liderança não aparece e a empresa fala apenas como uma entidade anônima.', coldScore: 30 },
      { text: 'Apenas compartilham notícias ou post institucional', desc: 'Zero opinião própria, zero narrativa de bastidor ou aprendizados reais.', coldScore: 25 },
      { text: 'Publicam de vez em quando sem estratégia', desc: 'Falta consistência e clareza sobre qual autoridade querem construir.', coldScore: 15 },
      { text: 'Presença autoral consolidada e magnética', desc: 'Geram respeito no mercado, atraem parceiros e clientes naturalmente.', coldScore: 5 }
    ]
  }
];

let currentSimStep = 0;
let userColdScore = 0;
const userAnswers = [];

function initSimulator() {
  const container = document.getElementById('simulator-cards-container');
  const fillBar = document.getElementById('sim-progress-fill');
  const stepBadge = document.getElementById('sim-step-badge');
  if (!container) return;

  renderStep(0);

  function renderStep(index) {
    if (index >= simulatorQuestions.length) {
      showResults();
      return;
    }

    const q = simulatorQuestions[index];
    if (stepBadge) {
      stepBadge.textContent = `Etapa ${index + 1} de ${simulatorQuestions.length}`;
    }
    if (fillBar) {
      fillBar.style.width = `${((index + 1) / simulatorQuestions.length) * 100}%`;
    }

    let html = `
      <div class="sim-card active">
        <h3>${q.title}</h3>
        <p class="sim-subtitle">${q.subtitle}</p>
        <div class="options-grid">
    `;

    q.options.forEach((opt) => {
      html += `
        <button class="option-btn" data-score="${opt.coldScore}" data-title="${encodeURIComponent(opt.text)}">
          <strong>${opt.text} <span class="arrow" style="font-weight: 300;">→</span></strong>
          <span>${opt.desc}</span>
        </button>
      `;
    });

    html += `</div></div>`;
    container.innerHTML = html;

    const buttons = container.querySelectorAll('.option-btn');
    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        playTone(320 + index * 60, 'sine', 0.08);
        btn.classList.add('selected');
        const score = parseInt(btn.dataset.score);
        userColdScore += score;
        userAnswers.push(decodeURIComponent(btn.dataset.title));

        setTimeout(() => {
          currentSimStep++;
          renderStep(currentSimStep);
        }, 260);
      });
    });
  }

  function showResults() {
    playSuccessChord();
    const finalScore = Math.min(Math.round((userColdScore / 130) * 100), 96);
    const resultCard = document.getElementById('simulator-result');
    container.style.display = 'none';
    document.querySelector('.sim-progress-bar').style.display = 'none';

    let verdictTitle = '';
    let verdictDesc = '';
    let recommendation = '';

    if (finalScore >= 65) {
      verdictTitle = 'Frieza Digital Crítica Detectada';
      verdictDesc = 'Sua comunicação está excessivamente técnica ou homogeneizada por automações impessoais. Os leads não sentem empatia e procuram concorrentes antes de fechar.';
      recommendation = 'Recomendação prioritária: Diagnóstico de Humanização Digital completo para redesenhar seus pontos de contato.';
    } else if (finalScore >= 35) {
      verdictTitle = 'Frieza Digital Moderada com Potencial Oculto';
      verdictDesc = 'Sua empresa produz conteúdo, mas a mensagem carece de diferenciação e voz autoral. Os concorrentes poderiam assinar as mesmas postagens sem que o público notasse.';
      recommendation = 'Recomendação prioritária: Posicionamento Estratégico, Tom de Voz e Linha Editorial H2H.';
    } else {
      verdictTitle = 'Base Humana Sólida';
      verdictDesc = 'Sua comunicação já preserva autenticidade. O próximo passo é transformar essa voz em um método de escala consistente para toda a equipe.';
      recommendation = 'Recomendação prioritária: Mentoria Executiva H2H para Lideranças.';
    }

    resultCard.innerHTML = `
      <div class="score-display-wrapper">
        <div class="score-circle">
          <div class="score-number">${finalScore}%</div>
          <div class="score-tag">Índice de Frieza</div>
        </div>
        <div class="result-breakdown">
          <h4>${verdictTitle}</h4>
          <p>${verdictDesc}</p>
          <div class="result-recommendation">
            <strong>${recommendation}</strong>
          </div>
        </div>
      </div>
      <div class="result-actions">
        <a href="#sessao" class="btn btn-primary btn-lg" id="btn-prefill-booking">
          Analisar Resultado na Sessão de Clareza (30 min) →
        </a>
        <button class="btn btn-outline btn-lg" id="btn-restart-sim">
          Refazer Teste
        </button>
      </div>
    `;

    resultCard.classList.add('active');

    const prefillBtn = document.getElementById('btn-prefill-booking');
    if (prefillBtn) {
      prefillBtn.addEventListener('click', () => {
        const textarea = document.querySelector('textarea[name="desafio"]');
        if (textarea) {
          textarea.value = `[Resultado do Teste: ${finalScore}% de Frieza Digital - ${verdictTitle}]. Minha maior dor é: `;
          textarea.focus();
        }
      });
    }

    const restartBtn = document.getElementById('btn-restart-sim');
    if (restartBtn) {
      restartBtn.addEventListener('click', () => {
        currentSimStep = 0;
        userColdScore = 0;
        userAnswers.length = 0;
        container.style.display = 'block';
        document.querySelector('.sim-progress-bar').style.display = 'flex';
        resultCard.classList.remove('active');
        renderStep(0);
      });
    }
  }
}

/* ==========================================================================
   6. COMPARADOR INTERATIVO: IA GENÉRICA vs H2H
   ========================================================================== */
const comparisonData = {
  linkedin: {
    cold: {
      title: 'IA Corporativa Genérica',
      badge: 'Frieza Digital (Sem Alma)',
      text: `"No cenário dinâmico e volátil do mercado corporativo moderno, implementar sinergias holísticas e alavancar a transformação digital com inteligência artificial é um imperativo estratégico para maximizar o ROI e potencializar a performance dos nossos stakeholders 360..."`,
      stat: '0 comentários reais · 4 reações de colegas'
    },
    h2h: {
      title: 'Comunicação H2H (DH Nexus)',
      badge: 'Conexão Humana & Autoridade',
      text: `"Na última terça-feira, quase demitimos uma tecnologia que nos custava R$ 8 mil por mês. O motivo? Ela não era ruim. A gente é que parou de conversar com as pessoas reais do outro lado e achou que um painel de métricas substituiria a escuta. Foi aí que aprendi a lição mais valiosa do ano..."`,
      stat: '+142 comentários qualificados · 3 novos contratos'
    }
  },
  outreach: {
    cold: {
      title: 'Automação Fria de E-mail / WhatsApp',
      badge: 'Robô de Vendas',
      text: `"Olá [Primeiro_Nome], tudo bem? Me deparei com seu perfil aqui no LinkedIn e notei que você é [Cargo] na [Nome_da_Empresa]. Nós somos a empresa líder em soluções integradas com tecnologia escalável de ponta. Gostaria de agendar 15 minutos na sua agenda nesta quinta-feira às 14h para apresentar nosso portfólio?"`,
      stat: '98% ignorado · Risco de denúncia/bloqueio'
    },
    h2h: {
      title: 'Abordagem H2H (DH Nexus)',
      badge: 'Empatia & Intenção Real',
      text: `"Oi Marcos, vi o artigo que você publicou semana passada sobre o desafio de engajar times remotos na área de TI. O ponto onde você cita que 'a liderança técnica muitas vezes se isola' foi direto na ferida. Nós mapeamos esse mesmo padrão aqui em empresas do seu setor. Se fizer sentido, preparei um insight prático de 2 minutos sobre como revertemos isso em um caso recente. Topa dar uma olhada sem compromisso?"`,
      stat: '64% taxa de resposta positiva · Conversas fluidas'
    }
  },
  website: {
    cold: {
      title: 'Site Corporativo Tradicional',
      badge: 'Jargão Burocrático',
      text: `"Somos a principal plataforma omnicanal focada em prover soluções disruptivas e sustentáveis para ecossistemas de negócios B2B através de algoritmos preditivos e automações de ponta a ponta."`,
      stat: 'Taxa de rejeição de 78% · Visita esquecível'
    },
    h2h: {
      title: 'DH Nexus (H2H)',
      badge: 'Mensagem Magnética & Clara',
      text: `"Sua empresa não precisa de mais uma IA. Precisa voltar a falar como gente. Ajudamos empresas B2B a transformar comunicações frias em conexões humanas que geram respeito, autoridade e novos contratos."`,
      stat: 'Tempo de permanência 3.4x maior · Conexão imediata'
    }
  }
};

function initComparator() {
  const tabs = document.querySelectorAll('.comp-tab-btn');
  const coldTitle = document.getElementById('cold-title');
  const coldBadge = document.getElementById('cold-badge');
  const coldText = document.getElementById('cold-text');
  const coldStat = document.getElementById('cold-stat');

  const humanTitle = document.getElementById('human-title');
  const humanBadge = document.getElementById('human-badge');
  const humanText = document.getElementById('human-text');
  const humanStat = document.getElementById('human-stat');

  if (!tabs.length || !coldText) return;

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');

      playTone(440, 'triangle', 0.08);

      const key = tab.dataset.scenario;
      const data = comparisonData[key];
      if (!data) return;

      coldText.style.opacity = '0';
      humanText.style.opacity = '0';

      setTimeout(() => {
        coldTitle.textContent = data.cold.title;
        coldBadge.textContent = data.cold.badge;
        coldText.textContent = data.cold.text;
        coldStat.innerHTML = `⚠️ ${data.cold.stat}`;

        humanTitle.textContent = data.h2h.title;
        humanBadge.textContent = data.h2h.badge;
        humanText.textContent = data.h2h.text;
        humanStat.innerHTML = `✨ ${data.h2h.stat}`;

        coldText.style.opacity = '1';
        humanText.style.opacity = '1';
      }, 150);
    });
  });
}

/* ==========================================================================
   7. SERVICE TABS
   ========================================================================== */
function initServiceTabs() {
  const items = document.querySelectorAll('.service-nav-item');
  const cards = document.querySelectorAll('.service-detail-card');
  if (!items.length) return;

  items.forEach((item) => {
    item.addEventListener('click', () => {
      items.forEach((i) => i.classList.remove('active'));
      cards.forEach((c) => c.classList.remove('active'));

      item.classList.add('active');
      const targetId = item.dataset.target;
      const targetCard = document.getElementById(targetId);
      if (targetCard) {
        targetCard.classList.add('active');
      }

      playTone(520, 'sine', 0.06);
    });
  });
}

/* ==========================================================================
   8. SESSÃO DE CLAREZA BOOKING FORM & MODAL
   ========================================================================== */
function initBookingForm() {
  const form = document.getElementById('clarity-form');
  const modal = document.getElementById('success-modal');
  const modalClose = document.getElementById('modal-close-btn');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nome = form.querySelector('[name="nome"]').value.trim();
    const empresa = form.querySelector('[name="empresa"]').value.trim();
    const whatsapp = form.querySelector('[name="whatsapp"]').value.trim();
    const site = form.querySelector('[name="site"]').value.trim();
    const desafio = form.querySelector('[name="desafio"]').value.trim();

    const msg = `Olá Alessandra! Gostaria de agendar minha Sessão de Clareza na DH Nexus.%0A%0A*Nome:* ${encodeURIComponent(nome)}%0A*Empresa:* ${encodeURIComponent(empresa)}%0A*WhatsApp:* ${encodeURIComponent(whatsapp)}%0A*Site/LinkedIn:* ${encodeURIComponent(site)}%0A*Desafio:* ${encodeURIComponent(desafio)}`;
    const waUrl = `https://wa.me/5521965485163?text=${msg}`;

    playSuccessChord();

    if (modal) {
      modal.classList.add('open');
      const modalMsg = document.getElementById('modal-user-name');
      if (modalMsg) modalMsg.textContent = nome;

      const directWa = document.getElementById('modal-whatsapp-link');
      if (directWa) directWa.href = waUrl;
    }

    try {
      fetch('https://formsubmit.co/ajax/contato@dhnexus.com.br', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({
          nome,
          empresa,
          whatsapp,
          site,
          desafio,
          _subject: `Nova Sessão de Clareza - ${empresa} (${nome})`
        })
      }).catch(() => {});
    } catch (e) {}
  });

  if (modalClose) {
    modalClose.addEventListener('click', () => {
      modal.classList.remove('open');
      form.reset();
    });
  }
}

/* ==========================================================================
   9. WEB AUDIO API SYNTHESIZER
   ========================================================================== */
let audioCtx = null;
let soundEnabled = true;

function initSoundEngine() {
  const toggleBtn = document.getElementById('sound-toggle');
  if (!toggleBtn) return;

  toggleBtn.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    toggleBtn.innerHTML = soundEnabled
      ? `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg> Som H2H: Ativado`
      : `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg> Som: Mudo`;

    if (soundEnabled) {
      playTone(560, 'sine', 0.08);
    }
  });
}

function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) audioCtx = new AudioContextClass();
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function playTone(freq, type = 'sine', duration = 0.09) {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    gain.gain.setValueAtTime(0.03, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {}
}

function playSuccessChord() {
  if (!soundEnabled) return;
  const notes = [392, 523.25, 659.25, 783.99];
  notes.forEach((n, idx) => {
    setTimeout(() => {
      playTone(n, 'sine', 0.24);
    }, idx * 60);
  });
}
