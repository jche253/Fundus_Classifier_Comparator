require 'json'
jsonFName=ARGV[0]


jsonFName = "/Users/jkc/Documents/retinalImaging/website/data/ret_images_4_27_2015.json"

res=File.read(jsonFName)
data = JSON.parse(res)


puts data['rows'][1].class
