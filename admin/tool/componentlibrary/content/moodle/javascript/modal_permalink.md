---
layout: docs
title: "Permalink display"
description: "A reusable modal used to display a permalink to the user"
date: 2023-02-07T14:48:00+08:00
draft: false
tags:
- MDL-76418
- "4.2"
---

## How it works

The modal is generated using a JavaScript call, usually in response to a user.

The modal displays the link, and a "Copy to clipboard" button which, when clicked, will copy the link to the clipboard and close the modal.

## Source files

* `lib/amd/src/modal_permalink.js` ({{< jsdoc module="core/modal_permalink" >}})
* `lib/templates/modal_permalink.mustache`

## Usage

The modal is automatically registered with the Modal Registry and can be invoked from any JavaScript easily using the static `create` function.

The create function takes as parameters:

- the link; and
- a title.

{{< example >}}
<button id="example-modal-permalink" data-link="https://example.com/course/view.php?id=4">
    Trigger the modal
</button>

{{#js}}
// Note: This should be written as an ESM.
// Unfortunately the Component Library cannot transpile this code at this time.
// See the following section for the ESM equivalent.
require(['core/modal_permalink', 'core/str'], function(ModalPermalink, Str) {
    document.addEventListener('click', (e) => {
        const button = e.target.closest('#example-modal-permalink');
        if (button) {
            ModalPermalink.create({
                link: button.dataset.link
            }, Str.get_string('exampletitle', 'core'));
        }
    });
});
{{/js}}
{{< /example >}}

{{< highlight javascript >}}
import ModalPermalink from 'core/modal_permalink';
import Str from 'core/str';

document.addEventListener('click', (e) => {
    const button = e.target.closest('#example-modal-permalink');
    if (button) {
        ModalPermalink.create({
            link: button.dataset.link
        }, Str.get_string('exampletitle', 'core'));
    }
});

{{< /highlight >}}
