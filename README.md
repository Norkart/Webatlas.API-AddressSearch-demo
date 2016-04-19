Notes on example implementation:
--------------------------------

The search box can be modified overriding the CSS in js/wa-search/wa-search.css and the HTML-code in index.html. Please override the css as this makes updating the libs far easier in the future. 

The library depends on jquery, underscore along with our own libraries found under js/*. In the example we use cloudflare CDN as host. 

Your API-key and endpoints are located in js/main.js. Be aware that you will need to change the API-key when going in production as this is a limited key for preview purposes. 

Please do not hesitate to reach out if you have any problems integrating the code! 


TODO
----
Implement fully working example using Typeahead.js: https://jsfiddle.net/alexanno/1929urpp/5/

Alexander (alenos@norkart.no)
