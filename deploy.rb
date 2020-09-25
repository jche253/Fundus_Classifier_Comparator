## usage: ruby deploy.rb test or ruby deploy.rb prod

if (ARGV.size != 1) then
  puts "Usage: ruby : #{$PROGRAM_NAME} <env>";
  puts "where <env> is either test or prod."
  puts "e.g. ruby #{$PROGRAM_NAME} test"
  exit
end

env=ARGV[0].strip
puts "environment is #{env}"

moveToFolder="test"
if env =="prod"
  moveToFolder= "/var/www/html/"
else if env =="test"
  ## test site
  moveToFolder="/var/www/html/test/"
  #local
  #moveToFolder="test/"
else
  puts "env should be either prod or test"
  exit
end
end


folders=['dbutil',  'feeders',  'ui',  'util',  'vendor', 'results']
files =['index.html']

folders.each do |f|
  moveToFolderFull="#{moveToFolder}#{f}"
  puts "copying #{moveToFolderFull}"
  if File.directory? moveToFolderFull
    cmd1="rm -R #{moveToFolderFull}"
    puts "  #{cmd1}"
    `#{cmd1}`
  end
  cmd2="cp -R #{f} " + moveToFolder
  puts "  #{cmd2}"
  `#{cmd2}`
end

files.each do |fl|
  moveToFile="#{moveToFolder}#{fl}"
  puts "copying #{moveToFile}"
  if File.file? moveToFile
    puts "  #{fl} is being removed"
    cmd3="rm #{moveToFile}"
    puts "  #{cmd3}"
    `#{cmd3}`
  end

  cmd4="cp #{fl} #{moveToFolder}"
  puts "  #{cmd4}"
  `#{cmd4}`
end



=begin
cmd3="cp index.html #{moveToFolder}"
puts cmd3
`#{cmd3}`
if File.directory? f
  cmd1="rm #{moveToFolder/}"

cmd2="sudo cp -R #{f} " + moveToFolder
puts cmd2
#  `#{cmd2}`
if File.directory? moveToFolder
    puts "moveTo dir exists"
    cmd="du -s -m #{moveToFolder}"
    fSize=`#{cmd}`
    puts fSize.split("\t").first.to_i
    if fSize.split("\t").first.to_i >3
      cmd1="rm -R #{moveToFolder}"
      #  `#{cmd1}`
    end
else
    puts "moveTo dir does not exist"
  end
  cmd2=" mkdir #{testFolder}"
  `#{cmd2}`
end

=end



folders.each do |f|
  cmd2="sudo cp -R #{f} " + moveToFolder
#  puts cmd2
#  `#{cmd2}`
end
