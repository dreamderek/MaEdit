function doGet(e) {
  return handleRequest_(e);
}

function doPost(e) {
  return handleRequest_(e);
}

function handleRequest_(e) {
  try {
    const payload = parsePayload_(e);
    const action = payload.action || "health";
    let data;

    if (action === "health") {
      data = { service: "MaEdit GAS API", status: "ok" };
    } else if (action === "getData") {
      data = JSON.parse(sql_getData());
    } else if (action === "getBy") {
      const name = payload.name;
      const value = payload.value;
      data = JSON.parse(sql_get_data(name, value));
    } else if (action === "edit") {
      if (!payload.row || !Array.isArray(payload.row)) {
        throw new Error("Missing payload.row for edit action");
      }
      sql_edit_data(payload.row);
      data = { updated: true };
    } else if (action === "delete") {
      if (payload.id === undefined || payload.id === null || payload.id === "") {
        throw new Error("Missing id for delete action");
      }
      data = JSON.parse(sql_delete(payload.id));
    } else {
      throw new Error("Unsupported action: " + action);
    }

    return jsonResponse_({ ok: true, data: data });
  } catch (error) {
    return jsonResponse_({
      ok: false,
      error: error && error.message ? error.message : String(error)
    });
  }
}

function parsePayload_(e) {
  const fromQuery = (e && e.parameter) ? e.parameter : {};
  let body = {};

  if (e && e.postData && e.postData.contents) {
    try {
      body = JSON.parse(e.postData.contents);
    } catch (ignore) {
      body = {};
    }
  }

  const payload = {};
  Object.keys(fromQuery).forEach(function (key) { payload[key] = fromQuery[key]; });
  Object.keys(body).forEach(function (key) { payload[key] = body[key]; });

  if (typeof payload.row === "string") {
    try {
      payload.row = JSON.parse(payload.row);
    } catch (ignore) {}
  }

  return payload;
}

function jsonResponse_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
