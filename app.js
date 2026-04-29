let data = JSON.parse(localStorage.getItem("contractors") || "{}");

function save() {
localStorage.setItem("contractors", JSON.stringify(data));
}

function addContract() {
let name = prompt("Contractor name");
let value = Number(prompt("Contract value"));

data[name] = {
contract: value,
claimed: 0,
paid: 0
};

save();
render();
}

function addClaim() {
let name = getSelected();
let amount = Number(prompt("Claim amount"));

data[name].claimed += amount;

save();
render();
}

function addPayment() {
let name = getSelected();
let amount = Number(prompt("Payment amount"));

if (amount > data[name].claimed - data[name].paid) {
alert("Payment cannot exceed claimed!");
return;
}

data[name].paid += amount;

save();
render();
}

function getSelected() {
return document.getElementById("contractorSelect").value;
}

function render() {
let select = document.getElementById("contractorSelect");

select.innerHTML = "";

Object.keys(data).forEach(name => {
let opt = document.createElement("option");
opt.value = name;
opt.innerText = name;
select.appendChild(opt);
});

if (!getSelected()) return;

let c = data[getSelected()];

document.getElementById("contract").innerText = c.contract;
document.getElementById("claimed").innerText = c.claimed;
document.getElementById("paid").innerText = c.paid;
document.getElementById("outstanding").innerText = c.contract - c.paid;

let above = c.claimed - c.contract;
document.getElementById("above").innerText = above > 0 ? above : 0;
}

render();
