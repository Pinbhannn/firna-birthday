/* ============================================================
   Musik background dari file MP3.
   API publik: window.Music.start() / .stop() / .toggle() / .isOn()
   ============================================================ */

"use strict";

(function () {
  const STORAGE_KEY = "hb_music_on";
  const MUSIC_SRC = "assets/Paul Partohap - P.S. I LOVE YOU (Lyric Video).mp3";
  const audio = new Audio(MUSIC_SRC);
  audio.loop = true;
  audio.preload = "auto";
  audio.volume = 0.35;

  let playing = false;
  let enabled = readEnabled();

  function readEnabled() {
    try {
      const value = localStorage.getItem(STORAGE_KEY);
      return value === null ? true : value === "1";
    } catch (e) {
      return true;
    }
  }

  function saveEnabled() {
    try {
      localStorage.setItem(STORAGE_KEY, enabled ? "1" : "0");
    } catch (e) {
      /* localStorage bisa diblokir -> abaikan */
    }
  }

  function updateButton() {
    const btn = document.getElementById("btn-music");
    if (!btn) return;
    const on = enabled && playing;
    btn.textContent = on ? "🔊" : "🔇";
    btn.classList.toggle("is-on", on);
    btn.setAttribute("aria-label", on ? "Matikan musik" : "Nyalakan musik");
    btn.title = on ? "Matikan musik" : "Nyalakan musik";
  }

  function start() {
    if (playing) return;
    const result = audio.play();
    if (result && typeof result.then === "function") {
      result.then(() => {
        playing = true;
        updateButton();
      }).catch(() => {
        // Browser dapat menolak audio sampai ada interaksi pengguna.
        playing = false;
        updateButton();
      });
    } else {
      playing = true;
      updateButton();
    }
  }

  function stop() {
    audio.pause();
    playing = false;
    updateButton();
  }

  function toggle() {
    if (playing) {
      enabled = false;
      saveEnabled();
      stop();
    } else {
      enabled = true;
      saveEnabled();
      start();
    }
    updateButton();
    return enabled;
  }

  function isOn() {
    return enabled && playing;
  }

  function init() {
    const btn = document.getElementById("btn-music");
    if (btn) {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        toggle();
      });
    }

    // Browser memblokir autoplay sebelum ada interaksi pengguna.
    // Mulai musik pada gesture pertama jika preferensi musik aktif.
    const begin = (e) => {
      if (e.target && e.target.closest && e.target.closest("#btn-music")) return;
      if (enabled) start();
    };
    document.addEventListener("pointerdown", begin);
    document.addEventListener("keydown", begin);

    audio.addEventListener("play", () => {
      playing = true;
      updateButton();
    });
    audio.addEventListener("pause", () => {
      playing = false;
      updateButton();
    });

    updateButton();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  window.Music = { start, stop, toggle, isOn };
})();
