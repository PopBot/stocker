from django.shortcuts import render
from django.http import HttpResponse
import urllib
import json
import bs4
import requests
import datetime
from datetime import timedelta
# Create your views here.

ua = 'Mozilla/5.0 (X11; Linux x86_64; rv:45.0) Gecko/20100101 Firefox/45.0'
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
    headers = {'User-Agent': ua}
    text = requests.get(url, headers=headers).text
    soup = bs4.BeautifulSoup(text, "html.parser")
    try:
        data = {}
        data['name'] = soup.title.string.split(':')[0]
        data['current_price'] = soup.select('.pr')[0].getText().split('\n')[1]
        data['open_price'] = soup.select('.snap-data .val')[2].getText().split('\n')[0]
        data['pe'] = soup.select('.snap-data .val')[5].getText().split('\n')[0]
        try:
            data['day_change'] = soup.select('.chg')[0].getText()
        except:
            data['day_change'] = soup.select('.ch')[0].getText()

        data['historical_data'] = get_historical_data(stock)

        json_data = json.dumps(data)
        today = datetime.datetime.now().date()
        fifty = timedelta(days=-50)

        return HttpResponse(json_data)
    except Exception as e:
        print repr(e)
        return HttpResponse('["failure"]')

# gets data from the last 200 trading days
def get_historical_data(stock):
    hist_url = 'https://www.google.com/finance/historical?q=NASDAQ%3A' + stock + '&num=200'
    hist_text = requests.get(hist_url).text
    hist_soup = bs4.BeautifulSoup(hist_text, "html.parser")
    dates = hist_soup.select('.historical_price tr')
    dates_process = dates[0].getText().split('\n\n')
    result = {}
    for i in range(1, len(dates_process)):
        results = dates_process[i].split('\n')
        result[results[0]] = {'Open': results[1], 'High': results[2], 'Low': results[3], 'Close': results[4], 'Volume': results[5], 'Change': percent_change(float(results[1]), float(results[4])), 'Diff': round_hund(float(results[4]) - float(results[1]))}
    return result


def round_hund(num):
    return ("%.2f" % num)

def percent_change(old, new):
    return round_hund(((new - old) / old) * 100)
