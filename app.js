let currentContractor = null;

function getAll() {
  return JSON.parse(localStorage.getItem("contractors") || "{}");
}

function saveAll(data) {
  localStorage.setItem("contractors", JSON.stringify(data));
}

function init() {
  const select = document.getElementById("contractorSelect");
  const suppliers = JSON.parse(localStorage.getItem("supplier") || "[]");

  select.innerHTML = "<option>Select Contractor</option>";

  suppliers.forEach(s => {
    select.innerHTML += `<option value="${s}">${s}</option>`;
  });
}

function loadContractor(name) {
  currentContractor = name;

  let all = getAll();

  if (!all[name]) {
    all[name] = { contract:0, accounts:[], payments:[], retention:[] };
    saveAll(all);
  }

  render();
}

function saveContract() {
  let all = getAll();
  const val = Number(document.getElementById("contractInput").value || 0);

  all[currentContractor].contract = val;

  saveAll(all);
  render();
}

function addAccount() {
  const val = Number(prompt("Claimed amount"));
  if (!val) return;

  let all = getAll();
  let c = all[currentContractor];

  const totalClaimed = c.accounts.reduce((a,b)=>a+b.claimed,0);

  if (totalClaimed + val > c.contract) {
    alert("Over contract! Add variation first");
    return;
  }

  c.accounts.push({claimed:val, paid:false});

  saveAll(all);
  render();
}

function releaseRetention() {
  const val = Number(prompt("Release retention"));
  if (!val) return;

  let all = getAll();
  all[currentContractor].retention.push(val);

  saveAll(all);
  render();
}

function calculate(c) {
  const paid = c.accounts.filter(a=>a.paid).reduce((a,b)=>a+b.claimed,0);
  const claimed = c.accounts.reduce((a,b)=>a+b.claimed,0);
  const retention = claimed * 0.05;

  return {
    paid,
    outstanding: c.contract - paid,
    retention,
    over: claimed > c.contract ? claimed - c.contract : 0
  };
}

function render() {
  let all = getAll();
  let c = all[currentContractor];
  if (!c) return;

  const calc = calculate(c);

  document.getElementById("kpiContract").innerText = c.contract;
  document.getElementById("kpiPaid").innerText = calc.paid;
  document.getElementById("kpiOutstanding").innerText = calc.outstanding;
  document.getElementById("kpiRetention").innerText = calc.retention;
  document.getElementById("kpiOver").innerText = calc.over;

  document.getElementById("accounts").innerHTML =
    c.accounts.map((a,i)=>`
      <div>
        Account ${i+1} - ${a.claimed}
        <button onclick="pay(${i})">Pay</button>
      </div>
    `).join("");
}

function pay(i){
  let all = getAll();
  all[currentContractor].accounts[i].paid = true;
  saveAll(all);
  render();
}

init();
