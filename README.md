Notes on example implementation:

The folder contains a running example integration of the code-library in js/rooftopMap.js. The initialization of the complete map along with the data service interaction can be found in js/main.js where you’re able to specify  the id of the div-container to keep the map. The center+zoom of the map and callbacks for click and error. You may find the Norwegian: “takflate” - this means “rooftop”. 

The search box can be modified overriding the CSS in js/wa-search/wa-search.css and the HTML-code in index.html. Please override the css as this makes updating the libs far easier in the future. 

The library depends on leaflet, jquery, underscore along with our own libraries found under js/*. In the example we use cloudflare CDN as host. 

Your API-key and endpoints are located in js/rooftopMap.js. Be aware that you will need to change the API-key when going in production as this is a limited key for preview purposes. 

Please do not hesitate to reach out if you have any problems integrating the code! 

Alexander (alenos@norkart.no)