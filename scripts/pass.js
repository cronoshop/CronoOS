let pass_password = "";
let input_password = "";
const saved_pass_local = localStorage.getItem("pass_saved");
if (saved_pass_local) pass_password = saved_pass_local;

const translations = {
  en: {
    create_new: "Create new password",
    enter_old: "Enter old password",
    confirm_new: "Confirm new password",
    wrong_old: "Incorrect old password",
    not_match: "Passwords do not match",
    remove_success: "Password removed successfully",
    forgot: "Forgot password",
  },
  vi: {
    create_new: "Create new password",
    enter_old: "Enter old password",
    confirm_new: "Confirm new password",
    wrong_old: "Incorrect old password",
    not_match: "Passwords do not match",
    remove_success: "Password removed successfully",
    forgot: "Forgot password",
  },
  // ... Thêm ngôn ngữ khác
};
let currentLang = localStorage.getItem("language") || "en"; // mặc định tiếng Việt
function t(key) {
  return translations[currentLang]?.[key] || key;
}
function updatePasswordTexts() {
  document.getElementById("title_crea_pass").textContent =
    stage_crea_pass === 0
      ? t("enter_old")
      : stage_crea_pass === 1
      ? t("create_new")
      : t("confirm_new");

  document.getElementById("error_crea_pass").textContent = "";
  fogot_pass_btn.textContent = t("forgot");
}
function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem("language", lang);
  updatePasswordTexts();
}

if (pass_password === "") {
  box_pass1.classList.add("off");
  box_pass2.classList.add("off");
  pass_icon_btn.style.fill = "#000000";
  finger_icon_btn.style.fill = "#000000";
  status_pass1.textContent = box_pass1.classList.contains("off") ? "OFF" : "ON";
  status_pass2.textContent = box_pass2.classList.contains("off") ? "OFF" : "ON";
  finger_biometrics = box_pass2.classList.contains("off") ? 0 : 1;

  localStorage.removeItem("pass_saved");
  localStorage.setItem("finger_saved", finger_biometrics.toString());
}

const dots_password = document.querySelectorAll(".dot_password");
const message_password = document.getElementById("message_password");
const keypad_password = document.getElementById("keypad_password");
const container_password = document.querySelector(".container_password");
const swipeHandle = document.getElementById("swipe_handle");
const lock_content = document.getElementById("lock_content");
const dotsBox_password = document.querySelector(".dots_password");
const remove_pass_btn = document.getElementById("remove_password");

// Tạo nút 1–9
for (let i = 1; i <= 9; i++) {
  const btn_password = document.createElement("div");
  btn_password.className = "key_password";
  btn_password.id = `key_password${i}`;
  btn_password.textContent = i;
  btn_password.addEventListener("click", () => addNumber_password(i));
  keypad_password.appendChild(btn_password);
}

// Nút trống căn giữa
const empty_password = document.createElement("div");
empty_password.className = "key_password empty_password";
keypad_password.appendChild(empty_password);

// Nút 0
const zero_password = document.createElement("div");
zero_password.className = "key_password";
zero_password.textContent = "0";
zero_password.id = "key_password0";
zero_password.addEventListener("click", () => addNumber_password(0));
keypad_password.appendChild(zero_password);

// Nút xóa
const del_password = document.createElement("div");
del_password.className = "key_password";
del_password.innerHTML = `<span class="material-icons" style="background: none; height: none; width: none; margin-right: 2px; font-size: 25px;">backspace</span>`;
del_password.addEventListener("click", () => {
  if (input_password.length > 0) {
    input_password = input_password.slice(0, -1);
    updateDots_password();
    message_password.textContent = "";
  } else {
    lock_content.style.transform = `translateY(0px)`;
    lock_content.style.opacity = `1`;
    swipeHandle.style.opacity = "1";
    // THOÁT GIAO DIỆN NẾU CHƯA NHẬP GÌ
    show_pass_for_cuslock = false;
    container_password.style.animation = "fadeOut_password 0.3s ease-out";
    container_password.addEventListener("animationend", function handler() {
      container_password.style.display = "none";
      container_password.style.pointerEvents = "none";
      container_password.style.animation = "";
      container_password.removeEventListener("animationend", handler);
    });
  }
});
keypad_password.appendChild(del_password);

// Nhập số
let failCount_password = 0; // đếm số lần nhập sai

function addNumber_password(num) {
  if (input_password.length >= 6) return;

  input_password += num;
  updateDots_password();

  if (input_password.length === 6) {
    if (input_password === pass_password) {
      failCount_password = 0; // reset khi đúng
      fogot_pass_btn.style.display = "none";
      if (show_pass_for_cuslock) {
        currentOpeningBtn = boxes["box4"];
        app = appopen[`box4`];
        app.style.display = "none";
        hideAllClickables();
        handleShowLockOption_noanim();
        showPopup_open_close_noanim("app4theme");
        id_holding_locksreen = null;
        lock_preview.style.transform = "translateX(-50%) scale(1)";
        unlock_noanim();
        openPopupFromCurrentButton_noanim();
        updateTime2();

        id_holding_locksreen2 = setTimeout(() => {
          lock_preview.style.transform = "translateX(-50%) scale(0.7)";

          AboutInSetting.style.pointerEvents = "none";
          animationInSetting.style.pointerEvents = "none";

          lockscreen.style.transform = "translateX(-50%) scale(1)";
          id_holding_locksreen2 = null;
          is_holding_locksreen = false;
          show_pass_for_cuslock = false;

          wallpaper_btn.addEventListener("click", handleOpenWallpaperPopup);
          wallpaper_btn2.addEventListener("click", handleOpenWallpaperPopup);
          back4.addEventListener("click", handleCloseWallpaperPopup);

          aod_btn.addEventListener("click", handleOpenAODOption);
          back5.addEventListener("click", handleCloseAODOption);

          lock_btn.addEventListener("click", handleShowLockOption);
          back6.addEventListener("click", handleHideLockOption);

          home_btn.addEventListener("click", showHomeApp);
          back8.addEventListener("click", hideHomeApp);

          finger.addEventListener("click", showFingerPopup);
          back9.addEventListener("click", hideFingerPopup);

          removeCustomLockscreenTime(); // để tắt
          addEventListeners_aod_preview();
        }, 100);
      } else {
        setTimeout(() => {
          input_password = "";
          updateDots_password();
          unlock(); // mở khóa
        }, 100);
      }
    } else {
      failCount_password++;
      dotsBox_password.classList.remove("shake_password");
      void dotsBox_password.offsetWidth;
      dotsBox_password.classList.add("shake_password");

      setTimeout(() => {
        input_password = "";
        updateDots_password();
      }, 200);

      if (failCount_password >= 2) {
        onThreeFails();
        failCount_password = 0;
      }
    }
  }
}

const fogot_pass_btn = document.getElementById("fogot_password");
function onThreeFails() {
  fogot_pass_btn.style.display = "block";
  fogot_pass_btn.addEventListener("click", () => {
    pass_password = "";
    unlock();
    tb_system("Password removed successfully");
    remove_pass_btn.style.display = "none";
    pass_password = "";
    stage_crea_pass = 0;
    input_crea_pass = "";
    newPass_crea_pass = "";
    document.getElementById("title_crea_pass").textContent =
      pass_password === "" ? t("create_new") : t("enter_old");
    document.getElementById("error_crea_pass").textContent = "";
    updateDots_crea_pass();
    hidePopup_open_close(crea_pass);
    box_pass1.classList.add("off");
    box_pass2.classList.add("off");
    pass_icon_btn.style.fill = "#000000";
    finger_icon_btn.style.fill = "#000000";
    status_pass1.textContent = box_pass1.classList.contains("off")
      ? "OFF"
      : "ON";
    status_pass2.textContent = box_pass2.classList.contains("off")
      ? "OFF"
      : "ON";
    finger_biometrics = box_pass2.classList.contains("off") ? 0 : 1;
    localStorage.setItem("finger_saved", finger_biometrics.toString());
    fogot_pass_btn.style.display = "none";
  });
}

// Cập nhật 6 chấm tròn
function updateDots_password() {
  dots_password.forEach((dot, index) => {
    dot.classList.toggle("filled_password", index < input_password.length);
  });
}

let isDragging_pass = false;
let startY_pass = 0;
let currentY_pass = 0;

// --- TOUCH ---
function touchStartHandler(e) {
  isDragging_pass = true;
  startY_pass = e.touches[0].clientY;
}

function touchMoveHandler(e) {
  if (!isDragging_pass) return;
  currentY_pass = e.touches[0].clientY;
  const delta_pass = startY_pass - currentY_pass;
  if (delta_pass > 0 && delta_pass < 300) {
    swipeHandle.style.transition = `none`;
    swipeHandle.style.bottom = `${delta_pass}px`;
    swipeHandle.style.opacity = `${Math.max(1 - delta_pass / 150, 0)}`;
    lock_content.style.transition = `none`;
    lock_content.style.transform = `translateY(-${delta_pass}px)`;
    lock_content.style.opacity = `${Math.max(1 - delta_pass / 150, 0)}`;
  }
}

function touchEndHandler() {
  isDragging_pass = false;
  const delta_pass = startY_pass - currentY_pass;
  swipeHandle.style.transition = `bottom 0.2s`;
  swipeHandle.style.bottom = "5px";
  lock_content.style.transition = `transform 0.2s`;
  lock_content.style.transform = `translateY(0px)`;
  if (delta_pass > 100) {
    swipeHandle.style.opacity = "0";
    lock_content.style.opacity = `0`;
    container_password.style.animation = "none";
    container_password.style.display = "flex";
    container_password.style.pointerEvents = "auto";
    animateKeys_password();
    input_password = "";
    updateDots_password();
  } else {
    swipeHandle.style.opacity = "1";
    lock_content.style.opacity = `1`;
  }
}

function mouseDownHandler(e) {
  isDragging_pass = true;
  startY_pass = e.clientY;
}

function mouseMoveHandler(e) {
  if (!isDragging_pass) return;
  currentY_pass = e.clientY;
  const delta_pass = startY_pass - currentY_pass;
  if (delta_pass > 0 && delta_pass < 300) {
    swipeHandle.style.transition = `none`;
    swipeHandle.style.bottom = `${delta_pass}px`;
    swipeHandle.style.opacity = `${Math.max(1 - delta_pass / 150, 0)}`;
    lock_content.style.transition = `none`;
    lock_content.style.transform = `translateY(-${delta_pass}px)`;
    lock_content.style.opacity = `${Math.max(1 - delta_pass / 150, 0)}`;
  }
}

function mouseUpHandler() {
  if (!isDragging_pass) return;
  isDragging_pass = false;
  const delta_pass = startY_pass - currentY_pass;
  swipeHandle.style.transition = `bottom 0.2s`;
  swipeHandle.style.bottom = "5px";
  lock_content.style.transition = `transform 0.2s`;
  lock_content.style.transform = `translateY(0px)`;
  if (delta_pass > 100) {
    swipeHandle.style.opacity = "0";
    lock_content.style.opacity = `0`;
    container_password.style.animation = "none";
    container_password.style.display = "flex";
    container_password.style.pointerEvents = "auto";
    animateKeys_password();
    input_password = "";
    updateDots_password();
  } else {
    swipeHandle.style.opacity = "1";
    lock_content.style.opacity = `1`;
  }
}

function removeSwipeEvents() {
  swipeHandle.removeEventListener("touchstart", touchStartHandler);
  swipeHandle.removeEventListener("touchmove", touchMoveHandler);
  swipeHandle.removeEventListener("touchend", touchEndHandler);

  swipeHandle.removeEventListener("mousedown", mouseDownHandler);
  document.removeEventListener("mousemove", mouseMoveHandler);
  document.removeEventListener("mouseup", mouseUpHandler);
}

function addSwipeEvents() {
  swipeHandle.addEventListener("touchstart", touchStartHandler);
  swipeHandle.addEventListener("touchmove", touchMoveHandler);
  swipeHandle.addEventListener("touchend", touchEndHandler);

  swipeHandle.addEventListener("mousedown", mouseDownHandler);
  document.addEventListener("mousemove", mouseMoveHandler);
  document.addEventListener("mouseup", mouseUpHandler);
}

addSwipeEvents();

// Animation hiển thị các nút
function animateKeys_password() {
  if (!pass_password) {
    unlock();
    return;
  }
  container_password.style.display = "flex";
  container_password.style.pointerEvents = "auto";
  container_password.style.animation = `show_all_pass 0.3s ease-out`;

  for (let i = 0; i <= 9; i++) {
    const key = document.getElementById(`key_password${i}`);
    if (key) {
      key.style.animation = `show_pass${i} 1s ease-out forwards`;
    }
  }

  del_password.style.animation = `show_pass0 1.2s ease-out forwards`;
  document.querySelector(
    ".dots_password"
  ).style.animation = `show_pass 0.3s ease-out`;
  keypad_password.style.animation = `show_pass 0.4s ease-out`;
}

if (!pass_password) {
  fingerprint.style.display = "none";
} else remove_pass_btn.style.display = "none";

let input_crea_pass = "";
let stage_crea_pass = pass_password === "" ? 1 : 0; // 0: xác nhận cũ, 1: tạo mới, 2: xác nhận lại
let newPass_crea_pass = "";

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("title_crea_pass").textContent =
    pass_password === "" ? t("create_new") : t("enter_old");
});

function updateDots_crea_pass() {
  const dots = document.querySelectorAll(".dot_crea_pass");
  dots.forEach((dot, index) => {
    dot.classList.toggle(
      "dot_active_crea_pass",
      index < input_crea_pass.length
    );
  });
}

function pressKey_crea_pass(key) {
  if (input_crea_pass.length >= 6) return;
  input_crea_pass += key;
  updateDots_crea_pass();

  if (input_crea_pass.length === 6) {
    setTimeout(() => handleFullInput_crea_pass(), 200);
  }
}

function deleteKey_crea_pass() {
  if (input_crea_pass.length === 0) {
    stage_crea_pass = 0;
    input_crea_pass = "";
    newPass_crea_pass = "";
    document.getElementById("title_crea_pass").textContent =
      pass_password === "" ? t("create_new") : t("enter_old");
    document.getElementById("error_crea_pass").textContent = "";
    updateDots_crea_pass();
    hidePopup_open_close(crea_pass);
    remove_pass_btn.style.display = "none";
    return;
  }
  input_crea_pass = input_crea_pass.slice(0, -1);
  updateDots_crea_pass();
  document.getElementById("error_crea_pass").textContent = "";
}

function handleFullInput_crea_pass() {
  const errorEl = document.getElementById("error_crea_pass");
  errorEl.textContent = "";
  if (stage_crea_pass === 0) {
    if (input_crea_pass === pass_password) {
      stage_crea_pass = 1;
      document.getElementById("title_crea_pass").textContent = t("create_new");
      remove_pass_btn.style.display = "block";
    } else {
      errorEl.textContent = t("wrong_old");
    }
  } else if (stage_crea_pass === 1) {
    newPass_crea_pass = input_crea_pass;
    stage_crea_pass = 2;
    document.getElementById("title_crea_pass").textContent = t("confirm_new");
  } else if (stage_crea_pass === 2) {
    if (input_crea_pass === newPass_crea_pass) {
      pass_password = newPass_crea_pass;
      hidePopup_open_close(crea_pass);
      localStorage.setItem("pass_saved", pass_password);
      remove_pass_btn.style.display = "none";
      box_pass1.classList.remove("off");
      pass_icon_btn.style.fill = "#ffffff";
      stage_crea_pass = 0;
      document.getElementById("title_crea_pass").textContent = t("enter_old");
      status_pass1.textContent = box_pass1.classList.contains("off")
        ? "OFF"
        : "ON";
    } else {
      errorEl.textContent = t("not_match");
      stage_crea_pass = 1;
      document.getElementById("title_crea_pass").textContent = t("create_new");
    }
  }

  input_crea_pass = "";
  updateDots_crea_pass();
}

remove_pass_btn.addEventListener("click", () => {
  remove_pass_btn.style.display = "none";
  pass_password = "";
  stage_crea_pass = 0;
  input_crea_pass = "";
  newPass_crea_pass = "";
  document.getElementById("title_crea_pass").textContent =
    pass_password === "" ? t("create_new") : t("enter_old");
  document.getElementById("error_crea_pass").textContent = "";
  updateDots_crea_pass();
  hidePopup_open_close(crea_pass);
  box_pass1.classList.add("off");
  box_pass2.classList.add("off");
  pass_icon_btn.style.fill = "#000000";
  finger_icon_btn.style.fill = "#000000";
  status_pass1.textContent = box_pass1.classList.contains("off") ? "OFF" : "ON";
  status_pass2.textContent = box_pass2.classList.contains("off") ? "OFF" : "ON";
  finger_biometrics = box_pass2.classList.contains("off") ? 0 : 1;

  localStorage.removeItem("pass_saved");
  localStorage.setItem("finger_saved", finger_biometrics.toString());
});

if (!pass_password || !finger_biometrics) fingerprint.style.display = "none";
