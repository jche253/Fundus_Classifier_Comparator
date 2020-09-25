require 'couchrest'
require  'yaml'
dbName=ARGV[0]


dbname = "ret_images"

#connect to db, create if does not exist
db = CouchRest.database!("http://127.0.0.1:54956/#{dbname}")

res= db.view('basic_views/count_image_docs')#.to_yaml
puts res
imgCount= res["rows"][0]["value"]
puts imgCount
