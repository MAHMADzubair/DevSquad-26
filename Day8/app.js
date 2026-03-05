let selectedTip = 0;

const billInput = document.getElementById("bill");
const peopleInput = document.getElementById("people");
const customTipInput = document.getElementById("customTip");
const tipButtons = document.querySelectorAll(".tip-btn");
const tipAmountEl = document.getElementById("tipAmount");
const totalAmountEl = document.getElementById("totalAmount");
const errorEl = document.getElementById("error");
const resetBtn = document.getElementById("reset");

function calculate() {

  const bill = parseFloat(billInput.value);
  const people = parseInt(peopleInput.value);

  if (!bill || !people || people === 0 || selectedTip === 0) {
    tipAmountEl.textContent = "$0.00";
    totalAmountEl.textContent = "$0.00";
    return;
  }

  const tipTotal = (bill * selectedTip) / 100;
  const tipPerPerson = tipTotal / people;
  const totalPerPerson = (bill + tipTotal) / people;

  tipAmountEl.textContent = "$" + tipPerPerson.toFixed(2);
  totalAmountEl.textContent = "$" + totalPerPerson.toFixed(2);
}

tipButtons.forEach(btn => {
  btn.addEventListener("click", () => {

    tipButtons.forEach(b => {
      b.classList.remove("bg-[#26c0ab]", "text-[#00494d]");
      b.classList.add("bg-[#00494d]", "text-white");
    });

    btn.classList.remove("bg-[#00494d]", "text-white");
    btn.classList.add("bg-[#26c0ab]", "text-[#00494d]");

    selectedTip = parseInt(btn.dataset.tip);
    customTipInput.value = "";
    calculate();
  });
});

customTipInput.addEventListener("input", () => {
  selectedTip = parseInt(customTipInput.value) || 0;
  tipButtons.forEach(b => {
    b.classList.remove("bg-[#26c0ab]", "text-[#00494d]");
    b.classList.add("bg-[#00494d]", "text-white");
  });
  calculate();
});

peopleInput.addEventListener("input", () => {
  if (peopleInput.value == 0) {
    errorEl.classList.remove("hidden");
    peopleInput.classList.add("border-red-500");
  } else {
    errorEl.classList.add("hidden");
    peopleInput.classList.remove("border-red-500");
  }
  calculate();
});

billInput.addEventListener("input", calculate);

resetBtn.addEventListener("click", () => {
  billInput.value = "";
  peopleInput.value = "";
  customTipInput.value = "";
  selectedTip = 0;

  tipAmountEl.textContent = "$0.00";
  totalAmountEl.textContent = "$0.00";

  tipButtons.forEach(b => {
    b.classList.remove("bg-[#26c0ab]", "text-[#00494d]");
    b.classList.add("bg-[#00494d]", "text-white");
  });

  errorEl.classList.add("hidden");
  peopleInput.classList.remove("border-red-500");
});
