
    function openNav() {
        document.getElementById("mySidebar").style.width = "250px";
        document.getElementById("main").style.marginLeft = "250px";
      }
      
      function closeNav() {
        document.getElementById("mySidebar").style.width = "0";
        document.getElementById("main").style.marginLeft= "0";
      }
  
  
  
  //************************Calendar chart************************************************* */
  
   function drawChart(dates) {
       var dataTable = new google.visualization.DataTable();
       dataTable.addColumn({ type: 'date', id: 'Date' });
      dataTable.addColumn({ type: 'number', id: 'full/empty' });
      for (let index = 0; index < dates.length; index++) {
        dataTable.addRow(dates[index]);
      }
      //  dataTable.addRows([
      //   dates
      //     // Many rows omitted for brevity.
      //     // [ new Date(2013, 9, 4), 38177 ],
      //     // [ new Date(2013, 9, 5), 38705 ],
      //     // [ new Date(2013, 9, 12), 38210 ],
      //     // [ new Date(2013, 9, 13), 38029 ],
      //     // [ new Date(2013, 9, 19), 38823 ],
      //     // [ new Date(2013, 9, 23), 38345 ],
      //     // [ new Date(2013, 9, 24), 38436 ],
      //     // [ new Date(2013, 9, 30), 38447 ]
      //   ]);
  
       var chart = new google.visualization.Calendar(document.getElementById('calendar_basic'));
  
       var options = {
         title: "Habit activity history",
         height: 350,
       };
  
       chart.draw(dataTable, options);
   }
  
   google.charts.load("current", {packages:["calendar"]});
   function habitListChanged(){
  
    
    // $.ajax({
    //   type: 'GET',
    //   url: '/calendarHabits',
    //   success: function(response) { 
    
    //     console.log(response.data);
    //       var habitArray = [];
    //       response.data.forEach(habit => {
    
    //         var hTitle = habit.title;
    //         var hId = habit._id;
    //         var hStartDate = habit.startDate;
    //         var hEndDate = habit.endDate;
    //         //add: if statement for monthly, weekly, daily
    //         habitArray.push({
    //           id: hId,
    //           title: hTitle,
    //           start: hStartDate,
    //           end: hEndDate
    //           //groupId: '999', //groupId is for a repeated item (weekly, monthly, etc)
    //         })
    //         //create the calendar using the list of habit objects
    //         draw(habitArray);
    //       })
    //   },
    //   error: function(xhr, status, err) {
    //     console.log(xhr.responseText);
    //   }
    //   });
      
  
   
    var habit=document.getElementById("habitList").value;
  
    if(habit=='Walking'){
      document.getElementById("habitname").innerText="Walking";
      document.getElementById("score").innerText="4";
      document.getElementById("frequency").innerText="5";
      document.getElementById("beststrike").innerText="6";
      document.getElementById("healthstatus").innerText="7";
      document.getElementById("habit_image").src="../HTML/p1.png";
  
      var dates= [
      [ new Date(2021, 3, 13), 0 ],
      [ new Date(2021, 3, 14), 5 ],
      [ new Date(2021, 3, 15), 5 ],
      [ new Date(2021, 3, 16),  5],
      [ new Date(2021, 3, 17), 5 ]
    ];
      google.charts.setOnLoadCallback(drawChart(dates));
      
    }else if(habit=="Reading"){
      document.getElementById("habitname").innerText="Reading";
      document.getElementById("score").innerText="5";
      document.getElementById("frequency").innerText="1";
      document.getElementById("beststrike").innerText="4";
      document.getElementById("healthstatus").innerText="6";
      document.getElementById("habit_image").src="../HTML/p2.png";
  
      var dates= [
        [ new Date(2021, 1, 13), 4 ],
        [ new Date(2021, 1, 14), 4 ],
        [ new Date(2021, 2, 15), 5 ],
        [ new Date(2021, 3, 16),  5],
        [ new Date(2021, 3, 17), 8 ]
      ];
        google.charts.setOnLoadCallback(drawChart(dates));
  
    } else {
      document.getElementById("habitname").innerText="Choose your habit";
      document.getElementById("score").innerText="";
      document.getElementById("frequency").innerText="";
      document.getElementById("beststrike").innerText="";
      document.getElementById("healthstatus").innerText="";
      document.getElementById("habit_image").src="../HTML/p3.png";
  
      var dates= [
      
      ];
        google.charts.setOnLoadCallback(drawChart(dates));
    }
  
    }
  
  
   //************************Calendar chart************************************************* */