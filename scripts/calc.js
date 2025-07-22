let display_calc = document.getElementById("display_calc");

function append_calc(value) {
  const current = display_calc.innerText;

  if (current === "Error") return;
  else if (current === "Infinity") return;
  else if (current === "NaN") return;

  if (value === "+/-") {
    if (current.startsWith("-")) {
      display_calc.innerText = current.slice(1);
    } else if (current !== "0") {
      display_calc.innerText = "-" + current;
    }
  } else if (value === ".") {
    if (current === "0") {
      display_calc.innerText = "0.";
    } else {
      display_calc.innerText += ".";
    }
  } else {
    if (current === "0") {
      display_calc.innerText = value;
    } else {
      display_calc.innerText += value;
    }
  }
}

function clearDisplay_calc() {
  display_calc.innerText = "0";
}

function backspace_calc() {
  if (display_calc.innerText === "Error") return;

  let text = display_calc.innerText;
  if (text.length > 1) {
    display_calc.innerText = text.slice(0, -1);
  } else {
    display_calc.innerText = "0";
  }
}

function calculate_calc() {
  if (display_calc.innerText === "Error") return;
  else if (display_calc.innerText === "Infinity") return;
  else if (display_calc.innerText === "NaN") return;

  try {
    const expression = display_calc.innerText
      .replace(/:/g, "/")
      .replace(/×/g, "*");

    display_calc.innerText = eval(expression);
  } catch {
    display_calc.innerText = "Error";
  }
}
