const studentForm = document.getElementById("studentForm");
const studentTable = document.getElementById("studentTable");
const searchInput = document.getElementById("searchInput");
const studentModal = document.getElementById("studentModal");
const closeModalBtn = document.getElementById("closeModalBtn");

let students = JSON.parse(localStorage.getItem("students")) || [];

function saveStudents() {
    localStorage.setItem("students", JSON.stringify(students));
}

function closeStudentModal() {
    studentModal.classList.add("hidden");
    studentModal.setAttribute("aria-hidden", "true");
}

function viewStudent(id) {
    const student = students.find((item) => item.id === id);

    if (!student) return;

    document.getElementById("modalStudentId").textContent = student.id;
    document.getElementById("modalStudentName").textContent = student.name;
    document.getElementById("modalStudentEmail").textContent = student.email;
    document.getElementById("modalStudentDepartment").textContent = student.department;
    document.getElementById("modalStudentYear").textContent = student.year;
    document.getElementById("modalStudentPhone").textContent = student.phone;

    studentModal.classList.remove("hidden");
    studentModal.setAttribute("aria-hidden", "false");
}

function displayStudents(data = students) {
    studentTable.innerHTML = "";

    document.getElementById("noData").style.display = data.length === 0 ? "block" : "none";

    data.forEach((student, index) => {
        const row = document.createElement("tr");

        const values = [
            index + 1,
            student.id,
            student.name,
            student.email,
            student.department,
            student.year,
            student.phone
        ];

        values.forEach((value) => {
            const td = document.createElement("td");
            td.textContent = value;
            row.appendChild(td);
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

    const duplicate = students.some(
        (item) => item.id.toLowerCase() === student.id.toLowerCase() && item.id !== editId
    );

    if (duplicate) {
        alert("Student ID already exists!");
        return;
    }

    if (editId) {
        const index = students.findIndex((item) => item.id === editId);
        if (index !== -1) {
            students[index] = student;
            alert("Student updated successfully!");
        }
    } else {
        students.push(student);
        alert("Student added successfully!");
    }

    saveStudents();
    displayStudents();
    resetForm();
});

function editStudent(id) {
    const student = students.find((item) => item.id === id);

    if (!student) return;

    document.getElementById("editId").value = student.id;
    document.getElementById("studentId").value = student.id;
    document.getElementById("studentName").value = student.name;
    document.getElementById("email").value = student.email;
    document.getElementById("department").value = student.department;
    document.getElementById("year").value = student.year;
    document.getElementById("phone").value = student.phone;

    document.getElementById("formTitle").textContent = "Edit Student Details";
    document.getElementById("submitBtn").textContent = "Update Student";

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
});

displayStudents();
