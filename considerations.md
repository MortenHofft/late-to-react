# Questions I have for the project:

* What would be an appropriate scope?
* How should the interaction be with things that are outside scope - say species definitions/pages?
* How modular? Where could/should it be used?
* What hard dependencies do we have and what can be configured.
* Browser requirements
* How should downloads work?

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
* A redirect for downloads feels strange. On the other hand that is where the actual 

Dependencies would be:
* A pipeline build ES index.
* The GBIF registry.
* Image cache?
* A map-server for maps

# UI
I like the first version I did. That version was much inspired by carto and contentful. Iterating on that seems promising. There is little initial clutter, but still configurable to show complex views. Could also be an option to ask for a designer to work with.

# Index
Probably need to build my own for developing this as the pipeline team - at this point - is occupied with other stuff, than accomodating my desires for how it should look.

--------------

How to represent queries internally. As ES or own syntax? Should all of ES queries be available or only a subset?
for gallery tab and image tabs it is necessary to extend the filter. Free text isn't a filter, but a query (so it is scored).
Perhaps additional filters can be handles by simple nesting. Then there is no need to parse the query to extend it.

State handling should be a seperate component, so that url isn't a required or can be mapped to another scheme.

For it to work on GBIF.org it would have to:
* support custom url mapping (including none)
* custom styling

If used as seperate components, then having a central unit where the individual components are all registered is needed. This will coordinate messages, update filters, and serve as an interface for events.
If that should be possible, then using flux instead seems neccessary as components could be in different parts of the DOM?
Alternatively only support the explorer as one block. The latter seems by far the easiest.

The table as a component, that takes a state and some callbacks. 
The coordinater as a component
