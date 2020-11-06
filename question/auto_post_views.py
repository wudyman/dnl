
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
from . import configure
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
def auto_post_article(request):
    print(request.POST)
    userId=request.POST.get('user_id')
    print(userId)
    user=get_object_or_404(User,id=userId)
    print(user)
    print(user.first_name)
    title=request.POST.get('title')
    content=request.POST.get('content')
    topics=request.POST.getlist('topics_array')
    print(topics)
    
    article=Article()
    article.title=title
    article.content=content
    article.author=user
    article.topics_array=topics             
    article.save()
    user.userprofile.article_nums+=1
    user.userprofile.contribution+=configure.WRITE_ARTICLE_CONTRIBUTION
    user.userprofile.save()
    
    for topic_str in topics:
        topic_array=topic_str.split(':')
        topic=get_object_or_404(Topic,id=topic_array[0])
        topic.article.add(article)
        topic.article_nums+=1
        topic.save()
    print(article.id)
    return HttpResponse(str(article.id))
    #result='/article/'+str(article.id)+'/'
    #return HttpResponseRedirect(result)
    '''
    questions=Question.objects.all()
    for question in questions:
        topics_array=[];
        topics=question.topics.all()
        for topic in topics:
            topics_array.append(str(topic.id)+':'+topic.name)
        question.topics_array=topics_array
        question.save()
        
    articles=Article.objects.all()
    for article in articles:
        topics_array=[];
        topics=article.topics.all()
        for topic in topics:
            topics_array.append(str(topic.id)+':'+topic.name)
        article.topics_array=topics_array
        article.save()
        
    topics=Topic.objects.all()
    for topic in topics:
        topic.nums=topic.question_nums+topic.article_nums+topic.follower_nums;
        topic.save()
    
    cache_dir=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))+'/cache/'
    print(cache_dir)
    for i in os.listdir(cache_dir):
        cache_file = os.path.join(cache_dir,i)  # 取文件绝对路径
        if os.path.isfile(cache_file):
            os.remove(cache_file)
    '''              
    #return HttpResponse('success')
    
@csrf_exempt
def check_all(request):
    '''
    questions=Question.objects.all()
    for question in questions:
        topics_array=[];
        topics=question.topics.all()
        for topic in topics:
            topics_array.append(str(topic.id)+':'+topic.name)
        question.topics_array=topics_array
        question.save()
        
    articles=Article.objects.all()
    for article in articles:
        topics_array=[];
        topics=article.topics.all()
        for topic in topics:
            topics_array.append(str(topic.id)+':'+topic.name)
        article.topics_array=topics_array
        article.save()
        
    topics=Topic.objects.all()
    for topic in topics:
        topic.nums=topic.question_nums+topic.article_nums+topic.follower_nums;
        topic.save()
    
    cache_dir=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))+'/cache/'
    print(cache_dir)
    for i in os.listdir(cache_dir):
        cache_file = os.path.join(cache_dir,i)  # 取文件绝对路径
        if os.path.isfile(cache_file):
            os.remove(cache_file)
    '''              
    return HttpResponse('success')
    
@csrf_exempt
def check_sitemap(request):
    '''
    item=''
    filepath=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))+'/question/templates/question/'
    print(filepath)
    f=open (filepath+'sitemap_content.html','w')
    
    
    f.write('<h1><B>问题列表</B></h1>')
    questions=Question.objects.all()
    for question in questions:
        item='<h2><a href="'+configure.SITE_URL+'/question/'+str(question.id)+'/">'+question.title+'</a></h2>'
        f.write(item)
        
    f.write('<br/><h1><B>文章列表</B></h1>')
    articles=Article.objects.all()
    for article in articles:
        item='<h2><a href="'+configure.SITE_URL+'/article/'+str(article.id)+'/">'+article.title+'</a></h2>'
        f.write(item)
        
    f.write('<br/><h1><B>买卖列表</B></h1>')
    businessInfos=BusinessInfo.objects.all()
    for businessInfo in businessInfos:
        item='<h2><a href="'+configure.SITE_URL+'/business/'+str(businessInfo.id)+'/">'+businessInfo.title+'</a></h2>'
        f.write(item)
      
    f.write('<br/><h1><B>栏目列表</B></h1>')
    topics=Topic.objects.all()
    for topic in topics:
        item='<h2><a href="'+configure.SITE_URL+'/topic/'+str(topic.id)+'/">'+topic.name+'</a></h2>'
        f.write(item)
        
    f.close()
    ''' 
    
    #######latest content site map start###########################
    #'''
    find_date=datetime.now()+ timedelta(days=-7)
    item=''
    filepath=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))+'/question/templates/question/'
    f=open (filepath+'sitemap_latest_content.html','w')
    f.write('<h1><B>最新回答</B></h1>')
    answers=Answer.objects.order_by('-pub_date').filter(pub_date__gt=find_date).values_list("question__id","question__title","id")
    for answer in answers:
        item='<h2><a href="'+configure.SITE_URL+'/question/'+str(answer[0])+'/?ans='+str(answer[2])+'">'+answer[1]+'</a></h2>'
        f.write(item)
        
    f.write('<br/><h1><B>最新文章</B></h1>')
    articles=Article.objects.order_by('-update_date').filter(update_date__gt=find_date)
    for article in articles:
        item='<h2><a href="'+configure.SITE_URL+'/article/'+str(article.id)+'/">'+article.title+'</a></h2>'
        f.write(item)
        
    f.write('<br/><h1><B>最新买卖信息</B></h1>')
    businessInfos=BusinessInfo.objects.order_by('-update_date').filter(update_date__gt=find_date)
    for businessInfo in businessInfos:
        item='<h2><a href="'+configure.SITE_URL+'/business/'+str(businessInfo.id)+'/">'+businessInfo.title+'</a></h2>'
        f.write(item)
        
    f.write('<br/><h1><B>最新问题</B></h1>')
    questions=Question.objects.order_by('-pub_date').filter(pub_date__gt=find_date)
    for question in questions:
        item='<h2><a href="'+configure.SITE_URL+'/question/'+str(question.id)+'/">'+question.title+'</a></h2>'
        f.write(item)
        
    f=open (filepath+'sitemap_latest_content.html','r')
    sitemap_latest_content=f.read()
    cache_key='sitemap_latest_content'
    cache.set(cache_key,sitemap_latest_content,86400)#24*60*60=86400=24 hours
        
    f.close()
    #'''
    #######latest content site map end###########################
    #######content site map start#########
    #'''
    find_date=datetime.now()+ timedelta(days=-1365)
    item=''
    filepath=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))+'/question/templates/question/'
    f=open (filepath+'sitemap_content.html','w')
    f.write('<br/><h1><B>回答列表</B></h1>')
    answers=Answer.objects.order_by('-pub_date').filter(pub_date__gt=find_date).values_list("question__id","question__title","id")
    for answer in answers:
        item='<h2><a href="'+configure.SITE_URL+'/question/'+str(answer[0])+'/?ans='+str(answer[2])+'">'+answer[1]+'</a></h2>'
        f.write(item)
        
    f.write('<br/><h1><B>文章列表</B></h1>')
    articles=Article.objects.order_by('-update_date').filter(update_date__gt=find_date)
    for article in articles:
        item='<h2><a href="'+configure.SITE_URL+'/article/'+str(article.id)+'/">'+article.title+'</a></h2>'
        f.write(item)
        
    f.write('<br/><h1><B>买卖信息列表</B></h1>')
    businessInfos=BusinessInfo.objects.order_by('-update_date').filter(update_date__gt=find_date)
    for businessInfo in businessInfos:
        item='<h2><a href="'+configure.SITE_URL+'/business/'+str(businessInfo.id)+'/">'+businessInfo.title+'</a></h2>'
        f.write(item)
        
    f.write('<br/><h1><B>问题列表</B></h1>')
    questions=Question.objects.order_by('-pub_date').filter(pub_date__gt=find_date)
    for question in questions:
        item='<h2><a href="'+configure.SITE_URL+'/question/'+str(question.id)+'/">'+question.title+'</a></h2>'
        f.write(item)
        
    f.write('<br/><h1><B>栏目列表</B></h1>')
    topics=Topic.objects.all()
    for topic in topics:
        item='<h2><a href="'+configure.SITE_URL+'/topic/'+str(topic.id)+'/">'+topic.name+'</a></h2>'
        f.write(item)
        
    f=open (filepath+'sitemap_content.html','r')
    sitemap_content=f.read()
    cache_key='sitemap_content'
    cache.set(cache_key,sitemap_content,86400)#24*60*60=86400=24 hours
        
    f.close()
    #'''
    #######content site map end#######
    return HttpResponse('success 2')