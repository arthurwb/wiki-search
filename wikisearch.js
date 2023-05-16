document.addEventListener('DOMContentLoaded', function () {
  var submitButton = document.querySelector('input[type="submit"]');
  submitButton.addEventListener('click', function () {
    var languageSelect = document.getElementById('search-language');
    var selectedLanguage = languageSelect.value;
    var searchQuery = document.getElementById('search-query').value;

    if (searchQuery !== '') {
      var apiUrl = 'https://' + selectedLanguage + '.wikipedia.org/w/api.php';
      var params = {
        action: 'query',
        format: 'json',
        list: 'search',
        srsearch: searchQuery
      };
      var url = apiUrl + '?' + new URLSearchParams(params).toString();

      // Make a request to the Wikipedia API to check if the page exists
      var xhr = new XMLHttpRequest();
      xhr.open('GET', url, true);
      xhr.withCredentials = true; // Enable CORS handling
      xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 400) {
          var data = JSON.parse(xhr.responseText);
          var pageId = data.query.searchinfo.totalhits
          if (pageId !== 0) {
            // Page exists, show search results
            let searchList = document.getElementById("search-results");
            searchList.innerHTML = "";
            data.query.search.forEach(el => {
              searchList.innerHTML += `<div><a href="https://en.wikipedia.org/wiki/${el.title}">${el.title}</a></div>`;
            });
            // var pageUrl = 'https://' + selectedLanguage + '.wikipedia.org/wiki/' + encodeURIComponent(searchQuery);
            // browser.tabs.create({ url: pageUrl });
          } else {
            // Page does not exist, handle accordingly (e.g., show an error message)
            document.getElementById("search-query").value = "Page does not exist";
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
  });
});