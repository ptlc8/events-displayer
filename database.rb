#!/usr/bin/ruby

require "mongo"

class Database

    MODELS = {
        "events"=>{type:Hash, content:{"id"=>{type:String}, "title"=>{type:String,required:true}, "color"=>{type:String,required:true}, "date"=>{type:String,required:true}, "time"=>{type:String,required:true}, "asso"=>{type:String}, "place"=>{type:String}, "price"=>{type:String}, "description"=>{type:String}, "poster"=>{type:String,is_file:true}, "link"=>{type:String}}},
        "assos"=>{type:Hash, content:{"id"=>{type:String}, "name"=>{type:String,required:true}, "logo"=>{type:String}}}
    }

    def initialize
        @client = Mongo::Client.new([ '127.0.0.1:27017' ], :database => 'tekiens')
    end

    def add collection, document
        if validate_model MODELS[collection], document
            return {success: @client[collection].insert_one(document).n > 0}
        else
            return {error: "Invalid model"}
        end
    end

    def get collection, params
        @client[collection].find.select do |doc|
            validate_model MODELS[collection],doc
        end
    end

    def remove collection, document
        if validate_model MODELS[collection], document
            return {success: @client[collection].delete_one(document).n > 0}
        else
            return {error: "Invalid model"}
        end
    end

    def edit collection, document
        return "editing";
    end

    def validate_model model, doc
        if model.nil? or not doc.is_a? model[:type]
            p model[:type].name+" !~= "+doc.class.name
            return false
        end
        if model[:type] == Hash
            model[:content].keys.each do |attr|
                if doc[attr].nil? and model[:content][attr][:required]
                    return false
                elsif not doc[attr].nil? and not validate_model model[:content][attr], doc[attr]
                    return false
                end
            end
            doc.delete_if do |attr, value|
                not model[:content].has_key? attr
            end
        end
        return true
    end

end