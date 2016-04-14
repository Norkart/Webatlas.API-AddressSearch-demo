
var wa = wa || {};

(function (ns) {

    ns.Search = function (config) {
    
        var id = "search";
        
        var $suggestTemplate = _.template($('#suggest_element').html());
        var $searchContainer = $('#search-outer-container');

        var $searchForm = $('#search-form');
        var $searchInput = $('#search-input');
        var $clearButton = $('#search-clear-button');
        var $searchButton = $('#search-button');

        var $suggestionContainer = $('#suggestions-container');
        var $searchResultContainer = $('#search-results-container');
        var $loadContainer = $('<div id="search-loader">');
        var loadTemplate = _.template($('#norkart-loader-small').html());
        
        var suggestionRequest;
        var searchRequest;
        var searchActive = false;
        
        
        var selectSearchResultCallback;
        var selectSuggestionCallback;

        /* Search form key handling */
        $searchForm.on('keyup', function (e) {
            var keyCode = e.keyCode || e.which;
            
            if (keyCode === 27) {
                clearAll();
                return;
            }
            if (keyCode === 8) {
                searchActive = false;
            }
            if (!_.contains([13, 16, 17, 18, 20, 37, 38, 39, 40], keyCode)) {
                suggest(e);
            }     
        });
        
        $searchForm.on('submit', function (e) {
            search(e);
            e.preventDefault();
        });

        $searchButton.on('click', function (e) {
            $searchForm.submit();
        });

        function showLoading() {
            $searchResultContainer.append(loadTemplate({ message: "Søker..." }));
        }

        function stopSearch() {
            if (searchRequest) {
                searchRequest.abort();
                searchRequest = null;
                searchActive = false;
            }
        }

        function stopSuggestion() {

            $suggestionContainer.empty();
            $suggestionContainer.hide();

            if (suggestionRequest) {
                suggestionRequest.abort();
                suggestionRequest = null;
            }
        }

        function search(e) {
            searchActive = true;
            stopSuggestion();
            stopSearch();
            $searchResultContainer.empty();
            $searchResultContainer.show();

            showLoading();
            if (searchInputIsEmpty()) {
                clearAll();
                return;
            }

            var start = new Date();
            var searchTerm = $searchInput.val();


            ////$searchResultContainer.css('width', 300);
            $searchResultContainer.css('height',"auto");
            
            searchRequest = executeSearchRequest(
                searchTerm,
                function (data) {
                    var loadTime = start - new Date();
                    if (loadTime < 250) {
                        setTimeout(function () {
                            showSearchResults(data);
                        }, 250-loadTime);
                    } else {
                        showSearchResults(data);
                    }

                },
                function (data) {
                    console.log(data);
                });
            return false;
        }


        function suggest(event) {

            stopSearch();
            $searchResultContainer.empty();
            event.preventDefault();
            if (searchInputIsEmpty()) {
                clearAll();
                return;
            }

            var searchTerm = $searchInput.val();

            suggestionRequest = executeSuggestRequest(
                searchTerm,
                function (data) {
                    if (!searchActive) {
                        showSuggestions(data);
                    }
                });
        }



        function showContainer($container) {
            //$container.css('width', 300);
            $container.css('height', "auto");

        }

        function showSearchResults(response) {

            $searchResultContainer.empty();

            if (response.SearchResults.length > 0) {

                var els = getSearchResultElements(response.SearchResults);
                $searchResultContainer.append(els);
                //$searchResultContainer.css('width', 300);
                $searchResultContainer.css('height', "auto");
            } else {
                //$searchResultContainer.css('width', 300);
                $searchResultContainer.css('height', "auto");
                $searchResultContainer.append('<p>Ingen forslag</p>');

            }
        }
        function showSuggestions(response) {

            $suggestionContainer.empty();
            $suggestionContainer.show();

            if (response.Options.length > 0) {
                var els = getSuggestionElements(response.Options);
                $suggestionContainer.append(els);
                //$suggestionContainer.css('width', 300);
                $suggestionContainer.css('height', "auto");
            } else {
                //$suggestionContainer.css('width', 300);
                $suggestionContainer.css('height', "auto");
                $suggestionContainer.append('<p>Ingen forslag</p>');
                search({});
            }
        }

        function selectSearchResult(result) {
            
            selectSearchResultCallback(result);
            clearAll();

        }

        function selectSuggestion(suggestion) {

            selectSuggestionCallback(suggestion);
            clearAll();

        }
        
        function createQueryParameterString(params) {    
            return _.map(params, function (value, key) {
                return encodeURIComponent(key) + '=' + encodeURIComponent(value);
            }).join('&');
        }


        
        function executeSuggestRequest(query, success, error) {

        
            var url = config.fritekstSokUrl + "/suggest/matrikkel/adresse/gateadresse?query="+query + '&api_key=' + config.clientKey;

            var request = $.ajax({
                crossDomain: true,
                url: url,
                type: 'GET',
                dataType: 'json',
                success: success,
                error: error
            });
        }

        function executeSearchRequest(query, success, error) {
        
            var url = config.fritekstSokUrl + "/search/matrikkel/adresse/gateadresse?query="+query  + '&api_key=' + config.clientKey;

            return $.ajax({
                crossDomain: true,
                url: url,
                type: 'GET',
                dataType: 'json',
                success: success,
                error: error
            });

        }
        
        function getSuggestionElements(suggestions) {

            var count = 0;
            var elements = _.map(suggestions, function (suggestion) {
                var element = $($suggestTemplate({ text: suggestion.Text, type: suggestion.PayLoad.Type }));
                element.attr('tabindex', count);
                element.on('click', function (event) {
                    selectSuggestion(suggestion);
                });
                element.bind('keyup', function (e) {
                    if (e.keyCode === 13) {
                        selectSuggestion(suggestion);
                    }
                });
                return element;

            });

            return elements;
        }


        function getSearchResultElements(searchResults) {

            var count = 0;
            var elements = _.map(searchResults, function (result) {
                var element = $($suggestTemplate({ text: result.Source.Text, type: result.Type }));
                element.attr('tabindex', count);
                element.on('click', function (event) {
                    selectSearchResult(result);
                });
                element.bind('keyup', function (e) {
                    if (e.keyCode === 13) {
                        selectSearchResult(result);
                    }
                });
                return element;

            });

            return elements;

        }

        $clearButton.on('click', function () {
            console.log('clear all');
            clearAll();
        });

        function clearAll() {
            clearInput();
            clearSearchResults();
            searchActive = false;
            clearSuggestions();
        }


        function clearInput() {
            if (!searchInputIsEmpty()) {
                $searchInput.val('');
            }
        }

        function clearSearchResults() {
            $searchResultContainer.empty();
            $searchResultContainer.hide();
        }

        function clearSuggestions() {
            $suggestionContainer.empty();
            $suggestionContainer.hide();
        }
        
        function searchInputIsEmpty() {
            return $searchInput.val().length === 0
        }

        function setSelectSearchResultCallback(callback) {
            selectSearchResultCallback = callback;
        }
        
        function setSelectSuggestionCallback(callback) {
            selectSuggestionCallback = callback;
        }
        

        return {
            setSelectSearchResultCallback: setSelectSearchResultCallback,
            setSelectSuggestionCallback: setSelectSuggestionCallback
        };

    };

})(wa);