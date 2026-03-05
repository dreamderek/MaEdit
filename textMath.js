function repaint() {

  tmp = text.value;

  tmp = tmp.replaceAll("<", " < ").replaceAll("\n", "</p><p>");
  tmp = tmp.replace(/\\\[/gs, `\\\(`).replace(/\\\]/gs, `\\\)`);
  tmp = tmp.replace(/\$\$/gs, `$`);

  tmp = tmp.replace(/\$.+?\$/gs, s => { return `\\\(${s.replace(/\$/gs, ``)}\\\)`; });
  tmp = tmp.replace(/\([A-E]\)/gs, e => { return `\n${e}&#9;` }).replace(/(\n)\1+/gs, `\n`);
  tmp = tmp.replace(/\d+\\%/gs, e => { return `\\\(${e}\\\)` });

  tmp = test_begin(tmp);

  // tmp = tmp.replaceAll(" ", "&nbsp");

  tmp = tmp.replace(/[,，]/gs, `, `);
  tmp = tmp.replace(/\?/gs, `？`);
  tmp = tmp.replace(/\s+/g, " ");
  tmp = tmp.replace(/\t/g, "&#9;");

  tmp = tmp.replace(/tabular/gs, `array`);
  tmp = tmp.replace(/\\\(.+?\\\)/gs, s => { return ` <span class="math-tex">${s}</span> `; });
  tmp = tmp.replace(/`.+?`/gs, s => { return `<span class="math-tex">${s}</span>`; });
  tmp = tmp.replace(/<span class="math-tex".+?span>/g, e => { return e.replace(/<p>|<\/p>/gs, ``); });
  tmp = tmp.replace(/\\displaystyle/gs, "");
  tmp = tmp.replace(/\\\(/gs, "\\\(\\displaystyle ");

  tmp = "<p>" + tmp + "</p>";

  tmp = jump(tmp);

  reMix(tmp);
}

function reMix(tmp) {
  if (typeof finger !== "undefined" && finger !== "" && data[finger][title["question"]] !== text.value) {
    data[finger][title["question"]] = text.value;
    if (typeof apiEditData === "function") {
      apiEditData(data[finger]).catch(function (error) {
        console.error("Failed to save row:", error);
      });
    }
  }

  show.innerHTML = tmp;
  var object = Array.from(show.querySelectorAll(".math-tex"));
  object.forEach(function (item) {
    MathJax.Hub.Typeset(item);
  });
}

function test_begin(textInput) {
  var text = textInput;
  if (text.split("begin").length > 1) {
    text += "\\begin{array}{}&nbsp\\end{array}";
  }
  text = text.replace(/\\begin/gs, function (e) { return "\\\\(" + e; }).replace(/\\end{.+?}/gs, function (e) { return e + "\\\\)"; });

  var regex = /\\\(|\\\)/gs;
  var textBlocks = text.split(regex);
  var latexBlocks = Array.from(text.matchAll(regex));

  var tmp = textBlocks[0];
  var type = 0;
  latexBlocks.forEach(function (item, index) {
    if (item[0] === "\\\\(") {
      if (type > 0) item[0] = "";
      type += 1;
    } else if (item[0] === "\\\\)") {
      type -= 1;
      if (type > 0) item[0] = "";
    }
    tmp += item[0] + textBlocks[index + 1];
  });
  return tmp;
}

function jump(tmpInput) {
  var regex = /---/gs;
  var textBlocks = tmpInput.split(regex);
  var latexBlocks = Array.from(tmpInput.matchAll(regex));

  var tmp = textBlocks[0];
  var point = 0;
  latexBlocks.forEach(function (item, index) {
    point += textBlocks[index].length;
    tmp += "<hr onclick=\"go(" + point + ")\">" + textBlocks[index + 1];
  });

  return tmp;
}

function go(e) {
  return e;
}
