
from django.shortcuts import render,get_object_or_404
from django.http import HttpResponse,HttpResponseRedirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin
from .models import *
from django.contrib.auth.models import User
from django.contrib.auth import authenticate,login,logout
import json
from django.views.decorators.csrf import csrf_exempt
from .models import *
import time,random
from PIL import Image
from django.db import connection
from . import dysms
import uuid
from datetime import datetime,timedelta
#from itertools import chain
#import numpy as np
from django.core.cache import cache

import os

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
#BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

class CJsonEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, datetime):
            return obj.strftime('%Y-%m-%d %H:%M:%S')
        elif isinstance(obj, date):
            return obj.strftime("%Y-%m-%d")
        else:
            return json.JSONEncoder.default(self, obj)
    
@csrf_exempt
def check_all(request):
    questions=Question.objects.all()
    for question in questions:
        topics_array=[];
        topics=question.topics.all()
        for topic in topics:
            topics_array.append(str(topic.id)+':'+topic.name)
        print(topics_array)
        question.topics_array=topics_array
        question.save()
        
    articles=Article.objects.all()
    for article in articles:
        topics_array=[];
        topics=article.topics.all()
        for topic in topics:
            topics_array.append(str(topic.id)+':'+topic.name)
        print(topics_array)
        article.topics_array=topics_array
        article.save()
    return HttpResponse('success')
    
@csrf_exempt
def check_sitemap(request):
    item=''
    filepath=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))+'/question/templates/question/'
    print(filepath)
    f=open (filepath+'sitemap_content.html','w')
    
    f.write('<h1><B>问题列表</B></h1>')
    questions=Question.objects.all()
    for question in questions:
        item='<h2><a href="/question/'+str(question.id)+'/">'+question.title+'</a></h2>'
        f.write(item)
        
    f.write('<br/><h1><B>文章列表</B></h1>')
    articles=Article.objects.all()
    for article in articles:
        item='<h2><a href="/article/'+str(article.id)+'/">'+article.title+'</a></h2>'
        f.write(item)
        
    f.write('<br/><h1><B>买卖列表</B></h1>')
    businessInfos=BusinessInfo.objects.all()
    for businessInfo in businessInfos:
        item='<h2><a href="/business/'+str(businessInfo.id)+'/">'+businessInfo.title+'</a></h2>'
        f.write(item)
        
    f.write('<br/><h1><B>栏目列表</B></h1>')
    topics=Topic.objects.all()
    for topic in topics:
        item='<h2><a href="/topic/'+str(topic.id)+'/">'+topic.name+'</a></h2>'
        f.write(item)
        
    f.close()
    return HttpResponse('success')