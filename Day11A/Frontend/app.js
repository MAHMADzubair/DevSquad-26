const API = "http://localhost:3000";

let token = "";

/* ===== Toast Notifications ===== */
function showToast(message, type = "info") {
  const container = document.getElementById("toast-container");
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;

  const icons = {
    success: "fa-circle-check",
    error: "fa-circle-xmark",
    info: "fa-circle-info",
  };

  toast.innerHTML = `
    <i class="fa-solid ${icons[type] || icons.info}"></i>
    <span class="toast-msg">${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("removing");
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

/* ===== Tab Switching ===== */
function switchTab(tab) {
  document
    .querySelectorAll(".tab")
    .forEach((t) => t.classList.remove("active"));
  document
    .querySelectorAll(".form-container")
    .forEach((f) => f.classList.remove("active"));

  if (tab === "login") {
    document.querySelectorAll(".tab")[0].classList.add("active");
    document.getElementById("login-form").classList.add("active");
  } else {
    document.querySelectorAll(".tab")[1].classList.add("active");
    document.getElementById("register-form").classList.add("active");
  }
}

/* ===== Section Switching ===== */
function showSection(sectionId) {
  document.querySelectorAll(".section").forEach((s) => {
    s.classList.remove("active");
  });
  const target = document.getElementById(sectionId);
  // Small delay for smooth animation
  setTimeout(() => {
    target.classList.add("active");
  }, 50);
}

/* ===== REGISTER ===== */
async function register() {
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!name || !email || !password) {
    showToast("Please fill in all fields", "error");
    return;
  }

  try {
    const res = await fetch(`${API}/api/users/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      showToast(data.message || "Registration failed", "error");
      return;
    }

    showToast("Account created successfully!", "success");
    // Clear fields
    document.getElementById("name").value = "";
    document.getElementById("email").value = "";
    document.getElementById("password").value = "";
    // Switch to login tab
    switchTab("login");
  } catch (err) {
    showToast("Network error. Is the server running?", "error");
  }
}

/* ===== LOGIN ===== */
async function login() {
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value.trim();

  if (!email || !password) {
    showToast("Please fill in all fields", "error");
    return;
  }

  try {
    const res = await fetch(`${API}/api/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      showToast(data.message || "Login failed", "error");
      return;
    }

    token = data.token;
    showToast("Welcome back! 🎉", "success");

    // Clear fields
    document.getElementById("loginEmail").value = "";
    document.getElementById("loginPassword").value = "";

    // Switch to dashboard
    showSection("dashboard-section");
    getTasks();
  } catch (err) {
    showToast("Network error. Is the server running?", "error");
  }
}

/* ===== LOGOUT ===== */
function logout() {
  token = "";
  showToast("Logged out successfully", "info");
  showSection("auth-section");
}

/* ===== CREATE TASK ===== */
async function createTask() {
  const titleInput = document.getElementById("taskTitle");
  const title = titleInput.value.trim();

  if (!title) {
    showToast("Task title cannot be empty", "error");
    return;
  }

  try {
    const res = await fetch(`${API}/api/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title }),
    });

    if (!res.ok) {
      const data = await res.json();
      showToast(data.message || "Failed to create task", "error");
      return;
    }

    titleInput.value = "";
    showToast("Task added!", "success");
    getTasks();
  } catch (err) {
    showToast("Network error", "error");
  }
}

/* ===== Handle Enter Key for Task ===== */
function handleTaskKeyPress(event) {
  if (event.key === "Enter") {
    createTask();
  }
}

/* ===== GET TASKS ===== */
async function getTasks() {
  try {
    const res = await fetch(`${API}/api/tasks`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const tasks = await res.json();
    const list = document.getElementById("taskList");
    const countBadge = document.getElementById("task-count");

    countBadge.textContent = tasks.length || 0;

    if (!tasks.length) {
      list.innerHTML = `
        <div class="empty-state">
          <i class="fa-regular fa-clipboard"></i>
          <p>No tasks yet</p>
          <span>Add a task above to get started</span>
        </div>
      `;
      return;
    }

    list.innerHTML = "";

    tasks.forEach((task, index) => {
      const li = document.createElement("li");
      li.style.animationDelay = `${index * 0.05}s`;

      li.innerHTML = `
        <div class="task-info">
          <div class="task-icon">
            <i class="fa-solid fa-check"></i>
          </div>
          <span class="task-title">${task.title}</span>
        </div>
        <button class="delete-btn" onclick="deleteTask('${task._id}')" title="Delete task">
          <i class="fa-solid fa-trash-can"></i>
        </button>
      `;

      list.appendChild(li);
    });
  } catch (err) {
    showToast("Failed to load tasks", "error");
  }
}

/* ===== DELETE TASK ===== */
async function deleteTask(id) {
  try {
    await fetch(`${API}/api/tasks/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    showToast("Task deleted", "info");
    getTasks();
  } catch (err) {
    showToast("Failed to delete task", "error");
  }
}
