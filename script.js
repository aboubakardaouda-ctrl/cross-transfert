/* ============================================================
   WEDDING INVITATION — A & H
   Pure vanilla JS · No dependencies · LWS compatible
   ============================================================ */

'use strict';

/* ==========================================
   CONFIGURATION
   ========================================== */
const CONFIG = {
  rsvpEndpoint: 'rsvp.php',
};

/* ==========================================
   OPENING ANIMATION
   Called by the hero button
   ========================================== */
function openInvitation() {
  const hero    = document.getElementById('hero');
  const main    = document.getElementById('main-content');
  const card    = document.getElementById('invitationCard');
  const openBtn = document.getElementById('openBtn');

  if (!hero || !main || !card) return;

  // Prevent double-tap
  openBtn.disabled = true;
  openBtn.style.pointerEvents = 'none';

  // Phase 1 (0 ms): card brightens and lifts
  card.classList.add('card-opening');

  // Phase 2 (320 ms): card and hero dissolve out
  setTimeout(() => {
    card.classList.add('card-dissolving');
    hero.classList.add('hero-dissolving');
  }, 320);

  // Phase 3 (540 ms): main content fades in
  setTimeout(() => {
    main.classList.add('content-visible');
  }, 540);

  // Phase 4 (960 ms): remove hero from layout entirely
  setTimeout(() => {
    hero.style.display = 'none';
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Trigger scroll reveal for elements already in viewport
    checkRevealInView();
  }, 960);
}

/* ==========================================
   SCROLL REVEAL — IntersectionObserver
   ========================================== */
function initScrollReveal() {
  if (!('IntersectionObserver' in window)) {
    // Fallback: just show everything
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('revealed'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -36px 0px' }
  );

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

function checkRevealInView() {
  document.querySelectorAll('.reveal:not(.revealed)').forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.98) {
      el.classList.add('revealed');
    }
  });
}

/* ==========================================
   GUEST COUNTER — +/− buttons
   ========================================== */
function initGuestCounter() {
  const input   = document.getElementById('guests');
  const decBtn  = document.getElementById('decreaseGuests');
  const incBtn  = document.getElementById('increaseGuests');

  if (!input || !decBtn || !incBtn) return;

  function update(delta) {
    const current = parseInt(input.value, 10) || 0;
    const next    = Math.max(0, Math.min(10, current + delta));
    input.value   = next;
    decBtn.disabled = (next === 0);
    incBtn.disabled = (next === 10);
  }

  decBtn.addEventListener('click', () => update(-1));
  incBtn.addEventListener('click', () => update(+1));

  // Initial disabled state
  decBtn.disabled = true;
}

/* ==========================================
   ATTENDING TOGGLE — hide guests when "non"
   ========================================== */
function initAttendingToggle() {
  const radios      = document.querySelectorAll('input[name="attending"]');
  const guestsGroup = document.getElementById('guestsGroup');

  if (!guestsGroup) return;

  radios.forEach(radio => {
    radio.addEventListener('change', () => {
      const showGuests = (radio.value === 'oui');
      guestsGroup.style.transition = 'opacity 0.3s ease';
      if (showGuests) {
        guestsGroup.style.display  = '';
        guestsGroup.style.opacity  = '0';
        requestAnimationFrame(() => {
          requestAnimationFrame(() => { guestsGroup.style.opacity = '1'; });
        });
      } else {
        guestsGroup.style.opacity = '0';
        setTimeout(() => { guestsGroup.style.display = 'none'; }, 300);
      }
    });
  });
}

/* ==========================================
   RSVP FORM SUBMISSION
   ========================================== */
function initRsvpForm() {
  const form = document.getElementById('rsvpForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearFormError();

    // Validate attending radio (not covered by checkValidity)
    const attendingChecked = form.querySelector('input[name="attending"]:checked');
    if (!attendingChecked) {
      showFormError('Veuillez indiquer si vous serez présent(e).');
      return;
    }

    // HTML5 native validation
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    setSubmitLoading(true);

    const formData = new FormData(form);

    try {
      const response = await fetch(CONFIG.rsvpEndpoint, {
        method: 'POST',
        body: formData,
      });

      // Handle non-JSON responses gracefully
      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error('Réponse serveur invalide.');
      }

      if (data.success) {
        showSuccess(data);
      } else {
        showFormError(data.message || 'Une erreur est survenue. Veuillez réessayer.');
        setSubmitLoading(false);
      }

    } catch (err) {
      showFormError('Impossible d\'envoyer votre réponse. Vérifiez votre connexion et réessayez.');
      setSubmitLoading(false);
    }
  });
}

function setSubmitLoading(loading) {
  const btn    = document.getElementById('submitBtn');
  const text   = btn && btn.querySelector('.btn-text');
  const loader = btn && btn.querySelector('.btn-loader');

  if (!btn) return;
  btn.disabled    = loading;
  if (text)   text.hidden   = loading;
  if (loader) loader.hidden = !loading;
}

function showSuccess(data) {
  const rsvpCard    = document.getElementById('rsvpCard');
  const successCard = document.getElementById('successCard');
  const successMsg  = document.getElementById('successMessage');

  // Personalize the confirmation message
  const nameInput = document.getElementById('name');
  const firstName = nameInput ? nameInput.value.trim().split(' ')[0] : '';
  const attending = data.data && data.data.attending === 'oui';

  if (successMsg) {
    if (attending) {
      successMsg.textContent = firstName
        ? `Merci ${firstName} ! Votre présence est confirmée. Nous sommes impatients de célébrer ce moment avec vous.`
        : 'Votre présence est confirmée. Nous sommes impatients de célébrer ce moment avec vous.';
    } else {
      successMsg.textContent = firstName
        ? `Merci ${firstName}, nous avons bien noté votre réponse. Vous serez dans nos pensées ce jour-là.`
        : 'Nous avons bien noté votre réponse. Vous serez dans nos pensées ce jour-là.';
    }
  }

  // Fade out form card
  if (rsvpCard) {
    rsvpCard.style.transition = 'opacity 0.38s ease, transform 0.38s ease';
    rsvpCard.style.opacity    = '0';
    rsvpCard.style.transform  = 'translateY(-8px)';

    setTimeout(() => {
      rsvpCard.hidden = true;

      if (successCard) {
        successCard.hidden = false;
        successCard.style.opacity   = '0';
        successCard.style.transform = 'translateY(10px)';
        successCard.style.transition = 'opacity 0.5s ease, transform 0.5s ease';

        requestAnimationFrame(() => requestAnimationFrame(() => {
          successCard.style.opacity   = '1';
          successCard.style.transform = 'translateY(0)';
        }));

        // Scroll success card into view
        setTimeout(() => {
          successCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 200);
      }
    }, 380);
  }
}

function showFormError(message) {
  clearFormError();

  const err = document.createElement('p');
  err.className = 'form-error';
  err.id        = 'formError';
  err.textContent = message;
  err.setAttribute('role', 'alert');

  const form = document.getElementById('rsvpForm');
  const submitBtn = form && form.querySelector('[type="submit"]');
  if (submitBtn) {
    form.insertBefore(err, submitBtn);
  } else if (form) {
    form.appendChild(err);
  }

  // Auto-dismiss after 6 s
  setTimeout(clearFormError, 6000);
}

function clearFormError() {
  const err = document.getElementById('formError');
  if (err) err.remove();
}

/* ==========================================
   INIT — DOM ready
   ========================================== */
document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  initGuestCounter();
  initAttendingToggle();
  initRsvpForm();
});
