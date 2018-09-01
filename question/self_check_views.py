
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