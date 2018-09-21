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
* In a light weight node portal

That is quite a variety of contexts. It isn't clear to me how to accomodate them all in one product.

**Other**
Style should be somewhat overwritable.
A redirect for downloads feels strange. On the other hand that is where the actual 

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

# Occurrence search architecture thoughts
individual components would need
* current filter
* queryBuilder and/or requestWrapper endpoint
* callbacks
* translation library
* general configurations

say Table
What is the filter to apply?
Where and how to ask for the table data.
What lib/file to use for translations of e.g. columns?
An update filter callback (e.g. click '+' on a country name to add it to the filters)
Where is the image cache? What endpoint/index? What to do when clicking a row (e.g. url template)?

QueryStateManager
Translation lib
QueryComposer (helps with creating queryies)

there is a hard depdency on a registry with same API and keys as the GBIF one. And an ES index with a known schema with keys corresponding to the central registry.

Start with the table, splitting data management from presentation.
But then how about 

# Hosted solution
how would it work
makes use of the occurrence search, with configurable linking to the registry.
It also has a content system and the code should only be updated one place. That is you cannot add code, customize code etc. If you need that, then you need to use the APIs and perhaps components from the hosted solution. It is in other word not an extendable product. The customizable product is the APIs and tools.
The only thing you can customize is a few styling things and how things are linked together.

Having it as one codebase means that a new site is:
a js shared between all.
a js style shared
optional custom style
local config
  endpoints
  fields
  translations
So essentially a html page and a couple of js and json files that could be hosted anywhere.

An initial assumption could be. node app to create/manage sites. they are created in github as a repo. you can edit the prose in github (later perhaps by app). Jenkins will build the sites. Ideally that hook can be done in a gerneal way or programmatically.

So 
* Node app to manage/create/edit site config and content. Will create repo and hooks in Github.
* Github repo is the actual site with config and content
* Jenkins builds and deploys. Ideally a generic build that takes data from an arbitrary site repo, builds and deploys to a hook configured destination.
* Site is static. Everyone shares a common js and css. Content database could be lunr.
* Interface translations is a generic crowdin project. Content translations is a part of the yaml frontmatter.
* Downloads links to GBIF.org
* Login if any will use GBIF.org
* Registry, ES, image cache and map servers either shared or same API but different installations.

For non-invasive updates simply update the central js/css.
For non backwards compatible changes, then transform all repo content and configurations as well.
Versioning unclear:
* each build adds a version (could check if the js had changed)? then we need to rebuild all upon js change.
* only update js if new build, but then check with ajax and suggest a reload (new version available).

# Seperate product
Create a simple portal with custom index or subset of index.
Should list
datasets, institutions
occurrence search
downloads via gbif.org
login using gbif.org credentials
have prose articles

A node app that lets you register a new site (if you are allowed to. e.g. a node manager)
A new site is essentially just a configuration and a list of articles. The node app serves all sites (or could) as they are simply one basic html, with script tags for the configurations. The content search is a build lunr index. The content is managed in the app. either using a simple on premise cms or a custom one that is simply markdown with frontmatter.


# Style inspiration
Occurrence search facet/filters
https://carto.com/blog/what-online-retailers-can-learn-mapping-sales-data/

searchbar
app.contentful

ideas for article style
prose https://tympanus.net/Tutorials/MediumStylePageTransition/#3


# Aproach
Create an index as I think it should look.

Start with occurrence standalone explorer. Proof of concept. Taking a config.

Then do a hosted site proof of concept. 
Rewrite occurrence explorer so that it can be used in this context.