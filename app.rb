#!/usr/bin/ruby

require "roda"
require "./api"

class App < Roda

    route do |r|

        # /api
        r.on "api" do
            r.run Api
        end

        # /
        r.root do
            r.redirect "/displayer.html"
        end

        r.get "hello" do
            "hello you !"
        end
        
        # static files
        r.get do
            r.response["Content-Type"] = ""
            filename = "static"+r.remaining_path
            if File.file? filename
                File.read filename
            end
        end

        # error 404

    end
end