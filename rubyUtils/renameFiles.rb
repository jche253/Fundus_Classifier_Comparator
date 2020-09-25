#baseDir="/Users/jkc/Documents/retinalImaging/website/Image-Comparator/images/set34/"

require 'RMagick'
include Magick
baseDir='/Users/jkc/Documents/retinalImaging/website/Image-Comparator/images/set34/'

fileList=Dir.glob("#{baseDir}*")

fileList.each do |f|
  puts f
  fName=f.split('/').last.split('.').first

  image = Image.read(f).first
  puts image.format

  newFile="#{baseDir}#{fName}.jpg"
  puts newFile
  image.write(newFile)

#  image = Image.read('cat.jpg').first
#  puts image.format

end
