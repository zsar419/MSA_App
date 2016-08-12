
$("#d-menu li").click(function () { $("#b-text").text($(this).text()); });
$("#d-menu2 li").click(function () { $("#b-text2").text("Language: " + $(this).text()); });

$("#convert-btn").on("click", function () {
    processImage(function (file) { //this checks the extension and file
        ajaxRequest(file, function (callbackData) { //here we send the API request and get the response
            console.log(callbackData)
            // Update UI - make method
            $( "#txt-container" ).show();
            $( "#txt-content" ).html(callbackData);
            
            
        });
    });

    download(callbackData, "PDf_Text.txt", "file");
    //var fileObject = retrieveFile();
    //ajaxRequest();
});


function download(text, name, type) {
  var a = $( "#txt-container" );
  var file = new Blob([text], {type: type});
  a.href = URL.createObjectURL(file);
  a.download = name;
}

function processImage(callback) {
    var file = $("#file-input").get(0).files[0]; //get(0) is required as imgSelector is a jQuery object so to get the DOM object, its the first item in the object. files[0] refers to the location of the photo we just chose.
    var reader = new FileReader();
    if (file) reader.readAsDataURL(file); //used to read the contents of the file
    else console.log("Invalid file");
    reader.onloadend = function () {
        if (!file.name.match(/\.(jpg|jpeg|png)$/)) pageheader.innerHTML = "Please upload an image file (jpg or png).";
        else callback(file);
    };
}

function ajaxRequest(file, callback) {
    console.log('sending request');
    $.ajax({
        url: "https://api.projectoxford.ai/vision/v1.0/ocr?",
        beforeSend: function (xhrObj) {
            // Request headers
            xhrObj.setRequestHeader("Content-Type", "application/octet-stream");
            xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", "66cae471cfd24dfea8c8f6bdee28eab5");
        },
        type: "POST",
        data: file,
        processData: false
    })
        .done(function (data) {
            var retrievedText = '';
            var dataObject = $(data.regions[0].lines);
            for (i = 0; i < dataObject.length; i++) {
                $(dataObject[i].words).each(function (data) {
                    retrievedText += this.text + ' ';
                });
                retrievedText += '\n';
            }
            callback(retrievedText);
        })
        .fail(function (error) { console.log(error.getAllResponseHeaders());});
}

/*

function retrieveFile() {
	var file = $("#file-input").get(0).files[0];
    var reader = new FileReader();
	if (file) reader.readAsDataURL(file);
	else alert("Invalid file");
	reader.onload =
		reader.onloadend = function () {
			//After loading the file it checks if extension is jpg or png and if it isnt it lets the user know.
			if (!file.name.match(/\.(jpg|jpeg|png)$/)) alert("Invalid file");
			else callback(file);
		};
}

function ajaxRequest(file) {
	$.ajax({
		url: "https://api.projectoxford.ai/vision/v1.0/ocr?" + $.param(params),
		beforeSend: function (xhrObj) {
			// Request headers
			xhrObj.setRequestHeader("Content-Type", "application/octet-stream");
			xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", "66cae471cfd24dfea8c8f6bdee28eab5");
		},
		type: "POST",
		// Request body
		data: file,
	})
        .done(function (data) {
            alert("success");
			console.log(data);
        })
        .fail(function () {
            alert("error");
        });
} */
