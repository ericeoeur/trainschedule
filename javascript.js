let config = {
    apiKey: "AIzaSyBe1WMDhTXBhrmNqrh9dynEuVR4qqrbdOE",
    authDomain: "trainschedule-7662e.firebaseapp.com",
    databaseURL: "https://trainschedule-7662e.firebaseio.com",
    projectId: "trainschedule-7662e",
    storageBucket: "trainschedule-7662e.appspot.com",
    messagingSenderId: "246718767215"
};


firebase.initializeApp(config);
let database = firebase.database();

$("#submit").on("click", function (event) {
    // preventing the page from refreshing
    event.preventDefault();
    let trainName = $("#train-name-input").val().trim();
    let trainDestination = $("#destination-input").val().trim();
    let time = $("#firstTrain-input").val().trim();
    let frequency = $("#frequency-input").val().trim();

    // creating a new object for the values in order to push it to the firebase
    let NewTrain = {
        name: trainName,
        destination: trainDestination,
        time: time,
        frequency: frequency
    };
    // pushing the values to database
    database.ref().push(NewTrain);

    // clearing the inputs field
    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#firstTrain-input").val("");
    $("#frequency-input").val("");

});

//whenever an object is added we start our calculations
database.ref().on('child_added', function (snapshot) {
    let TrainName = snapshot.val().name;
    let TrainDestination = snapshot.val().destination;
    let Traintime = (snapshot.val().time);
    let TrainFrequency = snapshot.val().frequency;
    let convertedTime = moment(Traintime, "HH:mm")
    console.log(convertedTime);

    // Current Time
    let currentTime = moment();
    console.log("Current time: " + moment(currentTime).format("HH:mm"));

    // Difference between the times
    let timeDifference = moment().diff(moment(convertedTime), "minutes");
    console.log("Time Difference:  " + timeDifference);

    // Time apart (remainder)
    let timeRemainder = timeDifference % TrainFrequency;
    console.log("Remainder:" + timeRemainder);

    // Minute Until Train
    let arrivalMinutes = TrainFrequency - timeRemainder;
    console.log("Arrival in Minutes: " + arrivalMinutes);

    // Next Train
    let nextArrival = moment().add(arrivalMinutes, "minutes");
    console.log("Arrival Time: " + moment(nextArrival).format("HH:mm"));


    // Add each train's data into the table 
    $("#train-table > tbody").append("<tr><td>" + TrainName + "</td><td>" + TrainDestination + "</td><td>" +
        TrainFrequency + "</td><td>" + moment(nextArrival).format("hh:mm a") + "</td><td>" + arrivalMinutes + "</td><td>" + "" + "</td></tr>");
});


$("#submit").submit(function (e) {
    e.preventDefault();
});
