require 'net/http'
require 'uri'
require 'json'

#image ids
imgids = [3, 1, 4]

dbname = "ret_images/"
docname = "image_subset"
url = 'http://localhost:54956/' + dbname + docname
uri = URI.parse(url)
 
http = Net::HTTP.new(uri.host, uri.port)
request = Net::HTTP::Put.new(uri.path)

resp = http.request(request, "{\"idx order\": \"#{imgids}\"}") 
puts resp.body