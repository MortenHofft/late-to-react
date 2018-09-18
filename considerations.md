# Questions I have for the project:

* What would be an appropriate scope?
* How should the interaction be with things that are outside scope - say species definitions/pages?
* How modular?
* What hard dependencies do we have and what can be configured.
* Browser requirements

## First thoughts
Browsing occurrences by table, map, images. Showing individual occurrences. Charts from occurrences.
Dataset, publisher and species pages are outside scope. I'm willing to consider basic dataset and publisher though.

It should be able to work as:
* A standalone explorer
* React components that you can use in other contexts
* Possibly wrapped components for non-React applications?
* As a drop in on GBIF.org - this is really a way to test how modular it is as GBIF.org is an Angular app.
* In a configurable product with CMS and possibly custom pages.
* Style should be somewhat overwritable.

Dependencies would be:
* A pipeline build ES index.
* the GBIF registry.

# UI
I like the first version I did. That version was much inspired by carto and contentful. Iterating on that seems promising. There is little initial clutter, but still configurable to show complex views. Could also be an option to ask for a designer to work with.

# Index
Probably need to build my own for developing this as the pipeline team - at this point - is occupied with other stuff, than accomodating my desires for how it should look.