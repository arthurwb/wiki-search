function searchOnWikipedia(info, tab) {
    var selectedText = info.selectionText;
  
    if (selectedText !== '') {
      var apiUrl = 'https://en.wikipedia.org/w/api.php';
      var params = {
        action: 'query',
        format: 'json',
        titles: selectedText
      };
      var url = apiUrl + '?' + new URLSearchParams(params).toString();
  
      // Make a request to the Wikipedia API to check if the page exists
      var xhr = new XMLHttpRequest();
      xhr.open('GET', url, true);
      xhr.withCredentials = true; // Enable CORS handling
      xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 400) {
          var data = JSON.parse(xhr.responseText);
          var pageId = Object.keys(data.query.pages)[0];
          if (pageId !== '-1') {
            // Page exists, create new tab
            var pageUrl = 'https://en.wikipedia.org/wiki/' + encodeURIComponent(selectedText);
            browser.tabs.create({ url: pageUrl });
          } else {
            // Page does not exist, handle accordingly (e.g., show an error message)
            console.log('Page does not exist');
          }
        } else {
          console.error('Request failed with status:', xhr.status);
        }
      };
      xhr.onerror = function () {
        console.error('An error occurred during the request');
      };
      xhr.send();
    }
  }
  
  browser.contextMenus.create({
    id: "search-wikipedia",
    title: "Search on Wikipedia",
    contexts: ["selection"],
  });
  
  browser.contextMenus.onClicked.addListener(searchOnWikipedia);
  