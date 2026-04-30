# frozen_string_literal: true

require "yaml"

ROOT = File.expand_path("..", __dir__)
ERRORS = []

def data_file(name)
  File.join(ROOT, "_data", "#{name}.yml")
end

def load_yaml(name)
  YAML.load_file(data_file(name))
rescue Psych::Exception => e
  ERRORS << "_data/#{name}.yml is invalid YAML: #{e.message}"
  nil
end

def present?(value)
  !(value.nil? || (value.respond_to?(:empty?) && value.empty?))
end

def require_keys(record, keys, context)
  keys.each do |key|
    ERRORS << "#{context} is missing #{key}" unless record.is_a?(Hash) && present?(record[key])
  end
end

def require_key(record, key, context)
  ERRORS << "#{context} is missing #{key}" unless record.is_a?(Hash) && record.key?(key)
end

def require_array(record, key, context)
  value = record[key] if record.is_a?(Hash)
  ERRORS << "#{context}.#{key} must be a non-empty list" unless value.is_a?(Array) && value.any?
end

def require_file(path, context)
  normalized = path.to_s.sub(%r{\A/+}, "")
  ERRORS << "#{context} points to missing file #{path}" unless File.exist?(File.join(ROOT, normalized))
end

designs = load_yaml("designs") || []
profile = load_yaml("profile") || {}
work = load_yaml("work") || []
cv = load_yaml("cv") || {}
skills = load_yaml("skills") || []
publications = load_yaml("publications") || []
page_copy = load_yaml("page_copy") || {}

required_design_keys = %w[home projects cv case]
seen_designs = {}
designs.each do |design|
  context = "design #{design["value"] || "(missing value)"}"
  require_keys(design, %w[value name icon stylesheet css_budget_kb includes], context)
  value = design["value"]
  ERRORS << "#{context} value must be lowercase kebab-case" if value && value !~ /\A[a-z][a-z0-9-]*\z/
  ERRORS << "duplicate design value #{value}" if value && seen_designs[value]
  seen_designs[value] = true if value
  require_file(design["stylesheet"].to_s.sub(/\.css\z/, ".scss"), "#{context}.stylesheet") if design["stylesheet"]
  required_design_keys.each do |key|
    include_path = design.dig("includes", key)
    if include_path
      require_file(File.join("_includes", include_path), "#{context}.includes.#{key}")
    else
      ERRORS << "#{context} is missing includes.#{key}"
    end
  end
end

require_keys(profile, %w[name short_name initials role headline summary about current_work location image cv_pdf contact socials metrics skill_chips principles focus_areas], "profile")
require_file(profile["image"], "profile.image") if profile["image"]
require_file(profile["cv_pdf"], "profile.cv_pdf") if profile["cv_pdf"]
require_keys(profile["contact"], %w[email phone phone_uri], "profile.contact")
%w[github linkedin].each { |name| require_keys(profile.dig("socials", name), %w[label username url icon], "profile.socials.#{name}") }
%w[metrics principles focus_areas skill_chips].each { |key| require_array(profile, key, "profile") }

require_keys(page_copy["work"], %w[eyebrow headline intro cta_eyebrow cta_heading cta_text], "page_copy.work")
require_keys(page_copy["cv"], %w[summary_eyebrow summary_heading experience_eyebrow experience_heading work_reference_heading skills_eyebrow skills_heading education_eyebrow education_heading publications_eyebrow publications_heading], "page_copy.cv")

seen_slugs = {}
work.each_with_index do |item, index|
  context = "work[#{index}] #{item["slug"] || "(missing slug)"}"
  require_keys(item, %w[slug title eyebrow category icon description problem contribution outcome highlights stack links], context)
  slug = item["slug"]
  ERRORS << "#{context} duplicate slug #{slug}" if slug && seen_slugs[slug]
  seen_slugs[slug] = true if slug
  %w[highlights stack links].each { |key| require_array(item, key, context) }

  if item["url"].to_s.start_with?("/projects/")
    require_file(File.join("projects", "#{slug}.md"), "#{context}.url page") if slug
    require_keys(item["case"], %w[eyebrow title lede facts overview visual sections workflow architecture_heading architecture stack_heading case_stack hero_actions cta], "#{context}.case")
  end

  Array(item["screenshots"]).each_with_index do |shot, shot_index|
    require_keys(shot, %w[src alt caption], "#{context}.screenshots[#{shot_index}]")
    require_file(shot["src"], "#{context}.screenshots[#{shot_index}].src") if shot["src"]
  end

  case_data = item["case"]
  next unless case_data.is_a?(Hash)

  %w[facts overview sections architecture case_stack hero_actions].each { |key| require_array(case_data, key, "#{context}.case") }
  require_keys(case_data["workflow"], %w[label title body], "#{context}.case.workflow")
  require_keys(case_data["cta"], %w[label title body actions], "#{context}.case.cta")
  require_array(case_data["cta"], "actions", "#{context}.case.cta")

  if case_data.dig("visual", "type") == "screenshots"
    require_array(case_data, "case_screenshots", "#{context}.case")
    Array(case_data["case_screenshots"]).each_with_index do |shot, shot_index|
      require_keys(shot, %w[src alt caption], "#{context}.case.case_screenshots[#{shot_index}]")
      require_file(shot["src"], "#{context}.case.case_screenshots[#{shot_index}].src") if shot["src"]
    end
  end
end

%w[experience education].each do |section|
  require_array(cv, section, "cv")
  Array(cv[section]).each_with_index do |entry, index|
    context = "cv.#{section}[#{index}]"
    require_keys(entry, %w[id accent period title organization], context)
    if section == "experience"
      require_keys(entry, %w[summary], context)
      require_key(entry, "bullets", context)
    else
      require_keys(entry, %w[paragraphs], context)
      require_key(entry, "bullets", context)
    end
  end
end

skills.each_with_index do |group, index|
  context = "skills[#{index}]"
  require_keys(group, %w[category icon items], context)
  require_array(group, "items", context)
end

publications.each_with_index do |publication, index|
  require_keys(publication, %w[year title authors journal volume doi], "publications[#{index}]")
end

if ERRORS.any?
  warn "Content validation failed:"
  ERRORS.each { |error| warn " - #{error}" }
  exit 1
end

puts "content ok: #{work.length} project entries, #{designs.length} designs"
