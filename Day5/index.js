const notifications = document.querySelectorAll(".notification");
const unreadCount = document.getElementById("unread-count");
const markAllBtn = document.getElementById("mark-all");

function updateUnreadCount() {
  const unread = document.querySelectorAll(".notification.unread").length;
  unreadCount.textContent = unread;
}

notifications.forEach((notification) => {
  notification.addEventListener("click", () => {
    if (notification.classList.contains("unread")) {
      notification.classList.remove("unread");
      notification.classList.remove("bg-blue-50");
      notification.classList.add("bg-white");

      const dot = notification.querySelector(".red-dot");
      if (dot) dot.remove();

      updateUnreadCount();
    }
  });
});

markAllBtn.addEventListener("click", () => {
  notifications.forEach((notification) => {
    notification.classList.remove("unread");
    notification.classList.remove("bg-blue-50");
    notification.classList.add("bg-white");

    const dot = notification.querySelector(".red-dot");
    if (dot) dot.remove();
  });

  updateUnreadCount();
});

updateUnreadCount();
