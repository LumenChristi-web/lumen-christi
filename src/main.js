// 🌐 LOAD HEADER & FOOTER DYNAMICALLY
document.addEventListener("DOMContentLoaded", () => {
  loadHTML("header.html", "header");
  loadHTML("footer.html", "footer");

  // ✅ Initialize mini text slider after DOM is ready
  initMiniTextSlider();
});

function loadHTML(file, elementId) {
  fetch(file)
    .then(response => response.text())
    .then(data => {
      document.getElementById(elementId).innerHTML = data;

      // ✅ Initialize burger menu only after header is loaded
      if (elementId === "header") {
        initBurgerMenu();
        highlightActiveNavLink(); // ✅ highlight current page link
      }
    })
    .catch(error => console.error("Error loading file:", error));
}

// 🍔 BURGER MENU FUNCTION (separate mobile nav)
function initBurgerMenu() {
  const menuToggle = document.getElementById("menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");

  if (!menuToggle || !mobileMenu) return; // nothing to do

  // ensure mobile menu is hidden initially (safe)
  mobileMenu.classList.add("hidden");

  menuToggle.addEventListener("click", () => {
    const isOpen = !mobileMenu.classList.contains("hidden");

    // toggle visibility: show as block on mobile, keep desktop unaffected
    if (isOpen) {
      mobileMenu.classList.add("hidden");
      menuToggle.setAttribute("aria-expanded", "false");
    } else {
      mobileMenu.classList.remove("hidden");
      mobileMenu.classList.add("block"); // show as block (stacked column)
      menuToggle.setAttribute("aria-expanded", "true");
    }

    // animate burger -> X (pure classes)
    const spans = menuToggle.querySelectorAll("span");
    if (spans && spans.length >= 3) {
      spans[0].classList.toggle("rotate-45");
      spans[0].classList.toggle("translate-y-[7px]");
      spans[1].classList.toggle("opacity-0");
      spans[2].classList.toggle("-rotate-45");
      spans[2].classList.toggle("-translate-y-[7px]");
    }
  });

  // Optional: close menu when clicking outside (nice UX)
  document.addEventListener("click", (e) => {
    const target = e.target;
    if (!menuToggle.contains(target) && !mobileMenu.contains(target) && !mobileMenu.classList.contains("hidden")) {
      mobileMenu.classList.add("hidden");
      mobileMenu.classList.remove("block");
      menuToggle.setAttribute("aria-expanded", "false");
      const spans = menuToggle.querySelectorAll("span");
      if (spans && spans.length >= 3) {
        spans[0].classList.remove("rotate-45", "translate-y-[7px]");
        spans[1].classList.remove("opacity-0");
        spans[2].classList.remove("-rotate-45", "-translate-y-[7px]");
      }
    }
  });
}

// 🌿 AUTO-HIGHLIGHT ACTIVE NAV LINK
function highlightActiveNavLink() {
  const currentPage = window.location.pathname.split("/").pop();
  const navLinks = document.querySelectorAll("nav a");

  navLinks.forEach((link) => {
    const linkPage = link.getAttribute("href").split("/").pop();
    if (linkPage === currentPage) {
      link.classList.add("text-green", "font-semibold");
    }
  });
}

// 🎞️ UNIVERSAL SLIDER LOGIC (Works for all sliders)
document.querySelectorAll(".slider").forEach(slider => {
  const slides = slider.querySelectorAll(".slide");
  const prevBtn = slider.querySelector(".prev");
  const nextBtn = slider.querySelector(".next");
  const dotsContainer = slider.querySelector(".dots");
  let current = 0;
  let dots = [];

  if (dotsContainer) {
    dotsContainer.innerHTML = "";

    slides.forEach((_, i) => {
      const dot = document.createElement("span");
      dot.className = `
        dot w-3 h-3 rounded-full mx-1 cursor-pointer border border-white/70
        bg-transparent transition-all duration-300
        hover:bg-white
        ${i === 0 ? "bg-white" : ""}
      `;

      dot.addEventListener("click", () => {
        current = i;
        updateSlide();
      });

      dotsContainer.appendChild(dot);
    });

    dots = dotsContainer.querySelectorAll(".dot");
  }

  function updateSlide() {
    slides.forEach((s, i) => {
      s.classList.toggle("hidden", i !== current);
      s.classList.toggle("active", i === current);
    });

    if (dots.length > 0) {
      dots.forEach((d, i) => {
        d.classList.toggle("bg-white", i === current);
        d.classList.toggle("bg-transparent", i !== current);
      });
    }
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      current = (current - 1 + slides.length) % slides.length;
      updateSlide();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      current = (current + 1) % slides.length;
      updateSlide();
    });
  }

  setInterval(() => {
    current = (current + 1) % slides.length;
    updateSlide();
  }, 5000);

  updateSlide();
});

// 🩺 MINI TEXT SLIDER (Assisted Living, Health Care, Community Engagement)
function initMiniTextSlider() {
  const slides = [
    {
      title: "Assisted Living",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
    },
    {
      title: "Health Care",
      text: "Providing high-quality support and health management for all residents."
    },
    {
      title: "Community Engagement",
      text: "Encouraging participation and connection through social activities."
    }
  ];

  let currentSlide = 0;

  const titleEl = document.getElementById("slideTitle");
  const textEl = document.getElementById("slideText");
  const dots = document.querySelectorAll(".dot");
  const nextBtn = document.getElementById("nextBtn");
  const prevBtn = document.getElementById("prevBtn");

  if (!titleEl || !textEl || dots.length === 0) return;

  function updateSlide() {
    titleEl.textContent = slides[currentSlide].title;
    textEl.textContent = slides[currentSlide].text;

    dots.forEach((dot, index) => {
      dot.classList.toggle("opacity-100", index === currentSlide);
      dot.classList.toggle("opacity-50", index !== currentSlide);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      currentSlide = (currentSlide + 1) % slides.length;
      updateSlide();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      currentSlide = (currentSlide - 1 + slides.length) % slides.length;
      updateSlide();
    });
  }

  updateSlide();
}

// 📩 TRAINING PAGE MODAL FUNCTIONALITY
document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("contact-modal");
  const closeModal = document.getElementById("close-modal");
  const messageButtons = document.querySelectorAll(".send-message-btn");

  if (!modal || messageButtons.length === 0) return;

  // Open modal on any "Send Message" button click
  messageButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault(); // ✅ Prevent form submission or link navigation
      modal.classList.remove("hidden");
      modal.classList.add("flex"); // Ensure it's visible and properly displayed
    });
  });

  // Close modal
  closeModal.addEventListener("click", () => {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
  });

  // Close when clicking outside
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.add("hidden");
      modal.classList.remove("flex");
    }
  });
});


