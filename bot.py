import telegram
from telegram.ext import Updater, MessageHandler, Filters
from telegram.ext import CommandHandler
import os
import re

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
    update.message.reply_text("Your order is: " + input_details)
    return


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