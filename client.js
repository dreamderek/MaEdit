var title = {};
var data = [[]];
var finger = "";

var text = document.querySelector(".div-main textarea");
var show = document.querySelector(".div-main div");
var buffing = document.querySelector(".buffing");
var setlist = document.querySelector(".setlist");
var dl = document.querySelector(".setlist dl");
var target = document.querySelector("#target");

initData();

text.addEventListener("input", repaint);

text.addEventListener("keydown", function (e) {
  if (e.key === "Tab") {
    e.preventDefault();
    var cursorPos = this.selectionStart;
    var tmp = this.value;
    var before = tmp.substring(0, cursorPos);
    var after = tmp.substring(cursorPos);
    this.value = before + "\t" + after;
    this.selectionStart = this.selectionEnd = cursorPos + 1;
  }
  repaint();
});

text.addEventListener("focus", function () {
  var tmp = document.querySelector(".action");
  if (tmp) toggleSlide();
});

async function initData() {
  try {
    data = await apiGetData();
    if (!Array.isArray(data) || data.length === 0) {
      data = [[]];
    }
  } catch (error) {
    console.error("Failed to load data from GAS API:", error);
    data = [[]];
  }

  buildTitleIndex();
}

function buildTitleIndex() {
  title = {};
  if (!data[0] || !Array.isArray(data[0])) return;

  data[0].forEach(function (item, index) {
    title[item] = index;
  });
}

function getApiUrl() {
  if (!window.MAEDIT_API_URL || window.MAEDIT_API_URL.indexOf("PASTE_YOUR_GAS_WEB_APP_URL_HERE") >= 0) {
    throw new Error("window.MAEDIT_API_URL is not configured in index.html");
  }
  return window.MAEDIT_API_URL;
}

async function apiGetData() {
  var url = new URL(getApiUrl());
  url.searchParams.set("action", "getData");

  var response = await fetch(url.toString(), {
    method: "GET"
  });

  if (!response.ok) {
    throw new Error("HTTP " + response.status);
  }

  var result = await response.json();
  if (!result.ok) {
    throw new Error(result.error || "Unknown API error");
  }

  return result.data;
}

async function apiEditData(row) {
  var response = await fetch(getApiUrl(), {
    method: "POST",
    headers: {
      "Content-Type": "text/plain;charset=utf-8"
    },
    body: JSON.stringify({
      action: "edit",
      row: row
    })
  });

  if (!response.ok) {
    throw new Error("HTTP " + response.status);
  }

  var result = await response.json();
  if (!result.ok) {
    throw new Error(result.error || "Unknown API error");
  }

  return result.data;
}

function toggleSlide() {
  setlist.classList.toggle("action");
  var tmp = document.querySelector(".action");
  if (tmp) tmp.focus();

  dl.innerHTML = "";
  data.forEach(function (item, index) {
    if (index !== 0) {
      var dt = document.createElement("dt");
      var span = document.createElement("span");

      dt.appendChild(span);
      span.textContent = item[title["question_bank"]];
      dt.id = index;
      dt.addEventListener("click", callfile);
      dl.appendChild(dt);
    }
  });
}

function callfile() {
  finger = this.id;
  text.value = data[finger][title["question"]];
  target.textContent = data[finger][title["question_bank"]];
  repaint();
  toggleSlide();
}

