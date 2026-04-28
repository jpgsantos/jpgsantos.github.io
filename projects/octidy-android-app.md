---
layout: default
title: Octidy Android App Case Study
description: "Technical case study for Octidy, a Kotlin Android application built with Jetpack Compose, Hilt, Firebase Auth, Firestore, WorkManager, and Play Console testing."
permalink: /projects/octidy-android-app/
---

<section class="case-mondrian" data-design-root="default mondrian" aria-label="Octidy Android App — Mondrian case study">

  {%- comment -%} Row 1-2: Hero — title tile + 4 metadata tiles {%- endcomment -%}
  <header class="mond-tile case-tile--hero">
    <p class="mond-eyebrow">Case study · Android engineering</p>
    <h1 class="mond-section-title">Octidy Android App</h1>
    <p class="mond-section-lede">A Firebase-first Android application for coordinating household chores through bidding, assignment, and progress tracking. I founded the project in 2025 and built the app independently from concept to Play Store testing.</p>
  </header>
  <div class="mond-tile case-tile--meta case-tile--meta-1">
    <p class="mond-eyebrow">Timeframe</p>
    <p class="case-meta__value">2025-present</p>
  </div>
  <div class="mond-tile case-tile--meta case-tile--meta-2">
    <p class="mond-eyebrow">Role</p>
    <p class="case-meta__value">Founder, solo developer</p>
  </div>
  <div class="mond-tile case-tile--meta case-tile--meta-3">
    <p class="mond-eyebrow">Status</p>
    <p class="case-meta__value">Play Store testing</p>
  </div>
  <div class="mond-tile case-tile--meta case-tile--meta-4">
    <p class="mond-eyebrow">Stack</p>
    <p class="case-meta__value">Kotlin, Compose, Firestore, Hilt</p>
  </div>

  {%- comment -%} Phone screenshots gallery — single tile so the surround is paper, not the page-grid ink. {%- endcomment -%}
  <div class="mond-tile case-tile--screenshots">
    <figure class="case-shot">
      <span class="case-shot__frame">{% include project-screenshot.html src="/assets/images/projects/octidy-dashboard.png" alt="Octidy shared household chores dashboard" loading="lazy" width="1080" height="2400" %}</span>
      <figcaption>Shared dashboard</figcaption>
    </figure>
    <figure class="case-shot">
      <span class="case-shot__frame">{% include project-screenshot.html src="/assets/images/projects/octidy-bidding.png" alt="Octidy household chore bidding screen" loading="lazy" width="1080" height="2400" %}</span>
      <figcaption>Bidding flow</figcaption>
    </figure>
    <figure class="case-shot">
      <span class="case-shot__frame">{% include project-screenshot.html src="/assets/images/projects/octidy-create-task.png" alt="Octidy create household task screen" loading="lazy" width="1080" height="2400" %}</span>
      <figcaption>Create task</figcaption>
    </figure>
    <figure class="case-shot">
      <span class="case-shot__frame">{% include project-screenshot.html src="/assets/images/projects/octidy-assigned-task.png" alt="Octidy assigned household task screen" loading="lazy" width="1080" height="2400" %}</span>
      <figcaption>Assignment</figcaption>
    </figure>
    <figure class="case-shot">
      <span class="case-shot__frame">{% include project-screenshot.html src="/assets/images/projects/octidy-calendar.png" alt="Octidy household chores calendar screen" loading="lazy" width="1080" height="2400" %}</span>
      <figcaption>Calendar</figcaption>
    </figure>
  </div>

  {%- comment -%} Row 5: Architecture — 6 flat tiles {%- endcomment -%}
  <div class="mond-tile case-tile--arch case-tile--arch-1">
    <p class="mond-eyebrow">UI</p>
    <p class="case-arch__value">Jetpack Compose</p>
  </div>
  <div class="mond-tile case-tile--arch case-tile--arch-2">
    <p class="mond-eyebrow">State</p>
    <p class="case-arch__value">ViewModel + Flow</p>
  </div>
  <div class="mond-tile case-tile--arch case-tile--arch-3">
    <p class="mond-eyebrow">Data</p>
    <p class="case-arch__value">Firestore</p>
  </div>
  <div class="mond-tile case-tile--arch case-tile--arch-4">
    <p class="mond-eyebrow">Work</p>
    <p class="case-arch__value">WorkManager</p>
  </div>
  <div class="mond-tile case-tile--arch case-tile--arch-5">
    <p class="mond-eyebrow">Sync</p>
    <p class="case-arch__value">Snapshot listeners</p>
  </div>
  <div class="mond-tile case-tile--arch case-tile--arch-6">
    <p class="mond-eyebrow">Release</p>
    <p class="case-arch__value">Play Console</p>
  </div>

  {%- comment -%} Row 6-7: Problem and Ownership — 2 flat tiles spanning the row {%- endcomment -%}
  <article class="mond-tile mond-tile--red case-tile--problem">
    <p class="mond-eyebrow">Problem</p>
    <h2>Make household chores feel fair without negotiation overhead.</h2>
    <p>Octidy turns an everyday coordination problem into a product workflow: people create chores, household members bid the number of points they would accept, the lowest bid wins, and completed work updates household progress transparently.</p>
  </article>
  <article class="mond-tile mond-tile--blue case-tile--ownership">
    <p class="mond-eyebrow">Ownership</p>
    <h2>End-to-end delivery from concept to Play Console testing.</h2>
    <p>I handled the full development lifecycle: product definition, architecture, Firebase data modeling, responsive Compose UI, offline behavior, realtime sync, background deadlines, notifications, testing, Git workflow, documentation, production packaging, and Play Console deployment.</p>
  </article>

  {%- comment -%} Row 8-9: Product behavior — section heading + 3 flat tiles {%- endcomment -%}
  <header class="mond-tile case-tile--section-head case-tile--behavior-head">
    <p class="mond-eyebrow">Product behavior</p>
    <h2 class="mond-section-title">Core app flows</h2>
  </header>
  <article class="mond-tile case-tile--behavior case-tile--behavior-1">
    <div class="case-feat__icon">{% include icon.html name="users" %}</div>
    <h3>Households</h3>
    <p>Users authenticate with Firebase Auth, create or join houses with invite codes, and keep separate spaces for roommates, couples, or families.</p>
  </article>
  <article class="mond-tile case-tile--behavior case-tile--behavior-2">
    <div class="case-feat__icon">{% include icon.html name="target" %}</div>
    <h3>Bidding</h3>
    <p>Members bid on chores before a deadline. The app assigns the task to the lowest bidder and handles ties explicitly instead of hiding edge cases.</p>
  </article>
  <article class="mond-tile case-tile--behavior case-tile--behavior-3">
    <div class="case-feat__icon">{% include icon.html name="calendar-check" %}</div>
    <h3>Accountability</h3>
    <p>Recurring chores, due dates, calendar views, local notifications, and progress statistics keep effort visible over time.</p>
  </article>

  {%- comment -%} Row 10-11: Engineering choices — section heading + 3 flat tiles {%- endcomment -%}
  <header class="mond-tile case-tile--section-head case-tile--eng-head">
    <p class="mond-eyebrow">Implementation details</p>
    <h2 class="mond-section-title">Engineering choices</h2>
  </header>
  <article class="mond-tile case-tile--eng case-tile--eng-1">
    <div class="case-feat__icon">{% include icon.html name="android" %}</div>
    <h3>Modern Android UI</h3>
    <p>Used Kotlin, Jetpack Compose, Navigation Compose, semantic typography, and responsive layouts for compact phones and tablets.</p>
  </article>
  <article class="mond-tile case-tile--eng case-tile--eng-2">
    <div class="case-feat__icon">{% include icon.html name="database" %}</div>
    <h3>Realtime data layer</h3>
    <p>Structured a Firebase-first architecture around Firestore snapshot listeners, offline persistence, cached reads/writes, repository flows, ViewModels, and Hilt.</p>
  </article>
  <article class="mond-tile case-tile--eng case-tile--eng-3">
    <div class="case-feat__icon">{% include icon.html name="calendar-check" %}</div>
    <h3>Background work</h3>
    <p>Used WorkManager for task deadlines and reminders, with Android notification channels and deep links into the relevant task flow.</p>
  </article>

  {%- comment -%} Row 12: Workflow + Stack chips {%- endcomment -%}
  <article class="mond-tile case-tile--workflow">
    <p class="mond-eyebrow">Workflow</p>
    <h2>Collaborator-ready process, even as a solo project.</h2>
    <p>The project includes Git workflows and documentation intended to make future collaboration easier. I also used LLM-assisted programming to accelerate implementation where it improved speed without sacrificing code quality.</p>
  </article>
  <div class="mond-tile case-tile--stack-head">
    <p class="mond-eyebrow">Stack</p>
    <h3 class="mond-section-title">Android product stack</h3>
  </div>
  {%- assign stack = "Kotlin,Android Studio,Jetpack Compose,Navigation Compose,ViewModel,Hilt,Firestore,Firebase Auth,Coroutines/Flow,WorkManager,Play Console" | split: "," -%}
  {%- assign stack_count = stack | size -%}
  {%- if stack_count <= 4 -%}
    {%- assign s_cols = stack_count -%}
  {%- else -%}
    {%- assign s_cols = stack_count | divided_by: 2.0 | ceil -%}
  {%- endif -%}
  {%- assign s_partial = stack_count | modulo: s_cols -%}
  {%- assign s_full_rows = stack_count | divided_by: s_cols -%}
  {%- if s_partial > 0 -%}
    {%- assign s_grid = s_cols | times: s_partial -%}
    {%- assign s_normal = s_partial -%}
    {%- assign s_partial_span = s_cols -%}
  {%- else -%}
    {%- assign s_grid = s_cols -%}
    {%- assign s_normal = 1 -%}
    {%- assign s_partial_span = 1 -%}
  {%- endif -%}
  <div class="mond-tile case-tile--stack-chips proj-chips" style="grid-template-columns: repeat({{ s_grid }}, 1fr);">
    {%- for s in stack -%}
      {%- assign idx0 = forloop.index0 -%}
      {%- assign row0 = idx0 | divided_by: s_cols -%}
      {%- assign in_partial = false -%}
      {%- if s_partial > 0 and row0 == s_full_rows -%}{%- assign in_partial = true -%}{%- endif -%}
      {%- if in_partial -%}{%- assign span = s_partial_span -%}{%- else -%}{%- assign span = s_normal -%}{%- endif -%}
      {%- assign extra = "" -%}
      {%- assign next_idx = idx0 | plus: 1 -%}
      {%- assign next_row0 = next_idx | divided_by: s_cols -%}
      {%- if forloop.last or next_row0 != row0 -%}{%- assign extra = extra | append: " no-br" -%}{%- endif -%}
      {%- if s_partial > 0 -%}
        {%- if row0 == s_full_rows -%}{%- assign extra = extra | append: " no-bb" -%}{%- endif -%}
      {%- else -%}
        {%- assign last_row0 = s_full_rows | minus: 1 -%}
        {%- if row0 == last_row0 -%}{%- assign extra = extra | append: " no-bb" -%}{%- endif -%}
      {%- endif -%}
      <span style="grid-column: span {{ span }};"{% if extra != "" %} class="{{ extra | strip }}"{% endif %}>{{ s }}</span>
    {%- endfor -%}
  </div>

  {%- comment -%} Row 13: CTA — heading + button row {%- endcomment -%}
  <div class="mond-tile case-tile--cta-head">
    <p class="mond-eyebrow">Related work</p>
    <h2 class="mond-section-title">See more</h2>
    <p>Browse all projects or review the CV for the broader research and software background.</p>
  </div>
  <div class="mond-tile case-tile--cta-actions">
    <a href="{{ '/projects/' | relative_url }}" class="mond-button mond-button--primary">
      {% include icon.html name="arrow-right" %} All work
    </a>
    <a href="{{ '/cv/' | relative_url }}" class="mond-button">
      {% include icon.html name="file" %} CV
    </a>
  </div>

</section>
