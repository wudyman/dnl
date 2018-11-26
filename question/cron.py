import os
from .models import *

def test():
    print('test task run')
    
def d_task():
    print('day task run')
    #######site map#########
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
    #######site map#######
def m_task():
    print('month task run')