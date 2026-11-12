// Module 3: Marks and Attendance Analysis
document.addEventListener("DOMContentLoaded", () => {
    const subjectList = document.getElementById("subjectList");
    const addSubjectBtn = document.getElementById("addSubjectBtn");
    const calculateBtn = document.getElementById("calculateBtn");
    const resetBtn = document.getElementById("resetBtn");
    const attendanceInput = document.getElementById("attendanceInput");
    const errorBanner = document.getElementById("errorBanner");
    const resultsSection = document.getElementById("resultsSection");

    // Evaluation constants
    const MIN_SUBJECT_PASS_MARK = 35;
    const MIN_ATTENDANCE_PERCENT = 75;
    const MIN_OVERALL_AVERAGE_PASS = 40;

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

    // Add new subject row
    addSubjectBtn.addEventListener("click", () => {
        const row = document.createElement("div");
        row.className = "subject-row";
        row.innerHTML = `
            <input type="text" class="subject-name" placeholder="Subject Name" required>
            <input type="number" class="subject-mark" placeholder="Marks (0-100)" min="0" max="100" required>
            <button type="button" class="btn-remove" title="Remove Subject" aria-label="Remove subject">&times;</button>
        `;
        subjectList.appendChild(row);
        row.querySelector(".subject-name").focus();
    });

    // Reset button
    resetBtn.addEventListener("click", () => {
        document.getElementById("studentName").value = "";
        document.getElementById("rollNumber").value = "";
        attendanceInput.value = "";
        
        // Reset subject list to standard 5
        subjectList.innerHTML = `
            <div class="subject-row">
                <input type="text" class="subject-name" value="Mathematics" placeholder="Subject Name" required>
                <input type="number" class="subject-mark" placeholder="Marks (0-100)" min="0" max="100" required>
                <button type="button" class="btn-remove" title="Remove Subject" aria-label="Remove subject">&times;</button>
            </div>
            <div class="subject-row">
                <input type="text" class="subject-name" value="Physics" placeholder="Subject Name" required>
                <input type="number" class="subject-mark" placeholder="Marks (0-100)" min="0" max="100" required>
                <button type="button" class="btn-remove" title="Remove Subject" aria-label="Remove subject">&times;</button>
            </div>
            <div class="subject-row">
                <input type="text" class="subject-name" value="Chemistry" placeholder="Subject Name" required>
                <input type="number" class="subject-mark" placeholder="Marks (0-100)" min="0" max="100" required>
                <button type="button" class="btn-remove" title="Remove Subject" aria-label="Remove subject">&times;</button>
            </div>
            <div class="subject-row">
                <input type="text" class="subject-name" value="Computer Science" placeholder="Subject Name" required>
                <input type="number" class="subject-mark" placeholder="Marks (0-100)" min="0" max="100" required>
                <button type="button" class="btn-remove" title="Remove Subject" aria-label="Remove subject">&times;</button>
            </div>
            <div class="subject-row">
                <input type="text" class="subject-name" value="English" placeholder="Subject Name" required>
                <input type="number" class="subject-mark" placeholder="Marks (0-100)" min="0" max="100" required>
                <button type="button" class="btn-remove" title="Remove Subject" aria-label="Remove subject">&times;</button>
            </div>
        `;
        clearError();
        resultsSection.style.display = "none";
    });

    // Calculate & Evaluate performance
    calculateBtn.addEventListener("click", () => {
        clearError();

        const studentName = document.getElementById("studentName").value.trim();
        const rollNumber = document.getElementById("rollNumber").value.trim();

        // 1. Validate attendance percentage
        const attendanceValStr = attendanceInput.value.trim();
        if (attendanceValStr === "") {
            showError("Please enter the attendance percentage.");
            attendanceInput.focus();
            return;
        }

        const attendance = parseFloat(attendanceValStr);
        if (isNaN(attendance) || attendance < 0 || attendance > 100) {
            showError("Attendance percentage must be a valid number between 0 and 100.");
            attendanceInput.focus();
            return;
        }

        // 2. Validate subjects & marks
        const subjectRows = subjectList.querySelectorAll(".subject-row");
        if (subjectRows.length === 0) {
            showError("Please add at least one subject.");
            return;
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
                return;
            }

            const mark = parseFloat(markStr);
            if (isNaN(mark) || mark < 0 || mark > 100) {
                showError(`Marks for "${name}" must be between 0 and 100.`);
                markInput.focus();
                return;
            }

            const isSubjectPassed = mark >= MIN_SUBJECT_PASS_MARK;
            if (!isSubjectPassed) {
                failedSubjects.push({ name, mark });
            }

            totalMarks += mark;
            subjects.push({ name, mark, isPassed: isSubjectPassed });
        }

        // 3. Calculate metrics
        const subjectCount = subjects.length;
        const maxTotalMarks = subjectCount * 100;
        const averageMarks = totalMarks / subjectCount;

        // 4. Pass / Fail Evaluation
        const attendanceShortage = attendance < MIN_ATTENDANCE_PERCENT;
        const averageFail = averageMarks < MIN_OVERALL_AVERAGE_PASS;
        const isOverallPass = (failedSubjects.length === 0) && !attendanceShortage && !averageFail;

        // Grade calculation
        let grade = "F";
        if (isOverallPass) {
            if (averageMarks >= 85) grade = "A+ (Distinction)";
            else if (averageMarks >= 70) grade = "A (First Class)";
            else if (averageMarks >= 55) grade = "B (Second Class)";
            else grade = "C (Pass Class)";
        } else {
            grade = "F (Fail)";
        }

        // 5. Render Results
        displayResults({
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
        });
    });

    function displayResults(data) {
        // Display student info if provided
        const studentDisplay = document.getElementById("studentDisplayName");
        if (data.studentName || data.rollNumber) {
            const parts = [];
            if (data.studentName) parts.push(data.studentName);
            if (data.rollNumber) parts.push(`(${data.rollNumber})`);
            studentDisplay.textContent = parts.join(" ");
        } else {
            studentDisplay.textContent = "";
        }

        // Status banner
        const statusBanner = document.getElementById("statusBanner");
        const statusIcon = document.getElementById("statusIcon");
        const statusTitle = document.getElementById("statusTitle");
        const statusReason = document.getElementById("statusReason");

        if (data.isOverallPass) {
            statusBanner.className = "status-banner pass";
            statusIcon.textContent = "✓";
            statusTitle.textContent = "PASSED";
            statusReason.textContent = "Congratulations! Met all academic marks and attendance requirements.";
        } else {
            statusBanner.className = "status-banner fail";
            statusIcon.textContent = "✕";
            statusTitle.textContent = "FAILED";

            const reasons = [];
            if (data.failedSubjects.length > 0) {
                const subNames = data.failedSubjects.map(s => `${s.name} (${s.mark})`).join(", ");
                reasons.push(`Scored below ${MIN_SUBJECT_PASS_MARK} in: ${subNames}`);
            }
            if (data.averageFail) {
                reasons.push(`Overall average (${data.averageMarks.toFixed(1)}%) is below ${MIN_OVERALL_AVERAGE_PASS}%`);
            }
            if (data.attendanceShortage) {
                reasons.push(`Attendance (${data.attendance.toFixed(1)}%) is below required ${MIN_ATTENDANCE_PERCENT}%`);
            }
            statusReason.textContent = reasons.join(" • ");
        }

        // Metric values
        document.getElementById("totalMarksVal").textContent = `${data.totalMarks.toFixed(1).replace(/\.0$/, "")} / ${data.maxTotalMarks}`;
        document.getElementById("averageMarksVal").textContent = `${data.averageMarks.toFixed(2)}%`;
        document.getElementById("gradeVal").textContent = data.grade;

        const attendanceVal = document.getElementById("attendanceVal");
        attendanceVal.textContent = `${data.attendance.toFixed(1)}%`;
        if (data.attendanceShortage) {
            attendanceVal.style.color = "var(--danger)";
        } else {
            attendanceVal.style.color = "var(--success)";
        }

        // Table breakdown
        const tbody = document.getElementById("breakdownTableBody");
        tbody.innerHTML = "";
        data.subjects.forEach(sub => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td><strong>${escapeHtml(sub.name)}</strong></td>
                <td>${sub.mark}</td>
                <td>100</td>
                <td>
                    <span class="badge-tag ${sub.isPassed ? "badge-pass" : "badge-fail"}">
                        ${sub.isPassed ? "PASS" : "FAIL"}
                    </span>
                </td>
            `;
            tbody.appendChild(tr);
        });

        // Show section and scroll smoothly into view
        resultsSection.style.display = "block";
        resultsSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    function showError(msg) {
        errorBanner.textContent = msg;
        errorBanner.style.display = "block";
    }

    function clearError() {
        errorBanner.textContent = "";
        errorBanner.style.display = "none";
    }

    function escapeHtml(str) {
        const div = document.createElement("div");
        div.textContent = str;
        return div.innerHTML;
    }
});
