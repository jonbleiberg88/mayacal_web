document.addEventListener('DOMContentLoaded', () => {

      document.querySelector('.button-infer').onclick = () => {

          // Initialize new request
          const request = new XMLHttpRequest();

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

          const baktun = processInt(document.querySelector('#baktun-0').value);
          const katun = processInt(document.querySelector('#katun-0').value);
          const tun = processInt(document.querySelector('#tun-0').value);
          const winal = processInt(document.querySelector('#winal-0').value);
          const kin = processInt(document.querySelector('#kin-0').value);

          const tzolkin_num = processInt(document.querySelector('#tzolkin-num-0').value)
          const tzolkin_name = processStr(document.querySelector('#tzolkin-0').value)

          const haab_num = processInt(document.querySelector('#haab-num-0').value)
          const haab_name = processStr(document.querySelector('#haab-0').value)

          // alert(`${baktun}.${katun}.${tun}.${winal}.${kin} ${tzolkin_num} ${tzolkin_name} ${haab_num} ${haab_name}`);
          request.open('POST', '/api/v1/infer');
          request.setRequestHeader('Content-Type', 'application/json');

          // Callback function for when request completes
          request.onload = () => {
              // console.log(request.responseText);
              //Extract JSON data from request

              const data = JSON.parse(request.responseText);

              // Update the result div
              if (data.success) {
                poss_dates = data.data.poss_dates
                // document.querySelector('#result').innerHTML = data.data.poss_dates[0];
              }
              else {
                  // document.querySelector('#result').innerHTML = data;
              }
          }

          // Add data to send with request
          request.send(JSON.stringify({
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
            }
          }));
          return false;
      };


      document.querySelector('.button-convert').onclick = () => {

          // Initialize new request
          const request = new XMLHttpRequest();

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

          const baktun = processInt(document.querySelector('#baktun-0').value);
          const katun = processInt(document.querySelector('#katun-0').value);
          const tun = processInt(document.querySelector('#tun-0').value);
          const winal = processInt(document.querySelector('#winal-0').value);
          const kin = processInt(document.querySelector('#kin-0').value);

          const tzolkin_num = processInt(document.querySelector('#tzolkin-num-0').value)
          const tzolkin_name = processStr(document.querySelector('#tzolkin-0').value)

          const haab_num = processInt(document.querySelector('#haab-num-0').value)
          const haab_name = processStr(document.querySelector('#haab-0').value)

          request.open('POST', '/api/v1/convert/from_maya');
          request.setRequestHeader('Content-Type', 'application/json');

          // Callback function for when request completes
          request.onload = () => {
              console.log(request.responseText);
              //Extract JSON data from request

              const data = JSON.parse(request.responseText);

              // Update the result div
              if (data.success) {
                // document.querySelector('#result').innerHTML = data.data.poss_dates[0];
              }
              else {
                  // document.querySelector('#result').innerHTML = data;
              }
          }

          // Add data to send with request
          request.send(JSON.stringify({

          'date' : {
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
              }
          },
          'correlation' : 584283,
          'mode' : 'julian'
          }));
          return false;
      };

  });
