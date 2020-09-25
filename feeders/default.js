
// This file adds shared utilities for ImageCompare objects

var ImageCompare = (function (IC) {

    IC.TaskFeeder = IC.TaskFeeder || {};

    IC.TaskFeeder.GetImageDbUrl = function () {

        var  db_config_elem = document.getElementById("database");
        IC.TaskFeeder.db_config = db_config_elem.options[db_config_elem.selectedIndex].value;
        IC.TaskFeeder.hostname = IC.TaskFeeder.db_config = "http://ec2-18-220-36-255.us-east-2.compute.amazonaws.com:54956/";
        IC.TaskFeeder.imageDbName = "ret_images/";

        return IC.TaskFeeder.hostname + IC.TaskFeeder.imageDbName;
    };



    return IC;

}(ImageCompare || {}));
