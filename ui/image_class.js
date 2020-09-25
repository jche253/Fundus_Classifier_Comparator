
$(document).ready(function() {

    handleUrlFilter(document.location.search);
    updateStatusInfo();

    if (ImageCompare.username) {
        ImageCompare.TaskFeeder.SetImage(ImageCompare.username);
    }

});

updateStatusInfo = function() {

    // update user
    // var elem = document.getElementById("si_user");
    // var user_elem = document.getElementById("username");
    // var selUser = user_elem.options[ user_elem.selectedIndex ];
    // elem.textContent = selUser.text;
    // var label = $("#si_user_label");
    // var isDanger = (selUser.value === "testuser");
    // setLabelDanger(isDanger, label);

    // update database
    var elem = document.getElementById("si_db");
    var db_elem = document.getElementById("database");
    var seldb = db_elem.options[ db_elem.selectedIndex ];
    elem.textContent = seldb.text;
    var label = $("#si_db_label");
    var isDanger = (seldb.value === "localhost");
    setLabelDanger(isDanger, label);

    // update tasks
    var user = ImageCompare.username;
    if (user) {
        getIncompleteClassifyTasks(user, updateStatInfoTasks);
    }
};

// called on getTasks success, input are the rows from the view
// todo: should not be global
updateStatInfoTasks = function(json) {
    var result = jQuery.parseJSON( json );
    var tasks = result.rows;

    var elem = document.getElementById("si_tasks");
    elem.textContent = "You have " + tasks.length + " unfinished tasks.";

    // this is to be updated - hide it if there are no pending tasks
    var curTaskElem = document.getElementById("si_curtask");

    if (tasks.length > 0) {
        curTaskElem.hidden = false;

        var firstTask = tasks[0].value;

        // now we want to find the task that has the lowest (positive?) task_order
        var minTaskOrder = Number.POSITIVE_INFINITY;
        for (var irow = 0; irow < tasks.length; ++irow) {
            // old ones might not even have a task_order
            var rowVal = tasks[irow].value;
            if (rowVal.task_order && rowVal.task_order < minTaskOrder) {
                firstTask = rowVal;
                minTaskOrder = rowVal.task_order;
            }
        }

        var icl_id = firstTask.image_classify_list;

        var dburl = ImageCompare.TaskFeeder.GetImageDbUrl();
        var fullurl = dburl + "_design/basic_views/_view/image_classify_lists?key=\"" + icl_id + "\"";

        $.ajax({
            url : fullurl,
            type : 'GET',
            success : function (json) {
                //console.log("get succeeded : " + JSON.stringify(json));
                var result = jQuery.parseJSON( json );

                var curIdx = firstTask.current_idx + 1; // because humans usually don't use zero based indexing
                curTaskElem.textContent = "You are classifying image " + curIdx + " of " + result.rows[0].value.count;

            },
            error: function (response) {
                console.log("get failed : " + JSON.stringify(response));
            }
        });
    }
    else {

        // reformat ui
        curTaskElem.hidden = true;
        var imagesDiv = document.getElementById("image-row");
        imagesDiv.style.display = "none";
        var toDoMsg = document.getElementById("to-do-message");
        toDoMsg.textContent = "All tasks are complete."
        $(".btn-group").hide();

        // save results doc


    }
};


var getIncompleteClassifyTasks = function(username, successFn) {

    var dburl = ImageCompare.TaskFeeder.GetImageDbUrl();
    var fullurl = dburl + "_design/basic_views/_view/incomplete_classify_tasks?key=\"" + username + "\"";

    $.ajax({
        url : fullurl,
        type : 'GET',
        success : successFn,
        error: function (response) {
            console.log("get failed : " + JSON.stringify(response));
        }
    });
}

// THIS IS A DB PUT
// winVal is a number representing how much A is greater than B
// In a situation where the user can pick one or the other or neither
// winVal will be -1, 0, or 1. This can support other values for UIs
// where the user can say "A five times more than B"
// todo - this should not be global
createICResult = function(diagnosis, img0, user, comment, task, task_idx) {

    var currentTime = new Date();
    var timeStr = currentTime.toString();
    var imgDbStr = ImageCompare.TaskFeeder.GetImageDbUrl();

    if (user === null) {
      alert ("Uh oh: undefined user. Contact Jayashree.");
      return;
    }

    var dataStr = "{\"user\":\"" + user + "\",";
    dataStr += "\"type\":\"" + "imageClassifyResult" + "\",";
    dataStr += "\"date\":\"" + timeStr + "\",";
    dataStr += "\"image0\":\"" + imgDbStr + img0.toString() + "\",";
    dataStr += "\"diagnosis\":\"" +  diagnosis + "\",";
    dataStr += "\"task\":\"" +  task._id + "\",";
    dataStr += "\"task_idx\":\"" +  task_idx + "\"";
    dataStr += "}";

    console.log ("Putting: " + dataStr);

    var def = $.ajax({
        url : imgDbStr + generateUUID(),
        type : 'PUT',
        headers : {'Content-Type': 'application/json'},
        //dataType : "jsonp",
        data: dataStr,
        success : function(json) {
            console.log ("put succeeded: " + JSON.stringify(json));
        },
        error: function (response) {
            console.log("put failed : " + JSON.stringify(response));
            alert ("Network Issue, Result not Recorded. Please stop the task and contact Jayashree.");
        }
    });

    return def;
};

// THIS IS A DB PUT
// increments the task's current idx and posts it back to the database
// user is used to set the next image pair
// todo - this should not be global
updateTask = function(task, user) {

    // first get the length of the icl for the task, (to see if the task is now complete)
    var dburl = ImageCompare.TaskFeeder.GetImageDbUrl();
    var fullurl = dburl + "_design/basic_views/_view/icl_lengths?key=\"" + task.image_classify_list + "\"";
    var icl_count = -1;

    var defered = $.ajax({
        url : fullurl,
        type : 'GET',
        success : function(json) {

            var result = jQuery.parseJSON( json );
            icl_count = result.rows[0].value;

            // now that that worked, update the task
            var dburl = ImageCompare.TaskFeeder.GetImageDbUrl();
            var fullurl = dburl + task._id;

            task.current_idx++;
            if (task.current_idx >= icl_count) {
                task.completed = true;
            }

            $.ajax({
                url : fullurl,
                type : 'PUT',
                data: JSON.stringify(task),
                contentType: "application/json",
                success : function(json) {
                    //console.log ("put succeeded: " + JSON.stringify(json));
                    ImageCompare.TaskFeeder.SetImage(user);
                    updateStatusInfo(); // really this is redundant, but I need to return a deferred for this ajax call - how?
                },
                error: function (response) {
                    console.log("put failed : " + JSON.stringify(response));
                }
            });
        },
        error: function (response) {
            console.log("put failed : " + JSON.stringify(response));
        }
    });

    return defered;
};

OnSetDB = function(sel) {
    console.log ("Database changed to: " + sel.value);
    updateStatusInfo();

    var user_elem = document.getElementById("username");
    var selUserTxt = user_elem.options[ user_elem.selectedIndex ].value;
    ImageCompare.TaskFeeder.SetImage(selUserTxt);
}

OnSetUser = function(username) {

    console.log ("User changed to: " + username);
    ImageCompare.username = username;
    updateStatusInfo();
    ImageCompare.TaskFeeder.SetImage(username);
}

// really a private helper
saveResultSetImages = function (diagnosis) {
    var img0 = ImageCompare.TaskFeeder.Image0;
    var task_idx = ImageCompare.TaskFeeder.current_task_idx;
    var task = ImageCompare.TaskFeeder.current_task;

    var comment = $("#compare-comment").val();
    var user = $("#username").val();

    // these two are like a transaction - how to ensure both or neither?

    // not sure why the result is being created with winval of 1
    //var d1 = createICResult(1, img0, img1, user, comment, task, task_idx);

    var d1 = createICResult(diagnosis, img0, user, comment, task, task_idx);
    var d2 = updateTask(task, user);
    // update happens asynchronously, so this would be wrong:
    // ImageCompare.TaskFeeder.SetImagePair(user);
    // instead it has to happen inside the updateTask success
    // Todo: maybe better would be to pass it in.

    // same here - this needs to happen after the previous two
    $.when(d1, d2).then(updateStatusInfo());
}

OnClassify = function(btn) {

    saveResultSetImages(btn.id);
};



// private utility
