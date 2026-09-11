/**
 * Brain.exe - Human Brain Loading Simulator
 * Main Application Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM References
  const startThinkingBtn = document.getElementById('startThinkingBtn');
  const tryAgainBtn = document.getElementById('tryAgainBtn');
  const brainChamber = document.getElementById('brainChamber');
  const idlePanel = document.getElementById('idlePanel');
  const loadingPanel = document.getElementById('loadingPanel');
  const resultPanel = document.getElementById('resultPanel');
  const glitchOverlay = document.getElementById('glitchOverlay');
  const progressBar = document.getElementById('progressBar');
  const statusMessage = document.getElementById('statusMessage');
  const percentageDisplay = document.getElementById('percentageDisplay');
  const cognitiveLoadText = document.getElementById('cognitiveLoadText');
  const memoryLeakText = document.getElementById('memoryLeakText');
  const attemptsCount = document.getElementById('attemptsCount');
  const audioToggleBtn = document.getElementById('audioToggleBtn');
  const audioIcon = document.getElementById('audioIcon');
  const systemPip = document.getElementById('systemPip');

  // Result Elements
  const verdictText = document.getElementById('verdictText');
  const statBrainPower = document.getElementById('statBrainPower');
  const barBrainPower = document.getElementById('barBrainPower');
  const statThoughtSpeed = document.getElementById('statThoughtSpeed');
  const barThoughtSpeed = document.getElementById('barThoughtSpeed');
  const statDistraction = document.getElementById('statDistraction');
  const barDistraction = document.getElementById('barDistraction');
  const statCriticalThinking = document.getElementById('statCriticalThinking');
  const barCriticalThinking = document.getElementById('barCriticalThinking');
  const statBrainBattery = document.getElementById('statBrainBattery');
  const barBrainBattery = document.getElementById('barBrainBattery');
  const healthGrade = document.getElementById('healthGrade');
  const healthDiagnosis = document.getElementById('healthDiagnosis');
  const leaderboardBody = document.getElementById('leaderboardBody');

  // State
  let attempts = parseInt(localStorage.getItem('brain_exe_attempts') || '0', 10);
  attemptsCount.textContent = attempts;

  // The 6 Dramatic Loading Phases
  const LOADING_PHASES = [
    { pct: 0, text: 'Waking up brain…', delay: 700, tone: 320, load: '12.4%', mem: 'WARMING' },
    { pct: 17, text: 'Finding thoughts…', delay: 1100, tone: 440, load: '38.1%', mem: 'SEARCHING' },
    { pct: 42, text: 'Processing unnecessary information…', delay: 1300, tone: 520, load: '67.8%', mem: 'OVERFLOWING' },
    { pct: 69, text: 'Getting distracted…', delay: 1400, tone: 480, load: '89.4%', mem: 'LEAKING MEMES' },
    { pct: 87, text: 'Almost had a thought…', delay: 1300, tone: 620, load: '95.2%', mem: 'NEARING PANIC' },
    { pct: 99, text: 'Critical thinking detected…', delay: 1500, tone: 880, load: '99.9%', mem: 'CRITICAL HAZARD' }
  ];

  // Fictional Results List (User Specified + Comedic Variants)
  const RESULTS = [
    '“Your brain is running on Wi-Fi.”',
    '“Congratulations. You thought about nothing.”',
    '“Brain.exe has stopped responding.”',
    '“Thought successfully lost.”',
    '“Your brain needs a software update.”',
    '“Processing complete. Result: absolutely nothing.”',
    '“404: Cognitive function not found on this server.”',
    '“RAM exceeded by an earworm song on 4-second loop.”',
    '“Brain overheat. Please reboot by staring blankly at wall.”'
  ];

  // Health Diagnoses
  const HEALTH_DIAGNOSES = [
    { grade: '14 / 100', diag: 'Status: Clinically Confused' },
    { grade: '3 / 100', diag: 'Status: Pure Vegetable Optimism' },
    { grade: '8 / 100', diag: 'Status: Severe Wi-Fi Latency' },
    { grade: '21 / 100', diag: 'Status: Equivalent to a Damp Sponge' },
    { grade: '5 / 100', diag: 'Status: Battery Expired in 2018' },
    { grade: '33 / 100', diag: 'Status: Mildly Capable of Blinking' }
  ];

  // Fictional Leaderboard
  const LEADERBOARD_DATA = [
    {
      rank: 1,
      badge: 'rank-1',
      name: 'Sir Overthink-a-Lot',
      quote: 'Wondering if penguins have knee joints',
      latency: '0.0001 Mbps',
      empty: '9,412'
    },
    {
      rank: 2,
      badge: 'rank-2',
      name: 'Karen from HR',
      quote: 'Per my last telepathic memo',
      latency: '0.0004 Mbps',
      empty: '7,180'
    },
    {
      rank: 3,
      badge: 'rank-3',
      name: 'The Couch Potato',
      quote: 'I think, therefore I need a nap',
      latency: '0.0009 Mbps',
      empty: '5,302'
    },
    {
      rank: 4,
      badge: 'rank-default',
      name: 'Chad G. Pete',
      quote: 'Hallucinating facts with 100% confidence',
      latency: '0.0012 Mbps',
      empty: '4,150'
    },
    {
      rank: 5,
      badge: 'rank-default',
      name: 'You (Current Brain)',
      quote: 'Attempting to think using Brain.exe',
      latency: '0.0028 Mbps',
      empty: `${attempts}`
    }
  ];

  function renderLeaderboard() {
    leaderboardBody.innerHTML = '';
    LEADERBOARD_DATA.forEach(row => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><span class="rank-badge ${row.badge}">#${row.rank}</span></td>
        <td><span class="thinker-name">${row.name}</span></td>
        <td><span class="thinker-quote">“${row.quote}”</span></td>
        <td><span class="latency-val">${row.latency}</span></td>
        <td><span class="count-val">${row.rank === 5 ? attempts : row.empty}</span></td>
      `;
      leaderboardBody.appendChild(tr);
    });
  }

  // Audio Toggle
  audioToggleBtn.addEventListener('click', () => {
    const isMuted = window.brainAudio.toggleMute();
    audioToggleBtn.classList.toggle('muted', isMuted);
    audioIcon.textContent = isMuted ? '🔇' : '🔊';
  });

  // Start Thinking Click Event
  startThinkingBtn.addEventListener('click', () => {
    window.brainAudio.playBoot();
    startSimulation();
  });

  // Try Again Click Event
  tryAgainBtn.addEventListener('click', () => {
    window.brainAudio.playResetChord();
    resetToIdle();
  });

  function startSimulation() {
    // Switch panels
    idlePanel.classList.remove('active');
    resultPanel.classList.remove('active');
    glitchOverlay.classList.remove('active');
    loadingPanel.classList.add('active');
    brainChamber.classList.add('thinking');
    systemPip.style.background = '#ff007f';
    systemPip.style.boxShadow = '0 0 16px #ff007f';

    // Increment attempts
    attempts++;
    localStorage.setItem('brain_exe_attempts', attempts);
    attemptsCount.textContent = attempts;
    renderLeaderboard();

    // Execute sequential loading phases
    let currentStep = 0;

    function nextStep() {
      if (currentStep < LOADING_PHASES.length) {
        const phase = LOADING_PHASES[currentStep];
        
        // Update UI
        percentageDisplay.textContent = `${phase.pct}%`;
        statusMessage.textContent = phase.text;
        progressBar.style.width = `${phase.pct}%`;
        cognitiveLoadText.textContent = `SYNAPSE LOAD: ${phase.load}`;
        memoryLeakText.textContent = `MEM BUFFER: ${phase.mem}`;

        // Audio tick
        window.brainAudio.playStepTick(phase.tone);

        currentStep++;
        setTimeout(nextStep, phase.delay);
      } else {
        // Trigger Dramatic Glitch Error!
        triggerGlitchError();
      }
    }

    nextStep();
  }

  function triggerGlitchError() {
    // Audio alarm
    window.brainAudio.playGlitchAlarm();

    // Show Glitch Overlay with Screen Shake
    glitchOverlay.classList.add('active');
    brainChamber.classList.remove('thinking');
    systemPip.style.background = '#ff2a55';
    systemPip.style.boxShadow = '0 0 20px #ff2a55';

    // Hold dramatic error for 1.8 seconds, then reveal funny results
    setTimeout(() => {
      glitchOverlay.classList.remove('active');
      loadingPanel.classList.remove('active');
      showResults();
    }, 1900);
  }

  function showResults() {
    resultPanel.classList.add('active');
    systemPip.style.background = '#00f3ff';
    systemPip.style.boxShadow = '0 0 12px #00f3ff';

    // 1. Pick random verdict
    const randomVerdict = RESULTS[Math.floor(Math.random() * RESULTS.length)];
    verdictText.textContent = randomVerdict;

    // 2. Generate random humorous fake stats
    const brainPowerVal = Math.floor(Math.random() * 16 + 4); // 4% - 20%
    const thoughtSpeedMbps = (Math.random() * 0.005 + 0.001).toFixed(3); // 0.001 - 0.006 Mbps
    const distractionVal = Math.floor(Math.random() * 6 + 94); // 94% - 99%
    const criticalThinkingVal = Math.floor(Math.random() * 3 + 1); // 1% - 3%
    const batteryVal = Math.floor(Math.random() * 9 + 2); // 2% - 10%

    statBrainPower.textContent = `${brainPowerVal}%`;
    barBrainPower.style.width = `${brainPowerVal}%`;

    statThoughtSpeed.textContent = `${thoughtSpeedMbps} Mbps`;
    barThoughtSpeed.style.width = `${Math.min(100, Math.round(thoughtSpeedMbps * 2000))}%`;

    statDistraction.textContent = `${distractionVal}%`;
    barDistraction.style.width = `${distractionVal}%`;

    statCriticalThinking.textContent = `${criticalThinkingVal}%`;
    barCriticalThinking.style.width = `${criticalThinkingVal}%`;

    statBrainBattery.textContent = `${batteryVal}%`;
    barBrainBattery.style.width = `${batteryVal}%`;

    // 3. Pick random brain health score
    const randomHealth = HEALTH_DIAGNOSES[Math.floor(Math.random() * HEALTH_DIAGNOSES.length)];
    healthGrade.textContent = randomHealth.grade;
    healthDiagnosis.textContent = randomHealth.diag;
  }

  function resetToIdle() {
    resultPanel.classList.remove('active');
    loadingPanel.classList.remove('active');
    glitchOverlay.classList.remove('active');
    idlePanel.classList.add('active');
    brainChamber.classList.remove('thinking');

    // Reset loading state
    percentageDisplay.textContent = '0%';
    statusMessage.textContent = 'Waking up brain…';
    progressBar.style.width = '0%';
    systemPip.style.background = '#00f3ff';
    systemPip.style.boxShadow = '0 0 12px #00f3ff';
  }

  // Initial render
  renderLeaderboard();
});
