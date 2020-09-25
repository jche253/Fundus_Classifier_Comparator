#!/bin/bash

# Typical Usage:
#    find ../images -name *.jpg | xargs ./addImagesToDb.sh
#  first create database ret_images
#  find ../../images -type f
# add tmp view with reduce function _count(keys, vals, rereduce)
# and save as count_docs under basic views
i=8
curlcmd="curl -X PUT http://13.58.138.74:5984/my_rop"
for arg in $*
do
   i=$((i+1))
   filename=$(cd $(dirname "$arg"); pwd)/$(basename "$arg")
   echo "adding $i : $filename"
   curldata="{\"origin\":\"$filename\"}"
   cmd="$curlcmd$i -d $curldata"
   echo $cmd
   res=$($cmd)
   echo $res
   IFS='"' read -a array <<< "$res"
   rev=${array[9]}
   imagename="image"
   cmd="$curlcmd$i/$imagename?rev=$rev --data-binary @$arg -H \"Content-Type: image/bmp\""
   echo $cmd
   res=$($cmd)
done
