#!/bin/sh
# set your hadoop location here
export HADOOP_PREFIX=/Users/norberto/sandbox/sparktalk/lib/hadoop-2.6.0
# need this to run local spark-shell
export SPARK_LOCAL_IP=127.0.0.1
# spark install
export SPARK_HOME=/Users/norberto/sandbox/sparktalk/lib/spark-1.4.0-bin-hadoop2.6

export PATH=$PATH:$SPARK_HOME/bin
export dbname=fake
export collname=minbars
# import mstf.csv file through mongoimport
mongoimport -d $dbname -c minbars --type csv --headerline mstf.csv

# dependencies: we need to set the folder with the following jars in it
# casbah-commons_2.10-2.8.0.jar
# casbah-core_2.10-2.8.0.jar
# casbah-query_2.10-2.8.0.jar
# mongo-java-driver-2.13.0.jar
# spark-mongodb-core - http://spark-packages.org/package/Stratio/spark-mongodb
export dependencies_dir=/Users/norberto/sandbox/sparktalk/lib
export dependencies_jars=$dependencies_dir/spark-mongodb-core-0.8.7.jar,$dependencies_dir/mongodb/casbah-commons_2.10-2.8.2.jar,$dependencies_dir/mongodb/casbah-core_2.10-2.8.0.jar,$dependencies_dir/mongodb/casbah-query_2.10-2.8.0.jar,$dependencies_dir/mongodb/mongo-java-driver-2.13.0.jar
# echo some results
mongo --eval "db.$collname.find().limit(10).forEach(function(d){printjson(d)})" $dbname

# run spark-shell
spark-shell --jars $dependencies_jars -i script.scala
