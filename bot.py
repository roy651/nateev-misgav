import telegram
from telegram.ext import Updater, MessageHandler, Filters
from telegram.ext import CommandHandler
import os
import re
import requests
import datetime

test_order = {
    "FirstName": "משה",
    "LastName": "כהן",
    "Phone": "0542345732",
    "Mobile": "0542345732",
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


# set up the introductory statement for the bot when the /start command is invoked
def start(update, context):
    chat_id = update.effective_chat.id
    context.bot.send_message(chat_id=chat_id, text="/details <first> <last> <phone> OR /order <date> <time>")

def details(update, context):
    input_details = update.message.text
    print(input_details)
    update.message.reply_text("Your details are: " + input_details)
    return

def order(update, context):
    input_details = update.message.text
    print(input_details)

    today = datetime.date.today()
    tomorrow = today + datetime.timedelta(days=1)
    test_order["DDate"] = tomorrow.strftime("%d/%m/%Y")
    print(test_order)

    result = _run_order(test_order)
    if result and result["d"]:
        update.message.reply_text("Your order id is: " + result["d"])
    else:
        update.message.reply_text("Your order failed: " + result)
    
    return

def _run_order(order):
    url = 'https://www.nateevexpress.com/OnCall/NateevWebService.asmx/AddNewOnCall'
    x = requests.post(url, json = order)
    print(x.json())

    return x.json()


telegram_bot_token = os.environ['TGRM_TKN']
if telegram_bot_token != 'TEST':
    updater = Updater(token=telegram_bot_token, use_context=True)
    dispatcher = updater.dispatcher

    # run the start function when the user invokes the /start command 
    dispatcher.add_handler(CommandHandler("start", start))

    dispatcher.add_handler(CommandHandler("details", details))

    dispatcher.add_handler(CommandHandler("order", order))

    # invoke the get_link function when the user sends a message 
    # that is not a command.
    # dispatcher.add_handler(MessageHandler(Filters.text, get_link))

    # updater.start_polling()
    updater.start_webhook(listen="0.0.0.0",
                        port=int(os.environ.get('PORT', 5243)),
                        url_path=telegram_bot_token,
                        webhook_url= 'https://nateev-misgav.up.railway.app/' + telegram_bot_token
                        )