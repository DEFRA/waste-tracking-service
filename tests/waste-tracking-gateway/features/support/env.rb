# frozen_string_literal: true

LOCAL = { local: 'http://localhost:3000' }.freeze

# Methods relating to the env details
class Env
  def self.host_url
    (ENV['START_PAGE_URL']) || 'http://localhost:3000'
  end

end
