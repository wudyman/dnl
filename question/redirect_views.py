
from django.shortcuts import render,get_object_or_404
from django.http import HttpResponse,HttpResponseRedirect
from django.views import generic
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

            
class RedirectArticleView(generic.ListView):
    #template_name='question/t_er_active.html'
    def get_queryset(self): 
        return
    def get(self,request,*args,**kwargs):
        articleId=self.kwargs.get('article_id')
        articleId=int(articleId)
        if 0!=(articleId%2):
            articleId=articleId+1
        articleId=articleId+20000
        url='http://it.danongling.com/articles/'+str(articleId)+'.html'
        print(url)
        return HttpResponseRedirect(url)
        
class RedirectCateView(generic.ListView):
    #template_name='question/t_er_active.html'
    def get_queryset(self): 
        return
    def get(self,request,*args,**kwargs):
        category_str=self.kwargs.get('category_str')
        url='http://it.danongling.com/articles/category/'+category_str
        print(url)
        return HttpResponseRedirect(url)
        
class RedirectTagView(generic.ListView):
    #template_name='question/t_er_active.html'
    def get_queryset(self): 
        return
    def get(self,request,*args,**kwargs):
        tag_str=self.kwargs.get('tag_str')
        url='http://it.danongling.com/articles/tag/'+tag_str
        print(url)
        return HttpResponseRedirect(url)
            
@csrf_exempt
def redirect_article(request,*args,**kwargs):
    print('*****************************')
    articleId=self.kwargs.get('article_id')
    print(articleId)
    url='http://it.danongling.com/articles/19052.html'
    return HttpResponseRedirect(url)
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