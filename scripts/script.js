// Responsive menu (optional: you can add a hamburger if desired)
document.addEventListener("DOMContentLoaded", () => {
  // Copyright year
  document.getElementById("year").textContent = new Date().getFullYear();

  // Last modified
  document.getElementById("lastModified").textContent =
    "Last Update: " + document.lastModified;

  // Course List Array
  const courses = [
    { code: "CSE 110", name: "Intro to Programming", credits: 2, completed: true },
    { code: "WDD 130", name: "Web Fundamentals", credits: 2, completed: true },
    { code: "CSE 111", name: "Programming with Functions", credits: 2, completed: true },
    { code: "CSE 210", name: "Programming with Classes", credits: 2, completed: true },
    { code: "WDD 131", name: "Dynamic Web Fundamentals", credits: 2, completed: true },
    { code: "WDD 231", name: "Frontend Development I", credits: 2, completed: false },
  ];

  const courseContainer = document.querySelector(".courses");
  const filterButtons = document.querySelectorAll(".filters button");

  function renderCourses(courseList) {
    courseContainer.innerHTML = ""; // Clear container

    let totalCredits = courseList.reduce((sum, course) => sum + course.credits, 0);

    courseList.forEach((course) => {
      const div = document.createElement("div");
      div.classList.add("course");

      // Add course type class
      if (course.code.startsWith("WDD")) {
        div.classList.add("wdd");
      } else if (course.code.startsWith("CSE")) {
        div.classList.add("cse");
      }

      // Completed styling
      if (course.completed) {
        div.style.border = "3px solid #333";
        div.style.backgroundColor = "#333";
      }

      div.textContent = `${course.code} - ${course.name}`;
      courseContainer.appendChild(div);
    });

    // Show total credits (optional element to insert this)
    let creditTotal = document.getElementById("creditTotal");
    if (!creditTotal) {
      creditTotal = document.createElement("p");
      creditTotal.id = "creditTotal";
      creditTotal.style.textAlign = "center";
      creditTotal.style.fontWeight = "bold";
      creditTotal.style.marginTop = "1rem";
      courseContainer.parentElement.appendChild(creditTotal);
    }
    creditTotal.textContent = `Total Credits: ${totalCredits}`;
  }

  // Initial render
  renderCourses(courses);

  // Filter button handlers
  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      let filtered;
      if (btn.textContent === "WDD") {
        filtered = courses.filter((c) => c.code.startsWith("WDD"));
      } else if (btn.textContent === "CSE") {
        filtered = courses.filter((c) => c.code.startsWith("CSE"));
      } else {
        filtered = courses;
      }
      renderCourses(filtered);
    });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  // Set current year in footer
  document.getElementById("year").textContent = new Date().getFullYear()

  // Set last modified date
  document.getElementById("lastModified").textContent = `Last Update: ${document.lastModified}`

  // Mobile menu setup
  setupMobileMenu()

  // Course filtering
  setupCourseFiltering()
})

function setupMobileMenu() {
  // Create mobile menu toggle button if it doesn't exist
  if (!document.querySelector(".menu-toggle")) {
    const header = document.querySelector("header")
    const menuToggle = document.createElement("button")
    menuToggle.classList.add("menu-toggle")
    menuToggle.innerHTML = "☰"
    menuToggle.setAttribute("aria-label", "Toggle navigation menu")
    header.appendChild(menuToggle)
  }

  const menuToggle = document.querySelector(".menu-toggle")
  const nav = document.querySelector("nav")

  // Toggle menu visibility when button is clicked
  menuToggle.addEventListener("click", () => {
    nav.classList.toggle("mobile-menu-open")

    // Change icon based on menu state
    menuToggle.innerHTML = nav.classList.contains("mobile-menu-open") ? "✕" : "☰"
  })

  // Close menu when clicking outside
  document.addEventListener("click", (event) => {
    if (
      !nav.contains(event.target) &&
      !menuToggle.contains(event.target) &&
      nav.classList.contains("mobile-menu-open")
    ) {
      nav.classList.remove("mobile-menu-open")
      menuToggle.innerHTML = "☰"
    }
  })
}

function setupCourseFiltering() {
  const filterButtons = document.querySelectorAll(".filters button")
  const courses = document.querySelectorAll(".course")

  // Set first button as active by default
  if (filterButtons.length > 0) {
    filterButtons[0].classList.add("active")
  }

  filterButtons.forEach((button) => {
    button.addEventListener("click", function () {
      // Update active button
      filterButtons.forEach((btn) => btn.classList.remove("active"))
      this.classList.add("active")

      const filter = this.textContent.toLowerCase()

      courses.forEach((course) => {
        if (filter === "all") {
          course.style.display = "block"
        } else if (course.classList.contains(filter)) {
          course.style.display = "block"
        } else {
          course.style.display = "none"
        }
      })
    })
  })
}
