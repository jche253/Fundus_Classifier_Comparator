require 'couchrest'
require  'yaml'
dbName=ARGV[0]


dbname = "ret_images"

#connect to db, create if does not exist
db = CouchRest.database!("http://127.0.0.1:54956/#{dbname}")

res= db.view('basic_views/taskresults')#.to_yaml
#puts res
#imgCount= res["rows"][0]["value"]
#puts imgCount

#puts res["rows"].to_yaml
puts res["rows"][0]
puts res["rows"].select { |x| puts x["value"]["user"]["paul"] }



res2= db.view('basic_views/task2icl')#.to_yaml

res2["rows"].each do |r|
#  puts r
end
