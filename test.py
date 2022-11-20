import os
os.environ['TGRM_TKN'] = "TEST"

from bot import _run_order
order = {
    "FirstName": "ddd",
    "LastName": "fff",
    "Phone": "0542277222",
    "Mobile": "0542277222",
    "TripID": "50795116",
    "Clerk": "865",
    "HostName": "WebSite",
    "CityID": 0,
    "StationID": "806601",
    "LineID": 37848,
    "DDate": "11/11/2022",
    "DtTime": "06:45",
    "NumOfPax": "1",
    "Remarks": "Remark",
    "StatusID": 1,
    "Boarded": 1,
    "Destination": "",
    "DStationID": "0"
}

print(_run_order(order))