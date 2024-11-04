// messages/message-functions.js
function removePopup(viewKey) {
  $("#" + viewKey + " .popup-message").remove();
}
function addPopup(viewKey, message, popupType) {
  var divSelector = $("#" + viewKey);
  var popup2 = $("<div>").addClass("popup-message");
  var messageDiv = $("<div>").html(message).css({
    marginBottom: "20px",
    fontSize: "18px",
    color: "#fff"
  });
  var progressBarContainer = $("<div>").addClass("progress-bar-container");
  var progressBar = $("<div>").attr("id", "popup-progress-bar-" + viewKey).addClass("popup-progress-bar");
  var progressText = $("<div>").attr("id", "progress-text-" + viewKey).addClass("progress-text").text("0%");
  progressBarContainer.append(progressBar);
  progressBarContainer.append(progressText);
  popup2.append(messageDiv);
  if (popupType === "progress") {
    popup2.append(progressBarContainer);
    console.log("progress popup");
  }
  var spinnerContainer = $("<div>").addClass("spinner-container");
  var spinner = $("<i>").addClass("fa fa-spinner fa-spin spinner").attr("id", "popup-spinner-" + viewKey);
  spinnerContainer.append(spinner);
  if (popupType === "spinner") {
    popup2.append(spinnerContainer);
    console.log("spinner popup");
  }
  console.log(popup2.html());
  divSelector.css("position", "relative").append(popup2);
}
function updatePopupProgress(viewKey, progress) {
  $("#popup-progress-bar-" + viewKey).css("width", progress + "%");
  $("#progress-text-" + viewKey).text(Math.round(progress) + "%");
}
var popup = {
  add: (viewKey, message, popupType) => addPopup(viewKey, message, popupType),
  remove: (viewKey) => removePopup(viewKey),
  update: (viewKey, progress) => updatePopupProgress(viewKey, progress)
};

// messages/message.js
var msg = {
  popup
};

// views/tables/tables-functions.js
function addCheckboxes(view) {
  $("#" + view.key + " .kn-table thead tr").prepend('<th><input type="checkbox"></th>');
  $("#" + view.key + " .kn-table tbody tr").each(function() {
    if (!$(this).hasClass("kn-table-group")) {
      $(this).prepend('<td><input type="checkbox"></td>');
    } else {
      $(this).prepend("<td></td>");
    }
  });
}
function handleHeaderCheckboxChange(view, selectionRules) {
  selectionRules = selectionRules || (() => true);
  $("#" + view.key + ' .kn-table thead input[type="checkbox"]').change(function() {
    var isChecked = $(this).prop("checked");
    $("#" + view.key + ' .kn-table tbody tr:not(.kn-table-group) input[type="checkbox"]').each(function() {
      var selectBasedOnRules = selectionRules();
      $(this).prop("checked", isChecked && selectBasedOnRules);
    });
  });
}
function getTableCheckedRecords(view) {
  const checkedRecords = [];
  $("#" + view.key + ' .kn-table tbody tr:not(.kn-table-group) input[type="checkbox"]').each(function() {
    var isChecked = $(this).prop("checked");
    if (isChecked) {
      var id = $(this).closest("tr").attr("id");
      checkedRecords.push({ id });
    }
  });
  return checkedRecords;
}
function addFilterToTableView(view, newFilters) {
  const filters = Knack.views[view.key].getFilters();
  let combinedFilters;
  if (filters.match) {
    filters.rules.push(newFilters);
    combinedFilters = JSON.parse(JSON.stringify(filters));
  } else if (filters.length) {
    filters.push(newFilters);
    combinedFilters = {
      match: "and",
      rules: JSON.parse(JSON.stringify(filters))
    };
  } else {
    combinedFilters = [newFilters];
  }
  Knack.views[view.key].handleChangeFilters(JSON.stringify(combinedFilters));
}
function setFilterToTableView(view, newFilters) {
  Knack.views[view.key].handleChangeFilters(JSON.stringify(newFilters));
}
function reRenderTableOrCalendar(view) {
  var originalFilters = JSON.stringify(Knack.views[view.key].getFilters());
  Knack.views[view.key].handleChangeFilters(originalFilters);
}

// views/tables/tables.js
var tables = {
  addCheckboxes: (view) => addCheckboxes(view),
  addHeadEventHandler: (view, rules) => handleHeaderCheckboxChange(view, rules),
  getChechedRecords: (view) => getTableCheckedRecords(view),
  addFilters: (view, filters) => addFilterToTableView(view, filters),
  setFilters: (view, filters) => setFilterToTableView(view, filters),
  reRender: (view) => reRenderTableOrCalendar(view)
};

// index.js
var knackInterface = {
  msg,
  views: {
    tables
  }
};
export {
  knackInterface
};
//# sourceMappingURL=bundle.js.map
