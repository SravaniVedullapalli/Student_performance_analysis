const SUBJECTS = [
    { key: "math", label: "Math" },
    { key: "science", label: "Science" },
    { key: "english", label: "English" },
    { key: "computer", label: "Computer" },
    { key: "history", label: "History" }
];

const PASS_MARK = 40;
const ATTENDANCE_THRESHOLD = 75;
const STORAGE_KEY = "student_performance_records_v1";

const DEFAULT_STUDENTS = [
    { roll: "101", name: "Aarav Patel", attendance: 96, marks: { math: 95, science: 92, english: 88, computer: 97, history: 89 } },
    { roll: "102", name: "Diya Nair", attendance: 93, marks: { math: 89, science: 94, english: 91, computer: 90, history: 86 } },
    { roll: "103", name: "Rohan Verma", attendance: 84, marks: { math: 78, science: 74, english: 80, computer: 82, history: 71 } },
    { roll: "104", name: "Sneha Reddy", attendance: 98, marks: { math: 91, science: 89, english: 93, computer: 94, history: 88 } },
    { roll: "105", name: "Karthik Rao", attendance: 68, marks: { math: 42, science: 36, english: 52, computer: 48, history: 44 } },
    { roll: "106", name: "Meera Joshi", attendance: 88, marks: { math: 72, science: 76, english: 79, computer: 75, history: 73 } },
    { roll: "107", name: "Vikram Singh", attendance: 62, marks: { math: 35, science: 41, english: 46, computer: 39, history: 38 } },
    { roll: "108", name: "Pooja Iyer", attendance: 79, marks: { math: 61, science: 58, english: 66, computer: 64, history: 59 } },
    { roll: "109", name: "Arjun Das", attendance: 72, marks: { math: 54, science: 49, english: 57, computer: 62, history: 51 } },
    { roll: "110", name: "Nisha Kulkarni", attendance: 91, marks: { math: 84, science: 81, english: 85, computer: 87, history: 78 } }
];

let students = loadStudents();

function loadStudents() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed) && parsed.length > 0) {
                return parsed;
            }
        }
    } catch {
        // Ignore storage read errors and fall back to default sample data.
    }
    return structuredClone(DEFAULT_STUDENTS);
}

function saveStudents() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
    } catch {
        // Ignore storage write errors in restricted browser environments.
    }
}

/**
 * Categorize a student based on average percentage.
 * Excellent: >= 85, Good: 70-84.99, Average: 50-69.99, Poor: < 50
 */
function categorizeStudent(average) {
    if (average >= 85) return "Excellent";
    if (average >= 70) return "Good";
    if (average >= 50) return "Average";
    return "Poor";
}

function enrichStudent(student) {
    const total = SUBJECTS.reduce((sum, sub) => sum + Number(student.marks[sub.key] || 0), 0);
    const average = total / SUBJECTS.length;
    const category = categorizeStudent(average);
    const weakSubjects = SUBJECTS
        .filter((sub) => Number(student.marks[sub.key]) < PASS_MARK)
        .map((sub) => `${sub.label} (${student.marks[sub.key]})`);

    return {
        ...student,
        total,
        average,
        category,
        weakSubjects
    };
}

function getRankedStudents() {
    return students
        .map(enrichStudent)
        .sort((a, b) => b.average - a.average || b.attendance - a.attendance)
        .map((student, index) => ({ ...student, rank: index + 1 }));
}

function badgeClass(category) {
    return `badge badge-${category.toLowerCase()}`;
}

function createEl(tag, className, text) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (text !== undefined) el.textContent = text;
    return el;
}

function renderKPIs(ranked) {
    const totalEl = document.getElementById("totalStudents");
    const classAvgEl = document.getElementById("classAverageMeta");
    const topperNameEl = document.getElementById("topperName");
    const topperScoreEl = document.getElementById("topperScore");
    const lowCountEl = document.getElementById("lowPerformerCount");
    const atRiskMetaEl = document.getElementById("atRiskMeta");
    const avgAttEl = document.getElementById("avgAttendance");
    const lowAttMetaEl = document.getElementById("lowAttendanceMeta");

    totalEl.textContent = String(ranked.length);

    if (ranked.length === 0) {
        classAvgEl.textContent = "Class Avg: 0%";
        topperNameEl.textContent = "-";
        topperScoreEl.textContent = "No records";
        lowCountEl.textContent = "0";
        atRiskMetaEl.textContent = "No records";
        avgAttEl.textContent = "0%";
        lowAttMetaEl.textContent = "0 below 75%";
        return;
    }

    const classAvg = ranked.reduce((s, st) => s + st.average, 0) / ranked.length;
    const topper = ranked[0];
    const poorCount = ranked.filter((st) => st.category === "Poor").length;
    const failingAny = ranked.filter((st) => st.weakSubjects.length > 0).length;
    const avgAttendance = ranked.reduce((s, st) => s + st.attendance, 0) / ranked.length;
    const lowAttendanceCount = ranked.filter((st) => st.attendance < ATTENDANCE_THRESHOLD).length;

    classAvgEl.textContent = `Class Avg: ${classAvg.toFixed(1)}%`;
    topperNameEl.textContent = topper.name;
    topperScoreEl.textContent = `${topper.average.toFixed(1)}% (${topper.total}/500)`;
    lowCountEl.textContent = String(poorCount);
    atRiskMetaEl.textContent = `${failingAny} student(s) below ${PASS_MARK} in a subject`;
    avgAttEl.textContent = `${avgAttendance.toFixed(1)}%`;
    lowAttMetaEl.textContent = `${lowAttendanceCount} student(s) below ${ATTENDANCE_THRESHOLD}%`;
}

function renderCategoryBreakdown(ranked) {
    const summaryEl = document.getElementById("categorySummary");
    const barEl = document.getElementById("categoryBar");
    summaryEl.replaceChildren();
    barEl.replaceChildren();

    const categories = ["Excellent", "Good", "Average", "Poor"];
    const total = ranked.length || 1;

    categories.forEach((cat) => {
        const count = ranked.filter((st) => st.category === cat).length;
        const pct = ((count / total) * 100).toFixed(0);

        const card = createEl("div", "category-card");
        const left = createEl("div");
        left.appendChild(createEl("span", badgeClass(cat), cat));
        left.appendChild(createEl("div", "highlight-meta", `${pct}% of class`));

        const right = createEl("strong", "", String(count));
        card.append(left, right);
        summaryEl.appendChild(card);

        if (count > 0) {
            const seg = createEl("div", `stacked-segment seg-${cat.toLowerCase()}`);
            seg.style.width = `${(count / total) * 100}%`;
            seg.title = `${cat}: ${count} student(s) (${pct}%)`;
            barEl.appendChild(seg);
        }
    });
}

function renderToppersAndLowPerformers(ranked) {
    const toppersEl = document.getElementById("toppersList");
    const lowEl = document.getElementById("lowPerformersList");
    toppersEl.replaceChildren();
    lowEl.replaceChildren();

    if (ranked.length === 0) {
        toppersEl.appendChild(createEl("p", "empty-state", "No student records available."));
        lowEl.appendChild(createEl("p", "empty-state", "No student records available."));
        return;
    }

    ranked.slice(0, 3).forEach((st) => {
        const item = createEl("div", "highlight-item");
        const info = createEl("div");
        info.appendChild(createEl("h3", "", `#${st.rank} ${st.name} (Roll ${st.roll})`));
        info.appendChild(
            createEl(
                "div",
                "highlight-meta",
                `Total: ${st.total}/500 | Avg: ${st.average.toFixed(1)}% | Attendance: ${st.attendance}%`
            )
        );
        const badge = createEl("span", badgeClass(st.category), st.category);
        item.append(info, badge);
        toppersEl.appendChild(item);
    });

    const lowPerformers = ranked.filter((st) => st.category === "Poor" || st.weakSubjects.length > 0);
    if (lowPerformers.length === 0) {
        lowEl.appendChild(createEl("p", "empty-state", "No low-performing students found."));
        return;
    }

    lowPerformers.forEach((st) => {
        const item = createEl("div", "highlight-item");
        const info = createEl("div");
        info.appendChild(createEl("h3", "", `${st.name} (Roll ${st.roll})`));
        const weakText = st.weakSubjects.length > 0
            ? `Weak subjects: ${st.weakSubjects.join(", ")}`
            : "Overall average below 50%";
        info.appendChild(
            createEl(
                "div",
                "highlight-meta",
                `Avg: ${st.average.toFixed(1)}% | Attendance: ${st.attendance}% | ${weakText}`
            )
        );
        const badge = createEl("span", badgeClass(st.category), st.category);
        item.append(info, badge);
        lowEl.appendChild(item);
    });
}

function renderSubjectAnalysis(ranked) {
    const barsEl = document.getElementById("subjectBars");
    const tbody = document.getElementById("subjectTableBody");
    barsEl.replaceChildren();
    tbody.replaceChildren();

    if (ranked.length === 0) {
        barsEl.appendChild(createEl("p", "empty-state", "Add students to compare subject-wise marks."));
        return;
    }

    SUBJECTS.forEach((sub) => {
        const scores = ranked.map((st) => ({ name: st.name, score: Number(st.marks[sub.key]) }));
        const avg = scores.reduce((s, item) => s + item.score, 0) / scores.length;
        const maxScore = Math.max(...scores.map((item) => item.score));
        const minScore = Math.min(...scores.map((item) => item.score));
        const toppers = scores.filter((item) => item.score === maxScore).map((item) => item.name).join(", ");
        const passCount = scores.filter((item) => item.score >= PASS_MARK).length;
        const passRate = (passCount / scores.length) * 100;

        // Visual comparison bar
        const row = createEl("div", "bar-row");
        const header = createEl("div", "bar-row-header");
        header.append(
            createEl("span", "", sub.label),
            createEl("span", "", `Avg ${avg.toFixed(1)}% (High: ${maxScore}, Low: ${minScore})`)
        );
        const track = createEl("div", "bar-track");
        const fill = createEl("div", `bar-fill ${avg < 50 ? "bar-fill-warn" : ""}`);
        fill.style.width = `${Math.min(100, Math.max(0, avg))}%`;
        track.appendChild(fill);
        row.append(header, track);
        barsEl.appendChild(row);

        // Summary table row
        const tr = document.createElement("tr");
        tr.append(
            createEl("td", "", sub.label),
            createEl("td", "", `${avg.toFixed(1)}%`),
            createEl("td", "", `${maxScore} (${toppers})`),
            createEl("td", "", String(minScore)),
            createEl("td", "", `${passRate.toFixed(0)}% (${passCount}/${scores.length})`)
        );
        tbody.appendChild(tr);
    });
}

function renderAttendanceAnalysis(ranked) {
    const insightsEl = document.getElementById("attendanceInsights");
    const listEl = document.getElementById("attendanceList");
    insightsEl.replaceChildren();
    listEl.replaceChildren();

    if (ranked.length === 0) {
        listEl.appendChild(createEl("p", "empty-state", "No attendance records available."));
        return;
    }

    const regularStudents = ranked.filter((st) => st.attendance >= ATTENDANCE_THRESHOLD);
    const lowAttStudents = ranked.filter((st) => st.attendance < ATTENDANCE_THRESHOLD);

    const avgMarksRegular = regularStudents.length
        ? (regularStudents.reduce((s, st) => s + st.average, 0) / regularStudents.length).toFixed(1) + "%"
        : "N/A";
    const avgMarksLow = lowAttStudents.length
        ? (lowAttStudents.reduce((s, st) => s + st.average, 0) / lowAttStudents.length).toFixed(1) + "%"
        : "N/A";

    const insights = [
        { label: `>= ${ATTENDANCE_THRESHOLD}% Attendance`, value: `${regularStudents.length} student(s)` },
        { label: `< ${ATTENDANCE_THRESHOLD}% Attendance`, value: `${lowAttStudents.length} student(s)` },
        { label: "Avg Marks (Regular)", value: avgMarksRegular },
        { label: "Avg Marks (Low Att.)", value: avgMarksLow }
    ];

    insights.forEach((item) => {
        const box = createEl("div", "insight-box");
        box.append(createEl("span", "", item.label), createEl("strong", "", item.value));
        insightsEl.appendChild(box);
    });

    // Sort by attendance ascending so attendance risks appear at the top.
    const sortedByAtt = [...ranked].sort((a, b) => a.attendance - b.attendance);
    sortedByAtt.forEach((st) => {
        const row = createEl("div", "bar-row");
        const header = createEl("div", "bar-row-header");
        const status = st.attendance < ATTENDANCE_THRESHOLD ? "Low Attendance" : "Regular";
        header.append(
            createEl("span", "", `${st.name} (Avg: ${st.average.toFixed(1)}%)`),
            createEl("span", "", `${st.attendance}% (${status})`)
        );
        const track = createEl("div", "bar-track");
        const fill = createEl(
            "div",
            `bar-fill ${st.attendance < ATTENDANCE_THRESHOLD ? "bar-fill-warn" : "bar-fill-good"}`
        );
        fill.style.width = `${Math.min(100, Math.max(0, st.attendance))}%`;
        track.appendChild(fill);
        row.append(header, track);
        listEl.appendChild(row);
    });
}

function renderStudentsTable(ranked) {
    const tbody = document.getElementById("studentsTableBody");
    const query = document.getElementById("searchInput").value.trim().toLowerCase();
    const categoryFilter = document.getElementById("categoryFilter").value;
    tbody.replaceChildren();

    const filtered = ranked.filter((st) => {
        const matchesQuery =
            st.name.toLowerCase().includes(query) || st.roll.toLowerCase().includes(query);
        const matchesCategory = categoryFilter === "All" || st.category === categoryFilter;
        return matchesQuery && matchesCategory;
    });

    if (filtered.length === 0) {
        const tr = document.createElement("tr");
        const td = createEl("td", "empty-state", "No matching students found.");
        td.colSpan = 13;
        tr.appendChild(td);
        tbody.appendChild(tr);
        return;
    }

    filtered.forEach((st) => {
        const tr = document.createElement("tr");
        tr.append(
            createEl("td", "", `#${st.rank}`),
            createEl("td", "", st.roll),
            createEl("td", "", st.name)
        );

        SUBJECTS.forEach((sub) => {
            const mark = Number(st.marks[sub.key]);
            tr.appendChild(createEl("td", mark < PASS_MARK ? "fail-mark" : "", String(mark)));
        });

        tr.append(
            createEl("td", "", String(st.total)),
            createEl("td", "", `${st.average.toFixed(1)}%`),
            createEl("td", st.attendance < ATTENDANCE_THRESHOLD ? "fail-mark" : "", `${st.attendance}%`)
        );

        const catTd = document.createElement("td");
        catTd.appendChild(createEl("span", badgeClass(st.category), st.category));
        tr.appendChild(catTd);

        const actionTd = document.createElement("td");
        const deleteBtn = createEl("button", "btn btn-danger", "Delete");
        deleteBtn.type = "button";
        deleteBtn.addEventListener("click", () => {
            students = students.filter((item) => item.roll !== st.roll);
            saveStudents();
            renderDashboard();
        });
        actionTd.appendChild(deleteBtn);
        tr.appendChild(actionTd);

        tbody.appendChild(tr);
    });
}

function renderDashboard() {
    const ranked = getRankedStudents();
    renderKPIs(ranked);
    renderCategoryBreakdown(ranked);
    renderToppersAndLowPerformers(ranked);
    renderSubjectAnalysis(ranked);
    renderAttendanceAnalysis(ranked);
    renderStudentsTable(ranked);
}

document.getElementById("studentForm").addEventListener("submit", (event) => {
    event.preventDefault();

    const name = document.getElementById("studentName").value.trim();
    const roll = document.getElementById("studentRoll").value.trim();
    const attendance = Number(document.getElementById("studentAttendance").value);
    const marks = {
        math: Number(document.getElementById("markMath").value),
        science: Number(document.getElementById("markScience").value),
        english: Number(document.getElementById("markEnglish").value),
        computer: Number(document.getElementById("markComputer").value),
        history: Number(document.getElementById("markHistory").value)
    };

    if (!name || !roll) return;

    const existingIndex = students.findIndex((st) => st.roll === roll);
    const record = { roll, name, attendance, marks };

    if (existingIndex >= 0) {
        students[existingIndex] = record;
    } else {
        students.push(record);
    }

    saveStudents();
    event.target.reset();
    renderDashboard();
});

document.getElementById("searchInput").addEventListener("input", renderDashboard);
document.getElementById("categoryFilter").addEventListener("change", renderDashboard);
document.getElementById("resetDataBtn").addEventListener("click", () => {
    students = structuredClone(DEFAULT_STUDENTS);
    saveStudents();
    renderDashboard();
});

renderDashboard();
