require 'spec_helper'

describe 'repos controller' do
  it 'can route to the refresh path' do
    expect(get '/repos/refresh').to route_to(controller: "repos",
                                             action:   "refresh")
  end

  it 'can route to the index path' do
    expect(get '/repos/').to route_to(controller: "repos",
                                      action:   "index")
  end

  it 'can route to the editor' do 
    expect(get '/repos/1/edit').to route_to(controller: "editor",
                                            action:   "index",
                                            id: '1')
  end

  it 'can route to the build path' do
    expect(get '/repos/1/build').to route_to(controller: "repos",
                                             action:   "build",
                                             id: '1')
  end

  it 'can route to the follow path' do
    expect(get '/repos/1/follow').to route_to(controller: "repos",
                                             action:   "follow",
                                             id: '1')
  end
end
