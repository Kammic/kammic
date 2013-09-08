Rails.application.config.middleware.use OmniAuth::Builder do
  provider :github, '2e0806ae149248209186', '085e191637e19976595921703ce5255ce5317f6f'
end
