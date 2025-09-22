// Remedy database
const remedies = {
  cramps: [
    "Apply a heating pad to your lower abdomen",
    "Try gentle yoga poses like child's pose",
    "Drink chamomile or ginger tea",
    "Take a warm bath with Epsom salts",
  ],
  headache: [
    "Stay well hydrated - drink plenty of water",
    "Apply a cold compress to your forehead",
    "Try gentle neck and shoulder stretches",
    "Rest in a dark, quiet room",
  ],
  bloating: [
    "Avoid salty foods and drink herbal tea",
    "Try gentle abdominal massage",
    "Eat smaller, frequent meals",
    "Consider probiotics or yogurt",
  ],
  mood: [
    "Practice deep breathing exercises",
    "Go for a gentle walk outdoors",
    "Listen to calming music",
    "Talk to a trusted friend or family member",
  ],
  fatigue: [
    "Ensure you're getting 7-9 hours of sleep",
    "Eat iron-rich foods like spinach",
    "Take short power naps if needed",
    "Avoid excessive caffeine",
  ],
  backache: [
    "Use a heating pad on your lower back",
    "Try gentle back stretches",
    "Sleep with a pillow between your knees",
    "Consider a warm shower or bath",
  ],
  nausea: [
    "Sip on ginger tea or chew ginger candies",
    "Eat small, frequent meals",
  ],
  acne: [
    "Maintain a gentle skincare routine",
    "Avoid touching your face frequently",
  ],
  insomnia: [
    "Establish a calming bedtime routine",
    "Avoid screens at least an hour before bed",
    "Try relaxation techniques like meditation",
    "Keep your bedroom cool and dark",
  ],
  breastTenderness: [
    "Wear a supportive bra",
    "Apply warm or cold compresses",
    "Reduce caffeine intake",
    "Take over-the-counter pain relief if needed",
  ],
  foodCravings: [
    "Opt for healthy snacks like fruits or nuts",
    "Stay hydrated - sometimes thirst is mistaken for hunger",
    "Distract yourself with a hobby or activity",
    "Practice mindful eating",
  ],
  dizziness: [
    "Sit or lie down immediately if you feel dizzy",
    "Avoid sudden movements",
    "Stay hydrated",
    "Eat small, frequent meals to maintain blood sugar levels",
  ],
};

// Phase insights
const phaseInsights = {
  menstrual: {
    title: "Menstrual Phase",
    description: "Your period is here - time to rest and recharge",
    insight:
      "Your energy might be lower today. Focus on rest, gentle movement, and nourishing foods. Listen to your body and be kind to yourself.",
    class: "phase-menstrual",
  },
  follicular: {
    title: "Follicular Phase",
    description: "Energy is building - great time for new projects",
    insight:
      "You're likely feeling more energetic and optimistic. This is a great time to start new projects or make important decisions.",
    class: "phase-follicular",
  },
  ovulation: {
    title: "Ovulation Phase",
    description: "Peak energy and fertility window",
    insight:
      "You're at your peak energy levels! Social activities and physical exercise will feel easier. You might feel more confident and outgoing.",
    class: "phase-ovulation",
  },
  luteal: {
    title: "Luteal Phase",
    description: "Energy may be winding down - focus on self-care",
    insight:
      "Your body is preparing for the next cycle. You might crave comfort foods and prefer quieter activities. Practice extra self-care.",
    class: "phase-luteal",
  },
};

let userData = {
  lastPeriodDate: null,
  cycleLength: 28,
  dailyEntries: {},
  selectedSymptoms: [],
  customInsights: {},
  periodEntries: [], // Changed: Store individual period entries
};

// Initialize the app
document.addEventListener("DOMContentLoaded", function () {
  loadUserData();
  initializeWaterTracker();
  updateCycleInfo();
  loadTodayData();
  updatePhaseInfo();
  generateSampleCycleData(); // Add sample data if no history exists
  updateCycleHistory();
  drawCycleGraph();
  loadVoiceNotes(); // Load voice notes automatically
});

function loadUserData() {
  const saved = localStorage.getItem("periodTrackerData");
  if (saved) {
    userData = { ...userData, ...JSON.parse(saved) };
  }

  // Set default last period date if not set
  if (!userData.lastPeriodDate) {
    const today = new Date();
    today.setDate(today.getDate() - 10); // Default to 10 days ago
    userData.lastPeriodDate = today.toISOString().split("T")[0];
  }

  // Update settings inputs
  document.getElementById("lastPeriod").value = userData.lastPeriodDate;
  document.getElementById("cycleLength").value = userData.cycleLength;
}

function saveUserData() {
  localStorage.setItem("periodTrackerData", JSON.stringify(userData));
}

function switchTab(tabName) {
  // Remove active class from all tabs and contents
  document
    .querySelectorAll(".tab")
    .forEach((tab) => tab.classList.remove("active"));
  document
    .querySelectorAll(".tab-content")
    .forEach((content) => content.classList.remove("active"));

  // Add active class to clicked tab and corresponding content
  event.target.classList.add("active");
  document.getElementById(tabName).classList.add("active");
}

function initializeWaterTracker() {
  const waterGlasses = document.getElementById("waterGlasses");
  waterGlasses.innerHTML = "";

  for (let i = 0; i < 8; i++) {
    const glass = document.createElement("div");
    glass.className = "glass";
    glass.onclick = () => toggleWaterGlass(i);
    waterGlasses.appendChild(glass);
  }

  updateWaterDisplay();
}

function toggleWaterGlass(index) {
  const today = new Date().toISOString().split("T")[0];
  if (!userData.dailyEntries[today]) {
    userData.dailyEntries[today] = { waterIntake: 0 };
  }

  const current = userData.dailyEntries[today].waterIntake || 0;
  userData.dailyEntries[today].waterIntake = index + 1;

  updateWaterDisplay();
  saveUserData();
}

function updateWaterDisplay() {
  const today = new Date().toISOString().split("T")[0];
  const waterIntake = userData.dailyEntries[today]?.waterIntake || 0;

  document.querySelectorAll(".glass").forEach((glass, index) => {
    glass.classList.toggle("filled", index < waterIntake);
  });

  document.getElementById("waterCount").textContent = waterIntake;
}

function toggleSymptom(symptom) {
    const btn = event.target;
    const today = new Date().toISOString().split('T')[0];
    
    if (!userData.dailyEntries[today]) {
        userData.dailyEntries[today] = { symptoms: [] };
    }
    if (!userData.dailyEntries[today].symptoms) {
        userData.dailyEntries[today].symptoms = [];
    }
    
    const symptoms = userData.dailyEntries[today].symptoms;
    const index = symptoms.indexOf(symptom);
    
    // Clear all previously selected symptoms and their buttons
    symptoms.length = 0; // Clear the array
    document.querySelectorAll('.symptom-btn').forEach(button => {
        button.classList.remove('selected');
    });
    
    // Add only the newly selected symptom
    if (index === -1) { // Only add if it wasn't already selected
        symptoms.push(symptom);
        btn.classList.add('selected');
    }
    
    updateRemedies();
    saveUserData();
}

function updateRemedies() {
  const today = new Date().toISOString().split("T")[0];
  const symptoms = userData.dailyEntries[today]?.symptoms || [];
  const remediesSection = document.getElementById("remediesSection");
  const remediesList = document.getElementById("remediesList");

  if (symptoms.length === 0) {
    remediesSection.style.display = "none";
    return;
  }

  remediesSection.style.display = "block";
  remediesList.innerHTML = "";

  symptoms.forEach((symptom) => {
    if (remedies[symptom]) {
      remedies[symptom].forEach((remedy) => {
        const remedyDiv = document.createElement("div");
        remedyDiv.className = "remedy-item";
        remedyDiv.innerHTML = `<strong></strong> ${remedy}`;
        remediesList.appendChild(remedyDiv);
      });
    }
  });
}

function loadTodayData() {
  const today = new Date().toISOString().split("T")[0];
  const todayData = userData.dailyEntries[today] || {};

  // Load notes
  document.getElementById("todayNotes").value = todayData.notes || "";

  // Load symptoms
  const symptoms = todayData.symptoms || [];
  document.querySelectorAll(".symptom-btn").forEach((btn) => {
    const symptom = btn.onclick
      .toString()
      .match(/toggleSymptom\('(.+?)'\)/)?.[1];
    btn.classList.toggle("selected", symptoms.includes(symptom));
  });

  updateRemedies();
}

// Save notes when typing
document.getElementById("todayNotes").addEventListener("input", function () {
  const today = new Date().toISOString().split("T")[0];
  if (!userData.dailyEntries[today]) {
    userData.dailyEntries[today] = {};
  }
  userData.dailyEntries[today].notes = this.value;
  saveUserData();
});

function updateCycleInfo() {
  const lastPeriod = new Date(userData.lastPeriodDate);
  const today = new Date();
  const daysSinceLastPeriod = Math.floor(
    (today - lastPeriod) / (1000 * 60 * 60 * 24)
  );
  const daysUntilNext = userData.cycleLength - daysSinceLastPeriod;

  document.getElementById("daysLeft").textContent =
    daysUntilNext > 0 ? daysUntilNext : "Due";

  // Calculate current phase
  const phase = getCurrentPhase(daysSinceLastPeriod);
  document.getElementById("currentPhase").textContent =
    phase.charAt(0).toUpperCase() + phase.slice(1);

  // Update predictions
  const nextPeriod = new Date(lastPeriod);
  nextPeriod.setDate(nextPeriod.getDate() + userData.cycleLength);
  document.getElementById("nextPeriodDate").textContent =
    nextPeriod.toLocaleDateString();

  const fertileStart = new Date(lastPeriod);
  fertileStart.setDate(fertileStart.getDate() + userData.cycleLength - 16);
  const fertileEnd = new Date(lastPeriod);
  fertileEnd.setDate(fertileEnd.getDate() + userData.cycleLength - 11);
  document.getElementById(
    "fertileWindow"
  ).textContent = `${fertileStart.toLocaleDateString()} - ${fertileEnd.toLocaleDateString()}`;

  document.getElementById(
    "avgCycle"
  ).textContent = `${userData.cycleLength} days`;
}

function getCurrentPhase(daysSinceLastPeriod) {
  const cycleDay = daysSinceLastPeriod % userData.cycleLength;

  if (cycleDay <= 5) return "menstrual";
  if (cycleDay <= 13) return "follicular";
  if (cycleDay <= 15) return "ovulation";
  return "luteal";
}

function updatePhaseInfo() {
  const lastPeriod = new Date(userData.lastPeriodDate);
  const today = new Date();
  const daysSinceLastPeriod = Math.floor(
    (today - lastPeriod) / (1000 * 60 * 60 * 24)
  );
  const phase = getCurrentPhase(daysSinceLastPeriod);
  const phaseInfo = phaseInsights[phase];

  const indicator = document.getElementById("phaseIndicator");
  indicator.className = `phase-indicator ${phaseInfo.class}`;
  document.getElementById("phaseTitle").textContent = phaseInfo.title;
  document.getElementById("phaseDescription").textContent =
    phaseInfo.description;

  // Check for custom insight
  const todayStr = today.toISOString().split("T")[0];
  const insight = userData.customInsights[todayStr] || phaseInfo.insight;
  document.getElementById("todayInsight").textContent = insight;
}

function editInsight() {
  const currentInsight = document.getElementById("todayInsight").textContent;
  const newInsight = prompt("Edit today's insight:", currentInsight);

  if (newInsight && newInsight !== currentInsight) {
    const today = new Date().toISOString().split("T")[0];
    userData.customInsights[today] = newInsight;
    document.getElementById("todayInsight").textContent = newInsight;
    saveUserData();
  }
}

function saveSettings() {
  userData.lastPeriodDate = document.getElementById("lastPeriod").value;
  userData.cycleLength = parseInt(document.getElementById("cycleLength").value);

  updateCycleInfo();
  updatePhaseInfo();
  saveUserData();

  alert("Settings saved successfully!");
}

function exportData() {
  const dataStr = JSON.stringify(userData, null, 2);
  const dataBlob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(dataBlob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "period-tracker-backup.json";
  link.click();

  URL.revokeObjectURL(url);
}

// New functions for cycle history
function generateSampleCycleData() {
  // Generate sample period entries if none exist
  if (userData.periodEntries.length === 0) {
    const samplePeriods = [
      { startDate: "2024-12-01", endDate: "2024-12-05", duration: 5 },
      { startDate: "2024-11-03", endDate: "2024-11-07", duration: 5 },
      { startDate: "2024-10-05", endDate: "2024-10-09", duration: 5 },
      { startDate: "2024-09-08", endDate: "2024-09-12", duration: 5 },
      { startDate: "2024-08-12", endDate: "2024-08-16", duration: 5 },
      { startDate: "2024-07-14", endDate: "2024-07-18", duration: 5 },
      { startDate: "2024-06-16", endDate: "2024-06-20", duration: 5 },
    ];

    userData.periodEntries = samplePeriods;
    saveUserData();
  }
}

function calculateCyclesFromPeriods() {
  // Calculate cycle lengths from period entries
  if (userData.periodEntries.length < 2) return [];

  const sortedPeriods = [...userData.periodEntries].sort(
    (a, b) => new Date(a.startDate) - new Date(b.startDate)
  );
  const cycles = [];

  for (let i = 0; i < sortedPeriods.length - 1; i++) {
    const currentPeriod = sortedPeriods[i];
    const nextPeriod = sortedPeriods[i + 1];

    const startDate = new Date(currentPeriod.startDate);
    const nextStartDate = new Date(nextPeriod.startDate);
    const cycleLength = Math.floor(
      (nextStartDate - startDate) / (1000 * 60 * 60 * 24)
    );

    cycles.push({
      startDate: currentPeriod.startDate,
      endDate: nextPeriod.startDate,
      length: cycleLength,
      periodDuration:
        currentPeriod.duration ||
        Math.floor(
          (new Date(currentPeriod.endDate) -
            new Date(currentPeriod.startDate)) /
            (1000 * 60 * 60 * 24)
        ) + 1,
    });
  }

  return cycles;
}

function updateCycleHistory() {
  const historyList = document.getElementById("cycleHistoryList");
  historyList.innerHTML = "";

  const cycles = calculateCyclesFromPeriods();

  if (cycles.length === 0 && userData.periodEntries.length === 0) {
    historyList.innerHTML =
      '<p style="text-align: center; color: #666; padding: 20px;">No period data yet. Add your first period above!</p>';
    return;
  }

  if (cycles.length === 0 && userData.periodEntries.length > 0) {
    historyList.innerHTML =
      '<p style="text-align: center; color: #666; padding: 20px;">Add more periods to see cycle calculations!</p>';
    // Show individual periods
    const sortedPeriods = [...userData.periodEntries].sort(
      (a, b) => new Date(b.startDate) - new Date(a.startDate)
    );
    sortedPeriods.forEach((period, index) => {
      const periodDiv = document.createElement("div");
      periodDiv.className = "cycle-entry normal";

      const startDate = new Date(period.startDate).toLocaleDateString();
      const endDate = new Date(period.endDate).toLocaleDateString();
      const duration =
        period.duration ||
        Math.floor(
          (new Date(period.endDate) - new Date(period.startDate)) /
            (1000 * 60 * 60 * 24)
        ) + 1;

      periodDiv.innerHTML = `
                        <div class="cycle-entry-header">
                            <div>
                                <div class="cycle-length normal">${duration} days period</div>
                                <div style="font-size: 12px; color: #666;">Period #${
                                  sortedPeriods.length - index
                                }</div>
                            </div>
                            <button onclick="deletePeriod(${userData.periodEntries.indexOf(
                              period
                            )})" 
                                    style="background: #ff6b6b; color: white; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer;">
                                Delete
                            </button>
                        </div>
                        <div style="font-size: 14px; color: #666;">
                            <div><strong>Start:</strong> ${startDate}</div>
                            <div><strong>End:</strong> ${endDate}</div>
                        </div>
                    `;

      historyList.appendChild(periodDiv);
    });
    return;
  }

  // Sort cycles by start date (most recent first)
  const sortedCycles = [...cycles].sort(
    (a, b) => new Date(b.startDate) - new Date(a.startDate)
  );

  sortedCycles.forEach((cycle, index) => {
    const cycleDiv = document.createElement("div");
    const cycleClass = getCycleClass(cycle.length);
    cycleDiv.className = `cycle-entry ${cycleClass}`;

    const startDate = new Date(cycle.startDate).toLocaleDateString();
    const endDate = new Date(cycle.endDate).toLocaleDateString();

    // Find the corresponding period entry for deletion
    const periodIndex = userData.periodEntries.findIndex(
      (p) => p.startDate === cycle.startDate
    );

    cycleDiv.innerHTML = `
                    <div class="cycle-entry-header">
                        <div>
                            <div class="cycle-length ${cycleClass}">${
      cycle.length
    } day cycle</div>
                            <div style="font-size: 12px; color: #666;">Cycle #${
                              sortedCycles.length - index
                            } • ${cycle.periodDuration} day period</div>
                        </div>
                        <button onclick="deletePeriod(${periodIndex})" 
                                style="background: #ff6b6b; color: white; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer;">
                            Delete
                        </button>
                    </div>
                    <div style="font-size: 14px; color: #666;">
                        <div><strong>Period:</strong> ${startDate}</div>
                        <div><strong>Next Period:</strong> ${endDate}</div>
                        <div><strong>Cycle Length:</strong> ${
                          cycle.length
                        } days</div>
                    </div>
                `;

    historyList.appendChild(cycleDiv);
  });
}

function getCycleClass(length) {
  if (length <= 20) return "short";
  if (length >= 36) return "long";
  return "normal";
}

function drawCycleGraph() {
  const graphLine = document.getElementById("graphLine");
  const graphLabels = document.getElementById("graphLabels");

  const cycles = calculateCyclesFromPeriods();

  if (cycles.length === 0) {
    graphLine.innerHTML =
      '<div style="text-align: center; padding: 50px; color: #666;">Add at least 2 periods to see your cycle graph</div>';
    graphLabels.innerHTML = "";
    return;
  }

  // Clear existing content
  graphLine.innerHTML = "";
  graphLabels.innerHTML = "";

  // Sort cycles by date
  const sortedCycles = [...cycles].sort(
    (a, b) => new Date(a.startDate) - new Date(b.startDate)
  );

  // Get last 6 cycles for graph
  const recentCycles = sortedCycles.slice(-6);

  // Create graph points
  recentCycles.forEach((cycle, index) => {
    const point = document.createElement("div");
    point.className = `graph-point ${getCycleClass(cycle.length)}`;

    // Position calculation
    const leftPercent = (index / (recentCycles.length - 1)) * 100;
    const bottomPercent = ((cycle.length - 15) / (45 - 15)) * 100;

    point.style.left = `${leftPercent}%`;
    point.style.bottom = `${Math.max(5, Math.min(95, bottomPercent))}%`;

    // Tooltip
    point.title = `${cycle.length} days - ${new Date(
      cycle.startDate
    ).toLocaleDateString()}`;

    graphLine.appendChild(point);

    // Add month label
    const label = document.createElement("span");
    const date = new Date(cycle.startDate);
    label.textContent = date.toLocaleDateString("en-US", {
      month: "short",
      year: "2-digit",
    });
    label.style.flex = "1";
    label.style.textAlign =
      index === 0
        ? "left"
        : index === recentCycles.length - 1
        ? "right"
        : "center";
    graphLabels.appendChild(label);
  });

  // Draw connecting line
  if (recentCycles.length > 1) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.style.position = "absolute";
    svg.style.top = "0";
    svg.style.left = "0";
    svg.style.width = "100%";
    svg.style.height = "100%";
    svg.style.pointerEvents = "none";

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    let pathData = "";

    recentCycles.forEach((cycle, index) => {
      const x = (index / (recentCycles.length - 1)) * 100;
      const y =
        100 -
        Math.max(5, Math.min(95, ((cycle.length - 15) / (45 - 15)) * 100));

      if (index === 0) {
        pathData += `M ${x} ${y}`;
      } else {
        pathData += ` L ${x} ${y}`;
      }
    });

    path.setAttribute("d", pathData);
    path.setAttribute("stroke", "#ff6b6b");
    path.setAttribute("stroke-width", "2");
    path.setAttribute("fill", "none");
    path.setAttribute("stroke-dasharray", "5,5");

    svg.appendChild(path);
    graphLine.appendChild(svg);
  }
}

function openAddCycleModal() {
  document.getElementById("addCycleModal").style.display = "block";
}

function closeAddCycleModal() {
  document.getElementById("addCycleModal").style.display = "none";
  document.getElementById("cycleStartDate").value = "";
  document.getElementById("cycleEndDate").value = "";
}

function addNewCycle() {
  const startDate = document.getElementById("cycleStartDate").value;
  const endDate = document.getElementById("cycleEndDate").value;

  if (!startDate) {
    alert("Please enter a period start date");
    return;
  }

  if (!endDate) {
    alert("Please enter a period end date");
    return;
  }

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (end <= start) {
    alert("Period end date must be after start date");
    return;
  }

  const duration = Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;

  const newPeriod = {
    startDate: startDate,
    endDate: endDate,
    duration: duration,
  };

  userData.periodEntries.push(newPeriod);

  // Update lastPeriodDate to most recent period
  const sortedPeriods = [...userData.periodEntries].sort(
    (a, b) => new Date(b.startDate) - new Date(a.startDate)
  );
  userData.lastPeriodDate = sortedPeriods[0].startDate;

  // Update average cycle length if we have enough data
  const cycles = calculateCyclesFromPeriods();
  if (cycles.length > 0) {
    const avgLength = Math.round(
      cycles.reduce((sum, cycle) => sum + cycle.length, 0) / cycles.length
    );
    userData.cycleLength = avgLength;
  }

  saveUserData();
  updateCycleInfo();
  updateCycleHistory();
  drawCycleGraph();
  closeAddCycleModal();

  alert("Period added successfully!");
}

function deletePeriod(index) {
  if (confirm("Are you sure you want to delete this period entry?")) {
    userData.periodEntries.splice(index, 1);

    // Update lastPeriodDate if needed
    if (userData.periodEntries.length > 0) {
      const sortedPeriods = [...userData.periodEntries].sort(
        (a, b) => new Date(b.startDate) - new Date(a.startDate)
      );
      userData.lastPeriodDate = sortedPeriods[0].startDate;
    } else {
      userData.lastPeriodDate = null;
    }

    saveUserData();
    updateCycleInfo();
    updateCycleHistory();
    drawCycleGraph();
  }
}

// Voice Notes Functions
function loadVoiceNotes() {
  const audioContainer = document.getElementById("audioContainer");
  const voiceNotesList = document.getElementById("voiceNotesList");

  // Find all audio elements in the hidden container
  const audioElements = audioContainer.querySelectorAll("audio");

  // Clear existing list
  voiceNotesList.innerHTML = "";

  if (audioElements.length === 0) {
    voiceNotesList.innerHTML = `
                    <div style="text-align: center; color: #666; padding: 40px;">
                        <h4>No voice notes yet</h4>
                        <p>Add audio tags in the HTML to see them here!</p>
                        <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-top: 15px; text-align: left;">
                            <strong>How to add voice notes:</strong><br>
                            Add audio tags in the audioContainer div like this:<br>
                            <code style="background: white; padding: 5px; border-radius: 3px;">
                                &lt;audio data-date="2025-01-20" data-title="My note"&gt;<br>
                                &nbsp;&nbsp;&lt;source src="path/to/audio.mp3" type="audio/mpeg"&gt;<br>
                                &lt;/audio&gt;
                            </code>
                        </div>
                    </div>
                `;
    return;
  }

  // Convert NodeList to Array and sort by date (newest first)
  const audioArray = Array.from(audioElements).sort((a, b) => {
    const dateA = a.getAttribute("data-date") || "1970-01-01";
    const dateB = b.getAttribute("data-date") || "1970-01-01";
    return new Date(dateB) - new Date(dateA);
  });

  // Create UI for each audio file
  audioArray.forEach((audio, index) => {
    const voiceNoteDiv = createVoiceNoteUI(audio, index);
    voiceNotesList.appendChild(voiceNoteDiv);
  });
}

function createVoiceNoteUI(audioElement, index) {
  const date = audioElement.getAttribute("data-date") || "Unknown date";
  const title =
    audioElement.getAttribute("data-title") || `Voice Note ${index + 1}`;
  const src = audioElement.querySelector("source")?.src || audioElement.src;

  const voiceNoteDiv = document.createElement("div");
  voiceNoteDiv.className = "voice-note-item";

  // Create formatted date
  const formattedDate =
    date !== "Unknown date"
      ? new Date(date).toLocaleDateString("en-US", {
          weekday: "short",
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : date;

  voiceNoteDiv.innerHTML = `
                <div class="voice-note-header">
                    <div>
                        <strong>${title}</strong>
                        <div class="voice-note-date">${formattedDate}</div>
                    </div>
                    <div class="voice-note-duration" id="duration-${index}">
                        Loading...
                    </div>
                </div>
                <audio class="custom-audio-player" controls preload="metadata" id="audio-${index}">
                    <source src="${src}" type="${
    audioElement.querySelector("source")?.type || "audio/mpeg"
  }">
                    Your browser does not support the audio element.
                </audio>
                <div class="voice-controls">
                    <button class="play-btn" onclick="playPauseAudio(${index})">
                        <span id="play-text-${index}">▶ Play</span>
                    </button>
                    <button class="delete-voice-btn" onclick="removeVoiceNote(${index})">
                        🗑 Delete
                    </button>
                </div>
            `;

  // Set up audio event listeners after adding to DOM
  setTimeout(() => {
    const audio = document.getElementById(`audio-${index}`);
    const durationSpan = document.getElementById(`duration-${index}`);

    audio.addEventListener("loadedmetadata", () => {
      const duration = audio.duration;
      if (duration && !isNaN(duration)) {
        const minutes = Math.floor(duration / 60);
        const seconds = Math.floor(duration % 60);
        durationSpan.textContent = `${minutes}:${seconds
          .toString()
          .padStart(2, "0")}`;
      } else {
        durationSpan.textContent = "Unknown";
      }
    });

    audio.addEventListener("play", () => {
      document.getElementById(`play-text-${index}`).textContent = "⏸ Pause";
    });

    audio.addEventListener("pause", () => {
      document.getElementById(`play-text-${index}`).textContent = "▶ Play";
    });

    audio.addEventListener("ended", () => {
      document.getElementById(`play-text-${index}`).textContent = "▶ Play";
    });
  }, 100);

  return voiceNoteDiv;
}

function playPauseAudio(index) {
  const audio = document.getElementById(`audio-${index}`);
  const playText = document.getElementById(`play-text-${index}`);

  if (audio.paused) {
    // Pause all other audio elements first
    document.querySelectorAll("audio").forEach((a) => {
      if (a !== audio && !a.paused) {
        a.pause();
      }
    });
    audio.play();
  } else {
    audio.pause();
  }
}

function removeVoiceNote(index) {
  if (
    confirm("Are you sure you want to remove this voice note from the display?")
  ) {
    const audioContainer = document.getElementById("audioContainer");
    const audioElements = audioContainer.querySelectorAll("audio");

    if (audioElements[index]) {
      audioElements[index].remove();
      loadVoiceNotes(); // Refresh the list
    }
  }
}

function deleteCycle(index) {
  // This function is no longer needed since we're managing periods directly
  deletePeriod(index);
}

