from django.shortcuts import render
from django.http import HttpResponse
import urllib
import json
import bs4
import requests
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
    url = 'http://www.marketwatch.com/investing/stock/' + stock
    text = requests.get(url).text
    soup = bs4.BeautifulSoup(text, "html.parser")
    price = soup.select('.pricewrap .data')[0].getText()
    return HttpResponse(price)
