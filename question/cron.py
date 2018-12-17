import os
from .models import *
from . import configure

def test():
    #print('test task run')
    
def d_task():
    print('day task run')
    #######site map start#########
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
    #######site map end#######
    #######topic check start###############
    topics=Topic.objects.all()
    for topic in topics:
        topic.nums=topic.question_nums+topic.article_nums+topic.follower_nums;
        topic.save()
    #######topic check end###############
    #######change push type start###############
    if 'LIKE'==configure.PUSH_MTTHOD:
        configure.PUSH_MTTHOD='TIME'
    else:
        configure.PUSH_MTTHOD='LIKE'
    #######change push type end###############
    #######delete cache start###############
    cache_dir=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))+'/cache/'
    for i in os.listdir(cache_dir):
        cache_file = os.path.join(cache_dir,i)
        if os.path.isfile(cache_file):
            os.remove(cache_file)
    #######delete cache end###############
def m_task():
    print('month task run')