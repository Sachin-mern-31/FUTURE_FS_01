const typingElement = document.querySelector(".typing-effect");
const words = [
  "Full Stack Web Developer",
  "Frontend Developer",
  "Backend Developer",
  "React Developer",
];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeEffect() {
  const currentWord = words[wordIndex];
  if (!typingElement) return;

  if (!isDeleting) {
    typingElement.textContent = currentWord.slice(0, charIndex++);
    if (charIndex > currentWord.length) {
      isDeleting = true;
      setTimeout(typeEffect, 1100);
      return;
    }
  } else {
    typingElement.textContent = currentWord.slice(0, charIndex--);
    if (charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
    }
  }

  setTimeout(typeEffect, isDeleting ? 60 : 120);
}

typeEffect();

const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");
const body = document.body;
const savedTheme = localStorage.getItem("theme");

function updateThemeIcon(isDark) {
  if (!themeIcon) return;
  themeIcon.className = isDark ? "fa-solid fa-sun" : "fa-solid fa-moon";
}

if (
  savedTheme === "dark" ||
  (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)
) {
  body.classList.add("dark");
  updateThemeIcon(true);
} else {
  updateThemeIcon(false);
}

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    body.classList.toggle("dark");
    const isDark = body.classList.contains("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
    updateThemeIcon(isDark);
  });
}

const header = document.querySelector("header");
window.addEventListener("scroll", () => {
  header?.classList.toggle("scrolled", window.scrollY > 40);
});

const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll("nav ul li a");
window.addEventListener("scroll", () => {
  let current = "";
  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 140;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === "#" + current) {
      link.classList.add("active");
    }
  });
});

const revealItems = document.querySelectorAll(".reveal");
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 },
);

revealItems.forEach((item) => revealObserver.observe(item));

const statItems = document.querySelectorAll(".stat-number");
const statObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = Number(el.dataset.target || 0);
        const suffix = el.dataset.suffix || "";
        let count = 0;
        const duration = 1200;
        const stepTime = Math.max(20, Math.floor(duration / target));

        const timer = setInterval(() => {
          count += 1;
          el.textContent = count + suffix;
          if (count >= target) {
            clearInterval(timer);
            el.textContent = target + suffix;
          }
        }, stepTime);

        statObserver.unobserve(el);
      }
    });
  },
  { threshold: 0.6 },
);

statItems.forEach((item) => statObserver.observe(item));

const scrollTopBtn = document.getElementById("scrollTopBtn");
window.addEventListener("scroll", () => {
  scrollTopBtn.style.display = window.scrollY > 400 ? "block" : "none";
});
scrollTopBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

const form = document.querySelector(".contact-form");
form?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const nameInput = form.querySelector("[name='name']");
  const emailInput = form.querySelector("[name='email']");
  const subjectInput = form.querySelector("[name='subject']");
  const messageInput = form.querySelector("[name='message']");

  const name = (nameInput?.value || "").trim();
  const email = (emailInput?.value || "").trim();
  const subject = (subjectInput?.value || "").trim();
  const message = (messageInput?.value || "").trim();

  if (!name || !email || !message) {
    alert("Please fill in your name, email, and message.");
    return;
  }

  try {
    const response = await fetch("http://localhost:5000/api/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, subject, message }),
    });

    const responseData = await response.json().catch(() => null);
    if (!response.ok) {
      const errorMessage = responseData?.error || response.statusText || "Server error";
      throw new Error(errorMessage);
    }

    alert("Message sent successfully. Thank you!");
    form.reset();
  } catch (error) {
    console.error("Submit error:", error);
    alert(`Unable to send your message right now: ${error.message}`);
  }
});

window.addEventListener("load", () => {
  const loader = document.getElementById("loader");
  setTimeout(() => loader?.classList.add("hidden"), 1200);
});
