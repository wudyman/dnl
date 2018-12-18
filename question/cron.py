import os
from datetime import datetime,timedelta
from .models import *
from django.core.cache import cache
from . import configure
#from . import push_configure

def h_task():
    print('hour task run --> '+datetime.now().strftime('%Y-%m-%d %H:%M:%S'))
    #######change push type start###############
    cache_key='push_method'
    cache_value=cache.get(cache_key,'expired')
    print(cache_value)
    if 'TIME'==cache_value:
        cache.set(cache_key,'LIKE',86400)#24*60*60=86400=24 hours
    else:
        cache.set(cache_key,'TIME',86400)#24*60*60=86400=24 hours
    '''
    filepath=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))+'/question/'
    f=open (filepath+'push_configure.py','r')
    method=f.read()
    f=open (filepath+'push_configure.py','w')
    if "METHOD='LIKE'"==method:
        f.write("METHOD='TIME'")
    else:
        f.write("METHOD='LIKE'")
    f.close()
    '''
    #######change push type end###############
    #######latest content site map start###########################
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
        
    f.close()
    #######latest content site map end###########################
    
def d_task():
    print('day task run --> '+datetime.now().strftime('%Y-%m-%d %H:%M:%S'))
    #######site map start#########
    find_date=datetime.now()+ timedelta(days=-365)
    item=''
    filepath=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))+'/question/templates/question/'
    f=open (filepath+'sitemap_content.html','w')
    f.write('<h1><B>回答列表</B></h1>')
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
        
    f.close()
    #######site map end#######
    #######topic check start###############
    topics=Topic.objects.all()
    for topic in topics:
        topic.nums=topic.question_nums+topic.article_nums+topic.follower_nums;
        topic.save()
    #######topic check end###############

def m_task():
    print('month task run --> '+datetime.now().strftime('%Y-%m-%d %H:%M:%S'))
    #######delete cache start###############
    cache_dir=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))+'/cache/'
    for i in os.listdir(cache_dir):
        cache_file = os.path.join(cache_dir,i)
        if os.path.isfile(cache_file):
            os.remove(cache_file)
    #######delete cache end###############