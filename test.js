window.onload = function(){
  Main();
}
function Main()
{
$(window).resize(function(){
  $("#RepositoryList").tabulator("redraw");
});

baseTime = new Date();
var tsvUrl = "https://raw.githubusercontent.com/ytyaru/structure.text.Upload.201703120923/master/res/tmp/2017/0312/Repositories.tsv"

d3.tsv(tsvUrl, function(error, data) {
  $("#RepositoryList").tabulator({
    //height:"320px",
    fitColumns:true,
    columns: getColumns(data)
});
  $("#RepositoryList").tabulator("setData", data);
});

function getColumns(data)
{
  columns = [];
  var keys = d3.entries(data[0]);
  for (var i = 0; i < keys.length; i++)
  {
    columns.push(getColumn(keys[i].key));
    console.log(keys[i]);
  }
  return columns;
}
  
function getColumn(key)
{
  var column = {};
  column["title"] = key;
  column["field"] = key;
  if ("Id" == key) {
    column["sorter"] = "integer";
    column["visible"] = false;
  } else if ("IdOnGitHub" == key) {
    column["sorter"] = "integer";
    column["visible"] = false;
  } else if ("Name" == key) {
    column["width"] = "30%";
    column["title"] = "リポジトリ名";
    column["formatter"] = repo_link_formatter;
  } else if ("Description" == key) {
    column["width"] = "50%";
    column["title"] = "説明";
    column["formatter"] = homepage_link_formatter;
  } else if ("Homepage" == key) {
    column["visible"] = false;
  } else if ("CreatedAt" == key) {
    column["title"] = "作成";
    column["formatter"] = CreatedAt_formatter;
  } else if ("PushedAt" == key) {
    column["title"] = "Push";
    column["formatter"] = PushedAt_formatter;
  } else if ("UpdatedAt" == key) {
    column["title"] = "更新";
    column["formatter"] = UpdatedAt_formatter;
  } else {}
  return column;
}

var repo_link_formatter = function(value, data, cell, row, options, formatterParams){
  return getATagString(data, text=data["Name"], href=getRepoUrl(data), title="");
}
var homepage_link_formatter = function(value, data, cell, row, options, formatterParams){
  return "<a href=\""+data["Homepage"]+"\">"+data["Description"]+"</a>";
}
var CreatedAt_formatter = function(value, data, cell, row, options, formatterParams){
  return getSpanTagString(data["CreatedAt"]);
}
var PushedAt_formatter = function(value, data, cell, row, options, formatterParams){
  return getSpanTagString(data["PushedAt"]);
}
var UpdatedAt_formatter = function(value, data, cell, row, options, formatterParams){
  return getSpanTagString(data["UpdatedAt"]);
}

function getSpanTagString(date)
{
  return "<span title=\""+ date +"\">" + abs2rel(baseTime, new Date(date)) + "前"+ "</span>";
}
function getATagString(data, text, href, title="")
{
  return "<a href=\""+href+"\" title=\""+title+"\">"+text+"</a>";
}

function getRepoUrl(data)
{
  var user = "ytyaru";
  return "https://github.com/" + user + "/" + data["Name"];
}

function formatDate(date, format)
{
    if (!format) format = 'yyyy-MM-dd HH:mm:ss.fff';
    format = format.replace(/yyyy/g, date.getFullYear());
    format = format.replace(/MM/g, ('0' + (date.getMonth() + 1)).slice(-2));
    format = format.replace(/dd/g, ('0' + date.getDate()).slice(-2));
    format = format.replace(/HH/g, ('0' + date.getHours()).slice(-2));
    format = format.replace(/mm/g, ('0' + date.getMinutes()).slice(-2));
    format = format.replace(/ss/g, ('0' + date.getSeconds()).slice(-2));
    if (format.match(/f/g)) {
        var milliSeconds = ('00' + date.getMilliseconds()).slice(-3);
        var length = format.match(/f/g).length;
        for (var i = 0; i < length; i++) format = format.replace(/f/, milliSeconds.substring(i, i + 1));
    }
    return format;
}
// 日付の相対表記（yyyy-MM-ddTHH:mm:ssZ→n日）
function abs2rel(baseDate, targetDate)
{
    var elapsedTime = Math.ceil((baseDate.getTime() - targetDate.getTime())/1000);
    if (elapsedTime < 60) { return (elapsedTime / 60) + "秒"; }
    else if (elapsedTime < (60 * 60)) { return Math.floor(elapsedTime / 60) + "分"; }
    else if (elapsedTime < (60 * 60 *24)) { return Math.floor(elapsedTime / 60 / 60) + "時間"; }
    else if (elapsedTime < (60 * 60 *24 * 7)) { return Math.floor(elapsedTime / 60 / 60 / 24) + "日"; }
    else if (elapsedTime < (60 * 60 *24 * 30)) { return Math.floor(elapsedTime / 60 / 60 / 24 / 7) + "週"; }
    else if (elapsedTime < (60 * 60 *24 * 365)) { return Math.floor(elapsedTime / 60 / 60 / 24 / 30) + "ヶ月"; }
    else if (elapsedTime < (60 * 60 *24 * 365 * 100)) { return Math.floor(elapsedTime / 60 / 60 / 24 / 365) + "年"; }
    else { return Math.floor(elapsedTime / 60 / 60 / 24 / 365 / 100) + "世紀"; }
}
}
