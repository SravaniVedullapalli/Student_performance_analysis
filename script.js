// Module 3: Marks and Attendance Analysis
document.addEventListener("DOMContentLoaded", () => {
    const subjectList = document.getElementById("subjectList");
    const addSubjectBtn = document.getElementById("addSubjectBtn");
    const calculateBtn = document.getElementById("calculateBtn");
    const resetBtn = document.getElementById("resetBtn");
    const attendanceInput = document.getElementById("attendanceInput");
    const errorBanner = document.getElementById("errorBanner");
    const resultsSection = document.getElementById("resultsSection");

    const saveToClassBtn = document.getElementById("saveToClassBtn");
    const resetClassBtn = document.getElementById("resetClassBtn");
    const studentSearchInput = document.getElementById("studentSearchInput");
    const categoryFilterSelect = document.getElementById("categoryFilterSelect");

    // Evaluation constants
    const MIN_SUBJECT_PASS_MARK = 35;
    const MIN_ATTENDANCE_PERCENT = 75;
    const MIN_OVERALL_AVERAGE_PASS = 40;
    const CLASS_STORAGE_KEY = "class_performance_analysis_v1";

    const DEFAULT_CLASS_STUDENTS = [
        { roll: "CS2026-101", name: "Aarav Patel", attendance: 96, subjects: [
            { name: "Mathematics", mark: 95 }, { name: "Physics", mark: 92 }, { name: "Chemistry", mark: 88 },
            { name: "Computer Science", mark: 97 }, { name: "English", mark: 89 }
        ]},
        { roll: "CS2026-102", name: "Diya Nair", attendance: 93, subjects: [
            { name: "Mathematics", mark: 89 }, { name: "Physics", mark: 94 }, { name: "Chemistry", mark: 91 },
            { name: "Computer Science", mark: 90 }, { name: "English", mark: 86 }
        ]},
        { roll: "CS2026-103", name: "Sneha Reddy", attendance: 98, subjects: [
            { name: "Mathematics", mark: 91 }, { name: "Physics", mark: 89 }, { name: "Chemistry", mark: 93 },
            { name: "Computer Science", mark: 94 }, { name: "English", mark: 88 }
        ]},
        { roll: "CS2026-104", name: "Nisha Kulkarni", attendance: 91, subjects: [
            { name: "Mathematics", mark: 84 }, { name: "Physics", mark: 81 }, { name: "Chemistry", mark: 85 },
            { name: "Computer Science", mark: 87 }, { name: "English", mark: 78 }
        ]},
        { roll: "CS2026-105", name: "Rohan Verma", attendance: 84, subjects: [
            { name: "Mathematics", mark: 78 }, { name: "Physics", mark: 74 }, { name: "Chemistry", mark: 80 },
            { name: "Computer Science", mark: 82 }, { name: "English", mark: 71 }
        ]},
        { roll: "CS2026-106", name: "Meera Joshi", attendance: 88, subjects: [
            { name: "Mathematics", mark: 72 }, { name: "Physics", mark: 76 }, { name: "Chemistry", mark: 79 },
            { name: "Computer Science", mark: 75 }, { name: "English", mark: 73 }
        ]},
        { roll: "CS2026-107", name: "Pooja Iyer", attendance: 79, subjects: [
            { name: "Mathematics", mark: 61 }, { name: "Physics", mark: 58 }, { name: "Chemistry", mark: 66 },
            { name: "Computer Science", mark: 64 }, { name: "English", mark: 59 }
        ]},
        { roll: "CS2026-108", name: "Arjun Das", attendance: 72, subjects: [
            { name: "Mathematics", mark: 54 }, { name: "Physics", mark: 49 }, { name: "Chemistry", mark: 57 },
            { name: "Computer Science", mark: 62 }, { name: "English", mark: 51 }
        ]},
        { roll: "CS2026-109", name: "Karthik Rao", attendance: 68, subjects: [
            { name: "Mathematics", mark: 42 }, { name: "Physics", mark: 32 }, { name: "Chemistry", mark: 52 },
            { name: "Computer Science", mark: 48 }, { name: "English", mark: 44 }
        ]},
        { roll: "CS2026-110", name: "Vikram Singh", attendance: 62, subjects: [
            { name: "Mathematics", mark: 31 }, { name: "Physics", mark: 41 }, { name: "Chemistry", mark: 46 },
            { name: "Computer Science", mark: 33 }, { name: "English", mark: 38 }
        ]}
    ];

    let classStudents = loadClassStudents();

    // Attach remove event listener to existing and future subject rows
    subjectList.addEventListener("click", (e) => {
        if (e.target.classList.contains("btn-remove")) {
            const rows = subjectList.querySelectorAll(".subject-row");
            if (rows.length <= 1) {
                showError("You must have at least one subject.");
                return;
            }
            e.target.closest(".subject-row").remove();
            clearError();
        }
    });

        const actionCell = document.createElement("td");

        const viewButton = document.createElement("button");
        viewButton.textContent = "View";
        viewButton.className = "view-btn";
        viewButton.onclick = () => viewStudent(student.id);

        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.className = "edit-btn";
        editButton.onclick = () => editStudent(student.id);

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-btn";
        deleteButton.onclick = () => deleteStudent(student.id);

        actionCell.appendChild(viewButton);
        actionCell.appendChild(editButton);
        actionCell.appendChild(deleteButton);

        row.appendChild(actionCell);
        studentTable.appendChild(row);
    });
}

studentForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const editId = document.getElementById("editId").value;
    const student = {
        id: document.getElementById("studentId").value.trim(),
        name: document.getElementById("studentName").value.trim(),
        email: document.getElementById("email").value.trim(),
        department: document.getElementById("department").value,
        year: document.getElementById("year").value,
        phone: document.getElementById("phone").value.trim()
    };

    if (!student.id || !student.name || !student.email || !student.department || !student.year || !student.phone) {
        alert("Please fill in all student details.");
        return;
    }

    function evaluateForm() {
        clearError();

    if (duplicate) {
        alert("Student ID already exists!");
        return;
    }

        // 1. Validate attendance percentage
        const attendanceValStr = attendanceInput.value.trim();
        if (attendanceValStr === "") {
            showError("Please enter the attendance percentage.");
            attendanceInput.focus();
            return null;
        }
    } else {
        students.push(student);
        alert("Student added successfully!");
    }

        const attendance = parseFloat(attendanceValStr);
        if (isNaN(attendance) || attendance < 0 || attendance > 100) {
            showError("Attendance percentage must be a valid number between 0 and 100.");
            attendanceInput.focus();
            return null;
        }

        // 2. Validate subjects & marks
        const subjectRows = subjectList.querySelectorAll(".subject-row");
        if (subjectRows.length === 0) {
            showError("Please add at least one subject.");
            return null;
        }

        const subjects = [];
        let totalMarks = 0;
        const failedSubjects = [];

        for (let i = 0; i < subjectRows.length; i++) {
            const row = subjectRows[i];
            const nameInput = row.querySelector(".subject-name");
            const markInput = row.querySelector(".subject-mark");

            const name = nameInput.value.trim() || `Subject ${i + 1}`;
            const markStr = markInput.value.trim();

            if (markStr === "") {
                showError(`Please enter marks for "${name}".`);
                markInput.focus();
                return null;
            }

            const mark = parseFloat(markStr);
            if (isNaN(mark) || mark < 0 || mark > 100) {
                showError(`Marks for "${name}" must be between 0 and 100.`);
                markInput.focus();
                return null;
            }

            const isSubjectPassed = mark >= MIN_SUBJECT_PASS_MARK;
            if (!isSubjectPassed) {
                failedSubjects.push({ name, mark });
            }

            totalMarks += mark;
            subjects.push({ name, mark, isPassed: isSubjectPassed });
        }

    document.getElementById("editId").value = student.id;
    document.getElementById("studentId").value = student.id;
    document.getElementById("studentName").value = student.name;
    document.getElementById("email").value = student.email;
    document.getElementById("department").value = student.department;
    document.getElementById("year").value = student.year;
    document.getElementById("phone").value = student.phone;

        return {
            studentName,
            rollNumber,
            subjects,
            totalMarks,
            maxTotalMarks,
            averageMarks,
            attendance,
            isOverallPass,
            failedSubjects,
            attendanceShortage,
            averageFail,
            grade
        };
    }

    // Calculate & Evaluate performance
    calculateBtn.addEventListener("click", () => {
        const result = evaluateForm();
        if (result) {
            displayResults(result);
        }
    });

    // Save current student from Module 3 form into Class Performance Analysis
    saveToClassBtn.addEventListener("click", () => {
        const result = evaluateForm();
        if (!result) return;

        if (!result.studentName) {
            showError("Please enter Student Name before saving to Class Analysis.");
            document.getElementById("studentName").focus();
            return;
        }

        const roll = result.rollNumber || `ID-${Date.now().toString().slice(-4)}`;
        const record = {
            roll,
            name: result.studentName,
            attendance: result.attendance,
            subjects: result.subjects.map((sub) => ({ name: sub.name, mark: sub.mark }))
        };

        const existingIdx = classStudents.findIndex(
            (st) => st.roll.toLowerCase() === roll.toLowerCase()
        );
        if (existingIdx >= 0) {
            classStudents[existingIdx] = record;
        } else {
            classStudents.push(record);
        }

        saveClassStudents();
        displayResults(result);
        renderClassAnalysis();
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
}

function deleteStudent(id) {
    const confirmDelete = confirm("Are you sure you want to delete this student?");

    if (!confirmDelete) return;

    students = students.filter((item) => item.id !== id);
    saveStudents();
    displayStudents();

    if (document.getElementById("editId").value === id) {
        resetForm();
    }

    closeStudentModal();
    alert("Student deleted successfully!");
}

searchInput.addEventListener("input", function () {
    const searchValue = this.value.toLowerCase().trim();

    const filteredStudents = students.filter((student) =>
        student.name.toLowerCase().includes(searchValue) ||
        student.id.toLowerCase().includes(searchValue)
    );

    displayStudents(filteredStudents);
});

function resetForm() {
    studentForm.reset();
    document.getElementById("editId").value = "";
    document.getElementById("formTitle").textContent = "Add New Student";
    document.getElementById("submitBtn").textContent = "Add Student";
}

closeModalBtn.addEventListener("click", closeStudentModal);
studentModal.addEventListener("click", function (event) {
    if (event.target === studentModal) {
        closeStudentModal();
    }

    // --- Class Performance Analysis ---
    function loadClassStudents() {
        try {
            const raw = localStorage.getItem(CLASS_STORAGE_KEY);
            if (raw) {
                const parsed = JSON.parse(raw);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    return parsed;
                }
            }
        } catch {
            // Fall back to default sample data if localStorage is unavailable.
        }
        return DEFAULT_CLASS_STUDENTS.map((st) => ({
            ...st,
            subjects: st.subjects.map((sub) => ({ ...sub }))
        }));
    }

    function saveClassStudents() {
        try {
            localStorage.setItem(CLASS_STORAGE_KEY, JSON.stringify(classStudents));
        } catch {
            // Ignore storage quota / restriction errors.
        }
    }

    function categorizeStudent(average) {
        if (average >= 85) return "Excellent";
        if (average >= 70) return "Good";
        if (average >= 50) return "Average";
        return "Poor";
    }

    function createEl(tag, className, text) {
        const el = document.createElement(tag);
        if (className) el.className = className;
        if (text !== undefined) el.textContent = text;
        return el;
    }

    function getRankedClassStudents() {
        return classStudents
            .map((st) => {
                const count = st.subjects.length || 1;
                const total = st.subjects.reduce((sum, sub) => sum + Number(sub.mark || 0), 0);
                const average = total / count;
                const weakSubjects = st.subjects
                    .filter((sub) => Number(sub.mark) < MIN_SUBJECT_PASS_MARK)
                    .map((sub) => `${sub.name} (${sub.mark})`);
                return {
                    ...st,
                    total,
                    maxMarks: count * 100,
                    average,
                    weakSubjects,
                    category: categorizeStudent(average)
                };
            })
            .sort((a, b) => b.average - a.average || b.attendance - a.attendance)
            .map((st, idx) => ({ ...st, rank: idx + 1 }));
    }

    function renderClassKPIs(ranked) {
        const totalEl = document.getElementById("classTotalStudents");
        const avgSubEl = document.getElementById("classAvgSub");
        const topperNameEl = document.getElementById("classTopperName");
        const topperMetaEl = document.getElementById("classTopperMeta");
        const lowCountEl = document.getElementById("classLowCount");
        const lowMetaEl = document.getElementById("classLowMeta");
        const avgAttEl = document.getElementById("classAvgAttendance");
        const lowAttMetaEl = document.getElementById("classLowAttMeta");

        totalEl.textContent = String(ranked.length);

        if (ranked.length === 0) {
            avgSubEl.textContent = "Class Avg: 0%";
            topperNameEl.textContent = "-";
            topperMetaEl.textContent = "No students";
            lowCountEl.textContent = "0";
            lowMetaEl.textContent = "No students";
            avgAttEl.textContent = "0%";
            lowAttMetaEl.textContent = "0 below 75%";
            return;
        }

        const classAvg = ranked.reduce((s, st) => s + st.average, 0) / ranked.length;
        const topper = ranked[0];
        const lowPerformers = ranked.filter(
            (st) => st.category === "Poor" || st.weakSubjects.length > 0
        );
        const avgAtt = ranked.reduce((s, st) => s + st.attendance, 0) / ranked.length;
        const lowAttCount = ranked.filter((st) => st.attendance < MIN_ATTENDANCE_PERCENT).length;

        avgSubEl.textContent = `Class Avg: ${classAvg.toFixed(1)}%`;
        topperNameEl.textContent = topper.name;
        topperMetaEl.textContent = `${topper.average.toFixed(1)}% (${topper.total}/${topper.maxMarks})`;
        lowCountEl.textContent = String(lowPerformers.length);
        lowMetaEl.textContent = `Avg < 50% or subject < ${MIN_SUBJECT_PASS_MARK}`;
        avgAttEl.textContent = `${avgAtt.toFixed(1)}%`;
        lowAttMetaEl.textContent = `${lowAttCount} student(s) below ${MIN_ATTENDANCE_PERCENT}%`;
    }

    function renderCategoryBreakdown(ranked) {
        const gridEl = document.getElementById("categoryBreakdownGrid");
        const barEl = document.getElementById("categoryStackedBar");
        gridEl.replaceChildren();
        barEl.replaceChildren();

        const categories = ["Excellent", "Good", "Average", "Poor"];
        const total = ranked.length || 1;

        categories.forEach((cat) => {
            const count = ranked.filter((st) => st.category === cat).length;
            const pct = ((count / total) * 100).toFixed(0);

            const box = createEl("div", "category-box");
            const left = createEl("div");
            left.append(
                createEl("span", `badge-tag badge-${cat.toLowerCase()}`, cat),
                createEl("div", "highlight-meta", `${pct}% of class`)
            );
            box.append(left, createEl("strong", "", String(count)));
            gridEl.appendChild(box);

            if (count > 0) {
                const seg = createEl("div", `stacked-segment seg-${cat.toLowerCase()}`);
                seg.style.width = `${(count / total) * 100}%`;
                seg.title = `${cat}: ${count} (${pct}%)`;
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
            toppersEl.appendChild(createEl("p", "empty-note", "No student records available."));
            lowEl.appendChild(createEl("p", "empty-note", "No student records available."));
            return;
        }

        ranked.slice(0, 3).forEach((st) => {
            const item = createEl("div", "highlight-item");
            const left = createEl("div");
            left.append(
                createEl("div", "highlight-title", `#${st.rank} ${st.name} (${st.roll})`),
                createEl("div", "highlight-meta", `Avg: ${st.average.toFixed(1)}% | Attendance: ${st.attendance}%`)
            );
            item.append(left, createEl("span", `badge-tag badge-${st.category.toLowerCase()}`, st.category));
            toppersEl.appendChild(item);
        });

        const lowPerformers = ranked.filter(
            (st) => st.category === "Poor" || st.weakSubjects.length > 0
        );
        if (lowPerformers.length === 0) {
            lowEl.appendChild(createEl("p", "empty-note", "No low-performing students found."));
            return;
        }

        lowPerformers.forEach((st) => {
            const item = createEl("div", "highlight-item");
            const left = createEl("div");
            const issue = st.weakSubjects.length > 0
                ? `Weak: ${st.weakSubjects.join(", ")}`
                : "Average below 50%";
            left.append(
                createEl("div", "highlight-title", `${st.name} (${st.roll})`),
                createEl("div", "highlight-meta", `Avg: ${st.average.toFixed(1)}% | Att: ${st.attendance}% | ${issue}`)
            );
            item.append(left, createEl("span", `badge-tag badge-${st.category.toLowerCase()}`, st.category));
            lowEl.appendChild(item);
        });
    }

    function renderSubjectComparison(ranked) {
        const barsEl = document.getElementById("subjectComparisonBars");
        const tbody = document.getElementById("subjectComparisonBody");
        barsEl.replaceChildren();
        tbody.replaceChildren();

        if (ranked.length === 0) {
            barsEl.appendChild(createEl("p", "empty-note", "No subject data available."));
            return;
        }

        const subjectMap = new Map();
        ranked.forEach((st) => {
            st.subjects.forEach((sub) => {
                if (!subjectMap.has(sub.name)) {
                    subjectMap.set(sub.name, []);
                }
                subjectMap.get(sub.name).push({ student: st.name, mark: Number(sub.mark) });
            });
        });

        subjectMap.forEach((entries, subjectName) => {
            const avg = entries.reduce((s, e) => s + e.mark, 0) / entries.length;
            const max = Math.max(...entries.map((e) => e.mark));
            const min = Math.min(...entries.map((e) => e.mark));
            const toppers = entries.filter((e) => e.mark === max).map((e) => e.student).join(", ");
            const passCount = entries.filter((e) => e.mark >= MIN_SUBJECT_PASS_MARK).length;
            const passRate = (passCount / entries.length) * 100;

            const row = createEl("div", "bar-row");
            const head = createEl("div", "bar-row-head");
            head.append(
                createEl("span", "", subjectName),
                createEl("span", "", `Avg ${avg.toFixed(1)}% (High ${max} / Low ${min})`)
            );
            const track = createEl("div", "bar-track");
            const fill = createEl("div", `bar-fill ${avg < 50 ? "bar-fill-warn" : ""}`);
            fill.style.width = `${Math.min(100, Math.max(0, avg))}%`;
            track.appendChild(fill);
            row.append(head, track);
            barsEl.appendChild(row);

            const tr = document.createElement("tr");
            tr.append(
                createEl("td", "", subjectName),
                createEl("td", "", `${avg.toFixed(1)}%`),
                createEl("td", "", `${max} (${toppers})`),
                createEl("td", "", String(min)),
                createEl("td", "", `${passRate.toFixed(0)}%`)
            );
            tbody.appendChild(tr);
        });
    }

    function renderAttendanceAnalysis(ranked) {
        const insightsEl = document.getElementById("attendanceInsightsGrid");
        const listEl = document.getElementById("attendanceBarList");
        insightsEl.replaceChildren();
        listEl.replaceChildren();

        if (ranked.length === 0) {
            listEl.appendChild(createEl("p", "empty-note", "No attendance data available."));
            return;
        }

        const regular = ranked.filter((st) => st.attendance >= MIN_ATTENDANCE_PERCENT);
        const low = ranked.filter((st) => st.attendance < MIN_ATTENDANCE_PERCENT);
        const avgRegular = regular.length
            ? `${(regular.reduce((s, st) => s + st.average, 0) / regular.length).toFixed(1)}%`
            : "N/A";
        const avgLow = low.length
            ? `${(low.reduce((s, st) => s + st.average, 0) / low.length).toFixed(1)}%`
            : "N/A";

        [
            { label: `>= ${MIN_ATTENDANCE_PERCENT}% Attendance`, value: `${regular.length} student(s)` },
            { label: `< ${MIN_ATTENDANCE_PERCENT}% Attendance`, value: `${low.length} student(s)` },
            { label: "Avg Marks (Regular)", value: avgRegular },
            { label: "Avg Marks (Low Att.)", value: avgLow }
        ].forEach((item) => {
            const card = createEl("div", "insight-card");
            card.append(createEl("span", "", item.label), createEl("strong", "", item.value));
            insightsEl.appendChild(card);
        });

        [...ranked]
            .sort((a, b) => a.attendance - b.attendance)
            .forEach((st) => {
                const row = createEl("div", "bar-row");
                const head = createEl("div", "bar-row-head");
                const tag = st.attendance < MIN_ATTENDANCE_PERCENT ? "Shortage" : "Regular";
                head.append(
                    createEl("span", "", `${st.name} (Avg ${st.average.toFixed(1)}%)`),
                    createEl("span", "", `${st.attendance}% (${tag})`)
                );
                const track = createEl("div", "bar-track");
                const fill = createEl(
                    "div",
                    `bar-fill ${st.attendance < MIN_ATTENDANCE_PERCENT ? "bar-fill-warn" : "bar-fill-good"}`
                );
                fill.style.width = `${Math.min(100, Math.max(0, st.attendance))}%`;
                track.appendChild(fill);
                row.append(head, track);
                listEl.appendChild(row);
            });
    }

    function renderClassStudentsTable(ranked) {
        const tbody = document.getElementById("classStudentsBody");
        const query = studentSearchInput.value.trim().toLowerCase();
        const catFilter = categoryFilterSelect.value;
        tbody.replaceChildren();

        const filtered = ranked.filter((st) => {
            const matchesText =
                st.name.toLowerCase().includes(query) || st.roll.toLowerCase().includes(query);
            const matchesCat = catFilter === "All" || st.category === catFilter;
            return matchesText && matchesCat;
        });

        if (filtered.length === 0) {
            const tr = document.createElement("tr");
            const td = createEl("td", "empty-note", "No matching students found.");
            td.colSpan = 8;
            tr.appendChild(td);
            tbody.appendChild(tr);
            return;
        }

        filtered.forEach((st) => {
            const tr = document.createElement("tr");
            tr.append(
                createEl("td", "", `#${st.rank}`),
                createEl("td", "", st.roll),
                createEl("td", "", st.name),
                createEl("td", "", `${st.average.toFixed(1)}%`),
                createEl("td", st.attendance < MIN_ATTENDANCE_PERCENT ? "text-warn" : "", `${st.attendance}%`),
                createEl("td", "", st.weakSubjects.length > 0 ? st.weakSubjects.join(", ") : "None")
            );

            const catTd = document.createElement("td");
            catTd.appendChild(createEl("span", `badge-tag badge-${st.category.toLowerCase()}`, st.category));
            tr.appendChild(catTd);

            const actionTd = document.createElement("td");
            const delBtn = createEl("button", "btn-delete-row", "Remove");
            delBtn.type = "button";
            delBtn.addEventListener("click", () => {
                classStudents = classStudents.filter((item) => item.roll !== st.roll);
                saveClassStudents();
                renderClassAnalysis();
            });
            actionTd.appendChild(delBtn);
            tr.appendChild(actionTd);

            tbody.appendChild(tr);
        });
    }

    function renderClassAnalysis() {
        const ranked = getRankedClassStudents();
        renderClassKPIs(ranked);
        renderCategoryBreakdown(ranked);
        renderToppersAndLowPerformers(ranked);
        renderSubjectComparison(ranked);
        renderAttendanceAnalysis(ranked);
        renderClassStudentsTable(ranked);
    }

    studentSearchInput.addEventListener("input", renderClassAnalysis);
    categoryFilterSelect.addEventListener("change", renderClassAnalysis);
    resetClassBtn.addEventListener("click", () => {
        classStudents = DEFAULT_CLASS_STUDENTS.map((st) => ({
            ...st,
            subjects: st.subjects.map((sub) => ({ ...sub }))
        }));
        saveClassStudents();
        renderClassAnalysis();
    });

    renderClassAnalysis();
});

displayStudents();
