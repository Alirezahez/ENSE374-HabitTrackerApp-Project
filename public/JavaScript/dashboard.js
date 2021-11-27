

//for the calandar creation. More code will be needed for manipulation (brandon H)
document.addEventListener("DOMContentLoaded", function () {
    var calendarEl = document.getElementById("calendar");
    var calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: "dayGridMonth",
    });
    calendar.render();
  });

//temporary function to increase habit progress bars by a static 20%
//will need to change this once real data is being used
function increaseProgress(id){
  //const Hresults = habit.find();
  //alert("in js", Hresults);
    console.log('increase' + id);
    let habitTarget = document.getElementById(id);
    let progressBar = habitTarget.lastElementChild.firstElementChild;

    let previousValue = progressBar.style.width.substring(0, progressBar.style.width.length - 1);
    //for now we will just do a 20% increase of the progress bar when tapped. This will change when there is a model for the habit data
    previousValue = Number(previousValue) + 20;
    if (previousValue > 100) {
        previousValue = 100;
    }
    progressBar.style.width = previousValue + '%';
    //console.log( progressBar.aria-valuenow)
}