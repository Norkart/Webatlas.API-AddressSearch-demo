var Norkart = this.Norkart || {};


/** Code for implementing Norkart.Search */
Norkart.searchExample = {};

(function (ns) {

	ns.options = {
		apikey: 'INSERT YOU APIKEY HERE',
		WAAPIsearchUrl: 'http://www.webatlas.no/waapi-fritekstsok'//do not change
	};
	ns.addSearchbox = function(options) {
        var config = {
            fritekstSokUrl : ns.options.WAAPIsearchUrl,
            clientKey: ns.options.apikey
        }
        
        var search = new wa.Search(config);
        
        search.setSelectSuggestionCallback(function(suggestion) {
        	/**Change this to call your code for handling the suggestion-result*/
        	/**Notice: the result structure differs from search result structure*/
        	console.log(suggestion);
        });
        
        search.setSelectSearchResultCallback(function(result) {
        	/**Change this to call your code for handling the search-result*/
        	/**Notice: the result structure differs from suggestion result structure*/
        	console.log(result);
        });
	};

})(Norkart.searchExample);

/**Code for initiating example implementation */
Norkart.searchExample.addSearchbox();
