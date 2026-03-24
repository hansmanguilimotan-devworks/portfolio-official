(function () {
  if (window.lucide && typeof window.lucide.createIcons === "function") {
    window.lucide.createIcons();
  }

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  const revealTargets = document.querySelectorAll(".reveal-card, .reveal-child");

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: "0px 0px -10% 0px"
      }
    );

    revealTargets.forEach((target, index) => {
      target.style.transitionDelay = `${Math.min(index * 40, 180)}ms`;
      revealObserver.observe(target);
    });

    const sections = Array.from(document.querySelectorAll("main section[id]"));
    const navLinks = Array.from(document.querySelectorAll("[data-target]"));

    const setActiveNav = (id) => {
      navLinks.forEach((link) => {
        link.classList.toggle("active", link.dataset.target === id);
      });
    };

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible) {
          setActiveNav(visible.target.id);
        }
      },
      {
        threshold: [0.35, 0.5, 0.7],
        rootMargin: "-22% 0px -32% 0px"
      }
    );

    sections.forEach((section) => sectionObserver.observe(section));
  }

  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    const successEl = document.getElementById("contactSuccess");
    const errorEl = document.getElementById("contactError");
    const submitBtn = document.getElementById("contactSubmitBtn");

    contactForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      const fullname = document.getElementById("fullname").value.trim();
      const email = document.getElementById("email").value.trim();
      const subjectEl = document.getElementById("subject");
      const subjectLabel = subjectEl.options[subjectEl.selectedIndex]?.text || "Contact";

      if (!fullname || !email || !subjectEl.value) {
        return;
      }

      if (successEl) successEl.textContent = "";
      if (errorEl) errorEl.textContent = "";

      const formData = new FormData(contactForm);
      formData.append("_subject", `Portfolio Contact: ${subjectLabel}`);

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "SENDING...";
      }

      try {
        const response = await fetch(contactForm.action, {
          method: "POST",
          body: formData,
          headers: {
            Accept: "application/json"
          }
        });

        if (!response.ok) {
          throw new Error("Form submission failed");
        }

        contactForm.reset();
        if (successEl) successEl.textContent = "Success! Your message has been sent.";
      } catch (error) {
        if (errorEl) {
          errorEl.textContent = "Could not send your message right now. Please try again.";
        }
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = "SEND MESSAGE";
        }
      }
    });
  }

  const orbitLink = document.querySelector(".orbit-link");

  if (orbitLink) {
    window.addEventListener(
      "scroll",
      () => {
        const y = window.scrollY;
        orbitLink.style.transform = `translateY(${Math.sin(y * 0.003) * 6}px)`;
      },
      { passive: true }
    );
  }
})();
