document.addEventListener('DOMContentLoaded', () => {

      document.querySelector('.button-infer').onclick = () => {

          // Initialize new request
          const request = new XMLHttpRequest();

          ISVals = retrieveInitialSeries();

          request.open('POST', '/api/v1/infer');
          request.setRequestHeader('Content-Type', 'application/json');

          // Callback function for when request completes
          request.onload = () => {
              var modal = document.getElementById("infer-modal");
              modal.style.display = "block";

              console.log(request.responseText);
              //Extract JSON data from request

              const data = JSON.parse(request.responseText);

              // Update the result div
              if (data.success) {
                const table = document.querySelector('#infer-res-table tbody');
                possDates = data.data.poss_dates;
                possDates.forEach((date) => {
                  dateStrs = mayadateToString(date)
                  const row = table.insertRow();

                  setDateAttrs(row, date);


                  const lcCell = row.insertCell(0);
                  const crCell = row.insertCell(1);
                  const gCell = row.insertCell(2);

                  lcCell.innerHTML = dateStrs.long_count;
                  crCell.innerHTML = dateStrs.calendar_round;
                  gCell.innerHTML = dateStrs.glyph_g;

                })

                rows = document.querySelectorAll('#infer-res-table tr');
                rows.forEach((row) => {
                  row.onclick = () => {
                    rs = document.querySelectorAll('#infer-res-table tr');
                    rs.forEach((r) => {
                      r.classList.remove('selected');
                    })
                    row.classList.toggle('selected');
                  }
                })

                const selectButton = document.querySelector('#infer-select');
                selectButton.onclick = () => {
                  const selectedRow = document.querySelector('.selected');
                  const table = document.querySelector('#infer-res-table tbody');
                  table.innerHTML = ""

                  const ISRow = document.querySelector("#initial-series-row");
                  const ISVals = getDateAttrs(selectedRow);
                  enterInitialSeries(ISVals);


                  document.getElementById("infer-modal").style.display = "none";

                }
              }
              else {
                  // document.querySelector('#result').innerHTML = data;
              }
          }

          // Add data to send with request
          request.send(JSON.stringify(ISVals));

          return false;
      };

      document.querySelector("#clear-0").onclick = () => {
        clear();
      }

      var modal = document.getElementById("infer-modal");
      // Get the <span> element that closes the modal
      var span = document.getElementsByClassName("close")[0];

      // When the user clicks on <span> (x), close the modal
      span.onclick = function() {
        modal.style.display = "none";
      }

      // When the user clicks anywhere outside of the modal, close it
      window.onclick = function(event) {
        if (event.target == modal) {
          modal.style.display = "none";
        }
      }

      document.querySelector('#enter-0').onclick = () => {
        const ISVals = retrieveInitialSeries();
        const request = enterInitialSeries(ISVals);
      }

      Handlebars.registerHelper('concat', function (a, b) {
        return `${a}${b}`;
      });

      // document.querySelector('.baktun').addEventListener('keyup', (e) => {
      //   let currentVal = e.target.value;
      //   const re = /^\d*$/;
      //   const valid = (re.test(currentVal) || parseInt(currentVal) > 19);
      //   if (!valid){
      //     document.querySelector('.baktun').nextElementSibling.style.display = "flex";
      //     e.target.classList.add("invalid-input");
      //   } else {
      //     document.querySelector('.baktun').nextElementSibling.style.display = "none";
      //     e.target.classList.remove("invalid-input");
      //   };
      //
      // }, false);

});



const mayadateToString = (dateJSON) => {
  const lc = dateJSON.long_count
  const tz = dateJSON.calendar_round.tzolkin
  const hb = dateJSON.calendar_round.haab
  const glyphG = dateJSON.glyph_g

  return {
      'long_count' : `${lc.baktun}.${lc.katun}.${lc.tun}.${lc.winal}.${lc.kin}`,
      'calendar_round' : `${tz.day_number} ${tz.day_name}  ${hb.month_number} ${hb.month_name}`,
      'glyph_g' : glyphG
  }

}

const setDateAttrs = (row, dateDict) => {
  row.dataset.baktun = dateDict.long_count.baktun
  row.dataset.katun = dateDict.long_count.katun
  row.dataset.tun = dateDict.long_count.tun
  row.dataset.winal = dateDict.long_count.winal
  row.dataset.kin = dateDict.long_count.kin

  row.dataset.tz_num = dateDict.calendar_round.tzolkin.day_number
  row.dataset.tz_name = dateDict.calendar_round.tzolkin.day_name

  row.dataset.hb_num = dateDict.calendar_round.haab.month_number
  row.dataset.hb_name = dateDict.calendar_round.haab.month_name

  row.dataset.glyph_g = dateDict.glyph_g

}

const processInt = (val) => {
  if(val === ""){
    return null;
  } else {
    return parseInt(val);
  }
}

const processStr = (val) => {
  if(val === ""){
    return null;
  } else {
    return val;
  }
}

const retrieveInitialSeries = () => {

  const baktun = processInt(document.querySelector('#baktun-0').value);
  const katun = processInt(document.querySelector('#katun-0').value);
  const tun = processInt(document.querySelector('#tun-0').value);
  const winal = processInt(document.querySelector('#winal-0').value);
  const kin = processInt(document.querySelector('#kin-0').value);

  const tzolkin_num = processInt(document.querySelector('#tzolkin-num-0').value)
  const tzolkin_name = processStr(document.querySelector('#tzolkin-0').value)

  const haab_num = processInt(document.querySelector('#haab-num-0').value)
  const haab_name = processStr(document.querySelector('#haab-0').value)

  const glyph_g = processStr(document.querySelector('#g-0').value)

  return {
    'long_count' : {
      'baktun' : baktun,
      'katun' : katun,
      'tun' : tun,
      'winal' : winal,
      'kin' : kin
    },
    'calendar_round' : {
      'tzolkin' : {
        'day_number' : tzolkin_num,
        'day_name' : tzolkin_name
      },
      'haab' : {
        'month_number' : haab_num,
        'month_name' : haab_name
      }
    },
    'glyph_g' : glyph_g
  };
}

const enterInitialSeries = (ISVals) => {
  const request = new XMLHttpRequest();

  request.open('POST', '/initial_series');
  request.setRequestHeader('Content-Type', 'application/json');

  request.onload = () => {
    const data = JSON.parse(request.responseText);
    if (data.success) {
      const displayTemplate = Handlebars.compile(document.querySelector('#is-entered').innerHTML);
      const displayRow = displayTemplate({'date' : ISVals})
      const ISRow = document.querySelector("#initial-series-row")
      ISRow.innerHTML = displayRow;
      ISRow.classList.add('is-entered');
      document.querySelectorAll(".is-tooltip").forEach((elem) => { elem.hidden = true;})

      setDateAttrs(ISRow, ISVals);

      document.querySelector("#add-row-0").onclick = () => {
        addRow(1);
      }

      document.querySelector('#edit-0').onclick = () => {
        toEditMode();
      }

      document.querySelector("#convert-0").onclick = () => {
        convert();
      }

      document.querySelectorAll("#convert-0-div .dropdown-item").forEach((item) => {
        item.onclick = () => {
          document.querySelectorAll("#convert-0-div .dropdown-item").forEach((i) => {
            i.classList.remove("active");
          })
          item.classList.add("active");
          convert();
          return false;
        }
      });

      if (document.querySelector("#parent-form").dataset.converted === "true") {
        convert();
      }

    } else {
      console.log(data);
    }

  }
  request.send(JSON.stringify(ISVals));

  return request;
}

const getDateAttrs = (obj) => {
  return {
    'long_count' : {
      'baktun' : processInt(obj.dataset.baktun),
      'katun' : processInt(obj.dataset.katun),
      'tun' : processInt(obj.dataset.tun),
      'winal' : processInt(obj.dataset.winal),
      'kin' : processInt(obj.dataset.kin)
    },
    'calendar_round' : {
      'tzolkin' : {
        'day_number' : processInt(obj.dataset.tz_num),
        'day_name' : processStr(obj.dataset.tz_name)
      },
      'haab' : {
        'month_number' : processInt(obj.dataset.hb_num),
        'month_name' : processStr(obj.dataset.hb_name)
      }
    },
    'glyph_g' : processStr(obj.dataset.glyph_g)
  };

}

const infer = () => {
  // Initialize new request
  const request = new XMLHttpRequest();

  ISVals = retrieveInitialSeries();

  request.open('POST', '/api/v1/infer');
  request.setRequestHeader('Content-Type', 'application/json');

  // Callback function for when request completes
  request.onload = () => {
      var modal = document.getElementById("infer-modal");
      modal.style.display = "block";

      console.log(request.responseText);
      //Extract JSON data from request

      const data = JSON.parse(request.responseText);

      // Update the result div
      if (data.success) {
        const table = document.querySelector('#infer-res-table tbody');
        possDates = data.data.poss_dates;
        possDates.forEach((date) => {
          const dateStrs = mayadateToString(date)
          const row = table.insertRow();

          setDateAttrs(row, date);
          console.log(lcStrToKin(dateStrs.long_count));
          row.dataset.total_kin = lcStrToKin(dateStrs.long_count);

          const lcCell = row.insertCell(0);
          const crCell = row.insertCell(1);
          const gCell = row.insertCell(2);

          lcCell.innerHTML = dateStrs.long_count;
          crCell.innerHTML = dateStrs.calendar_round;
          gCell.innerHTML = dateStrs.glyph_g;



        })

        rows = document.querySelectorAll('#infer-res-table tbody tr');
        rows.forEach((row) => {
          row.onclick = () => {
            rs = document.querySelectorAll('#infer-res-table tbody tr');
            rs.forEach((r) => {
              r.classList.remove('selected');
            })
            row.classList.toggle('selected');
          }
        })

        const selectButton = document.querySelector('#infer-select');
        selectButton.onclick = () => {
          const selectedRow = document.querySelector('.selected');

          const ISRow = document.querySelector("#initial-series-row");
          const ISVals = getDateAttrs(selectedRow);
          enterInitialSeries(ISVals);


          document.getElementById("infer-modal").style.display = "none";

        }
      }
      else {
          // document.querySelector('#result').innerHTML = data;
      }
  }

  // Add data to send with request
  request.send(JSON.stringify(ISVals));

  return false;

}
const toEditMode = () => {

  const ISRow = document.querySelector("#initial-series-row")
  const ISVals = getDateAttrs(ISRow);

  const editTemplate = Handlebars.compile(document.querySelector("#is-edit").innerHTML);
  const editRow = editTemplate({'date' : ISVals});

  ISRow.innerHTML = editRow;

  document.querySelector('#enter-0').onclick = () => {
    const ISVals = retrieveInitialSeries();
    const request = enterInitialSeries(ISVals);
  }

  document.querySelector('#infer-0').onclick = () => {
    infer();
  }

  document.querySelector("#clear-0").onclick = () => {
    clear();
  }

  return false;
}

const clear = () => {
  document.querySelectorAll("#initial-series-row input").forEach((field) => {
    field.value = "";
    field.setAttribute("placeholder", "");
  });
}

const convert = () => {
  // Initialize new request
  const request = new XMLHttpRequest();

  // const ISRow = document.querySelector("#initial-series-row")
  // const ISVals = getDateAttrs(ISRow);
  const dateVals = Array.from(document.querySelectorAll("#initial-series-row, .dist-res-row"), (row) => {
    return getDateAttrs(row);
  })

  const mode = document.querySelector("#convert-0-div .active").dataset.mode

  request.open('POST', '/api/v1/convert/batch/from_maya');
  request.setRequestHeader('Content-Type', 'application/json');

  request.onload = () => {
      console.log(request.responseText);
      //Extract JSON data from request

      const data = JSON.parse(request.responseText);

      // Update the result div
      if (data.success) {
        document.querySelectorAll(".main-date-col").forEach((col) => {
          col.classList.replace("col-3","col-2");
        });
        document.querySelectorAll(".convert-col").forEach((col) => {
          col.remove();
        });
        const convertTemplate  = Handlebars.compile(document.querySelector("#convert_template").innerHTML);
        const params = data.dates.map((date, idx) => {
          return {
            "cal_type" : mode.replace("_"," "),
            "date" : (mode === "julian_day") ? date : processDateObj(date),
            "isJulianDay" : (mode === "julian_day"),
            "isInitialSeries" : (idx === 0)
          }
        });

        document.querySelectorAll("#initial-series-row .g-col, .dist-res-row  .g-col").forEach((col, idx) => {
          col.insertAdjacentHTML('afterend', convertTemplate(params[idx]));
        });
        document.querySelectorAll(".dist-num-row .g-col").forEach((col) => {
          col.insertAdjacentHTML('afterend', '<div class="col-2 convert-col"></div>');
        })

        document.querySelector("#parent-form").dataset.converted = true;

      }
      else {

      }
  }

  // Add data to send with request
  request.send(JSON.stringify({
    'dates' : dateVals,
    'correlation' : 584283,
    'mode' : mode
  }));
  return false;
}

const addRow = (rowNum) => {
  const distanceNum = {
    "row" : rowNum,
    "sign" : "+",
    "empty" : true
  }

  // const isLastRow = document.querySelector("#parent-form").lastElementChild.row === (rowNum).toString();


  const distRowTemplate = Handlebars.compile(document.querySelector("#dist-edit").innerHTML);

  if(rowNum == 1) {
    document.querySelector("#dist-rows").insertAdjacentHTML('afterbegin', distRowTemplate(distanceNum));
  } else {
    document.querySelector(`#dist-res-${rowNum -1}`).insertAdjacentHTML('afterend', distRowTemplate(distanceNum));
  }

  const rowAdded = document.querySelector(`#dist-row-${rowNum}`);
  updateRowNums(rowAdded);


  document.querySelector(`#enter-${rowNum}`).onclick = () => {
    enterDistanceNumber(rowNum, true);
  }
  document.querySelector(`#clear-${rowNum}`).onclick = () => {
    document.querySelectorAll("#dist-row-1 input").forEach((i) => {
      i.value = "";
    });
  }

}

const updateRowNums = (rowAdded) => {
  console.log("updating")
  let row = rowAdded
  while (row.nextElementSibling) {
    row = row.nextElementSibling;
    let newRowNum = parseInt(row.dataset.row) + 1
    row.dataset.row = newRowNum;
    row.id = row.id.replace((newRowNum - 1).toString(), (newRowNum).toString());

    row.querySelectorAll("p,h6,button,label,input").forEach((elem) => {
      elem.id = elem.id.replace((newRowNum - 1).toString(), (newRowNum).toString());
    });

    if (row.classList.contains("dist-num-row")) {
      row.querySelector(`#dist-label-${newRowNum}`).innerHTML = `Distance Number ${newRowNum}:`;
    }

  }
}

const enterDistanceNumber = (rowNum, justAdded) => {
  const request = new XMLHttpRequest();

  request.open(justAdded ? 'POST' : 'PUT', '/distance_number');
  request.setRequestHeader('Content-Type', 'application/json');

  const distanceNum = retrieveDistanceNumber(rowNum, "edit");


  request.onload = () => {
    const data = JSON.parse(request.responseText);
    if (data.success) {
      console.log(data)
      // distanceNum.distance_number.sign = (distanceNum.distance_number.sign == 1) ? "+" : "-";

      const dnParams = {
        entries : data.resulting_dates.map((res) => {
          let r = res.row;
          let dn = (r == rowNum) ? distanceNum : retrieveDistanceNumber(r, "enter");
          dn.distance_number.sign = (dn.distance_number.sign == 1) ? "+" : "-";
          return {
            ...dn,
            result : res.date
          };
        })
      };

      document.querySelector(`#dist-row-${rowNum}`).remove();

      const distRowTemplate = Handlebars.compile(document.querySelector("#dist-entered").innerHTML);
      document.querySelector("#dist-rows").innerHTML = distRowTemplate(dnParams);
      dnParams.entries.forEach((entry) => {
        setDistAttrs(entry.row, entry);
        setDateAttrs(document.querySelector(`#dist-res-${entry.row}`), entry.result);

        document.querySelector(`#edit-${entry.row}`).onclick = () => {
          editDistanceNumber(entry.row);
        }

        document.querySelector(`#add-row-${entry.row}`).onclick = () => {
          addRow(entry.row + 1);
        }
      })

      if (document.querySelector("#parent-form").dataset.converted === "true") {
        convert();
      }

    } else {
      console.log(data);
    }

  }
  request.send(JSON.stringify(distanceNum));

  return request;
}

const editDistanceNumber = (rowNum) => {
  const distanceNum = getDistAttrs(rowNum);
  distanceNum.empty = false;
  distanceNum.distance_number.sign = (distanceNum.distance_number.sign == 1) ? "+" : "-";

  document.querySelectorAll(`#dist-res-${rowNum},#dist-row-${rowNum}`).forEach((r) => {
    r.remove();
  });

  const distRowTemplate = Handlebars.compile(document.querySelector("#dist-edit").innerHTML);
  const prevFormRow = (rowNum == 1) ?
                        document.querySelector("#initial-series-row") :
                        document.querySelector(`#dist-res-${rowNum -1}`);

  prevFormRow.insertAdjacentHTML('afterend', distRowTemplate(distanceNum));

  document.querySelector(`#enter-${rowNum}`).onclick = () => {
    enterDistanceNumber(rowNum, false);
  }
  document.querySelector(`#clear-${rowNum}`).onclick = () => {
    document.querySelectorAll(`#dist-row-${rowNum} input`).forEach((i) => {
      i.value = "";
    });
  }
}

const retrieveDistanceNumber = (rowNum, mode) => {
  if (mode === "edit") {
  let r = document.querySelector(`#dist-row-${rowNum}`);

    return {
      "row" : rowNum,
      "distance_number" : {
        "sign" : r.querySelector(`#sign-${rowNum}`).value == "+" ?
                    1 : r.querySelector(`#sign-${rowNum}`).value == "-" ?
                    -1 : null,
        "baktun" : processInt(r.querySelector(`#baktun-${rowNum}`).value),
        "katun" : processInt(r.querySelector(`#katun-${rowNum}`).value),
        "tun" : processInt(r.querySelector(`#tun-${rowNum}`).value),
        "winal" : processInt(r.querySelector(`#winal-${rowNum}`).value),
        "kin" : processInt(r.querySelector(`#kin-${rowNum}`).value),
      }
    }
  } else if (mode==="enter") {
    return getDistAttrs(rowNum);
  }
}

const getDistAttrs = (rowNum) => {
  row = document.querySelector(`#dist-row-${rowNum}`);

  return {
    "row" : rowNum,
    "distance_number" : {
      "sign" : row.dataset.sign === "+" ? 1 :
                row.dataset.sign === "-" ? -1 : null,
      "baktun" : processInt(row.dataset.baktun),
      "katun" : processInt(row.dataset.katun),
      "tun" : processInt(row.dataset.tun),
      "winal" : processInt(row.dataset.winal),
      "kin" : processInt(row.dataset.kin),
    }
  }

}

const setDistAttrs = (rowNum, data) => {
  row = document.querySelector(`#dist-row-${rowNum}`);

  row.dataset.sign = data.distance_number.sign;
  row.dataset.katun = data.distance_number.katun;
  row.dataset.baktun = data.distance_number.baktun;
  row.dataset.katun = data.distance_number.katun;
  row.dataset.tun = data.distance_number.tun;
  row.dataset.winal = data.distance_number.winal;
  row.dataset.kin = data.distance_number.kin;

}

const processDateObj = (dateObj) => {
  dateObj.month = monthFromNum(dateObj.month);
  dateObj.year = (dateObj.year > 0) ? `${dateObj.year} CE` : `${-1 *dateObj.year + 1} BCE`;
  switch(dateObj.day % 10) {
    case 1:
      (dateObj.day === 11) ?
        dateObj.day = "11th":
        dateObj.day = `${dateObj.day}st`;
      break;
    case 2:
      (dateObj.day === 12) ?
        dateObj.day = "12th":
        dateObj.day = `${dateObj.day}nd`;
      break;
    case 3:
      (dateObj.day === 13) ?
        dateObj.day = "13th":
        dateObj.day = `${dateObj.day}rd`;
      break;
    default:
      dateObj.day = `${dateObj.day}th`;
      break;
  }
  return dateObj;
}


const monthFromNum = (num) => {
  let month = "";
  switch(num) {
    case 1:
      month = "Jan";
      break;

    case 2:
      month = "Feb";
      break;

    case 3:
      month = "Mar";
      break;

    case 4:
      month = "Apr";
      break;

    case 5:
      month = "May";
      break;

    case 6:
      month = "Jun";
      break;

    case 7:
      month = "Jul";
      break;

    case 8:
      month = "Aug";
      break;

    case 9:
      month = "Sep";
      break;

    case 10:
      month = "Oct";
      break;

    case 11:
      month = "Nov";
      break;

    case 12:
      month = "Dec";
      break;
  }
  return month;
}

const lcStrToKin = (lcStr) => {
  const vals = lcStr.split(".")
  let num = (parseInt(vals[4]) + (parseInt(vals[3]) * 20) + (parseInt(vals[2]) * 20 * 18) +
                (parseInt(vals[3]) * 18 * (20 ** 2)) + (parseInt(vals[0]) * 18 * (20 ** 3)))

  return num
}
