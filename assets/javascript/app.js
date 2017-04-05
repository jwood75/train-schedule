// Initialize Firebase===============================
  var config = {
    apiKey: "AIzaSyBG1M1U2fiYx3OZtWO19MbHODrmXwu5omY",
    authDomain: "homework7-train-schedule.firebaseapp.com",
    databaseURL: "https://homework7-train-schedule.firebaseio.com",
    projectId: "homework7-train-schedule",
    storageBucket: "homework7-train-schedule.appspot.com",
    messagingSenderId: "811866820855"
  };

  firebase.initializeApp(config);
//===================================================

//====Global Variables=============================
var database = firebase.database();
var trainName = "";
var destination = "";
var firstTrain = "";
var trainFrequency= "";
var nextTrain = "";
var formatNextTrain = "";
var waitTime = "";
var convertedFirstTrain = "";
var currentTime = "";
var timeDifference = "";
var timeRemaining = "";
var nextTrainWait = "";
//=================================================

//jQuery Wrapper===================================
$(document).ready(function(){

	//creating on "click" function add train to database and html
	$("#add-train").on("click", function(event){

		event.preventDefault();

		//grabbing user input from form and setting to variables
		trainName = $("#name-input").val().trim();
		destination = $("#destination-input").val().trim();
		firstTrain = $("#firstTrain-input").val().trim();
		trainFrequency = $("#frequency-input").val().trim();

		//moment js math to calculate next train=============
		convertedFirstTrain = moment(firstTrain, "hh:mm").subtract(1, "years");
		currentTime = moment();
		timeDifference = moment().diff(moment(convertedFirstTrain), "minutes");
		timeRemaining = timeDifference % trainFrequency;
		nextTrainWait = trainFrequency - timeRemaining;
		nextTrain = moment().add(nextTrainWait, "minutes");
		formatNextTrain = moment(nextTrain).format("hh:mm");
		//===================================================

		//pushing user input into database
		database.ref().push({

			name: trainName,
			destination: destination,
			firstarrival: firstTrain,
			frequency: trainFrequency,
			nextTrainTime: formatNextTrain,
			arrivalWaitTime: nextTrainWait
		});

		//resets form 
		$('#name-input').val('');
     	$('#destination-input').val('');
     	$('#firstTrain-input').val('');
     	$('#frequency-input').val('');

	}); //end of on "click" function

	//apending info within database into html======================
	database.ref().on("child_added", function(childSnapshot){

		$('.train-schedule').append("<tr class='table-row newTrainRow'>" +

               "<td class='col-xs-3'>" + childSnapshot.val().name +
               "</td>" +
               "<td class='col-xs-2'>" + childSnapshot.val().destination +
               "</td>" +
               "<td class='col-xs-2'>" + childSnapshot.val().frequency +
               "</td>" +
               "<td class='col-xs-2'>" + childSnapshot.val().nextTrainTime +
               "</td>" +
               "<td class='col-xs-2'>" + childSnapshot.val().arrivalWaitTime + 
               "</td>" +
               // "<td class='col-xs-1'>" + "<input type='submit' value='remove train' class='removeTrain btn btn-primary btn-sm'>" + "</td>" +

          "</tr>");

	}, function(errorObject){

	});

	// $("body").on("click", ".removeTrain", function(){
	// 	//remove from html
	// 	$(this).closest("tr").remove();

	// 	//remove from database
	// 	var getKey = $(this).parent().parent().keys(childSnapshot.val());
	// 	database.ref().child(getKey).remove();
	// });//end on "click" function

});//end of jQuery Wrapper



