
// ImageCompare is the namespace
var ImageCompare = (function (IC) {

    IC.TaskFeeder = IC.TaskFeeder || {};
    IC.TaskFeeder.defaultComment = "<insert comment>";

    IC.TaskFeeder.imageDbName = "ret_images/";
    IC.TaskFeeder.resultsDbName = "image_compare_results/";

    // some of this is probably not needed
    IC.TaskFeeder.current_task = "";
    IC.TaskFeeder.current_task_idx = -1;
    IC.TaskFeeder.current_icl = ""; // image_compare_list

    IC.TaskFeeder.SetPrompt = function(prompt) {
        $("#to-do-message").text(prompt);
    }

    // consult results and image database to select two images to present to user
    IC.TaskFeeder.SetImagePair = function(username) {

        $("#compare-comment").val(this.defaultComment);

        // update the dbconfig - guess this should be a function
        var dbName = IC.TaskFeeder.GetImageDbUrl();

        var fullurl = dbName + '_design/basic_views/_view/incomplete_compare_tasks?key=\"' + username+ "\"";
        $.ajax({
            url : fullurl,
            type : 'GET',
            success : function(json) {

                var result = json
                var curUser = username;

                // of all pending tasks, are any assigned to this user?
                var newResRows = result.rows.filter(function(obj) {
                    return obj.value.user === username;
                });

                if (newResRows.length < 1)
                    return; // hmmm - some sort of message that there are no pending tasks?

                // set the TaskFeeder ICL info
                var task = IC.TaskFeeder.current_task = newResRows[0].value;
                var curICL = IC.TaskFeeder.current_icl = task.image_compare_list;
                var curTaskIdx = IC.TaskFeeder.current_task_idx = task.current_idx;

                // now get the next pair of image ids
                $.ajax({
                    url : dbName + '_design/basic_views/_view/image_compare_lists',
                    type : 'GET',
                    success: function (json) {
                        // okay, this seems wrong, we got all the tasks - way too much data over the wire
                        // filtering should happen on the server side - is this what reduce is for?

                        var nextpair;
                        var result = json;
                        var found = false;
                        var prompt = null;

                        for (var ires = 0 ; ires < result.rows.length && !found; ++ires) {

                            var res = result.rows[ires];
                            if (res.id === curICL) {
                                found = true;
                                prompt = res.value.prompt;
                                nextpair = res.value.list[curTaskIdx];

                                if (!nextpair)
                                    debugger;
                            }
                        }

                        if (!found) {
                            alert("No pending tasks");
                            return;
                        }

                        if (prompt) {
                            ImageCompare.TaskFeeder.SetPrompt(prompt);
                        }

                        var idx0 = nextpair[0];
                        var img0 = document.getElementById("image0");
                        //img0.src = IC.TaskFeeder.hostname + IC.TaskFeeder.imageDbName + idx0.toString() + "/image";
                        $("#image0").fadeOut(100, function() {
                            var newSrc = IC.TaskFeeder.hostname + IC.TaskFeeder.imageDbName + idx0.toString() + "/image";
                            var newImg = new Image(); // by having a new image, onload is called even if the image is already cached
                            newImg.onload = function() {
                                $("#image0").attr("src", newImg.src);
                                $("#image0").fadeIn(100);
                            };
                            newImg.src = newSrc;//.fadeIn(400);
                        });

                        var idx1 = nextpair[1];
                        var img1 = document.getElementById("image1");
                        //img1.src = IC.TaskFeeder.hostname + IC.TaskFeeder.imageDbName + idx1.toString() + "/image";
                        $("#image1").fadeOut(100, function() {
                            var newSrc = IC.TaskFeeder.hostname + IC.TaskFeeder.imageDbName + idx1.toString() + "/image";
                            var newImg = new Image(); // by having a new image, onload is called even if the image is already cached
                            newImg.onload = function() {
                                $("#image1").attr("src", newImg.src);
                                $("#image1").fadeIn(100);
                            };
                            newImg.src = newSrc;//.fadeIn(400);
                        });

                        IC.TaskFeeder.Image0 = idx0;
                        IC.TaskFeeder.Image1 = idx1;

                    },
                    error: function (response) {
                        console.log("get of tasks failed : " + JSON.stringify(response));
                    }
                });

            },
            error: function (response) {
                console.log("get failed : " + JSON.stringify(response));
            }
        });


    };

    // consult results and image database to select two images to present to user
    IC.TaskFeeder.SetOCTImagePair = function(username) {

        $("#compare-comment").val(this.defaultComment);

        // update the dbconfig - guess this should be a function
        var dbName = IC.TaskFeeder.GetImageDbUrl();

        var fullurl = dbName + '_design/basic_views/_view/incomplete_OCTcompare_tasks?key=\"' + username+ "\"";
        $.ajax({
            url : fullurl,
            type : 'GET',
            success : function(json) {

                var result = json
                var curUser = username;

                // of all pending tasks, are any assigned to this user?
                var newResRows = result.rows.filter(function(obj) {
                    return obj.value.user === username;
                });

                if (newResRows.length < 1)
                    return; // hmmm - some sort of message that there are no pending tasks?

                // set the TaskFeeder ICL info
                var task = IC.TaskFeeder.current_task = newResRows[0].value;
                var curICL = IC.TaskFeeder.current_icl = task.OCTimage_compare_list;
                var curTaskIdx = IC.TaskFeeder.current_task_idx = task.current_idx;

                // now get the next pair of image ids
                $.ajax({
                    url : dbName + '_design/basic_views/_view/OCTimage_compare_lists',
                    type : 'GET',
                    success: function (json) {
                        // okay, this seems wrong, we got all the tasks - way too much data over the wire
                        // filtering should happen on the server side - is this what reduce is for?

                        var nextpair;
                        var result = json;
                        var found = false;
                        var prompt = null;

                        for (var ires = 0 ; ires < result.rows.length && !found; ++ires) {

                            var res = result.rows[ires];
                            if (res.id === curICL) {
                                found = true;
                                prompt = res.value.prompt;
                                nextpair = res.value.list[curTaskIdx];

                                if (!nextpair)
                                    debugger;
                            }
                        }

                        if (!found) {
                            alert("No pending tasks");
                            return;
                        }

                        if (prompt) {
                            ImageCompare.TaskFeeder.SetPrompt(prompt);
                        }

                        var idx0 = nextpair[0];
                        var idx1 = nextpair[1];

                        IC.TaskFeeder.Image0 = idx0;
                        IC.TaskFeeder.Image1 = idx1;
                        IC.TaskFeeder.Image0Idx = 0;
                        IC.TaskFeeder.Image1Idx = 0;

                        $.ajax({
                            url : IC.TaskFeeder.hostname + IC.TaskFeeder.imageDbName + "OCT" + idx0.toString(),
                            type : 'GET',
                            success : function(json) {
                                IC.TaskFeeder.Image0Max = json.numImages;
                                IC.TaskFeeder.Image0Idx = Math.floor(IC.TaskFeeder.Image0Max/2);
                                $('#slider0').attr("max", json.numImages-1);
                                $('#slider0').val(IC.TaskFeeder.Image0Idx);

                                var img0 = document.getElementById("image0");
                                $("#image0").fadeOut(100, function() {
                                    var newSrc = IC.TaskFeeder.hostname + IC.TaskFeeder.imageDbName + "OCT" + idx0.toString() + "/image" + IC.TaskFeeder.Image0Idx.toString();
                                    var newImg = new Image(); // by having a new image, onload is called even if the image is already cached
                                    newImg.onload = function() {
                                        $("#image0").attr("src", newImg.src);
                                        $("#image0").fadeIn(100);
                                    };
                                    newImg.src = newSrc;//.fadeIn(400);
                                });
                            }
                        });

                        $.ajax({
                            url : IC.TaskFeeder.hostname + IC.TaskFeeder.imageDbName + "OCT" + idx1.toString(),
                            type : 'GET',
                            success : function(json) {
                                IC.TaskFeeder.Image1Max = json.numImages;
                                IC.TaskFeeder.Image1Idx = Math.floor(IC.TaskFeeder.Image1Max/2);
                                $('#slider1').attr("max", json.numImages-1);
                                $('#slider1').val("value", IC.TaskFeeder.Image1Idx);

                                var img1 = document.getElementById("image1");
                                $("#image1").fadeOut(100, function() {

                                    var newSrc = IC.TaskFeeder.hostname + IC.TaskFeeder.imageDbName + "OCT" + idx1.toString() + "/image" + IC.TaskFeeder.Image1Idx.toString();
                                    var newImg = new Image(); // by having a new image, onload is called even if the image is already cached
                                    newImg.onload = function() {
                                        $("#image1").attr("src", newImg.src);
                                        $("#image1").fadeIn(100);
                                    };
                                    newImg.src = newSrc;//.fadeIn(400);
                                });
                            }
                        });





                        // $("#slider0").slider("destroy");
                        // $("#slider1").slider("destroy");
                        //
                        // $("#slider0").slider({
                        //     min: 0, // min value
                        //     max: IC.TaskFeeder.Image0Max,
                        //     value: Math.floor(IC.TaskFeeder.Image0Max/2),
                        //     slide: function(event, ui) {
                        //       SliderChange(ui.value, ui.id)
                        //     }
                        // });​
                        //
                        // $("#slider1").slider({
                        //     min: 0, // min value
                        //     max: IC.TaskFeeder.Image1Max,
                        //     value: Math.floor(IC.TaskFeeder.Image1Max/2),
                        //     slide: function(event, ui) {
                        //       SliderChange(ui.value, ui.id)
                        //     }
                        // });​
                    },
                    error: function (response) {
                        console.log("get of tasks failed : " + JSON.stringify(response));
                    }
                });

            },
            error: function (response) {
                console.log("get failed : " + JSON.stringify(response));
            }
        });


    };

    IC.TaskFeeder.SwitchOCTImage = function(index, imageNum) {
        if(imageNum === 0) { //change image 0
            IC.TaskFeeder.Image0Idx = index;
            var newSrc = IC.TaskFeeder.hostname + IC.TaskFeeder.imageDbName + "OCT" + IC.TaskFeeder.Image0.toString() + "/image" + IC.TaskFeeder.Image0Idx;
            var newImg = new Image(); // by having a new image, onload is called even if the image is already cached
            newImg.onload = function() {
                $("#image0").attr("src", newImg.src);
            };
            newImg.src = newSrc;//.fadeIn(400);
        } else if(imageNum === 1) { //change image 0
            IC.TaskFeeder.Image1Idx = index;
            var newSrc = IC.TaskFeeder.hostname + IC.TaskFeeder.imageDbName + "OCT" + IC.TaskFeeder.Image1.toString() + "/image" + IC.TaskFeeder.Image1Idx;
            var newImg = new Image(); // by having a new image, onload is called even if the image is already cached
            newImg.onload = function() {
                $("#image1").attr("src", newImg.src);
            };
            newImg.src = newSrc;//.fadeIn(400);
        }
    }

    return IC;

}(ImageCompare || {}));
