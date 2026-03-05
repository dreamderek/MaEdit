var SHEET_ID = "1uXjjQVglhBXwqbxsJtMVg04SnUKJT9eDugphkODfdug";
var SHEET_NAME = "question";

/**
 *  1. sheetApp(sheetId)
 *  2. sheet(sheetName)
 *  3. 開始使用
 */

function test() {
  // sql_set_sheet("1uXjjQVglhBXwqbxsJtMVg04SnUKJT9eDugphkODfdug", "question");
  // e = ["30", "a", "b", "c", "d", "e", "f", "g"];
  // sql_edit_data(e);
  // sql_delete(2);
  Logger.log(typeof buffingspan === "undefined");
  // a = "12345";
  //   Logger.log(a.replace(/1.+?3/, s => { return "?"+s+"?";}));
  //   Logger.log(a.replace(/1.+?3/, "11"));
}

function sql_getData() {
  return JSON.stringify(getData_());
}

function sql_get_data(name, e) {
  var sql_data = getData_();
  var col = sql_data[0].map(String).indexOf(name);
  var tmp = [];
  sql_data.forEach(function (item) {
    if (item[col] == e) {
      tmp.push(item);
    }
  });
  return JSON.stringify(tmp);
}

function sql_edit_data(e) {
  var sheet = getSheet_();
  var sql_data = getData_();
  var row = sql_data.map(function (item) { return item[0]; }).map(String).indexOf(e[0].toString());
  row = (row == -1) ? sql_data.length : row;
  sheet.getRange(row + 1, 1, 1, e.length).setValues([e]);
}

function sql_delete(id) {
  var sheet = getSheet_();
  var sql_data = getData_();
  var col = sql_data[0].map(String).indexOf("id");

  sql_data.forEach(function (item, index) {
    if (item[col] == id) {
      sheet.deleteRow(index + 1);
    }
  });

  sql_data = sheet.getDataRange().getValues();
  return JSON.stringify(sql_data);
}

function getSheet_() {
  return SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
}

function getData_() {
  return getSheet_().getDataRange().getValues();
}
