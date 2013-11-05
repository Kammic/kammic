require 'spec_helper'

describe 'books controller' do
  it 'can route to the refresh path' do
    expect(get '/books/1/refresh').to route_to(controller: "books",
                                               action:     "refresh",
                                               "book_id" =>  "1")
  end

  it 'can route to the queue_build path' do
    expect(get '/books/1/queue_build').to route_to(controller: "books",
                                                   action:     "queue",
                                                   "book_id" =>  "1")
  end

  it 'can route to the queue_build path' do
    expect(get '/books/1/builds').to route_to(controller: "books",
                                              action: "builds",
                                              "book_id" =>  "1")
  end
end
