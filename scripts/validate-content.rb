# frozen_string_literal: true

require "yaml"
require "open3"
require "set"

ROOT = File.expand_path("..", __dir__)
ERRORS = []

def git_tracked_files
  stdout, _stderr, status = Open3.capture3("git", "-C", ROOT, "ls-files", "-z")
  return nil unless status.success?

  stdout.split("\0").reject(&:empty?).to_set
end

TRACKED_FILES = git_tracked_files

def data_file(name)
  File.join(ROOT, "_data", "#{name}.yml")
end

def load_yaml(name)
  YAML.load_file(data_file(name))
rescue Psych::Exception => e
  ERRORS << "_data/#{name}.yml is invalid YAML: #{e.message}"
  nil
end

def load_config
  YAML.load_file(File.join(ROOT, "_config.yml"))
rescue Psych::Exception => e
  ERRORS << "_config.yml is invalid YAML: #{e.message}"
  {}
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

def normalize_site_path(path)
  path.to_s.tr("\\", "/").sub(%r{\A/+}, "")
end

def exact_file?(path)
  parts = normalize_site_path(path).split("/")
  return false if parts.empty? || parts.any? { |part| part.empty? || part == ".." || part == "." }

  current = ROOT
  parts.each do |part|
    entries = Dir.children(current)
    return false unless entries.include?(part)

    current = File.join(current, part)
  rescue Errno::ENOENT, Errno::ENOTDIR
    return false
  end

  File.file?(current)
end

def require_file(path, context)
  normalized = normalize_site_path(path)
  unless exact_file?(normalized)
    ERRORS << "#{context} points to missing file #{path}"
    return
  end

  return unless TRACKED_FILES && !TRACKED_FILES.include?(normalized)

  ERRORS << "#{context} points to untracked file #{path}"
end

def source_templates
  if TRACKED_FILES
    TRACKED_FILES.select do |path|
      path.end_with?(".html", ".md") && !path.start_with?("_site/", "_site_preview/")
    end
  else
    Dir.glob(File.join(ROOT, "**", "*.{html,md}")).filter_map do |path|
      relative = path.delete_prefix("#{ROOT}#{File::SEPARATOR}").tr("\\", "/")
      relative unless relative.start_with?("_site/", "_site_preview/", ".jekyll-cache/")
    end
  end
end

def validate_static_includes
  source_templates.each do |relative|
    File.foreach(File.join(ROOT, relative)).with_index(1) do |line, index|
      line.scan(/{%\s*include\s+([^\s%]+)[^%]*%}/) do |matches|
        include_path = matches.first
        next if include_path.include?("{") || include_path.include?("}")

        require_file(File.join("_includes", include_path), "#{relative}:#{index} include #{include_path}")
      end
    end
  rescue Errno::ENOENT
    ERRORS << "tracked source template is missing #{relative}"
  end
end

designs = load_yaml("designs") || []
config = load_config
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

require_file(config["og_image"], "config.og_image") if config["og_image"]
validate_static_includes

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
