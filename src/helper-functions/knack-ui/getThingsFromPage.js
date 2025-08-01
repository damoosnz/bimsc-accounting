export function delay(ms) { //Example usage: await delay(1000);
  return new Promise((resolve) => setTimeout(resolve, ms));
}

//**Retry until**//
export async function retryUntil(condition, interval, maxTries) {

  for (let i = 0; i < maxTries; i++) {
    if (condition()) {
      return true;
      break;
    }
    await delay(interval);
  }

  return false;

}

//**Get element**//
export async function getElement(selector, interval = 100, maxTries = 120) {
  const elPresent = await retryUntil(() => {
    return $(selector).length > 0;
  }, interval, maxTries);
  if (!elPresent) return null;
  return $(selector);
}

export async function getElements(selector, length, interval = 100, maxTries = 120) {
  const elPresent = await retryUntil(() => {
    return $(selector).length >= length ;
  }, interval, maxTries);
  if (!elPresent) return null;
  return $(selector);
}

export async function getRecordsFromTableOnPage(viewKey) {
  const hasRendered = await retryUntil(() => {
    try {
      if (Knack.views[viewKey].render_count === 0) {
        console.log(`Table ${viewKey} not yet rendered, retrying...`)
        return false;
      } else {
        return true;
      }
    } catch (err) {
      console.log(err)
      return false;
    }
  }, 100, 120)//12 seconds
  if (hasRendered) {
    try {
      return Knack.models[viewKey].data.models.map(model => model.attributes);
    } catch (err) {
      return [];
    }
  } else {
    return [];
  }
}

export async function getRecordFromDetailsViewOnPage(viewKey) {
  const recordReady = await retryUntil(() => {
    try {
      const hasId = Knack.models[viewKey].attributes.id !== undefined;
      const hasOtherKeys = Object.keys(Knack.models[viewKey].attributes).length > 1;
      if (hasId && hasOtherKeys) {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      return false;
    }
  }, 100, 120)//12 seconds
  if (recordReady) {
    return Knack.models[viewKey].attributes;
  } else {
    return null;
  }
}

export const getFromPage = {
  records: (viewKey) => getRecordsFromTableOnPage(viewKey),
  record: (viewKey) => getRecordFromDetailsViewOnPage(viewKey),
  element: (selector, interval, maxTries) => getElement(selector, interval, maxTries),
  elements: (selector, length, interval, maxTries) => getElements(selector, length, interval, maxTries),
}
