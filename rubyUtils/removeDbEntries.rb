require 'couchrest'
require  'yaml'
dir = ARGV[0]
if dir == ""
  dir = '_design/basic_views/_view/classifyResults'
else
  dir = '_design/basic_views/_view/' + dir
end

dbname = "ret_images/"

#connect to db, create if does not exist
db = CouchRest.database!("http://127.0.0.1:54956/#{dbname}")


#docs=CouchRest.get("http://localhost:54956/#{dbname}/_all_docs?include_docs=true")


#docs.each do |d|
#  puts d
#end

## creating a view
=begin
db.save_doc({"_id" => "_design/test",:views => {:test => {:map =>
    "function(doc) {


    emit(doc.winner, doc);

}}})
=end


res= db.view(dir)#.to_yaml
rows= res["rows"]

rows.each do |r|
  thisDocId= r["id"]
  db.get(thisDocId).destroy()
end
