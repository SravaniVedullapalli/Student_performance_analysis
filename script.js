const students = [
  { name: "Aisha", math: 96, science: 92, english: 89, average: 92.3 },
  { name: "Rahul", math: 91, science: 88, english: 86, average: 88.3 },
  { name: "Maya", math: 87, science: 90, english: 84, average: 87.0 },
  { name: "Daniel", math: 84, science: 79, english: 81, average: 81.3 },
  { name: "Priya", math: 93, science: 95, english: 90, average: 92.7 },
  { name: "Noah", math: 78, science: 81, english: 75, average: 78.0 },
  { name: "Sara", math: 88, science: 86, english: 90, average: 88.0 },
  { name: "Leo", math: 74, science: 72, english: 76, average: 74.0 },
  { name: "Emma", math: 95, science: 91, english: 94, average: 93.3 },
  { name: "Karan", math: 82, science: 85, english: 80, average: 82.3 },
  { name: "Nina", math: 89, science: 88, english: 91, average: 89.3 },
  { name: "Arjun", math: 80, science: 77, english: 79, average: 78.7 }
];

const subjectLabels = [
  { key: "math", label: "Math" },
  { key: "science", label: "Science" },
  { key: "english", label: "English" }
];

const marksTrend = [72, 78, 84, 89, 94];

function calculateAverage(values) {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function renderSummary() {
  const totalStudents = students.length;
  const averageMarks = calculateAverage(students.map((student) => student.average));
  const passCount = students.filter((student) => student.average >= 40).length;
  const passPercentage = (passCount / totalStudents) * 100;
  const failPercentage = 100 - passPercentage;

  document.getElementById("total-students").textContent = totalStudents;
  document.getElementById("average-marks").textContent = `${averageMarks.toFixed(1)}%`;
  document.getElementById("pass-percentage").textContent = `${passPercentage.toFixed(1)}%`;
  document.getElementById("fail-percentage").textContent = `${failPercentage.toFixed(1)}%`;
}

function renderTopStudents() {
  const topStudents = [...students]
    .sort((a, b) => b.average - a.average)
    .slice(0, 5);

  const container = document.getElementById("top-students");
  container.innerHTML = topStudents
    .map(
      (student, index) => `
        <li>
          <div class="student-meta">
            <span class="rank-badge">${index + 1}</span>
            <span class="student-name">${student.name}</span>
          </div>
          <span class="student-score">${student.average.toFixed(1)}%</span>
        </li>
      `
    )
    .join("");
}

function renderSubjectChart() {
  const averagedSubjects = subjectLabels.map(({ key, label }) => ({
    label,
    value: calculateAverage(students.map((student) => student[key]))
  }));

  const container = document.getElementById("subject-chart");
  container.innerHTML = averagedSubjects
    .map(
      ({ label, value }) => `
        <div class="bar-row">
          <span class="bar-label">${label}</span>
          <div class="bar-track">
            <div class="bar-fill" style="width:${value}%"></div>
          </div>
          <span class="bar-value">${value.toFixed(0)}%</span>
        </div>
      `
    )
    .join("");
}

function renderTrendChart(data) {
  const svg = document.getElementById("trend-chart");
  const width = 680;
  const height = 220;
  const padding = 30;
  const max = 100;
  const min = 0;

  const points = data
    .map((value, index) => {
      const x = padding + index * ((width - padding * 2) / (data.length - 1));
      const y = height - padding - ((value - min) / (max - min)) * (height - padding * 2);
      return `${x},${y}`;
    })
    .join(" ");

  const markers = data
    .map((value, index) => {
      const x = padding + index * ((width - padding * 2) / (data.length - 1));
      const y = height - padding - ((value - min) / (max - min)) * (height - padding * 2);
      return `<circle cx="${x}" cy="${y}" r="5" fill="#4f75ff" />`;
    })
    .join("");

  const gridLines = Array.from({ length: 5 }, (_, index) => {
    const lineY = padding + index * ((height - padding * 2) / 4);
    return `<line x1="${padding}" y1="${lineY}" x2="${width - padding}" y2="${lineY}" stroke="rgba(95,111,148,0.20)" stroke-width="1" />`;
  }).join("");

  svg.innerHTML = `
    <defs>
      <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#4f75ff" />
        <stop offset="100%" stop-color="#21c6b8" />
      </linearGradient>
    </defs>
    ${gridLines}
    <polyline fill="none" stroke="url(#lineGradient)" stroke-width="4" stroke-linecap="round" points="${points}" />
    ${markers}
  `;
}

renderSummary();
renderTopStudents();
renderSubjectChart();
renderTrendChart(marksTrend);