---
layout: default
title: Subcellular Workflow Case Study
description: "Technical case study for Subcellular Workflow, a FAIR-compliant MATLAB framework for ODE biochemical pathway modeling and analysis."
permalink: /projects/subcellular-workflow/
---

<section class="case-mondrian" data-design-root="default mondrian" aria-label="Subcellular Workflow — Mondrian case study">

  {%- comment -%} Row 1-2: Hero + 4 metadata tiles {%- endcomment -%}
  <header class="mond-tile case-tile--hero">
    <p class="mond-eyebrow">Case study · scientific software</p>
    <h1 class="mond-section-title">Subcellular Workflow</h1>
    <p class="mond-section-lede">A modular, FAIR-compliant MATLAB framework for ODE biochemical pathway modeling, simulation, parameter estimation, global sensitivity analysis, and profile likelihood analysis. Thesis: <em>A workflow for developing biochemical pathway models using ordinary differential equations</em>.</p>
  </header>
  <div class="mond-tile case-tile--meta case-tile--meta-1">
    <p class="mond-eyebrow">Timeframe</p>
    <p class="case-meta__value">Jan 2016 – Mar 2025</p>
  </div>
  <div class="mond-tile case-tile--meta case-tile--meta-2">
    <p class="mond-eyebrow">Role</p>
    <p class="case-meta__value">Architect and developer</p>
  </div>
  <div class="mond-tile case-tile--meta case-tile--meta-3">
    <p class="mond-eyebrow">Domain</p>
    <p class="case-meta__value">Systems biology, neuroscience</p>
  </div>
  <div class="mond-tile case-tile--meta case-tile--meta-4">
    <p class="mond-eyebrow">Stack</p>
    <p class="case-meta__value">MATLAB, Python, COPASI, Git</p>
  </div>

  {%- comment -%} Row 3-4: Workflow diagram occupies full grid as a single tile {%- endcomment -%}
  <div class="mond-tile case-tile--workflow-visual">
    {% include workflow-diagram.html %}
  </div>

  {%- comment -%} Row 5: Architecture / pipeline strip — 4 colored cells summarising the workflow stages {%- endcomment -%}
  <div class="mond-tile case-tile--arch case-tile--arch-1">
    <p class="mond-eyebrow">Setup</p>
    <p class="case-arch__value">Model + data</p>
  </div>
  <div class="mond-tile case-tile--arch case-tile--arch-2">
    <p class="mond-eyebrow">Simulation</p>
    <p class="case-arch__value">MATLAB solvers</p>
  </div>
  <div class="mond-tile case-tile--arch case-tile--arch-3">
    <p class="mond-eyebrow">Estimation</p>
    <p class="case-arch__value">Optimization</p>
  </div>
  <div class="mond-tile case-tile--arch case-tile--arch-4">
    <p class="mond-eyebrow">Analysis</p>
    <p class="case-arch__value">Sensitivity / PLA</p>
  </div>
  <div class="mond-tile case-tile--arch case-tile--arch-5">
    <p class="mond-eyebrow">Standards</p>
    <p class="case-arch__value">SBML / SBtab</p>
  </div>
  <div class="mond-tile case-tile--arch case-tile--arch-6">
    <p class="mond-eyebrow">Output</p>
    <p class="case-arch__value">Validated results</p>
  </div>

  {%- comment -%} Row 6-7: Problem and Contribution — coloured tiles {%- endcomment -%}
  <article class="mond-tile mond-tile--red case-tile--problem">
    <p class="mond-eyebrow">Problem</p>
    <h2>Make biochemical pathway modeling reproducible and adoptable.</h2>
    <p>ODE-based biological models can be hard to build, parameterize, analyze, and share when each lab relies on bespoke scripts. The goal was a workflow that supports initialization, simulation, parameter estimation, sensitivity analysis, and profile likelihood analysis while following FAIR principles.</p>
  </article>
  <article class="mond-tile mond-tile--blue case-tile--ownership">
    <p class="mond-eyebrow">Contribution</p>
    <h2>Designed the framework and implemented the analysis pipeline.</h2>
    <p>I architected and built the framework, implemented algorithms from the scientific literature, engineered interfaces between MATLAB solvers and COPASI, created documentation, and managed Git/GitHub collaboration across institutions.</p>
  </article>

  {%- comment -%} Row 8-9: Implementation details — section heading + 3 capability tiles {%- endcomment -%}
  <header class="mond-tile case-tile--section-head case-tile--behavior-head">
    <p class="mond-eyebrow">Implementation details</p>
    <h2 class="mond-section-title">Core capabilities</h2>
  </header>
  <article class="mond-tile case-tile--behavior case-tile--behavior-1">
    <div class="case-feat__icon">{% include icon.html name="cogs" %}</div>
    <h3>Model setup</h3>
    <p>Structured model initialization and data handling for biochemical pathway models, with attention to standard formats like SBML and SBtab.</p>
  </article>
  <article class="mond-tile case-tile--behavior case-tile--behavior-2">
    <div class="case-feat__icon">{% include icon.html name="sliders" %}</div>
    <h3>Parameterization</h3>
    <p>Methods for parameter estimation and model calibration using MATLAB and scientific optimization tooling.</p>
  </article>
  <article class="mond-tile case-tile--behavior case-tile--behavior-3">
    <div class="case-feat__icon">{% include icon.html name="search" %}</div>
    <h3>Model analysis</h3>
    <p>Local and global sensitivity analysis plus profile likelihood analysis to understand model behavior and parameter identifiability.</p>
  </article>

  {%- comment -%} Row 10-11: Validation header + 3 model tiles {%- endcomment -%}
  <header class="mond-tile case-tile--section-head case-tile--eng-head">
    <p class="mond-eyebrow">Validation</p>
    <h2 class="mond-section-title">From simple motifs to basal ganglia signaling</h2>
  </header>
  <article class="mond-tile case-tile--eng case-tile--eng-1">
    <div class="case-feat__icon">{% include icon.html name="cogs" %}</div>
    <h3>LIRMO &amp; LIREM</h3>
    <p>Ligand-receptor interactions and ligand-receptor-effector responses validated as small reference models for the workflow.</p>
  </article>
  <article class="mond-tile case-tile--eng case-tile--eng-2">
    <div class="case-feat__icon">{% include icon.html name="sliders" %}</div>
    <h3>TM-M (CaMKII)</h3>
    <p>Translated complex CaMKII autophosphorylation dynamics into ODE form for medium-scale validation.</p>
  </article>
  <article class="mond-tile case-tile--eng case-tile--eng-3">
    <div class="case-feat__icon">{% include icon.html name="search" %}</div>
    <h3>G-PIPK striatal model</h3>
    <p>Pushed the framework into larger parameter spaces — intensive parameter estimation and PLA on an Intel i9-10980XE workstation. Resulted in a peer-reviewed Neuroinformatics paper.</p>
  </article>

  {%- comment -%} Row 12-13: Workflow + Stack chips {%- endcomment -%}
  <article class="mond-tile case-tile--workflow">
    <p class="mond-eyebrow">Workflow</p>
    <h2>FAIR-compliant scientific code with standard-tool interoperability.</h2>
    <p>The framework follows FAIR principles for findable, accessible, interoperable, and reusable research software, integrates standard formats, and uses Git workflows for cross-institutional collaboration.</p>
  </article>
  <div class="mond-tile case-tile--stack-head">
    <p class="mond-eyebrow">Stack</p>
    <h3 class="mond-section-title">Scientific software stack</h3>
  </div>
  {%- assign stack = "MATLAB,SimBiology,Optimization Toolbox,Python,COPASI,Git/GitHub,SBML,SBtab" | split: "," -%}
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

  {%- comment -%} Row 14: CTA {%- endcomment -%}
  <div class="mond-tile case-tile--cta-head">
    <p class="mond-eyebrow">Related work</p>
    <h2 class="mond-section-title">See more</h2>
    <p>Browse all projects or review the CV for the broader research and publication context.</p>
  </div>
  <div class="mond-tile case-tile--cta-actions">
    <a href="https://github.com/jpgsantos/Subcellular_Workflow" target="_blank" rel="noopener noreferrer" class="mond-button mond-button--primary">
      {% include icon.html name="github" %} GitHub
    </a>
    <a href="https://subcellular-workflow.readthedocs.io/" target="_blank" rel="noopener noreferrer" class="mond-button">
      {% include icon.html name="book" %} Docs
    </a>
    <a href="https://doi.org/10.1007/s12021-021-09546-3" target="_blank" rel="noopener noreferrer" class="mond-button">
      {% include icon.html name="file" %} Publication
    </a>
    <a href="{{ '/projects/' | relative_url }}" class="mond-button">
      {% include icon.html name="arrow-right" %} All work
    </a>
    <a href="{{ '/cv/' | relative_url }}" class="mond-button">
      {% include icon.html name="file" %} CV
    </a>
  </div>

</section>
