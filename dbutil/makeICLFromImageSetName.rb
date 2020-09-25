require 'net/http'
require 'uri'
require 'json'



if (ARGV.size != 3) then
    puts "Usage: ruby : #{$PROGRAM_NAME} <image set name> <pct repeat> <list name> ";
    puts "  where <image set name> was the name given to addImagesToDb_jkc ";
    puts " and pct repeat is the percentage of repeated pairs to be displayed"
    puts "  full example: ruby #{$PROGRAM_NAME} first_set_of_ten 20 bub";
    exit
end


# get the number of documents as a command line arg
#ARGV.each { |arg| puts "Argument: #{arg}" }
imgSetName = ARGV[0]
pctRep =ARGV[1]
nameStr = ARGV[2]

# find range from searching db for images that have image_set_name
viewUrl = "http://localhost:54956/ret_images/_design/basic_views/_view/imageSet2ImageId?key=\"#{imgSetName}\""
puts viewUrl
encoded_url = URI.encode(viewUrl)
uri = URI.parse(encoded_url)
#puts uri
#http = Net::HTTP.new(uri.host, uri.port)
#request = Net::HTTP::Get.new(uri.path+uri.qu)

#uri=URI(viewUrl)
resp= Net::HTTP.get(uri)

#resp = http.request(request)
#puts resp.body

# grab the ids, sort and confirm all from lowest to highest are in the list
#response = JSON.parse(resp.body)
response = JSON.parse(resp)

#puts response


imageIdRows = response['rows']
imageIds = []
imageIdRows.each {|x| imageIds.push(x['value'].to_i) }
imageIds.sort()
puts imageIds

rangeBnds = [imageIds.first, imageIds.last]
puts "rangeBnds is #{rangeBnds}"

range = Range.new(rangeBnds[0], rangeBnds[1]);
rangeArray= range.to_a
sizeDocs=rangeArray.size

puts "sizeDocs is #{sizeDocs}"

# create pairs
pairs = []
for i in (0..sizeDocs-1) do
    for j in (i+1..sizeDocs-1) do
        #pairs.push([i, j])
        pairs.push([rangeArray[i], rangeArray[j]])
    end
end
#puts pairs.inspect
#puts pairs.size

# shuffle them
pairs.shuffle!
#puts pairs.inspect
#puts pairs.size

puts pairs
puts "pairs.size is #{pairs.size}"

# add 20% duplicates by finding a random entry and inserting it randomly
dupCt = pairs.size*(pctRep.to_f/100) +1
puts "dup count is #{dupCt}."
for i in (1..dupCt) do
    idx = rand(pairs.size) # who to repeat
    #puts "repeating #{idx}"
    pair = pairs[idx].dup # duplicate the array
    pair.reverse! # if the repeat shows up next to the original, this will be good
    #puts "pair is " + pair.inspect
    idx = rand(pairs.size) # where to put the repeat
    #puts "pair is going to #{idx}"
    pairs.insert(idx, pair)
end
puts pairs.inspect
puts pairs.size


obj = { type:"image_compare_list",
        count:pairs.size,
        list:pairs,
        timeAdded:Time.now()}
puts obj.inspect
puts obj.to_json



# put the results in the database
dbname = "ret_images/"
docname = nameStr
url = 'http://localhost:54956/' + dbname + docname


uri = URI.parse(url)

http = Net::HTTP.new(uri.host, uri.port)
request = Net::HTTP::Put.new(uri.path)

resp = http.request(request, obj.to_json)
puts resp.body
