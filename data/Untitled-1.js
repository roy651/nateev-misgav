$(document).ready(function () {
  // $("[id*='txtMobile']").addClass('loader');

  GetPlaces(93);
  GetOnCallLines();
  //("[id*='txtMobile']").on('input', function () {
  $("[id*='txtMobile']").change("input", function () {
    var txtmobile = $("[id*='txtMobile']")[0].value;
    if (txtmobile.length == 9 || txtmobile.length == 10) {
      $("[id*='txtMobile']").addClass("loader");
      GetOnCallClientName($("[id*='txtMobile']")[0].value);
    }
  });

  var txtOnCallPhoneC = $("[id*=txtMobile]");
  txtOnCallPhoneC.val(readCookie("OC_No"));
  $(txtOnCallPhoneC).change();

  $("[id*='txtMobile']").keyup(function (e) {
    if (e.keyCode == 13) {
      var txtmobile = $("[id*='txtMobile']")[0].value;
      if (txtmobile.length == 9 || txtmobile.length == 10) {
        $("[id*='txtMobile']").addClass("loader");
        GetOnCallClientName($("[id*='txtMobile']")[0].value);
      }
    }
  });
});

function GetPlaces(Branch1) {
  NateevWebService.GetOnCallPlace(Branch1, OnSuccessCall);

  function OnSuccessCall(response) {
    $("#cmbPlaces").html("");
    $("#cmbPlaces").prepend("<option value='' selected='selected'></option>");
    if (response != "") {
      var data = $.map(JSON.parse(response), function (obj) {
        obj.id = obj.id || obj.StationName; // replace pk with your identifier
        obj.text = obj.text || obj.StationName;
        return obj;
      });

      $("#cmbPlaces").select2({
        placeholder: "בחר יעד",
        language: "he",
        dir: "rtl",
        width: "100%",
        data: data,
      });
    }
  }
}

var $eventPlaces = $("#cmbPlaces");
$eventPlaces.on("change", function (e) {
  GetOnCallLines(e.target.value);
  clearAllData();

  GetOnCallTimes();
  GetOnCallStations();
});

function GetOnCallClientName(Phone) {
  NateevWebService.GetOnCallPassengerName(Phone, GetClientNamesucess);

  function GetClientNamesucess(results) {
    if (results == null) {
      //ddlLinesTicketSale.length = 0
      //resetControls(ddlLinesTicketSale, "בחר קו");
      $("[id*='txtMobile']").removeClass("loader");
      var txtfirstname = $("[id*=txtFirstName]");
      var txtlastname = $("[id*=txtLastName]");
      txtfirstname.val("");
      txtlastname.val(""); //.value = Result[0].LastName;
      //$("#phoneerrmsg").html("המספר לא קיים במערכת");
      alert(
        "המספר אינו קיים במערכת. \n נא הזן שם פרטי ושם משפחה כדי להמשיך בהזמנה."
      );
    } else {
      var txtfirstname = $("[id*=txtFirstName]");
      var txtlastname = $("[id*=txtLastName]");
      Result = $.parseJSON(results);

      txtfirstname.val(Result[0].FirstName);
      txtlastname.val(Result[0].LastName); //.value = Result[0].LastName;
      //ddlCustomers.empty().append('<option selected="selected" value="0">בחר זמן</option>');
      //$.each(Result, function (key, value) {
      //    ddlCustomers.append($("<option></option>").val
      //        (value.TripID).html(value.FromHour));

      //});
      $("[id*='txtMobile']").removeClass("loader");
      $("#phoneerrmsg").html("");
      createCookie("OC_No", Phone, 360);
    }
  }
}

//----------------------  Get All Lines -------------------------------
function GetOnCallLines(Place) {
  var CTheDate = document.getElementById(
    "ctl00_ContentPlaceHolder1_cDepTicket"
  ); //$("[id*='cDepTicket.TextBox.clientId']");
  //var ddlPlace = document.getElementById('cmbPlaces');

  NateevWebService.GetOnCallLinesByCity(
    "93",
    CTheDate.value,
    Place,
    GethotelsFitPricedsucess
  );

  function GethotelsFitPricedsucess(results) {
    if (results == "") {
      ddlLinesTicketSale.length = 0;
    } else {
      var ddlLines = $("[id*=ddlLine]");
      Result = $.parseJSON(results);
      ddlLines
        .empty()
        .append('<option selected="selected" value="0">בחר קו</option>');
      var newArray = [];
      newArray = removeDumplicateValue(results);

      $.each(newArray, function (key, value) {
        //if (value.OnCall == true) {
        //    ddlLines.append($("<option style='color:green;'></option>").val
        //                       (value.IDLines + "|" + value.ISR).html(value.BusLineNo + ' ' + value.FromPlace + '-' + value.ToPlace));
        //} else {
        ddlLines.append(
          $("<option></option>")
            .val(value.IDLines + "|" + value.ISR)
            .html(value.BusLineNo + " " + value.FromPlace + "-" + value.ToPlace)
        );
        // }
      });
    }
  }
}

function removeDumplicateValue(myArray) {
  var newArray = [];
  var n_array = [];
  n_array = $.parseJSON(myArray);
  $.each(n_array, function (key, value) {
    var exists = false;
    value.ISR = "";
    $.each(newArray, function (k, val2) {
      //if (value.Hotel == val2.Hotel && value.CheckIn == val2.CheckIn && value.CheckOut == val2.CheckOut) { exists = true };
      if (
        value.BusLineNo == val2.BusLineNo &&
        value.Direction == val2.Direction &&
        value.FromPlace == val2.FromPlace &&
        value.ToPlace == val2.ToPlace
      ) {
        //value.ISR = value.ISR + "," + value.ISRName;
        exists = true;
      }
      //else {
      //    if (value.BusLineNo == val2.BusLineNo) {
      //    value.ISR = value.ISR + "," + value.ISRName;
      //    }

      //};
    });
    if (exists == false && value.BusLineNo != "") {
      newArray.push(value);
    }
    value.IDLines = "";
    $.each(n_array, function (key, value3) {
      if (
        value.BusLineNo == value3.BusLineNo &&
        value.Direction == value3.Direction &&
        value.FromPlace == value3.FromPlace &&
        value.ToPlace == value3.ToPlace
      ) {
        value.ISR = value.ISR + "," + value3.ISRName;
        value.IDLines = value.IDLines + "," + value3.LineID;
      }
    });
  });

  return newArray;
}

//background-color: #59946e;
//------------------ Get Available Times ----------------------------------
function GetOnCallTimes() {
  var CTheDate = document.getElementById(
    "ctl00_ContentPlaceHolder1_cDepTicket"
  ); //$("[id*='cDepTicket.TextBox.clientId']");
  var ddlLines = document.getElementById("ctl00_ContentPlaceHolder1_ddlLine");

  var strLines = ddlLines.value;
  var LineID = strLines.split("|");

  if (ddlLines.value != 0) {
    NateevWebService.GetOncallTripsData(
      CTheDate.value,
      LineID[0].substring(1),
      93,
      GethotelsFitPricedsucess
    );

    function GethotelsFitPricedsucess(results) {
      if (results == null) {
        var ddlCustomers = $("[id*=ddlTime]");
        ddlCustomers.html("");
        ddlCustomers
          .empty()
          .append('<option selected="selected" value="0">בחר זמן</option>');
      } else {
        var ddlCustomers = $("[id*=ddlTime]");
        Result = $.parseJSON(results);
        ddlCustomers
          .empty()
          .append('<option selected="selected" value="0">בחר זמן</option>');
        $.each(Result, function (key, value) {
          if (value.OnCall == "True") {
            ddlCustomers.append(
              $("<option style='color:green;'></option>")
                .val(value.TripID)
                .html(
                  value.FromHour +
                    "-" +
                    "<span style='font-size:10px'>(ש.להזמנה)</span>"
                )
            ); // + '-' + value.OnCall
          } else {
            ddlCustomers.append(
              $("<option style='color:#9e0231;' disabled></option>")
                .val("00")
                .html(
                  value.FromHour +
                    "-" +
                    "<span style='font-size:10px'>(ש.קבועה)</span>"
                )
            ); // + '-' + value.OnCall
          }
        });
      }
    }
  }
}

function removeStationsDuplicateValue(myArray) {
  var newArray = [];
  var n_array = [];
  n_array = myArray;
  $.each(n_array, function (key, value) {
    var exists = false;
    $.each(newArray, function (k, val2) {
      if (value.SpecialName == val2.SpecialName) {
        exists = true;
      }
    });
    if (exists == false && value.SpecialName != "") {
      newArray.push(value);
    }
  });

  return newArray;
}

function GetOnCallStations() {
  var ddlLines = document.getElementById("ctl00_ContentPlaceHolder1_ddlLine");

  var strLines = ddlLines.value;

  if (ddlLines.value != "" && ddlLines.value != 0) {
    var LineID = strLines.split("|");
    var firstLineID = LineID[0].substring(1).split(",");
    firstLineID[0].substring(1);

    NateevWebService.GetOnCallStations(
      firstLineID[0],
      GethotelsFitPricedsucess
    );

    function GethotelsFitPricedsucess(results) {
      //if (results == null) {
      //    var ddlFromStation = $("[id*=ddlFromStation]");
      //    var ddlToStation = $("[id*=ddlToStation]");
      //    ddlFromStation.html("");
      //    ddlToStation.html("");
      //    ddlFromStation.empty().append('<option selected="selected" value="0">בחר תחנה</option>');
      //    ddlToStation.empty().append('<option selected="selected" value="0">בחר תחנה</option>');
      //}
      //else {
      //    var ddlFromStation = $("[id*=ddlFromStation]");
      //    var ddlToStation = $("[id*=ddlToStation]");

      //    Result = $.parseJSON(results);
      //    ddlFromStation.empty().append('<option selected="selected" value="0">בחר תחנה</option>');
      //    ddlToStation.empty().append('<option selected="selected" value="0">בחר תחנה</option>');
      //    $.each(Result, function (key, value) {
      //        ddlFromStation.append($("<option></option>").val(value.indx).html(value.SpecialName));
      //        ddlToStation.append($("<option></option>").val(value.indx).html(value.SpecialName));

      //    });

      //}

      $("[id*=ddlFromStation]").html("");
      $("[id*=ddlFromStation]").prepend(
        "<option value='' selected='selected'></option>"
      );
      if (results != "") {
        var data = $.map(JSON.parse(results), function (obj) {
          obj.id = obj.id || obj.indx; // replace pk with your identifier
          obj.text = obj.text || obj.SpecialName;
          return obj;
        });

        data = removeStationsDuplicateValue(data);

        var newArray = [];
        jQuery.each(data, function (i, val) {
          var ddlPlace = document.getElementById("cmbPlaces");
          if (val.SpecialName == ddlPlace.value) {
            newArray.push(val);
            return false;
          } else {
            newArray.push(val);
          }
        });

        //debugger

        $("[id*=ddlFromStation]").select2({
          placeholder: "בחר תחנה",
          language: "he",
          dir: "rtl",
          width: "100%",
          data: newArray,
        });
      }
    }
  }
}

function clearAllData() {
  var ddlFromStation = $("[id*=ddlFromStation]");
  var ddlToStation = $("[id*=ddlToStation]");
  ddlFromStation.html("");
  ddlToStation.html("");
  ddlFromStation
    .empty()
    .append('<option selected="selected" value="0">בחר תחנה</option>');
  ddlToStation
    .empty()
    .append('<option selected="selected" value="0">בחר תחנה</option>');
  var ddlCustomers = $("[id*=ddlTime]");
  ddlCustomers.html("");
  ddlCustomers
    .empty()
    .append('<option selected="selected" value="0">בחר זמן</option>');

  //var cmbPlaces = $("#cmbPlaces");

  //cmbPlaces.select2("val", "");
}

function AddOnCallOrder() {
  if (isAll_F_OK()) {
    var FirstName = document.getElementById(
      "ctl00_ContentPlaceHolder1_txtFirstName"
    );
    var LastName = document.getElementById(
      "ctl00_ContentPlaceHolder1_txtLastName"
    );
    var Phone = document.getElementById("ctl00_ContentPlaceHolder1_txtMobile");
    var TripID = document.getElementById("ctl00_ContentPlaceHolder1_ddlTime");
    var StationID = document.getElementById(
      "ctl00_ContentPlaceHolder1_ddlFromStation"
    );
    var DDate = document.getElementById("ctl00_ContentPlaceHolder1_cDepTicket");
    var DtTime = document.getElementById("ctl00_ContentPlaceHolder1_ddlTime");
    var NumOfPax = document.getElementById(
      "ctl00_ContentPlaceHolder1_txtPaxNo"
    );
    var DStationID = document.getElementById(
      "ctl00_ContentPlaceHolder1_ddlToStation"
    );
    var ddlLines = document.getElementById("ctl00_ContentPlaceHolder1_ddlLine");

    //var strLines = ddlLines.value;
    //var LineID = strLines.split(",");

    var strLines = ddlLines.value;
    var LineID = strLines.split("|");
    var firstLineID = LineID[0].substring(1).split(",");
    firstLineID[0].substring(1);

    var strTime = DtTime.options[DtTime.selectedIndex].text.split("-");

    //function CheckPaxIsOksucess(results) {
    //    if (results == true) {

    NateevWebService.AddNewOnCall(
      FirstName.value,
      LastName.value,
      Phone.value,
      Phone.value,
      TripID.value,
      "865",
      "WebSite",
      0,
      StationID.value,
      parseInt(firstLineID[0]),
      DDate.value,
      strTime[0],
      NumOfPax.value,
      "Remark",
      1,
      1,
      "",
      DStationID.value,
      GetOrdersucess
    );

    function GetOrdersucess(results) {
      if (results == "") {
        ddlLinesTicketSale.length = 0;
        //resetControls(ddlLinesTicketSale, "בחר קו");
      } else {
        if (results > 0) {
          document.location.href = "OnCallThankYou.aspx";
        }
        // alert(results);
      }
    }

    //}
    //else {

    //if (isFirtLastName_OK()) {

    //    NateevWebService.AddNewOnCall(FirstName.value, LastName.value, Phone.value, Phone.value, TripID.value,
    //    "1", "WebSite", 0, StationID.value, ddlLines.value, DDate.value, DtTime.options[DtTime.selectedIndex].text,
    //    NumOfPax.value, "Remark", 1, 1, "", DStationID.value, GetOrdersucess1);

    //function GetOrdersucess1(results) {
    //    if (results == "") {
    //        ddlLinesTicketSale.length = 0
    //        //resetControls(ddlLinesTicketSale, "בחר קו");
    //    }
    //    else {
    //        if (results > 0) {
    //            document.location.href = "OnCallThankYou.aspx"
    //        }
    //        // alert(results);

    //    }
    //}

    //}

    //}

    // }
  }
}

$(".input-append.date")
  .datepicker({
    autoclose: true,
    minDate: 0,
    maxDate: "+4M +10D",
    dateFormat: "dd/mm/yy",
    format: "dd/mm/yyyy",
    todayHighlight: true,
    autoPick: true,
    //beforeShowDay: function (date) {
    //    if ($.inArray(formatDateToString(date), dateDisabled) !== -1) {
    //        return { classes: 'active' };///*,tooltip: 'You can select this date' */
    //    } else
    //        return false;
    //    //    return [true, "event", date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear(),"#fff"];
    //    //}
    //    //{
    //    //    return false;
    //    //}
    //},
  })
  .datepicker("setDate", new Date());

$("[id*='ddlLine']").change(function () {
  if (this.value == "") {
    var dtTheDate1 = document.getElementById(
      "ctl00_ContentPlaceHolder1_cDepTicket"
    );
    //dtTheDate1.value = readCookie('Date_cDepTicket');
  } else {
    //createCookie('Date_cDepTicket', this.value, 360);
    $("#phoneerrmsgTime").html("");
    GetOnCallTimes();
    GetOnCallStations();
    // GetDesLines();
  }
});

$("[id*='ddlTime']").change(function () {
  if (this.value == "00") {
    document.getElementById("btnOrder").disabled = true;
    $("#phoneerrmsgTime").html("קו קבוע לא מחוייב בהזמנה");
  } else {
    document.getElementById("btnOrder").disabled = false;
    $("#phoneerrmsgTime").html("");
  }
});

$("[id*='cDepTicket']").change(function () {
  if (this.value == "") {
    var dtTheDate1 = document.getElementById(
      "ctl00_ContentPlaceHolder1_cDepTicket"
    );
    dtTheDate1.value = readCookie("Date_cDepTicket");
    $("#phoneerrmsgTime").html("");
  } else {
    createCookie("Date_cDepTicket", this.value, 360);
    GetOnCallLines($("#cmbPlaces")[0].value);
    clearAllData();
    GetOnCallTimes();
    GetOnCallStations();
  }
});

function isNumberKey(evt) {
  var charCode = evt.which ? evt.which : event.keyCode;
  if (charCode > 31 && (charCode < 48 || charCode > 57)) {
    return false;
  }

  return true;
}

function NextBusgoTo() {
  if (
    document.getElementById("ctl00_ContentPlaceHolder1_ddlLine").value == "" ||
    document.getElementById("ctl00_ContentPlaceHolder1_ddlLine").value == "0"
  ) {
    alert(" לא בחרת קו ");
    return false;
  } else {
    var ddlLines = document.getElementById("ctl00_ContentPlaceHolder1_ddlLine");
    //var strLines = ddlLines.value;
    //     var LineID = strLines.split(",");
    var strLines = ddlLines.value;
    var LineID = strLines.split("|");

    var url = "NextBus.aspx?K=" + LineID[1].substring(1); //LineID[1];
    window.open(
      url,
      "_blank",
      "toolbar=yes, location=no,titlebar=no, directories=no, status=no, menubar=yes, scrollbars=yes, resizable=yes, copyhistory=yes"
    ); //.focus;

    return false;
  }
}
