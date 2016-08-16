
var convertbtn = $("#convert-btn");
var txtcontainer = $( "#txt-container" );
var txtcontent = $( "#txt-content" );
var requirements = $( "#requirements" )

$('input[type=file]').change(function(e){
  $("#fname").html("File: [ "+ $("#file-input").get(0).files[0].name + " ]");
});

convertbtn.on("click", function () {
    $( "#requirements" ).hide();
    processData(function (file) { //this checks the extension and file
        txtcontainer.show();
        txtcontent.html("... Processing ...");
        //$( "#txt-content" ).html("Converting...");
        sendAJAXRequest(file, function (callbackData) { //here we send the API request and get the response
            console.log(callbackData)
            txtcontent.html(callbackData); // Update UI - make method
        });
    });
});

function processData(callback) : void{
    var file = $("#file-input").get(0).files[0];
    var reader = new FileReader();
    if (file) reader.readAsDataURL(file); //used to read the contents of the file
    else{
        console.log("Invalid file");
        requirements.show();
    }
    reader.onloadend = function () {
        //if (!file.name.match(/\.(jpg|jpeg|png)$/)) $( "#requirements" ).show();
        //else callback(file);
        callback(file);
    };
}

function sendAJAXRequest(file, callback) : void {
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
            for (var i = 0; i < dataObject.length; i++) {
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
