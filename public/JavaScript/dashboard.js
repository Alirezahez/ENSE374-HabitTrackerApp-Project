//get the current date (used for the calendar init)
const formatYmd = date => date.toISOString().slice(0, 10);
var currentDay = formatYmd(new Date()); 

//Create the calendar using fullcalendar.js plugin
var calendar;
function draw(data) {

  var calendarEl = document.getElementById('calendar');

    calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: 'dayGridMonth',
      initialDate: currentDay,
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay'
      },
      events: data,
      eventBackgroundColor: '#5680E9',
      eventBorderColor: '#5680E9',

    });

    calendar.render();
}

//ajax to access the habits and use in JS (can't access through ejs and transfer to JS)
$("document").ready(() => {
    $.ajax({
  type: 'GET',
  url: '/calendarHabits',
  success: function(response) { 

    console.log(response.data);
      var habitArray = [];
      response.data.forEach(habit => {

        var hTitle = habit.title;
        var hId = habit._id;
        var hStartDate = habit.startDate;
        var hEndDate = habit.endDate;
        //add: if statement for monthly, weekly, daily
        habitArray.push({
          id: hId,
          title: hTitle,
          start: hStartDate,
          end: hEndDate
          //groupId: '999', //groupId is for a repeated item (weekly, monthly, etc)
        })
        //create the calendar using the list of habit objects
        draw(habitArray);
      })
  },
  error: function(xhr, status, err) {
    console.log(xhr.responseText);
  }
  });
  })