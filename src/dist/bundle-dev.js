// src/services/transaction-parties/events/assign-biz-unit-to-tr-party.js
$(document).on("knack-view-render.view_108", function(event, view, data) {
  const $view = $(`#${view.key}`);
  for (const rec of data) {
    const $rec = $view.find(`#${rec.id}`);
    const $tag = $rec.find("a");
    $tag.removeAttr("href");
    const event2 = () => {
    };
  }
});
//# sourceMappingURL=bundle-dev.js.map
