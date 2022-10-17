#!/usr/bin/ruby

require "roda"
require "json"
require "./database"

class Api < Roda

    def initialize(env)
        super env
        @database = Database.new
    end

    route do |r|
        r.response["Content-Type"] = "application/json"
        r.on String do |collec|

            r.get do
                JSON.generate @database.get collec, r.params
            end

            r.post "add" do
                JSON.generate @database.add collec, JSON.parse(r.body.read)
            end

            r.post "remove" do
                JSON.generate @database.remove collec, JSON.parse(r.body.read)
            end

            r.post "edit" do
                JSON.generate @database.edit collec
            end

        end
    end

end