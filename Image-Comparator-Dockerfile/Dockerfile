# Image-Comaparator Dockerfile
FROM ubuntu
MAINTAINER Jimmy Chen <chenjim@ohsu.edu>

# arguments
# ARG db_name="myrop"
# ARG host_local_ip="ec2-13-58-138-74.us-east-2.compute.amazonaws.com"

# install required packages
RUN apt-get update
RUN apt-get install -y nginx
RUN apt-get install -y build-essential
RUN apt-get install -y git
RUN apt-get install -y python
RUN apt-get install -y nodejs
RUN apt-get install -y ruby
RUN apt-get install -y vim
RUN apt-get install -y curl
RUN apt-get install -y apache2

# clone repository
RUN cd /
RUN git clone https://github.com/jche253/Fundus_Classifier_Comparator.git

# replace all instances of "rop_images" and "172.16.42.15" with new database name and new ip address

#From Collin Wen's repo, the following doesn't work
#RUN cd /Image-Comparator/
#RUN grep -rl "rop_images" /Image-Comparator/* | xargs sed -i 's/ret_images/myrop/g'
#RUN grep -rl "172.16.42.15" /Image-Comparator/* | xargs sed -i 's/ec2-18-220-36-255.us-east-2.compute.amazonaws.com/ec2-13-58-138-74.us-east-2.compute.amazonaws.com/g'
#RUN grep -rl "5984" /Image-Comparator/* | xargs sed -i 's/5984/<database_port>/g'

#Would recommend using the following instead (will need to adapt for your needs): 
RUN grep -rl 'myrop' Image-Comparator/ | xargs sed -i 's/myrop/<insert-db-name-here>/g'
RUN grep -rl '18.221.228.73' Image-Comparator/ | xargs sed -i 's/18.221.228.73/<insert-host-IP-here>/g'
RUN grep -rl '5984' Image-Comparator/ | xargs sed -i 's/5984/<insert-port-here>/g'

# install couchdb
# RUN export DEBIAN_FRONTEND=noninteractive
# RUN echo "deb http://apache.bintray.com/couchdb-deb bionic main" \ | tee -a /etc/apt/sources.list
# RUN curl -L https://couchdb.apache.org/repo/bintray-pubkey.asc \ | apt-key add -
# RUN apt-get update && apt-get install -yq couchdb

# configure couchdb
# 1
# 0.0.0.0
# password
# password

# start couchdb
# RUN service couchdb start
# RUN curl -X PUT http://admin:password@127.0.0.1:5984/_users
# RUN curl -X PUT http://admin:password@127.0.0.1:5984/_replicator

# Create database, add documents
# RUN curl -X PUT http://admin:password@localhost:5984/$db_name
# RUN cd Image-Comparator/dbutil
# RUN curl -X PUT http://admin:password@localhost:5984/$db_name/_design/basic_views -d @basic_views.json

CMD ["echo","Image created"]
