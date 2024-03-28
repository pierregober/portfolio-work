/**
 * Initial function to kick off the indexing process
 * @return {VoidFunction}
 */
function authenticateAndRun() {
  //Step 0: Grab todays date/time
  //Step 1: Grab the quotas from the properties service
  //Step 2: Conditional to check if quotas are truthy
  //Step 3: Convert quotas to valid dates
  //Step 3a: Conditional to stop everything if the quotas are met for today

  const today = new Date();

  const indexingQuotaResetDateTime =
    PropertiesService.getScriptProperties().getProperty(
      "INDEXING_QUOTA_RESET_DATE_TIME"
    );
  const inspectionQuotaResetDateTime =
    PropertiesService.getScriptProperties().getProperty(
      "INSPECTION_QUOTA_RESET_DATE_TIME"
    );

  if (indexingQuotaResetDateTime && inspectionQuotaResetDateTime) {
    const indexingResetDate = new Date(indexingQuotaResetDateTime);
    const inspectionResetDate = new Date(inspectionQuotaResetDateTime);

    if (today < indexingResetDate && today < inspectionResetDate) {
      console.warn("Indexing && Inspection API quota(s) have been reached.");
      return;
    }
  }

  //Step 0: Retrieve the last good date from the Properties Service (env variables)
  //Step 1: Conditional - check if the laast good crawl date is truthy, if not set to today
  //Step 2: Get the the array of rows, which are also arrays [][]
  //Step 3: Set the `maxUrlsToProcess` -- We believe it is 200
  //Step 4: Iterate over the urls
  //Step 4a: If the url in the iteration already has a recent crawl date (within the past 7 days + it is indexed) skip it move to next (continue)
  //Step 4b: If the url in the iteration needs to get indexed increment the counter and send for processing -- Note this also includes ones with errors

  // Retrieve the last good crawl date from the Properties Service
  const properties = PropertiesService.getScriptProperties();

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const urls = sheet.getRange("B2:B" + sheet.getLastRow()).getValues(); //A2 to acount for the header , concat to get the last row.

  let processedUrlsCount = 0;
  let i = 0;

  while (
    processedUrlsCount < properties.getProperty("MAX_URLS_TO_PROCESS") &&
    i < urls.length
  ) {
    const url = urls[i][0];
    i++;

    if (!url) continue; // Skip if the URL is empty or undefined.

    const inspectionResultCell = sheet.getRange(i + 1, 4).getValue(); // +1 because i was already incremented.
    let shouldProcess = true;

    if (
      inspectionResultCell &&
      inspectionResultCell !== "Quota Exceeded" &&
      inspectionResultCell !== "Server Error"
    ) {
      const inspectionData = JSON.parse(inspectionResultCell);

      if (inspectionData && !("error" in inspectionData)) {
        const { lastCrawlTime, verdict } =
          inspectionData.inspectionResult.indexStatusResult;
        const lastCrawlTimeTypecasted = new Date(lastCrawlTime);
        const trailingGoodCrawl = new Date(today);
        trailingGoodCrawl.setDate(
          today.getDate() - properties.getProperty("TRAILING_TIME")
        );

        if (
          lastCrawlTimeTypecasted <= today &&
          lastCrawlTimeTypecasted >= trailingGoodCrawl &&
          verdict === "PASS"
        ) {
          shouldProcess = false;
          sheet.getRange(i + 1, 6).setValue("SKIPPED");
          console.log(
            "URL skipped due to recent crawl and pass verdict.",
            ` [${url}]`
          );
          continue; // Skip this URL and move to the next.
        } else {
          shouldProcess = true;
          ++processedUrlsCount;
        }
      }
    } else {
      shouldProcess = true;
      ++processedUrlsCount;
    }

    if (shouldProcess) {
      const indexingResult = callIndexingApi(url);
      const inspectionResult = callInspectionApi(url);

      if ("error" in inspectionResult) {
      }
      // Convert the JSON objects to strings before setting them in the cells
      const indexingResultString = JSON.stringify(indexingResult);
      const inspectionResultString = JSON.stringify(inspectionResult);

      //Error validation
      const { coverageState, pageFetchState } =
        inspectionResult.inspectionResult.indexStatusResult;

      sheet.getRange(i + 1, 3).setValue(formatDate(new Date()));
      sheet.getRange(i + 1, 4).setValue(inspectionResultString);
      sheet.getRange(i + 1, 5).setValue(coverageState);
      sheet.getRange(i + 1, 6).setValue(pageFetchState);
      sheet.getRange(i + 1, 7).setValue(indexingResultString);
    }
  }
}

/**
 * Helper that calls the indexing process api for a single url
 * @param  {String} url
 * @return {Object | String}
 */
function callIndexingApi(url) {
  const currentDateTime = new Date();
  const quotaResetDateTime =
    PropertiesService.getScriptProperties().getProperty(
      "INDEXING_QUOTA_RESET_DATE_TIME"
    );

  // Check if the current date/time is past the quota reset date/time
  if (quotaResetDateTime && currentDateTime < new Date(quotaResetDateTime)) {
    console.log(
      "Indexing API quota has been reached. Next reset time: " +
      quotaResetDateTime
    );
    return "Quota Exceeded";
  }

  const apiToken = ScriptApp.getOAuthToken();
  const payload = {
    url: url,
    type: "URL_UPDATED",
  };

  const options = {
    method: "post",
    contentType: "application/json",
    headers: { Authorization: "Bearer " + apiToken },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true,
  };

  let response;
  try {
    // DOCS: https://developers.google.com/search/apis/indexing-api/v3/using-api#url
    response = UrlFetchApp.fetch(
      "https://indexing.googleapis.com/v3/urlNotifications:publish",
      options
    );

    if (response.getResponseCode() === 429) {
      console.log("Quota exceeded for Indexing API.");
      // Set the reset date/time to 24 hours later
      const resetDateTime = new Date(
        currentDateTime.getTime() + 24 * 60 * 60 * 1000
      );
      PropertiesService.getScriptProperties().setProperty(
        "INDEXING_QUOTA_RESET_DATE_TIME",
        resetDateTime.toISOString()
      );
      return "Quota Exceeded";
    }

    if (response.getResponseCode() === 500) {
      console.log("Server Error for Indexing API.");
      return "Server Error";
    }

    console.log("Indexing API Success Response: " + response.getContentText());
    return JSON.parse(response.getContentText());
  } catch (e) {
    console.log("Indexing API Error Response: " + e.toString());
    return "Error: " + e.toString();
  }
}

/**
 * Helper that calls the inspection process api for a single url
 * @param  {String} urlToInspect
 * @return {Object | String}
 */
function callInspectionApi(urlToInspect) {
  const currentDateTime = new Date();
  const quotaResetDateTime =
    PropertiesService.getScriptProperties().getProperty(
      "INSPECTION_QUOTA_RESET_DATE_TIME"
    );

  // Check if the current date/time is past the quota reset date/time
  if (quotaResetDateTime && currentDateTime < new Date(quotaResetDateTime)) {
    console.log(
      "URL Inspection API quota has been reached. Next reset time: " +
      quotaResetDateTime
    );
    return "Quota Exceeded";
  }

  const apiToken = ScriptApp.getOAuthToken();
  const inspectionRequestBody = {
    inspectionUrl: urlToInspect,
    siteUrl: "https://www.site.com/", // Include the trailing slash as it is in GSC
    languageCode: "en-US",
  };

  const options = {
    method: "post",
    contentType: "application/json",
    headers: { Authorization: "Bearer " + apiToken },
    payload: JSON.stringify(inspectionRequestBody),
    muteHttpExceptions: true,
  };

  let response;
  try {
    // DOCS: https://developers.google.com/webmaster-tools/v1/urlInspection.index/inspect
    response = UrlFetchApp.fetch(
      "https://searchconsole.googleapis.com/v1/urlInspection/index:inspect",
      options
    );

    if (response.getResponseCode() === 429) {
      console.log("Quota exceeded for URL Inspection API.");
      // Set the reset date/time to 24 hours later
      const resetDateTime = new Date(
        currentDateTime.getTime() + 24 * 60 * 60 * 1000
      );
      PropertiesService.getScriptProperties().setProperty(
        "INSPECTION_QUOTA_RESET_DATE_TIME",
        resetDateTime.toISOString()
      );
      return "Quota Exceeded";
    }

    //Sometimes the 500 error has be getting through and not to the catch somehow, but we dont want it to stop so that's why it returns a string and not throw error object
    if (response.getResponseCode() === 500) {
      console.log("Server Error for URL Inspection API.");
      return "Server Error";
    }

    console.log("GSC API Response: " + response.getContentText());
    return JSON.parse(response.getContentText());
  } catch (e) {
    console.log("GSC API Request Error: " + e.toString());
    return "Error: " + e.toString();
  }
}

/**
 * Helper that clears the values of INSPECTION_QUOTA_RESET_DATE_TIME and INDEXING_QUOTA_RESET_DATE_TIME
 * @return {Boolean}
 */
function clearQuotas() {
  let scriptProperties = PropertiesService.getScriptProperties();

  [
    "INDEXING_QUOTA_RESET_DATE_TIME",
    "INSPECTION_QUOTA_RESET_DATE_TIME",
  ].forEach(function (propertyName) {
    let propertyValue = scriptProperties.getProperty(propertyName);
    if (propertyValue) {
      console.log(`${propertyName} was: ${propertyValue}`);
      scriptProperties.deleteProperty(propertyName);
      console.log(propertyName + " has been removed.");
    } else {
      console.log(propertyName + " does not exist.");
    }
  });

  return true;
}

/**
 * Helper that retrieves the active user
 * @return {VoidFunction}
 */
function logActiveUserEmail() {
  const email = Session.getActiveUser().getEmail();
  console.log("Active User Email: " + email);
}

/**
 * Helper that formats a Date object to MM/DD/YYYY hh/mm
 * @param  {Date} date
 * @return {String}
 */
function formatDate(date) {
  let day = date.getDate().toString();
  let month = (date.getMonth() + 1).toString();
  let year = date.getFullYear();

  let hours = date.getHours();
  let mins = date.getMinutes().toString();
  let ampm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12;
  hours = hours ? hours.toString() : "12";
  mins = mins.length < 2 ? "0" + mins : mins;

  day = day.length < 2 ? "0" + day : day;
  month = month.length < 2 ? "0" + month : month;

  return `${month}/${day}/${year} ${hours}:${mins}${ampm}`;
}