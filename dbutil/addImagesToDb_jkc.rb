require 'couchrest'
require 'securerandom'


#baseDir="/Users/jkc/Documents/retinalImaging/website/Image-Comparator/"


imageFolder=ARGV[0]

if (ARGV.size != 1) then
  puts "Usage: ruby : #{$PROGRAM_NAME}.rb <imageFolder>";
  puts "where imageFolder is the full path to folder/directory where the images are located."
  exit
end


ims=Dir.glob("#{imageFolder}/*")

dbname = "ret_images"

#connect to db, create if does not exist
@db = CouchRest.database!("http://admin:password@ec2-18-220-36-255.us-east-2.compute.amazonaws.com:54956/#{dbname}")

#CouchRest.put("http://localhost:54956/testdb/doc", 'name' => 'test', 'date' => Date.current)

# res= @db.view('basic_views/count_image_docs')#.to_yaml
# puts res
# imgCount= res["rows"].size
# if imgCount >0
# #sleep 10000
#   imgCount= res["rows"][0]["value"].to_i
# end

ims.each_with_index do |im, idx|

puts im
puts idx
thisIm=im.split('/').last
imClass=thisIm.split('.').last
puts thisIm
puts imClass
uuid = SecureRandom.uuid

obj = { :origin => "#{thisIm}",
:id => uuid,
:type => "imageDoc",
:timeAdded => Time.now()

}
obj['_id']=(idx+1).to_s

#puts obj
response =@db.save_doc(obj)

@db.put_attachment(obj, "image", File.open(im), :content_type => "image/#{imClass}")

# obj['testAttr']='hello'
# @db.save_doc(obj)

end
