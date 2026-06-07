# Format: Explainer

**Use when** the goal is *understanding* — "explain how X works", a concept
walkthrough, a process breakdown, an educational piece. One reader, reading
through, building a mental model.

**Personality:** calm, read-through, diagram-forward. Each section advances one
idea; a diagram or callout does the heavy lifting so the prose can stay short.

## Spine

1. **Header + headline** — the thing being explained, stated plainly.
2. **Intro** — one bolded sentence that gives the whole idea in a nutshell, so a
   reader knows the destination before the journey.
3. **Sections, one concept each** — build in order. Lead each with the takeaway,
   then *show* the mechanism with a diagram, and use callouts for the key insight
   or a common gotcha. Use a numbered `steps` block for sequential processes.
4. **Recap / "so what"** — a short closing that ties it together.

## Markup

Diagrams (inline SVG) are the workhorse — see `components.md#diagram-inline-svg`.
Two explainer-specific blocks:

**Callout** — pull a key idea or caveat out of the flow:

```html
<div class="callout callout--key">
  <strong>The key idea:</strong> one or two sentences that are the thing to
  remember from this section.
</div>
```

(`callout--key` for the central insight; plain `callout` for an aside or note.)

**Steps** — a numbered sequence for a process:

```html
<ol class="steps">
  <li><h4>First, the trigger</h4><p>What kicks the process off.</p></li>
  <li><h4>Then, the work</h4><p>What happens in the middle.</p></li>
  <li><h4>Finally, the result</h4><p>What you end up with.</p></li>
</ol>
```

These live inside an `.item-body`, or as a direct child of `.report-section` for
full width.

## Build notes

Reach for a diagram whenever a point is about structure, flow, or relationship —
it's almost always clearer than a paragraph. Keep prose lean; the test is whether
someone could follow the diagrams and callouts alone and still get it.
