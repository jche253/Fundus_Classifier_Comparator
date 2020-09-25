require 'net/http'
require 'uri'
require 'json'

if (ARGV.size != 1) then
    puts "Usage: ruby : #{$PROGRAM_NAME} <icl name> ";
    exit
end


# get the number of documents as a command line arg
#ARGV.each { |arg| puts "Argument: #{arg}" }
iclName = ARGV[0]


# find range from searching db for images that have image_set_name
viewUrl = "http://localhost:54956/ret_images/_design/basic_views/_view/image_compare_lists"
uri = URI.parse(viewUrl)
http = Net::HTTP.new(uri.host, uri.port)
request = Net::HTTP::Get.new(uri.path)
resp = http.request(request)
#puts resp.body

# grab the ids, sort and confirm all from lowest to highest are in the list
response = JSON.parse(resp.body)
iclRows = response['rows']
puts "found " + iclRows.length.to_s() + " rows"
iclRow = iclRows.find {|x| x['id'] == iclName }

if (!iclRow) 
   puts "Unable to find ICL with name " + iclName
   exit();
else
   puts "Found " + iclName
end

# now find the duplicates in the icl
icl_list = iclRow['value']['list']
puts icl_list.inspect()

duplist = []
for i in (0..icl_list.length-1)
   pair = icl_list[i]
   for j in ((i+1)..icl_list.length-1)
      otherPair = icl_list[j]
      if (pair[0] == otherPair[0] && pair[1] == otherPair[1])
        puts "found " + i.to_s() + " matches " + j.to_s()
        duplist.push([i,j,1]);
      elsif ( pair[0] == otherPair[1] && pair[1] == otherPair[0])
        puts "found " + i.to_s() + " matches " + j.to_s()
        duplist.push([i,j,-1]);
      end     
   end 
end

puts "to repeat:"
puts duplist.inspect()

obj = { type:"icl_dup_list",
        icl:iclName,
        count:duplist.size,
        list:duplist,
        timeAdded:Time.now()}

puts "adding this doc to db:"
puts obj.inspect()        


dbname = "ret_images/"
docname = iclName+"_duplist"
url = 'http://localhost:54956/' + dbname + docname
uri = URI.parse(url)

http = Net::HTTP.new(uri.host, uri.port)
request = Net::HTTP::Put.new(uri.path)

resp = http.request(request, obj.to_json)
puts resp.body
        
        
exit()

imageIds = []
imageIdRows.each {|x| imageIds.push(x['value'].to_i) }
imageIds.sort()
#puts imageIds

rangeBnds = [imageIds.first, imageIds.last]

range = Range.new(rangeBnds[0], rangeBnds[1]);
rangeArray= range.to_a
sizeDocs=rangeArray.size


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
