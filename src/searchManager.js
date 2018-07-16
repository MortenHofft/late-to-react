/**
 * Lav en ny med parametre om endpoint
 * Den har ansvar for at lave api kald og sørge for at anullere gamle kald. Undgå duplicates? samle flere forspørgsler i een? konstruerer requests
 * måske kommunikerer den også med routes/search strings/url og konstruerer filtre derefter.
 * holder også styr på filtre? Evt separat enhed.
 * 
 * urlmanager (ikke nødvendig. man kan have en en app uden states)
 * Sørger for at synkronisere filter og component state med url'en search params. route håndteres andetsteds.
 * 
 * filter - det centrale filter som bruges af alle andre. Giver vel mening at have som seperat enhed
 * 
 * search manager - koordinerer søgninger, så aggregater/facets samles i et kald. Kan findes i 2 udgaver, til at bruge GBIF API eller ES. Så bruger kan sige, facet=xyz, facetLimit:10, facetOffset: 20, bucketSize: 10
 * hvis syntax ikke er understøttes, så smid fejl. I så fald bruger man et filter der ikke understøttes af ens API. 
 * 
 * 
 * 
 * 
 * ideelt så kan search filtre og tabel/galleri/map/charts også bruges i en single route app eller en angular routed app. 
 * Man sætter blot et filter ind og en tabel ind der hvor det skal bruges? det virker egnetlig lidt ureliastisk. 
 * Måske er det snarere hele pakken og så kan man rykke view til en parameter. Kibana betragter view som en del af path (hash routing dog)
 */