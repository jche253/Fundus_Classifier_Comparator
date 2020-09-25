function findTaskAndSetImage(json, username, listViewName) {
    var result = json;

    // of all pending tasks, are any assigned to this user?
    // hmm ... we filter by user, so this should not be needed, right?
    var newResRows = result.rows.filter(function(obj) {
        return obj.value.user === username;
    });

    if (newResRows.length < 1)
        return; // hmmm - some sort of message that there are no pending tasks?

    // default next task
    var task = newResRows[0].value;

    // now we want to find the task that has the lowest (positive?) task_order
    var minTaskOrder = Number.POSITIVE_INFINITY;
    for (var irow = 0; irow < newResRows.length; ++irow) {
        // old ones might not even have a task_order
        var rowVal = newResRows[irow].value;
        if (rowVal.task_order && rowVal.task_order < minTaskOrder) {
            task = rowVal;
            minTaskOrder = rowVal.task_order;
        }
    }

    var curICL = task.image_classify_list;
    var curTaskIdx = task.current_idx;

    $.ajax({
        url : listViewName,
        type : 'GET',
        success: function (json) {
            // okay, this seems wrong, we got all the tasks - way too much data over the wire
            // filtering should happen on the server side - is this what reduce is for?

            var nextimage;
            var result = json;
            var found = false;
            for (var ires = 0 ; ires < result.rows.length && !found; ++ires) {

                var res = result.rows[ires];
                if (res.id === curICL) {
                    found = true;
                    nextimage = res.value.list[curTaskIdx];

                    if (!nextimage)
                        alert("no next image");
                }
            }

            if (!found) {
                alert("No pending tasks");
                return;
            }

            var idx0 = nextimage;
            var img0 = document.getElementById("image0");
            //img0.src = IC.TaskFeeder.hostname + IC.TaskFeeder.imageDbName + idx0.toString() + "/image";
            $("#image0").fadeOut(100, function() {
                var newSrc = ImageCompare.TaskFeeder.hostname + ImageCompare.TaskFeeder.imageDbName + idx0.toString() + "/image";
                var newImg = new Image(); // by having a new image, onload is called even if the image is already cached
                newImg.onload = function() {
                    $("#image0").attr("src", newImg.src);
                    $("#image0").fadeIn(100);
                };
                newImg.src = newSrc;//.fadeIn(400);
            });

            ImageCompare.TaskFeeder.Image0 = idx0;

            // should this be done sooner, before the second ajax call?
            ImageCompare.TaskFeeder.current_icl = curICL;
            ImageCompare.TaskFeeder.current_task_idx = curTaskIdx;
            ImageCompare.TaskFeeder.current_task = task;
        },
        error: function (response) {
            console.log("get of tasks failed : " + JSON.stringify(response));
        }
    });
}
