Rails.application.config.middleware.use OmniAuth::Builder do
  provider :github, '2e0806ae149248209186', '84db43fbe23682d7eccb499ea57aebd015fc339e'
end
