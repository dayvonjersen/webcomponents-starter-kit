# webcomponents-starter-kit

A working directory to create WebComponents with [Bosonic](http://bosonic.github.io/) with minimal overhead.

---

## Why

>"Web Components" is not another term for [Google Polymer](https://www.polymer-project.org/). Polymer is a framework that is based on Web Components technologies. You can make and use Web Components without Polymer.


## Read first

[Source of above quote](https://developer.mozilla.org/en-US/docs/Web/Web_Components)

[The Spec](http://w3c.github.io/webcomponents/spec/custom/)

[The state of Web Components - June 2015](https://hacks.mozilla.org/2015/06/the-state-of-web-components/)

[Bosonic](https://bosonic.github.io/)

## Install

    git clone git@github.com:dayvonjersen/webcomponents-starter-kit
    cd webcomponents-starter-kit
    npm install
    
These readmes usually have a pretentious-looking file listing

    ├── bosonic-polyfills.js
    ├── bosonic-polyfills.min.js
    ├── build_all_webcomponents.sh
    ├── components
    │   └── .keep
    ├── components-src
    │   ├── build.sh
    │   └── .new-element.html
    ├── .gitignore
    ├── index.js
    ├── node_modules
    │   ├── bosonic
    │   └── bosonic-transpiler
    └── package.json



## Make it

Boilerplate available ([breakdown/explanation](#breakdown))

    vim components-src/.new-element.html
    
    (...make some changes)
    
    :sav my-custom-element.html
    
## Build it

    ./build_all_webcomponents.sh
    
Or individually

    cd components-src && ./build.sh my-custom-element
    
Or don't use the shell scripts

    node index.js my-custom-element

Or use [grunt-bosonic](https://github.com/bosonic/grunt-bosonic) or [yeoman-bosonic](https://github.com/bosonic/yeoman-bosonic) from the author and stop reading this.

## Use it in an html

    <script src="bosonic-polyfills.js"></script>
    <script src="components/my-custom-element.js"></script>
    <link  href="components/my-custom-element.css" rel="stylesheet">
    
    <my-custom-element>wow</my-custom-element>

## What's the point of Web Components?

They're useful if you're creating custom behaviors and appearances for elements which requires a complex HTML structure and/or JavaScript (and possibly an initialization step).

An example of what I'm talking about are the awesome things Mary Lou often makes for codrops including custom [select elements](http://tympanus.net/codrops/2014/07/10/inspiration-for-custom-select-elements/), [text input fields](http://tympanus.net/codrops/2015/03/18/inspiration-text-input-effects-2/), [buttons](http://tympanus.net/codrops/2015/02/26/inspiration-button-styles-effects/), and [much more](http://tympanus.net/codrops/).

While getting the HTML boilerplate sorted out and firing off an initialization process when the DOM is ready is fine for a standalone demo, using such elements in a web application with additional page logic and structure can quickly turn into a hairy mess.

WebComponents can allow you to...componentize these elements into self-contained files such that you just include the polyfill and the compiled assets and use the custom element without needing to initialize it first.

## No but why use this over the alternatives

Bosonic is the lightest, cleanest, most sane, and most standards-compliant implementation (that is to say, the code you write today will likely require the least amount of modification if/when webcomponents are natively supported in the browser).

The polyfills provided by Bosonic, selected from The Polymer Authors(r)(c)(tm) work in all major browsers *right now* and the Javascript boilerplate transpilation process (indeed, all Bosonic actually does) makes writing custom elements easy.

However, the author's tools [grunt-bosonic](https://github.com/bosonic/grunt-bosonic) and [yeoman-bosonic](https://github.com/bosonic/yeoman-bosonic) both require a ridiculous amount (100+MB) of dependencies and require a manual edit of the Gruntfile.js (or another 100+MB directory)

I made sense of what was needed and cut out the fat. I thought I'd share my workflow with you, dear reader.

There's also Polymer and React.js (google them)

## Breakdown

**Start with an element tag**

    <element name="your-custom-element">

Yes, the spec has since removed the HTMLElementElement but Bosonic needs it.

The `name` attribute must be **lowercase** and contain at least **one dash** and ***not be any of the following***: `annotation-xml`, `color-profile`,`font-face`,`font-face-src`,`font-face-uri`,`font-face-format`,`font-face-name`,`missing-glyph`.

My personal suggestion would be to prefix/namespace all custom elements you create. If you don't have a brand or project name, come up with something obnoxiously trendy and clever, like a food item, pun, or something misspelled. Preferably all three.

**Stylesheet for element**

    <style>

    </style>
    
After compilation, all rules in this stylesheet will be prepended with **your-custom-element**, i.e.

    button { border-radius: 2px; }
    
will become

    your-custom-element button { border-radius: 2px; }
    

**Template for inner structure of element**

    <template>
    
    </template>

**Javascript**

    <script>
        // object literal for this element
        ({
            createdCallback: function() {
                //called when a custom element is created.

                //almost always required 
                this.appendChild(this.template.content.cloneNode(true));
            },
            attachedCallback: function() {
                //called when a custom element is inserted into a DOM subtree.
            },
            detachedCallback: function() {
                //called when a custom element is removed from a DOM subtree.
            },
            attributeChangedCallback: function(attributeName) {
                //called when a custom element's attribute value has changed.
            },
            childListChangedCallback: function(removedNodes, addedNodes) {
                //called when a user of your element updates its DOM children.
            }
        });
    </script>
    
The empty object definition is the **prototype** for your-custom-element. You can add additional JavaScript before this object definition and be able to access it within the object definition.

After compilation, the whole of this script tag will be inside a closure.

### Gotchas

*These are specific to Bosonic*

## &lt;script&gt;

You can only have one script tag, so no external scripts.

The compiled JavaScript will turn the object definition into a *different* object definition, so usage of the keyword **this** will not be reliable in event callbacks.

To get around this, I found having a utility function something like

    function findParent(youarehere, targetPrototype) {
        var finding = youarehere.constructor.name;
        for(;;) {
            if(youarehere === null || youarehere instanceof HTMLHtmlElement) {
                    console.log("Could not find parent of " + finding + " matching " + targetPrototype.name);
                    break;
            }
            if(youarehere instanceof targetPrototype)
                return youarehere;
            youarehere = youarehere.parentElement;
        }
    }

Can then be applied to event handler callbacks

    function clickHandler(evnt) {
        var parent = findParent(evnt.target,YourCustomElement);
        // use parent instead of this ...
             
    }
    
Yes, after being document.registerElement()'d, your prototype will be named with **PascalCase** e.g.

    <your-custom-element> => YourCustomElement

## &lt;template&gt;

Cannot start with (or possibly even contain) HTML comments (&lt;!-- these things --&gt;)

`<template>` is actually a real HTML element now btw.

## &lt;style&gt;

Cannot *start* with a comment.

To get around the fact that ShadowDOM isn't implemented (or indeed even drafted yet), Bosonic adds the custom-element name before every css rule, however this is nothing like actual ShadowDOM encapsulation **and other stylesheets *will* affect your element's DOM**

Similarly, if you wish to reach *outside* your element with these styles (which technically speaking you aren't supposed to do, I guess), keep in mind that **all rules are prepended with your custom-element name except for the element itself**

<table><tr><th>selector</th><th>becomes</th></tr>
<tr><td>button</td><td>your-custom-element button</td></tr>
<tr><td>body > header p</td><td>your-custom-element body > header p</td></tr>
<tr><td>your-custom-element:hover</td><td>your-custom-element:hover</td></tr></table>

This can cause serious headaches with specificity and the like. Bosonic does provide the ShadowDOM polyfill so you're welcome to mess with that (I haven't yet, will report when I do)

o/

## License

[wtfpl](http://www.wtfpl.net/txt/copying) 2015
             
             
             
             
             
             
             
             
             
             
             
             
             
             
             
             
             
             
             
