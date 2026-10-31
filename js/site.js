/* VibeSyncro page interactions: mobile navigation, forms, quiz, canvas and scroll reveal. */
(function () {
  "use strict";

  // Brand-aligned themes use a strict allow-list; arbitrary CSS values are never accepted.
  function initThemeSwitcher() {
    const valid = { secure: true, privacy: true, safety: true };
    const root = document.documentElement;
    const menus = Array.from(document.querySelectorAll("[data-theme-menu]"));
    if (!menus.length) return;
    function initialTheme() {
      const attr = root.getAttribute("data-theme");
      if (Object.prototype.hasOwnProperty.call(valid, attr)) return attr;
      try {
        const saved = window.localStorage.getItem("vibesyncro-theme");
        if (Object.prototype.hasOwnProperty.call(valid, saved)) return saved;
      } catch (_) {}
      return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "secure" : "privacy";
    }
    let active = initialTheme();
    function close(menu, focus) {
      const trigger = menu.querySelector(".theme-trigger");
      const list = menu.querySelector(".theme-dropdown");
      if (!trigger || !list) return;
      list.classList.add("hidden");
      trigger.setAttribute("aria-expanded","false");
      if (focus) trigger.focus();
    }
    function sync() {
      menus.forEach((menu) => {
        const current = menu.querySelector(".theme-current-label");
        const selected = menu.querySelector('[data-theme-value="' + active + '"]');
        if (current && selected) current.textContent = selected.querySelector(".theme-option-label")?.textContent.trim() || active;
        menu.querySelectorAll("[data-theme-value]").forEach((option) => {
          option.setAttribute("aria-checked",String(option.getAttribute("data-theme-value")===active));
        });
      });
    }
    function setTheme(theme, persist) {
      if (!Object.prototype.hasOwnProperty.call(valid, theme)) return false;
      active = theme;
      root.setAttribute("data-theme",theme);
      if (persist) {
        try { window.localStorage.setItem("vibesyncro-theme",theme); }
        catch (_) { /* The current page still uses the selected palette. */ }
      }
      const color=getComputedStyle(root).getPropertyValue("--bg-main").trim();
      const meta=document.querySelector('meta[name="theme-color"]');
      if(meta&&color) meta.setAttribute("content",color);
      sync();
      document.dispatchEvent(new CustomEvent("vibesyncro:themechange",{detail:{theme:active}}));
      return true;
    }
    menus.forEach((menu) => {
      const trigger=menu.querySelector(".theme-trigger"), list=menu.querySelector(".theme-dropdown");
      const options=Array.from(menu.querySelectorAll("[data-theme-value]"));
      if(!trigger||!list) return;
      trigger.addEventListener("click",() => {
        const open=trigger.getAttribute("aria-expanded")!=="true";
        menus.forEach((item)=>close(item,false));
        if(open){list.classList.remove("hidden");trigger.setAttribute("aria-expanded","true");}
      });
      options.forEach((option) => {
        option.addEventListener("click",() => {
          if(!setTheme(option.getAttribute("data-theme-value"),true)) return;
          close(menu,false);trigger.focus();
        });
        option.addEventListener("keydown",(event) => {
          const i=options.indexOf(option);let next=null;
          if(event.key==="ArrowDown") next=(i+1)%options.length;
          if(event.key==="ArrowUp") next=(i-1+options.length)%options.length;
          if(event.key==="Home") next=0;if(event.key==="End") next=options.length-1;
          if(next!==null){event.preventDefault();options[next].focus();}
        });
      });
    });
    document.addEventListener("click",(event)=>menus.forEach((m)=>{if(!m.contains(event.target))close(m,false);}));
    document.addEventListener("keydown",(event)=>{
      if(event.key!=="Escape") return;
      const open=menus.find((m)=>m.querySelector(".theme-trigger")?.getAttribute("aria-expanded")==="true");
      if(open){event.preventDefault();close(open,true);}
    });
    document.addEventListener("vibesyncro:languagechange",sync);
    setTheme(active,false);
  }



  // Magnetic hero CTAs: RAF-throttled, bounded to 4px, and disabled for reduced motion/touch.
  function initMagneticButtons() {
    const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia && window.matchMedia("(pointer: coarse)").matches;
    if (reduce || coarse) return;
    document.querySelectorAll("[data-magnetic]").forEach((button) => {
      let frame = 0;
      const reset = () => {
        if (frame) cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => {
          button.style.setProperty("--magnetic-x","0px");
          button.style.setProperty("--magnetic-y","0px");
          frame = 0;
        });
      };
      button.addEventListener("pointermove",(event) => {
        const r=button.getBoundingClientRect(),x=event.clientX-r.left,y=event.clientY-r.top;
        const edge=Math.min(x,r.width-x,y,r.height-y);
        if(edge>40)return reset();
        const mx=Math.max(-4,Math.min(4,(x/r.width-.5)*8));
        const my=Math.max(-4,Math.min(4,(y/r.height-.5)*8));
        if(frame)cancelAnimationFrame(frame);
        frame=requestAnimationFrame(()=>{
          button.style.setProperty("--magnetic-x",mx.toFixed(2)+"px");
          button.style.setProperty("--magnetic-y",my.toFixed(2)+"px");frame=0;
        });
      },{passive:true});
      button.addEventListener("pointerleave",reset);
      button.addEventListener("blur",reset);
    });
  }

  // Trust-bar counters count once over 1.5 seconds when they enter the viewport.
  function initAnimatedCounters() {
    const counters=Array.from(document.querySelectorAll("[data-counter]"));
    if(!counters.length)return;
    const reduce=window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const format=n=>new Intl.NumberFormat(document.documentElement.lang||"en").format(n);
    const finish=el=>{const n=Number(el.dataset.counter);if(Number.isFinite(n))el.textContent=format(n);};
    if(reduce||!("IntersectionObserver" in window)){counters.forEach(finish);return;}
    const observer=new IntersectionObserver((entries,instance)=>{
      entries.forEach(entry=>{
        if(!entry.isIntersecting)return;
        const el=entry.target,target=Number(el.dataset.counter),duration=1500;let start=0;
        if(!Number.isFinite(target)){instance.unobserve(el);return;}
        const tick=now=>{
          if(!start)start=now;const p=Math.min(1,(now-start)/duration),ease=1-Math.pow(1-p,3);
          el.textContent=format(Math.round(target*ease));
          if(p<1)requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);instance.unobserve(el);
      });
    },{threshold:.45});
    counters.forEach(el=>observer.observe(el));
  }

  // Mobile navigation
  const menu = document.getElementById("menuBtn");
  const panel = document.getElementById("mobileMenu");
  const closeMenu = () => {
    if (!menu || !panel) return;
    menu.setAttribute("aria-expanded", "false");
    menu.setAttribute("aria-label", "Open navigation");
    menu.innerHTML = '<i class="fas fa-bars text-lg" aria-hidden="true"></i>';
    panel.classList.add("hidden");
  };

  if (menu && panel) {
    menu.addEventListener("click", () => {
      const open = menu.getAttribute("aria-expanded") !== "true";
      menu.setAttribute("aria-expanded", String(open));
      menu.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
      menu.innerHTML = open
        ? '<i class="fas fa-xmark text-lg" aria-hidden="true"></i>'
        : '<i class="fas fa-bars text-lg" aria-hidden="true"></i>';
      panel.classList.toggle("hidden", !open);
    });
    panel.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });
    document.addEventListener("click", (event) => {
      if (menu.getAttribute("aria-expanded") === "true" &&
          !panel.contains(event.target) && !menu.contains(event.target)) closeMenu();
    });
  }

  initThemeSwitcher();

  // Current navigation state and dynamic copyright
  const currentPage = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll("header nav a[href]").forEach((link) => {
    if (link.getAttribute("href") === currentPage) {
      link.setAttribute("aria-current", "page");
      link.classList.add("text-primaryRed", "font-semibold");
    }
  });
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  // Load the saved language once the page DOM is ready.
  if (window.VibeI18n) window.VibeI18n.init();

  // Subtle neural network, with one observer and animation loop per canvas.
  function initParticleCanvases() {
    const canvases = Array.from(document.querySelectorAll(".particle-canvas"));
    if (!canvases.length) return;

    const motionQuery = window.matchMedia
      ? window.matchMedia("(prefers-reduced-motion: reduce)")
      : { matches: false };

    function readParticleThemeColors() {
      const styles = getComputedStyle(document.documentElement);
      return {
        primary: styles.getPropertyValue("--brand-primary").trim() || "#C8102E",
        secondary: styles.getPropertyValue("--brand-secondary").trim() || "#0EA2EB"
      };
    }

    canvases.forEach((canvas) => {
      if (!canvas.getContext) return;

      const context = canvas.getContext("2d");
      if (!context) return;

      const host = canvas.closest("section") || canvas.parentElement;
      let width = 0;
      let height = 0;
      let particles = [];
      let pointer = { x: -1000, y: -1000 };
      let frame = 0;
      let visible = !("IntersectionObserver" in window);
      let running = false;
      let reducedMotion = motionQuery.matches;
      let pixelRatio = 1;
      let particleThemeColors = readParticleThemeColors();

      function resize() {
        const rect = canvas.getBoundingClientRect();
        width = Math.max(1, rect.width);
        height = Math.max(1, rect.height);
        pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);

        canvas.width = Math.round(width * pixelRatio);
        canvas.height = Math.round(height * pixelRatio);
        context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

        const count = Math.max(
          28,
          Math.min(78, Math.round((width * height) / 11000))
        );

        particles = Array.from({ length: count }, () => ({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.22,
          vy: (Math.random() - 0.5) * 0.22,
          radius: 1.5 + Math.random() * 1.5,
          accent: Math.random() > 0.84
        }));

        draw();
      }

      function draw() {
        context.clearRect(0, 0, width, height);

        for (let i = 0; i < particles.length; i += 1) {
          const particle = particles[i];

          if (!reducedMotion && visible && running) {
            particle.x += particle.vx;
            particle.y += particle.vy;

            if (particle.x < -5) particle.x = width + 5;
            if (particle.x > width + 5) particle.x = -5;
            if (particle.y < -5) particle.y = height + 5;
            if (particle.y > height + 5) particle.y = -5;

            const dx = particle.x - pointer.x;
            const dy = particle.y - pointer.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 125 && distance > 0) {
              particle.x += (dx / distance) * 0.32;
              particle.y += (dy / distance) * 0.32;
            }
          }

          context.beginPath();
          context.arc(
            particle.x,
            particle.y,
            particle.radius,
            0,
            Math.PI * 2
          );
          context.globalAlpha = 0.45;
          context.fillStyle = particle.accent
            ? particleThemeColors.primary
            : particleThemeColors.secondary;
          context.fill();
          context.globalAlpha = 1;

          for (let j = i + 1; j < particles.length; j += 1) {
            const other = particles[j];
            const dx = particle.x - other.x;
            const dy = particle.y - other.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 112) {
              context.beginPath();
              context.moveTo(particle.x, particle.y);
              context.lineTo(other.x, other.y);
              context.globalAlpha = (1 - distance / 112) * 0.25;
              context.strokeStyle = particleThemeColors.secondary;
              context.lineWidth = 1.2;
              context.stroke();
              context.globalAlpha = 1;
            }
          }

          const mx = particle.x - pointer.x;
          const my = particle.y - pointer.y;
          const mouseDistance = Math.sqrt(mx * mx + my * my);

          if (!reducedMotion && mouseDistance < 145) {
            context.beginPath();
            context.moveTo(particle.x, particle.y);
            context.lineTo(pointer.x, pointer.y);
            context.globalAlpha = (1 - mouseDistance / 145) * 0.35;
            context.strokeStyle = particleThemeColors.primary;
            context.lineWidth = 1.2;
            context.stroke();
            context.globalAlpha = 1;
          }
        }
      }

      function stop() {
        running = false;

        if (frame) {
          window.cancelAnimationFrame(frame);
        }

        frame = 0;
      }

      function animate() {
        if (!running || reducedMotion || !visible) {
          stop();
          return;
        }

        draw();
        frame = window.requestAnimationFrame(animate);
      }

      function start() {
        if (reducedMotion || running || !visible) return;

        running = true;
        frame = window.requestAnimationFrame(animate);
      }

      function handleThemeChange() {
        particleThemeColors = readParticleThemeColors();
        draw();
      }

      document.addEventListener("vibesyncro:themechange", handleThemeChange);

      function handleMotionPreferenceChange(event) {
        reducedMotion = event.matches;

        if (reducedMotion) {
          stop();
          draw();
        } else if (visible) {
          start();
        }
      }

      if (typeof motionQuery.addEventListener === "function") {
        motionQuery.addEventListener("change", handleMotionPreferenceChange);
      } else if (typeof motionQuery.addListener === "function") {
        motionQuery.addListener(handleMotionPreferenceChange);
      }

      if (host) {
        host.addEventListener("pointermove", (event) => {
          if (reducedMotion) return;

          const rect = canvas.getBoundingClientRect();
          pointer.x = event.clientX - rect.left;
          pointer.y = event.clientY - rect.top;
        }, { passive: true });

        host.addEventListener("pointerleave", () => {
          pointer = { x: -1000, y: -1000 };
        }, { passive: true });
      }

      window.addEventListener("resize", resize, { passive: true });

      if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.target !== canvas) return;

            visible = entry.isIntersecting;

            if (visible) start();
            else stop();
          });
        }, { threshold: 0.02 });

        observer.observe(canvas);
      }

      // Render a static frame for reduced-motion users.
      resize();

      if (!reducedMotion) {
        start();
      }
    });
  }

  // Scroll narrative reveal. Content stays visible when JS or IntersectionObserver is unavailable.
  function initScrollReveal() {
    const items = Array.from(document.querySelectorAll(".reveal"));
    if (!items.length) return;
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    if (!("IntersectionObserver" in window)) {
      items.forEach((item) => item.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver((entries, instance) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          instance.unobserve(entry.target);
        }
      });
    }, { threshold: 0, rootMargin: "-50% 0% -50% 0%" });

    items.forEach((item) => {
      item.classList.add("reveal-pending");
      observer.observe(item);
    });
  }

  // App finder quiz
  const quizChoices = {
    pdf: {
      key: "quizResultPdf",
      url: "https://play.google.com/store/apps/details?id=com.vibesync.toolkit.pdf&hl=en_IN"
    },
    developer: {
      key: "quizResultDeveloper",
      url: "https://play.google.com/store/apps/details?id=com.utility.devoptions&pcampaignid=web_share"
    },
    kids: {
      key: "quizResultKids",
      url: "https://play.google.com/store/apps/details?id=com.navya.kids_drawing_studio&pcampaignid=web_share"
    }
  };

  document.querySelectorAll("[data-quiz-choice]").forEach((button) => {
    button.addEventListener("click", async () => {
      if (window.VibeI18n) await window.VibeI18n.init();
      const choice = quizChoices[button.dataset.quizChoice];
      const result = document.getElementById("quizResult");
      const resultText = document.getElementById("quizResultText");
      const resultLink = document.getElementById("quizResultLink");
      if (!choice || !result || !resultText || !resultLink) return;

      resultText.setAttribute("data-i18n", choice.key);
      resultText.textContent = window.VibeI18n
        ? window.VibeI18n.t(choice.key)
        : choice.key;
      resultLink.href = choice.url;
      result.classList.remove("hidden");
      document.querySelectorAll("[data-quiz-choice]").forEach((item) => {
        item.setAttribute("aria-pressed", String(item === button));
        item.classList.toggle("border-primaryRed", item === button);
        item.classList.toggle("bg-red-50", item === button);
      });
    });
  });

  // Contact and Notify-Me form fallbacks
  const sendMail = (subject, body) => {
    location.href = "mailto:admin@vibesyncro.com?subject=" +
      encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
  };

  document.querySelectorAll(".notify-form").forEach((form) => {
    form.addEventListener("submit", async (event) => {
      const email = form.querySelector('input[type="email"]');
      if (!email || !email.checkValidity()) {
        event.preventDefault();
        if (email) email.reportValidity();
        return;
      }
      event.preventDefault();

      const status = form.querySelector(".notify-success");
      const subject = form.querySelector('[name="_subject"]')?.value || "SafeMobile update";
      const body = "Please notify me about updates. My email address is " + email.value.trim() + ".";

      if (form.action.includes("REPLACE_WITH_FORM_ID")) {
        if (status) {
          status.textContent = "Your email app is opening with your request. Send the email there to subscribe.";
          status.classList.remove("hidden");
        }
        sendMail(subject, body);
        return;
      }

      const button = form.querySelector('button[type="submit"]');
      if (button) {
        button.disabled = true;
        button.textContent = "Sending…";
      }

      try {
        const response = await fetch(form.action, {
          method: "POST",
          body: new FormData(form),
          headers: { Accept: "application/json" }
        });
        if (!response.ok) throw new Error("Form submission failed");
        if (status) {
          status.textContent = "Thank you. Your request has been received.";
          status.classList.remove("hidden");
        }
        form.reset();
      } catch (error) {
        if (status) {
          status.textContent = "We could not submit your request. Opening an email draft instead.";
          status.classList.remove("hidden");
        }
        sendMail(subject, body);
      } finally {
        if (button) {
          button.disabled = false;
          button.textContent = "Notify me";
        }
      }
    });
  });

  const contact = document.getElementById("contactForm");
  if (contact) {
    contact.addEventListener("submit", async (event) => {
      if (!contact.checkValidity()) {
        event.preventDefault();
        contact.reportValidity();
        return;
      }
      event.preventDefault();

      const name = contact.elements.name.value.trim();
      const email = contact.elements.email.value.trim();
      const subject = contact.elements.subject.value.trim();
      const message = contact.elements.message.value.trim();
      const mailSubject = "Website enquiry: " + subject;
      const body = "Name: " + name + "\nEmail: " + email + "\nSubject: " +
        subject + "\n\n" + message;
      const status = document.getElementById("contactStatus");

      if (contact.action.includes("REPLACE_WITH_FORM_ID")) {
        if (status) {
          status.textContent = "Your email app is opening with your message. Send the email there to contact us.";
          status.classList.remove("hidden");
        }
        sendMail(mailSubject, body);
        return;
      }

      const button = contact.querySelector('button[type="submit"]');
      if (button) {
        button.disabled = true;
        button.textContent = "Sending…";
      }
      try {
        const response = await fetch(contact.action, {
          method: "POST",
          body: new FormData(contact),
          headers: { Accept: "application/json" }
        });
        if (!response.ok) throw new Error("Form submission failed");
        if (status) {
          status.textContent = "Thank you. Your message has been sent.";
          status.classList.remove("hidden");
        }
        contact.reset();
      } catch (error) {
        if (status) {
          status.textContent = "We could not submit the form. Opening an email draft instead.";
          status.classList.remove("hidden");
        }
        sendMail(mailSubject, body);
      } finally {
        if (button) {
          button.disabled = false;
          button.textContent = "Send message";
        }
      }
    });
  }

  // SafeMobile research capability details
  document.querySelectorAll(".capability").forEach((button) => {
    button.addEventListener("click", () => {
      const descriptions = {
        scan: "Research direction: on-device checks to help identify vulnerabilities and unusual device conditions. Planned, not released.",
        finance: "Research direction: tools to help users recognise financial risk signals. No financial protection feature is currently available.",
        privacy: "Design objective: avoid unnecessary telemetry and keep processing local where practical.",
        ai: "Research direction: explore on-device AI for security analysis while minimising data sharing."
      };
      const target = document.getElementById("capabilityDetail");
      if (target) target.textContent = descriptions[button.dataset.cap] || "This capability is under research.";
      document.querySelectorAll(".capability").forEach((item) => {
        item.setAttribute("aria-expanded", String(item === button));
      });
    });
  });

  initParticleCanvases();
  initScrollReveal();
  initMagneticButtons();
  initAnimatedCounters();
})();
