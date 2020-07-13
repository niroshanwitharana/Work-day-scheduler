$(document).ready(function () {

   //make variable for time-block and mainSchedule
   var timeBlock = $(".time-block");
   var mainSchedule = $(".mainSchedule");


   var d = new Date();
   var currentDay = d.getDay();
   //create the date as requested format
   //put the days and months in to and array and call them with the index of the array
   var dayArray = ["Sunday,", "Monday,", "Tuesday,", "Wednesday,", "Thursday,", "Friday,", "Saturday"];
   var monthArray = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
   var dayFinal = dayArray[currentDay];
   var monthFinal = monthArray[d.getMonth()];
   console.log(dayFinal);
   $("#currentDay").html(dayFinal + "  " + monthFinal + "  " + d.getDate() + "th");

   //set the different colour for time-blocks for past, present and future
   //when you call setTimeBlock function for each time-block it will compare the dataHour and currentHour and will change the color
   function setTimeBlock() {
      timeBlock.each(function () {
         $thisBlock = $(this);
         var currentHour = d.getHours();
         var dataHour = parseInt($thisBlock.attr("dataHour"));

         if (dataHour < currentHour) {
            $thisBlock.children("textarea").addClass("past").removeClass("present", "future");
         }
         if (dataHour == currentHour) {
            $thisBlock.children("textarea").addClass("present").removeClass("past", "future");
         }
         if (dataHour > currentHour) {
            $thisBlock.children("textarea").addClass("future").removeClass("past", "present");
         }
      })

   }

   setTimeBlock();

   //initalize an array to store the data
   var dataArray = [];

   function initializeDataArray() {
      timeBlock.each(function () {
         var thisBlockHr = $(this);
         var $thisBlockHr = parseInt(thisBlockHr.attr("dataHour"));

         //for each time-block take the dataHour and taxt value and put in to the dataObject
         var dataObj = {
            hour: $thisBlockHr,
            text: "",
         }
         //put the each dataObject in to the dataArray       
         dataArray.push(dataObj);

      });
      //once you store the data in to the dataArray convert that array in to a string and put in the local storage
      localStorage.setItem("inputData", JSON.stringify(dataArray));

   } 


   function renderSchedule() {

      dataArray = localStorage.getItem("inputData");
      dataArray = JSON.parse(dataArray);
      //loop thru array then assign the text to the timeBlock with data-hour equal to hour. 
      //make a variable where [data-hour={hour}] then plug it in to the selector $('[data-hour={hour}')
      for (var i = 0; i < dataArray.length; i++) {
         var dataHour = dataArray[i].hour;
         var dataText = dataArray[i].text;
         console.log(dataText);

         $("[dataHour=" + dataHour + "]").children("textarea").val(dataText);
         console.log($("[dataHour=" + dataHour + "]").children("textarea").val(dataText));
      }

   }

   function saveHandler() {
      var $thisBlock = $(this).parent();

      var hourToAdd = $(this).parent().attr("dataHour");
      var textToAdd = (($(this).parent()).children("textarea")).val();

      //see which item we need to update based on the hour of the button clicked matching
      for (var j = 0; j < dataArray.length; j++) {
         if (dataArray[j].hour == hourToAdd) {
            //set its text to what was added to textarea
            dataArray[j].text = textToAdd;
         }
      }
      localStorage.setItem("inputData", JSON.stringify(dataArray));
      renderSchedule();
   }



   //if there's nothing for the todos in local storage
   if (!localStorage.getItem("inputData")) {
      //initialize the array of objects
      initializeDataArray();
   } //otherwise dont bother bc we get it from local storage

   //render schedule from local storage
   renderSchedule();
   //when a todo item save button is clicked, save it
   mainSchedule.on("click", "button", saveHandler);

});