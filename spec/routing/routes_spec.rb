require 'spec_helper'

describe 'Routes' do
  it 'routes to the user login path' do 
    expect(get '/user/login').to route_to(controller: "user",
                                          action:     "login")
  end

  it 'routes to the user logout path' do  
    expect(get '/user/logout').to route_to(controller: "user",
                                          action:     "logout")
  end

  it 'routes to the login callback path' do 
    expect(get '/user/login/callback').to route_to(controller: "omniauth_github",
                                                   action:     "callback")
  end

  it 'routes to the github callback path' do
    expect(get '/auth/github/callback').to route_to(controller: "omniauth_github",
                                                    action:     "callback")
  end

end
