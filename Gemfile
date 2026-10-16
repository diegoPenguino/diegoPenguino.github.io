# frozen_string_literal: true

source "https://rubygems.org"

# The site is deployed by GitHub Pages' built-in builder, which ignores this
# Gemfile and uses the pinned versions of the `github-pages` gem
# (https://pages.github.com/versions/). Using the same gem locally and in CI
# keeps local builds identical to production.
gem "github-pages", group: :jekyll_plugins

# Ruby 3.x no longer bundles these; `jekyll serve` and Jekyll 3.10 need them.
gem "webrick", "~> 1.8"
gem "csv"
gem "base64"
gem "bigdecimal"
gem "logger"

platforms :windows, :jruby do
  gem "tzinfo", ">= 1", "< 3"
  gem "tzinfo-data"
end

gem "wdm", "~> 0.1", platforms: :windows
gem "faraday-retry"
