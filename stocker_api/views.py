from django.shortcuts import render
from django.http import HttpResponse
import urllib
import json
import bs4
import requests
import datetime
from datetime import timedelta
# Create your views here.

"""
def get_stock(request):
    stock = request.path.split('/')[-1]
    baseUrl = 'http://query.yahooapis.com/v1/public/yql?q='
    query = "select * from yahoo.finance.quotes where symbol in ('" + stock + "')"
    encodeQ = urllib.quote(query.encode("utf-8"))
    finalUrl = baseUrl + encodeQ + '&format=json&env=http://datatables.org/alltables.env'
    response = urllib.urlopen(finalUrl)
    data = json.load(response)
    print data['query']['results']['quote']['LastTradePriceOnly']
    return HttpResponse(json.dumps(data))
"""

def get_stock(request):
    stock = request.path.split('/')[-1]
    url = 'https://www.google.com/finance?q=' + stock
    hist_url = 'https://www.google.com/finance/historical?q=NASDAQ%3A' + stock
    text = requests.get(url).text
    soup = bs4.BeautifulSoup(text, "html.parser")
    data = {}
    data['current_price'] = soup.select('.pr')[0].getText().split('\n')[1]
    data['open_price'] = soup.select('.snap-data .val')[2].getText().split('\n')[0]
    data['day_change'] = soup.select('.chr')[0].getText()
    json_data = json.dumps(data)
    today = datetime.datetime.now().date()
    fifty = timedelta(days=-50)

    print fifty + today
    return HttpResponse(json_data)

def round_hund(num):
    return ("%.2f" % num)

def percent_change(old, new):
    return round_hund(((new - old) / old) * 100)
