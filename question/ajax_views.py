
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
from django.db.models import Q
from . import dysms
import uuid
from datetime import datetime,timedelta
#from itertools import chain
#import numpy as np
from django.core.cache import cache
from . import configure
#from . import push_configure

class CJsonEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, datetime):
            return obj.strftime('%Y-%m-%d %H:%M:%S')
        elif isinstance(obj, date):
            return obj.strftime("%Y-%m-%d")
        else:
            return json.JSONEncoder.default(self, obj)
    
@csrf_exempt
def follow(request):
    to_json=json.dumps('fail')
    user=request.user
    if user.is_authenticated:
        follow_type=request.POST.get('follow_type')
        follow_id=request.POST.get('follow_id')
        follow_action=request.POST.get('follow_action')
        if 'question'==follow_type:
            question=get_object_or_404(Question,pk=follow_id)
            if question:
                if int(follow_action):
                    question.follower.add(user)
                    question.follower_nums+=1
                    user.userprofile.followquestion_nums+=1
                else:
                    question.follower.remove(user)
                    if question.follower_nums>0:
                        question.follower_nums-=1
                    else:
                        question.follower_nums=question.follower.count() 
                    if user.userprofile.followquestion_nums>0:
                        user.userprofile.followquestion_nums-=1
                    else:
                        user.userprofile.followquestion_nums=user.followquestions.count()
                question.save()
                user.userprofile.save()
                ret_data=[]
                ret_data.append(question.follower_nums)
                follow_questions=user.followquestions.values_list("id",flat=True)
                ret_data.append(list(follow_questions))
                to_json=json.dumps(ret_data)
        elif 'people'==follow_type:
            er=get_object_or_404(User,pk=follow_id)
            if er:
                if int(follow_action):
                    er.userprofile.follower.add(user)
                    er.userprofile.follower_nums+=1
                    user.followto.add(er.userprofile)
                    user.userprofile.followto_nums+=1
                else:
                    er.userprofile.follower.remove(user)
                    if er.userprofile.follower_nums>0:
                        er.userprofile.follower_nums-=1
                    else:
                        er.userprofile.follower_nums=er.userprofile.follower.count()
                        
                    user.followto.remove(er.userprofile)
                    if user.userprofile.followto_nums>0:
                        user.userprofile.followto_nums-=1
                    else:
                        user.userprofile.followto_nums=user.followto.count()
                er.userprofile.save()
                user.userprofile.save()
                ret_data=[]
                ret_data.append(er.userprofile.follower_nums)
                follow_peoples=user.followto.all().values_list("id",flat=True)
                ret_data.append(list(follow_peoples))
                to_json=json.dumps(ret_data)
        elif 'topic'==follow_type:
            topic=get_object_or_404(Topic,pk=follow_id)
            if topic:
                if int(follow_action):
                    topic.follower.add(user)
                    topic.follower_nums+=1
                    user.userprofile.followtopic_nums+=1
                else:
                    topic.follower.remove(user)
                    if topic.follower_nums>0:
                        topic.follower_nums-=1
                    else:
                        topic.follower_nums=topic.follower.count()
                    if user.userprofile.followtopic_nums>0:
                        user.userprofile.followtopic_nums-=1
                    else:
                        user.userprofile.followtopic_nums=user.followtopics.count()
                topic.save()
                user.userprofile.save()
                ret_data=[]
                ret_data.append(topic.follower_nums)
                follow_topics=user.followtopics.values_list("id",flat=True)
                ret_data.append(list(follow_topics))
                to_json=json.dumps(ret_data)
    return HttpResponse(to_json,content_type='application/json')


@csrf_exempt
def answer_question(request,question_id):
    to_json=json.dumps('fail')
    author=request.user #get_object_or_404(User,username=request.user)
    if author.is_authenticated:
        question=get_object_or_404(Question,pk=question_id)
        if question:
            answer=Answer()
            answer.content=request.POST.get('content')
            answer.author=author
            answer.question=question
            answer.save()
            author.userprofile.answer_nums+=1
            author.userprofile.contribution+=configure.ANSWER_CONTRIBUTION
            author.userprofile.save()
            question.answer_nums+=1#question.be_answers.count();
            question.push_answer_id=answer.id
            question.save()
            to_json=json.dumps('/question/'+str(question.id)+'/?ans='+str(answer.id))

            '''
            answer_list=[]
            temp=[answer.id,answer.content,answer.like_nums,answer.comment_nums,str(answer.pub_date),answer.author.id,answer.author.first_name,answer.author.userprofile.avatar,
            answer.author.userprofile.mood,answer.author.userprofile.sexual,answer.author.userprofile.question_nums,answer.author.userprofile.article_nums,answer.author.userprofile.answer_nums,
            answer.author.userprofile.followto_nums,answer.author.userprofile.follower_nums,answer.author.userprofile.followtopic_nums,answer.author.userprofile.followquestion_nums]
            answer_list.append(temp)
    
            to_json=json.dumps(answer_list)
            '''
            

    return HttpResponse(to_json,content_type='application/json')
    
@csrf_exempt
def get_topics(request,bIsGetAll,start,end):
    to_json=json.dumps('fail')
    cache_key='topics'
    if '1'==bIsGetAll:
        cache_value=cache.get(cache_key,'expired')
        if cache_value=='expired':
            topics=Topic.objects.order_by('-nums').all()
            cache.set(cache_key,topics,43200)#12*60*60=43200=12 hours
        else:
            topics=cache_value
    else:
        topics=Topic.objects.order_by('-nums')[int(start):int(end)]
    if topics:
        topic_list=[]
        for topic in topics:
            temp=[topic.id,topic.name,topic.avatar,topic.detail,topic.question_nums,topic.follower_nums,str(topic.pub_date)]
            topic_list.append(temp)
        to_json=json.dumps(topic_list)
    return HttpResponse(to_json,content_type='application/json')    
       
@csrf_exempt
def get_topic_adept(request):
    to_json=json.dumps('fail')
    #inviter=request.user
    topics=request.POST.get('topics').split(';')
    print(topics)
    topics.pop()
    print(topics)
    adepts=User.objects.all().values_list("id","first_name","userprofile__avatar","userprofile__mood")
    if adepts:
        to_json=json.dumps(list(adepts))
    return HttpResponse(to_json,content_type='application/json')
    
@csrf_exempt
def get_question_answers(request,question_id,order,start,end):
    to_json=json.dumps('fail')
    answers=Question.objects.filter(id=question_id).values_list("be_answers__id","be_answers__content","be_answers__like_nums","be_answers__comment_nums","be_answers__pub_date",
    "be_answers__author__id","be_answers__author__first_name","be_answers__author__userprofile__avatar","be_answers__author__userprofile__mood",
    "be_answers__author__userprofile__sexual","be_answers__author__userprofile__question_nums","be_answers__author__userprofile__article_nums","be_answers__author__userprofile__answer_nums",
    "be_answers__author__userprofile__followto_nums","be_answers__author__userprofile__follower_nums","be_answers__author__userprofile__followtopic_nums","be_answers__author__userprofile__followquestion_nums")[int(start):int(end)]
    #question=get_object_or_404(Question,pk=question_id)
    
    #answers=question.be_answers.order_by('-pub_date')[int(start):int(end)]
    if answers and answers[0][0]!=None:
        answer_list=list(answers)
        to_json=json.dumps(answer_list,cls=CJsonEncoder)
    return HttpResponse(to_json,content_type='application/json')
    
@csrf_exempt
def like(request):
    to_json=json.dumps('fail')
    likeType=request.POST.get('l_type')
    lId=request.POST.get('l_id')
    if("article"==likeType):
        article=get_object_or_404(Article,pk=lId)
        if article:
            article.like_nums+=1
            article.save()
            to_json=json.dumps(article.like_nums)
    elif("answer"==likeType):
        answer=get_object_or_404(Answer,pk=lId)
        if answer:
            answer.like_nums+=1
            answer.save()
            to_json=json.dumps(answer.like_nums)
    elif("comment_answer"==likeType):
        comment=get_object_or_404(AnswerComment,pk=lId)
        if comment:
            comment.like_nums+=1
            comment.save()
            to_json=json.dumps(comment.like_nums)
    elif("comment_article"==likeType):
        comment=get_object_or_404(ArticleComment,pk=lId)
        if comment:
            comment.like_nums+=1
            comment.save()
            to_json=json.dumps(comment.like_nums)
    return HttpResponse(to_json,content_type='application/json')
        
@csrf_exempt
def get_er_all(request,erid,command):
    to_json=json.dumps('fail')
    start=request.POST.get('start')
    end=request.POST.get('end')
    #er=get_object_or_404(User,pk=erid)
    if 'answers'==command:
        answers=User.objects.filter(id=erid).values_list("answers__id","answers__question__id","answers__question__title","answers__content","answers__pub_date","answers__like_nums","answers__comment_nums","id","first_name","userprofile__avatar","userprofile__mood")[int(start):int(end)]
        #answers=er.answers.all()
        #answers=er.answers.values_list("id","question__id","question__title","content","like_nums","comment_nums")
        if answers and answers[0][0]!=None:
            answers_list=list(answers)
            to_json=json.dumps(answers_list,cls=CJsonEncoder)
    elif 'asks'==command:
        questions=User.objects.filter(id=erid).values_list("selfquestions__id","selfquestions__title","selfquestions__answer_nums","selfquestions__follower_nums","selfquestions__pub_date")[int(start):int(end)]
        if questions and questions[0][0]!=None:
            questions_list=list(questions)
            to_json=json.dumps(questions_list,cls=CJsonEncoder)
    elif 'businesses'==command:
        businesses=User.objects.filter(id=erid).values_list("selfbusinesses__id","selfbusinesses__title","selfbusinesses__addr","selfbusinesses__pub_date")[int(start):int(end)]
        if businesses and businesses[0][0]!=None:
            businesses_list=list(businesses)
            to_json=json.dumps(businesses_list,cls=CJsonEncoder)
    elif 'articles'==command:
        articles=User.objects.filter(id=erid).values_list("selfarticles__id","selfarticles__title","selfarticles__pub_date","selfarticles__update_date")[int(start):int(end)]
        if articles and articles[0][0]!=None:
            articles_list=list(articles)
            to_json=json.dumps(articles_list,cls=CJsonEncoder)
    return HttpResponse(to_json,content_type='application/json')
    
@csrf_exempt
def get_er_following_all(request,erid,subcmd):
    to_json=json.dumps('fail')
    start=request.POST.get('start')
    end=request.POST.get('end')
    er=get_object_or_404(User,pk=erid)
    #user=request.user
    if 'followtos'==subcmd:
        followtos=er.followto.values_list("user__id","user__first_name","avatar","mood","sexual","answer_nums","article_nums","follower_nums")
        if followtos:
            followtos_list=list(followtos)
            to_json=json.dumps(followtos_list)
    elif 'followers'==subcmd:
        followers=er.userprofile.follower.values_list("id","first_name","userprofile__avatar","userprofile__mood","userprofile__sexual","userprofile__answer_nums","userprofile__article_nums","userprofile__follower_nums")
        if followers:
            followers_list=list(followers)
            to_json=json.dumps(followers_list)
    elif 'topics'==subcmd:
        topics=er.followtopics.values_list("id","name","avatar","detail")[int(start):int(end)]
        if topics:
            topics_list=list(topics)
            to_json=json.dumps(topics_list,cls=CJsonEncoder)
    elif 'questions'==subcmd:
        questions=er.followquestions.values_list("id","title","answer_nums","follower_nums","pub_date")[int(start):int(end)]
        if questions:
            questions_list=list(questions)
            to_json=json.dumps(questions_list,cls=CJsonEncoder)
    return HttpResponse(to_json,content_type='application/json')
    
@csrf_exempt
def upload_avatar(request):
    to_json=json.dumps('fail')
    if request.user.is_authenticated:
        imgfile=request.FILES.get('imgfile')
        if imgfile: 
            print(str(time.time()))
            posttime=request.user.username+str(time.time()).split('.')[0]
            postfix=str(imgfile).split('.')[-1]
            name='media'+'/avatar/%s.%s'%(posttime,postfix)
            img=Image.open(imgfile)
            img.save(name)
            #print(img.items)
            request.user.userprofile.avatar='/'+name
            request.user.userprofile.save()
            
            temp=request.user.userprofile.avatar
            to_json=json.dumps(temp)
    return HttpResponse(to_json,content_type='application/json')
    
@csrf_exempt
def upload_topic_avatar(request,topic_id):
    to_json=json.dumps('fail')
    if request.user.is_authenticated:
        imgfile=request.FILES.get('imgfile')
        if imgfile: 
            print(str(time.time()))
            posttime=request.user.username+str(time.time()).split('.')[0]
            postfix=str(imgfile).split('.')[-1]
            name='media'+'/avatar/%s.%s'%(posttime,postfix)
            img=Image.open(imgfile)
            img.save(name)
            #print(img.items)
            topic=get_object_or_404(Topic,pk=topic_id)
            if topic:
                topic.avatar='/'+name
                topic.save()        
                temp=topic.avatar
                to_json=json.dumps(temp)
    return HttpResponse(to_json,content_type='application/json')

@csrf_exempt
def upload_img(request):
    to_json=json.dumps('fail')
    if request.user.is_authenticated:
        imgfile=request.FILES.get('imgfile')
        if imgfile: 
            #print(str(time.time()))
            posttime=request.user.username+str(time.time()).split('.')[0]
            postfix=str(imgfile).split('.')[-1]
            name='media'+'/img/%s.%s'%(posttime,postfix)
            img=Image.open(imgfile)
            img.save(name)
            #print(img.items)    
            temp='/'+name
            to_json=json.dumps(temp)
    return HttpResponse(to_json,content_type='application/json')
           
@csrf_exempt
def invite(request):
    to_json=json.dumps('fail')
    q=request.POST.get('question')
    #f=request.GET.get('from')
    t=request.POST.get('to')

    inviter=request.user
    if inviter.is_authenticated:
        #inviter.sendinvite.add(invitation)
                
        invitee=get_object_or_404(User,pk=t)
        question=get_object_or_404(Question,id=int(q))
        #invitee.receiveinvite.add(invitation)
        if invitee:
            notification=Notification(type='invite',sender=inviter,receiver=invitee,target=question)
            notification.save()
            temp='success'
            to_json=json.dumps(temp)
    return HttpResponse(to_json,content_type='application/json')
    
@csrf_exempt
def get_notifications(request,order,start,end):
    to_json=json.dumps('fail')
    user=request.user
    if user.is_authenticated:
        notifications=user.receives.order_by('-pub_date')[int(start):int(end)].values_list("id","type","pub_date","sender__id","sender__first_name","target__id","target__title","status")
        if notifications:
            notification_list=list(notifications)
            to_json=json.dumps(notification_list,cls=CJsonEncoder)
        '''
            notification_list=[]
            for notification in notifications:
                temp=[]
                temp.append(notification.id)#0
                temp.append(notification.type)#1
                temp.append(notification.active_id)#2
                temp.append(notification.status)#3
                temp.append(str(notification.pub_date))#4
                temp.append(notification.sender.id)#5
                temp.append(notification.sender.first_name)#6
                if 'invite'==notification.type:
                    question=get_object_or_404(Question,pk=notification.active_id)
                    temp.append(question.title)#7
                notification_list.append(temp)
            to_json=json.dumps(notification_list)
        '''
    return HttpResponse(to_json,content_type='application/json')
    
@csrf_exempt
def send_message(request,receiver_id):
    to_json=json.dumps('fail')
    content=request.POST.get('content')
    if content:
        sender=request.user
        if sender.is_authenticated:
            receiver=get_object_or_404(User,pk=receiver_id)
            conversations=Conversation.objects.filter(initator__id=sender.id,parter__id=receiver_id) | Conversation.objects.filter(initator__id=receiver_id,parter__id=sender.id)
            if conversations:
                conversation=conversations[0]
            else:
                conversation=Conversation(initator=sender,parter=receiver)
                conversation.save()

            message=Message(conversation=conversation,content=content,sender=sender,receiver=receiver,delete_id=-1)
            message.save()
            #conversation.update_date=message.pub_date
            conversation.latest_message_content=content
            conversation.delete_id=-1
            conversation.save()
            to_json=json.dumps(message.id) 
    return HttpResponse(to_json,content_type='application/json')
    
@csrf_exempt
def get_conversations(request,order,start,end):
    to_json=json.dumps('fail')
    user=request.user
    if user.is_authenticated:
        conversations=Conversation.objects.filter(initator__id=user.id) | Conversation.objects.filter(parter__id=user.id)
        conversations=conversations.order_by('-update_date')[int(start):int(end)].values_list("id","delete_id","update_date","initator__id","initator__first_name","initator__userprofile__avatar",
        "parter__id","parter__first_name","parter__userprofile__avatar","latest_message_content")
        if conversations:
            conversation_list=list(conversations)
            to_json=json.dumps(conversation_list,cls=CJsonEncoder)
    return HttpResponse(to_json,content_type='application/json')
    
@csrf_exempt
def get_conversation_messages(request,conversation_id,order,start,end):
    to_json=json.dumps('fail')
    user=request.user
    if user.is_authenticated:
        conversation=get_object_or_404(Conversation,pk=conversation_id)
        if conversation:
            messages=conversation.messages.order_by('-pub_date')[int(start):int(end)].values_list("id","content","status","delete_id","pub_date",
            "sender__id","sender__first_name","sender__userprofile__avatar","receiver__id","receiver__first_name","receiver__userprofile__avatar")
            if messages:
                message_list=list(messages)
                to_json=json.dumps(message_list,cls=CJsonEncoder)
    return HttpResponse(to_json,content_type='application/json')
 
@csrf_exempt
def delete_conversation_message(request,message_id):
    to_json=json.dumps('fail')
    user=request.user
    if user.is_authenticated:
        message=get_object_or_404(Message,pk=message_id)
        if message:
            if user.id==message.sender.id or user.id==message.receiver.id:
                #Message.objects.filter(id=message_id).delete()
                if message.delete_id==-1: #delete one side
                    message.delete_id=user.id
                    message.save()
                elif message.delete_id!=user.id:# delete both side,real delete.
                    message.delete()
                to_json=json.dumps('success')
    return HttpResponse(to_json,content_type='application/json')
    
@csrf_exempt
def delete_conversation(request,conversation_id):
    to_json=json.dumps('fail')
    user=request.user
    if user.is_authenticated:
        conversation=get_object_or_404(Conversation,pk=conversation_id)
        if conversation:
            if user.id==conversation.initator.id or user.id==conversation.parter.id:
                #Conversation.objects.filter(id=message_id).delete()
                if conversation.delete_id==-1: #start to delete one side
                    messages=conversation.messages.exclude(delete_id__in=[-1,user.id]).delete()
                    messages=conversation.messages.update(delete_id=user.id)
                    '''
                    if messages:
                        for message in messages: #delete all messages
                            if message.delete_id==-1: #delete one side
                                message.delete_id=user.id
                                message.save()
                            elif message.delete_id!=user.id: #delete both side
                                message.delete()
                    '''
                    conversation.delete_id=user.id
                    conversation.save()
                elif conversation.delete_id!=user.id:# delete both side,real delete.
                    #conversation.messages.all().delete()
                    conversation.delete()
                to_json=json.dumps('success')
    return HttpResponse(to_json,content_type='application/json')
    
@csrf_exempt
def search(request,type,order,start,end):
    to_json=json.dumps('fail')
    keyword=request.POST.get('keyword')
    if keyword:
        ret_list=[]
        questions=[]
        articles=[]
        users=[]
        topics=[]
        if type=='all':
            questions=Question.objects.filter(title__contains=keyword)[int(start):int(end)].values_list("id","title")
            articles=Article.objects.filter(title__contains=keyword)[int(start):int(end)].values_list("id","title")
            users=User.objects.filter(first_name__contains=keyword)[int(start):int(end)].values_list("id","first_name","userprofile__avatar","userprofile__mood")
            topics=Topic.objects.filter(name__contains=keyword)[int(start):int(end)].values_list("id","name","avatar","detail")
        elif type=='content':
            questions=Question.objects.filter(title__contains=keyword)[int(start):int(end)].values_list("id","title")
            articles=Article.objects.filter(title__contains=keyword)[int(start):int(end)].values_list("id","title")
        elif type=='question':
            questions=Question.objects.filter(title__contains=keyword)[int(start):int(end)].values_list("id","title")
        elif type=='article':
            articles=Article.objects.filter(title__contains=keyword)[int(start):int(end)].values_list("id","title")
        elif type=='people':
            users=User.objects.filter(first_name__contains=keyword)[int(start):int(end)].values_list("id","first_name","userprofile__avatar","userprofile__mood")
        elif type=='topic':
            topics=Topic.objects.filter(name__contains=keyword)[int(start):int(end)].values_list("id","name","avatar","detail")
        if questions or articles or users or topics:
            ky=None
            try:
                ky=Keyword.objects.get(name=keyword)
            except Keyword.DoesNotExist:
                print("none data")
            if not ky:
                ky=Keyword()
                ky.name=keyword
            ky.sums+=1
            ky.save()
            ret_list.append(list(questions))
            ret_list.append(list(articles))
            ret_list.append(list(users))
            ret_list.append(list(topics))
            to_json=json.dumps(ret_list)
    return HttpResponse(to_json,content_type='application/json')
    
@csrf_exempt
def answer_page(request,type,order,start,end):
    to_json=json.dumps('fail')
    if type=='recommend':
        questions=Question.objects.filter(answer_nums__lte=0)[int(start):int(end)].values_list("id","title","answer_nums","follower_nums","pub_date")
        if questions:
            questions_list=list(questions)
            to_json=json.dumps(questions_list,cls=CJsonEncoder)
    elif type=='all':
        questions=Question.objects.filter(answer_nums__lte=0)[int(start):int(end)].values_list("id","title","answer_nums","follower_nums","pub_date")
        if questions:
            questions_list=list(questions)
            to_json=json.dumps(questions_list,cls=CJsonEncoder)
    elif type=='invited':
        user=request.user
        if user.is_authenticated:
            notifications=user.receives.filter(type='invite').order_by('-pub_date')[int(start):int(end)].values_list("id","type","pub_date","sender__id","sender__first_name","target__id","target__title","target__answer_nums","target__follower_nums","status")           
            if notifications:
                notification_list=list(notifications)
                to_json=json.dumps(notification_list,cls=CJsonEncoder)
            
    return HttpResponse(to_json,content_type='application/json')
	
@csrf_exempt
def profile_edit(request):
    to_json=json.dumps('fail')
    user=request.user
    if user.is_authenticated:
        field_type=request.POST.get('field_type')
        content=request.POST.get('content')
        if content:
            if field_type=='nickname':
                user.first_name=content
                user.save()
            else:
                if field_type=='sexual':
                    user.userprofile.sexual=content
                elif field_type=='mood':
                    user.userprofile.mood=content
                elif field_type=='residence':
                    user.userprofile.residence=content
                elif field_type=='job':
                    user.userprofile.job=content
                elif field_type=='intro':
                    user.userprofile.intro=content
                user.userprofile.save()
            to_json=json.dumps(content)
    return HttpResponse(to_json,content_type='application/json')
    
@csrf_exempt
def send_sms(request):
    to_json=json.dumps('fail')
    phone_no=request.POST.get('phone_no')
    type=request.POST.get('type')
    if type=='register':
        if User.objects.filter(username=phone_no):
            to_json=json.dumps('registered')
        else:
            verification_code=str(random.randint(100000,999999))
            __business_id = uuid.uuid1()
            params = {'code':verification_code}
            smsResponse=dysms.send_sms(__business_id, phone_no, "大农令", "SMS_133972103", params)
            print(smsResponse)
            status_code=eval(str(smsResponse,encoding = "utf8"))['Code']
            if 'OK'==status_code:
                request.session[phone_no]=verification_code
                to_json=json.dumps('success')
    elif type=='password_reset':
        if not User.objects.filter(username=phone_no):
            to_json=json.dumps('unregistered')
        else:
            verification_code=str(random.randint(100000,999999))
            __business_id = uuid.uuid1()
            params = {'code':verification_code}
            smsResponse=dysms.send_sms(__business_id, phone_no, "大农令", "SMS_133972103", params)
            print(smsResponse)
            status_code=eval(str(smsResponse,encoding = "utf8"))['Code']
            if 'OK'==status_code:
                request.session[phone_no]=verification_code
                to_json=json.dumps('success')
    return HttpResponse(to_json,content_type='application/json')
    
@csrf_exempt
def check_sms(request):
    to_json=json.dumps('fail')
    phone_no=request.POST.get('phone_no')
    type=request.POST.get('type')
    veri_code=request.POST.get('veri_code')
    if type=='password_reset':
        if not User.objects.filter(username=phone_no):
            to_json=json.dumps('unregistered')
        else:
            to_json=json.dumps('veri_code_error')
            cach_veri_code=request.session.get(phone_no,None)
            if cach_veri_code:
                if cach_veri_code==veri_code:
                    to_json=json.dumps('veri_code_ok')
    return HttpResponse(to_json,content_type='application/json')
    
@csrf_exempt
def reset_pwd(request):
    to_json=json.dumps('fail')
    phone_no=request.POST.get('phone_no')
    veri_code=request.POST.get('veri_code')
    password=request.POST.get('pwd')
    user=User.objects.get(username=phone_no)
    if user and phone_no and veri_code and password:
        cache_veri_code=request.session.get(phone_no,None)
        if cache_veri_code:
            if cache_veri_code==veri_code:
                user.set_password(password)
                user.save()
                to_json=json.dumps('success')
    return HttpResponse(to_json,content_type='application/json')

@csrf_exempt
def get_comments(request):
    to_json=json.dumps('fail')
    comments=[]
    user=request.user
    commentType=request.POST.get('c_type')
    aId=request.POST.get('a_id')       
    if "article"==commentType:
        article=get_object_or_404(Article,pk=aId)
        if article:       
            comments=article.comments.order_by('pub_date').values_list("id","content","like_nums","parent_id","pub_date","author__id","author__first_name","author__userprofile__avatar","author__userprofile__mood")
    elif "answer"==commentType:
        answer=get_object_or_404(Answer,pk=aId)
        if answer:
            comments=answer.comments.order_by('pub_date').values_list("id","content","like_nums","parent_id","pub_date","author__id","author__first_name","author__userprofile__avatar","author__userprofile__mood")
    if comments:
        comment_list=list(comments)
        to_json=json.dumps(comment_list,cls=CJsonEncoder)
    return HttpResponse(to_json,content_type='application/json')
    
@csrf_exempt
def comment(request):
    to_json=json.dumps('fail')
    user=request.user
    if user.is_authenticated:
        commentType=request.POST.get('c_type')
        commentContent=request.POST.get('c_content')
        aId=request.POST.get('a_id')
        parent_id=request.POST.get('parent_comment_id')
        if "article"==commentType:
            article=get_object_or_404(Article,pk=aId)
            if article:
                comment=ArticleComment()
                comment.content=commentContent
                comment.parent_id=parent_id;
                comment.author=user
                comment.article=article
                comment.save()
                article.comment_nums+=1
                article.save()
                
                comment_list=[[comment.id,comment.content,comment.like_nums,comment.parent_id,str(comment.pub_date),comment.author.id,comment.author.first_name,comment.author.userprofile.avatar,comment.author.userprofile.mood]]
                to_json=json.dumps(comment_list)
        elif "answer"==commentType:
            answer=get_object_or_404(Answer,pk=aId)
            if answer:
                comment=AnswerComment()
                comment.content=commentContent
                comment.parent_id=parent_id;
                comment.author=user
                comment.answer=answer
                comment.save()
                answer.comment_nums+=1
                answer.save()

                comment_list=[[comment.id,comment.content,comment.like_nums,comment.parent_id,str(comment.pub_date),comment.author.id,comment.author.first_name,comment.author.userprofile.avatar,comment.author.userprofile.mood]]
                to_json=json.dumps(comment_list)
    return HttpResponse(to_json,content_type='application/json')
@csrf_exempt
def hotwords(request):
    to_json=json.dumps('fail')
    hotwords=Keyword.objects.order_by('-sums')[0:10].values_list('name','sums')
    to_json=json.dumps(list(hotwords))
    return HttpResponse(to_json,content_type='application/json')
@csrf_exempt
def businesses(request,type,order,start,end):
    to_json=json.dumps('fail')
    addr=request.POST.get('addr')
    addr_value=request.POST.get('addr_value')
    keyword=request.POST.get('keyword')
    #print(request.POST)
    #print(keyword)
    addr_value_list=[]
    addr_value_list.append(addr_value[0:6])
    addr_value_list.append(addr_value[0:12])
    addr_value_list.append(addr_value)
    businessInfos=[]
    if type=='all':
        if addr and keyword:
            businessInfos=BusinessInfo.objects.filter(Q(addr_value__contains=addr_value)|Q(addr_value__in=addr_value_list),title__contains=keyword).order_by('-update_date')[int(start):int(end)].values_list("id","title","detail","type","addr","addr_value","contact","pictures","pub_date","update_date","poster__id","poster__first_name")
        elif addr:
            businessInfos=BusinessInfo.objects.filter(Q(addr_value__contains=addr_value)|Q(addr_value__in=addr_value_list)).order_by('-update_date')[int(start):int(end)].values_list("id","title","detail","type","addr","addr_value","contact","pictures","pub_date","update_date","poster__id","poster__first_name")
        elif keyword:
            businessInfos=BusinessInfo.objects.filter(title__contains=keyword).order_by('-update_date')[int(start):int(end)].values_list("id","title","detail","type","addr","addr_value","contact","pictures","pub_date","update_date","poster__id","poster__first_name")
        else:
            businessInfos=BusinessInfo.objects.order_by('-update_date')[int(start):int(end)].values_list("id","title","detail","type","addr","addr_value","contact","pictures","pub_date","update_date","poster__id","poster__first_name")
    else:
        if addr and keyword:
            businessInfos=BusinessInfo.objects.filter(Q(addr_value__contains=addr_value)|Q(addr_value__in=addr_value_list),type=type,title__contains=keyword).order_by('-update_date')[int(start):int(end)].values_list("id","title","detail","type","addr","addr_value","contact","pictures","pub_date","update_date","poster__id","poster__first_name")
        elif addr:
            businessInfos=BusinessInfo.objects.filter(Q(addr_value__contains=addr_value)|Q(addr_value__in=addr_value_list),type=type).order_by('-update_date')[int(start):int(end)].values_list("id","title","detail","type","addr","addr_value","contact","pictures","pub_date","update_date","poster__id","poster__first_name")
        elif keyword:
            businessInfos=BusinessInfo.objects.filter(type=type,title__contains=keyword).order_by('-update_date')[int(start):int(end)].values_list("id","title","detail","type","addr","addr_value","contact","pictures","pub_date","update_date","poster__id","poster__first_name")
        else:
            businessInfos=BusinessInfo.objects.filter(type=type).order_by('-update_date')[int(start):int(end)].values_list("id","title","detail","type","addr","addr_value","contact","pictures","pub_date","update_date","poster__id","poster__first_name")
    if businessInfos:
        to_json=json.dumps(list(businessInfos),cls=CJsonEncoder)
    return HttpResponse(to_json,content_type='application/json')
    
@csrf_exempt
def update_business(request,type):
    to_json=json.dumps('fail')
    user=request.user
    if user.is_authenticated:
        business_id=request.POST.get('business_id')
        if business_id:
            businessInfo=get_object_or_404(BusinessInfo,pk=business_id)
            if businessInfo:
                if user.id==businessInfo.poster.id:
                    if type=='time':
                        businessInfo.save()
                        to_json=json.dumps(businessInfo.update_date,cls=CJsonEncoder)
                    elif type=='all':
                        businessInfo.title=request.POST.get('title')
                        businessInfo.detail=request.POST.get('detail')
                        businessInfo.type=request.POST.get('type')
                        businessInfo.addr=request.POST.get('addr')
                        businessInfo.addr_value=request.POST.get('addr_value')
                        businessInfo.contact=request.POST.get('contact')
                        businessInfo.pictures=request.POST.get('pictures')
                        businessInfo.save()
                        businessInfoList=BusinessInfo.objects.filter(id=business_id).values_list("id","title","detail","type","addr","addr_value","contact","pictures","pub_date","update_date","poster__id","poster__first_name")
                        if businessInfoList:
                            to_json=json.dumps(businessInfoList[0],cls=CJsonEncoder)
    return HttpResponse(to_json,content_type='application/json')

@csrf_exempt
def user_data(request,userid):
    to_json=json.dumps('fail')
    user=request.user
    if user.is_authenticated:
        type=request.POST.get('type')
        lastNotificationTime=request.POST.get('lastNotificationTime')
        lastConversationTime=request.POST.get('lastConversationTime')
        if not lastNotificationTime:
            lastNotificationTime= datetime.now()+ timedelta(days=-30)
        if not lastConversationTime:
            lastConversationTime= datetime.now()+ timedelta(days=-30)
        if 'all'==type:
            ret_list=[]

            follow_peoples=user.followto.all().values_list("id",flat=True)
            follow_topics=user.followtopics.values_list("id",flat=True)
            follow_questions=user.followquestions.values_list("id",flat=True)
            user_profile=[user.id,user.first_name,user.userprofile.avatar,user.userprofile.mood]
            notifications=user.receives.order_by('-pub_date').filter(pub_date__gt=lastNotificationTime).values_list("id","type","pub_date","sender__id","sender__first_name","target__id","target__title","status")
            conversations=Conversation.objects.filter(initator__id=user.id) | Conversation.objects.filter(parter__id=user.id)
            conversations=conversations.order_by('-update_date').filter(update_date__gt=lastConversationTime).values_list("id","delete_id","update_date","initator__id","initator__first_name","initator__userprofile__avatar",
            "parter__id","parter__first_name","parter__userprofile__avatar","latest_message_content")

            ret_list.append(list(follow_peoples))
            ret_list.append(list(follow_topics))
            ret_list.append(list(follow_questions))
            ret_list.append(user_profile)
            ret_list.append(list(notifications))
            ret_list.append(list(conversations))
            to_json=json.dumps(ret_list,cls=CJsonEncoder)
        elif 'follow'==type:
            ret_list=[]

            follow_peoples=user.followto.all().values_list("id",flat=True)
            follow_topics=user.followtopics.values_list("id",flat=True)
            follow_questions=user.followquestions.values_list("id",flat=True)
            
            ret_list.append(list(follow_peoples))
            ret_list.append(list(follow_topics))
            ret_list.append(list(follow_questions))
            to_json=json.dumps(ret_list)
        elif 'userprofile'==type:
            user_profile=[user.id,user.first_name,user.userprofile.avatar,user.userprofile.mood,user.userprofile.phone,user.userprofile.sexual,
            user.userprofile.residence,user.userprofile.job,user.userprofile.question_nums,user.userprofile.article_nums,user.userprofile.answer_nums,user.userprofile.followto_nums,
            user.userprofile.follower_nums,user.userprofile.followtopic_nums,user.userprofile.followquestion_nums]
            to_json=json.dumps(user_profile)       
    return HttpResponse(to_json,content_type='application/json')
    
@csrf_exempt
def app_user_data(request):
    to_json=json.dumps('fail')
    user=request.user
    if user.is_authenticated:
        lastNotificationTime=request.POST.get('lastNotificationTime')
        lastConversationTime=request.POST.get('lastConversationTime')
        if not lastNotificationTime:
            lastNotificationTime= datetime.now()+ timedelta(days=-30)
        if not lastConversationTime:
            lastConversationTime= datetime.now()+ timedelta(days=-30)
            
        ret_list=[]
        user_profile=[user.id,user.first_name,user.userprofile.avatar,user.userprofile.mood]
        follow_topics=user.followtopics.order_by('question_topic_follower.id').values_list("id","name","avatar")
        notifications=user.receives.order_by('-pub_date').filter(pub_date__gt=lastNotificationTime).values_list("id","type","pub_date","sender__id","sender__first_name","target__id","target__title","status")
        conversations=Conversation.objects.filter(initator__id=user.id) | Conversation.objects.filter(parter__id=user.id)
        conversations=conversations.order_by('-update_date').filter(update_date__gt=lastConversationTime).values_list("id","delete_id","update_date","initator__id","initator__first_name","initator__userprofile__avatar",
        "parter__id","parter__first_name","parter__userprofile__avatar","latest_message_content")

        ret_list.append(user_profile)
        ret_list.append(list(follow_topics))
        ret_list.append(list(notifications))
        ret_list.append(list(conversations))
        to_json=json.dumps(ret_list,cls=CJsonEncoder)
    else:
        to_json=json.dumps('nologin')
    return HttpResponse(to_json,content_type='application/json')
    
@csrf_exempt
def app_my_data(request,type,start,end):
    to_json=json.dumps('fail')
    user=request.user
    if user.is_authenticated:
        if 'business'==type:
            businessInfos=user.selfbusinesses.order_by('-update_date')[int(start):int(end)].values_list("id","title","detail","type","addr","addr_value","contact","pictures","pub_date","update_date","poster__id","poster__first_name")
            if businessInfos:
                to_json=json.dumps(list(businessInfos),cls=CJsonEncoder)
    return HttpResponse(to_json,content_type='application/json')
    
@csrf_exempt   
def app_signin(request):
    #print(request.session.session_key)
    to_json=json.dumps('fail')
    phoneNo=request.POST.get('phoneNo')
    password=request.POST.get('password')
    if phoneNo and password:
        user=authenticate(username=phoneNo,password=password)
        if user is not None:
            login(request,user)
            request.session.set_expiry(15552000)#30*24*60*60=2592000  6*30*24*60*60=15552000
            #print(dir(request.session))
            #print(request.session.keys())
            #print(request.session.session_key)
            to_json=json.dumps('success')
    return HttpResponse(to_json,content_type='application/json')
 
@csrf_exempt   
def app_signup(request):
    to_json=json.dumps('fail')
    phoneNo=request.POST.get('phoneNo')
    smsCode=request.POST.get('smsCode')
    nickName=request.POST.get('nickName')
    pwd=request.POST.get('password')
    if phoneNo and smsCode and pwd:     
        if User.objects.filter(username=phoneNo):
            print(phoneNo+':have registered!')
            to_json=json.dumps('registered')
        else:
            cacheSmsCode=request.session.get(phoneNo,None)
            if cacheSmsCode and smsCode==cacheSmsCode:
                user=User.objects.create_user(username=phoneNo,password=pwd)
                user.first_name=nickName
                user.save()
                userprofile=UserProfile()
                userprofile.user=user
                userprofile.phone=phoneNo
                userprofile.save()
                to_json=json.dumps('success')
    return HttpResponse(to_json,content_type='application/json')
    
@csrf_exempt   
def app_logout(request):
    to_json=json.dumps('fail')
    logout(request)
    to_json=json.dumps('success')
    return HttpResponse(to_json,content_type='application/json')
    
@csrf_exempt
def app_follow_topics(request):
    to_json=json.dumps('fail')
    user=request.user
    if user.is_authenticated:
        userId=user.id
        topicsIds=request.POST.get('topicsIds')
        if topicsIds:
            user.followtopics.clear()
            topicsIdsArray=topicsIds.split(',')
            topicNum=len(topicsIdsArray)
            #user.userprofile.followtopic_nums=len(topicsIdsArray)
            sdlStr="INSERT INTO `question_topic_follower` (`topic_id`, `user_id`) VALUES "
            for topicId in topicsIdsArray:
                sdlStr+="("+str(topicId)+","+str(userId)+"),"
            cursor=connection.cursor()
            cursor.execute(sdlStr[:-1])
            #cursor.execute("DELETE FROM question_topic_follower WHERE question_topic_follower.user_id = 2")
            #cursor.execute("INSERT INTO `question_topic_follower` (`topic_id`, `user_id`) VALUES (6,2),(2,2),(1,2),(3,2),(5,2)")
            #cursor.execute("INSERT INTO `question_topic_follower` (`topic_id`, `user_id`) VALUES (6,2),(2,2),(1,2),(3,2),(5,2)")
            #topics=Topic.objects.filter(id__in=topicsIdsArray).extra(select={'manual': 'FIELD(question_topic.id,%s)' % ','.join(map(str, topicsIdsArray))},order_by=['manual'])
            #for topic in topics:
                #print(topic.id)
                #user.followtopics.add(topic)
            #user.followtopics.clear()
            #user.followtopics.add(*topics)
            UserProfile.objects.filter(user__id=userId).update(followtopic_nums=topicNum)
        else:
            #user.userprofile.followtopic_nums=0
            user.followtopics.clear()
            UserProfile.objects.filter(user__id=userId).update(followtopic_nums=0)
        #user.userprofile.save()
        #user.save()
        to_json=json.dumps('success')
    return HttpResponse(to_json,content_type='application/json')
    
@csrf_exempt
def app_business_post(request):
    to_json=json.dumps('fail')
    user=request.user
    if user.is_authenticated:
        businessInfo=BusinessInfo()
        businessInfo.poster=user
        businessInfo.title=request.POST.get('title')
        businessInfo.detail=request.POST.get('detail')
        businessInfo.type=request.POST.get('type')
        businessInfo.addr=request.POST.get('addr')
        businessInfo.addr_value=request.POST.get('addr_value')
        businessInfo.contact=request.POST.get('contact')
        businessInfo.pictures=request.POST.get('pictures')
        businessInfo.save()
        businessInfoList=BusinessInfo.objects.filter(id=businessInfo.id).values_list("id","title","detail","type","addr","addr_value","contact","pictures","pub_date","update_date","poster__id","poster__first_name")
        if businessInfoList:
            to_json=json.dumps(businessInfoList[0],cls=CJsonEncoder)
    return HttpResponse(to_json,content_type='application/json')
    
@csrf_exempt
def get_topic_questions(request,topic_id,order,start,end):
    to_json=json.dumps('fail')
    int_start=int(start)
    type=request.POST.get('type')
    print(type)
    if 'hot'==type:
        query_start=int(int_start/configure.LIST_NUM)*configure.LIST_NUM
        questions_answers_list=get_questions_inner(topic_id,type,query_start,query_start+configure.LIST_NUM)
        articles_list=get_articles_inner(topic_id,type,query_start,query_start+configure.LIST_NUM)        
        ret=[]
        if questions_answers_list:
            ret+=questions_answers_list
        if articles_list:
            ret+=articles_list
        if ret:
            to_json=json.dumps(ret,cls=CJsonEncoder)
    elif 'unanswered'==type:
        questions=Question.objects.filter(topics__id=topic_id,answer_nums__lte=0)[int(start):int(end)].values("id","title","answer_nums","follower_nums","pub_date")
        if questions:
            questions_list=list(questions)
            to_json=json.dumps(questions_list,cls=CJsonEncoder)
    return HttpResponse(to_json,content_type='application/json')
    
@csrf_exempt
def get_questions(request,order,start,end):
    to_json=json.dumps('fail')
    int_start=int(start)
    ret=[]
    follow_topics=request.POST.get('follow_topics')
    if follow_topics:
        topics_array=follow_topics.split(',')
        for topic_id in topics_array:
            query_start=int(int_start/configure.LIST_NUM/configure.STEP)*configure.LIST_NUM
            topic_questions_answers_list=get_questions_inner(topic_id,'',query_start,query_start+configure.LIST_NUM)
            if topic_questions_answers_list:
                index=int(int_start/configure.STEP)
                if index<len(topic_questions_answers_list):
                    ret.append(topic_questions_answers_list[index])
                
            topic_articles_list=get_articles_inner(topic_id,'',query_start,query_start+configure.LIST_NUM)
            if topic_articles_list:
                index=int(int_start/configure.STEP)
                if index<len(topic_articles_list):
                    ret.append(topic_articles_list[index])
    
    query_start=int(int_start/configure.LIST_NUM)*configure.LIST_NUM
    questions_answers_list=get_questions_inner('','',query_start,query_start+configure.LIST_NUM)
    articles_list=get_articles_inner('','',query_start,query_start+configure.LIST_NUM)   
    
    if questions_answers_list:
        ret+=questions_answers_list
    if articles_list:
        ret+=articles_list
    if ret:
        to_json=json.dumps(ret,cls=CJsonEncoder)

    return HttpResponse(to_json,content_type='application/json')
    
def get_questions_inner(topic_id,type,start,end):
    cache_key='push_method'
    cache_value=cache.get(cache_key,'expired')
    if 'TIME'==cache_value:
        order_type='-pub_date'
    else:
        order_type='-like_nums'
    answers=None
    print(order_type)
    questions_id_list=[]
    questions_list=[]
    if ''==topic_id:
        cache_key='question'+'hot'+str(start)
    else:
        cache_key='topic'+topic_id+'question'+type+str(start)
    cache_value=cache.get(cache_key,'expired')
    if True:#cache_value=='expired':
        if ''==topic_id:
            answers=Answer.objects.order_by(order_type)[int(start):int(end)].values_list("question__id","question__title","question__click_nums","question__push_answer_id","question__topics_array",
            "id","content","like_nums","comment_nums","pub_date",
            "author__id","author__first_name","author__userprofile__avatar","author__userprofile__mood","author__userprofile__sexual","author__userprofile__question_nums","author__userprofile__article_nums",
            "author__userprofile__answer_nums","author__userprofile__followto_nums","author__userprofile__follower_nums","author__userprofile__followtopic_nums","author__userprofile__followquestion_nums")

        else:
            answers=Answer.objects.order_by(order_type).filter(question__topics__id=topic_id)[int(start):int(end)].values_list("question__id","question__title","question__click_nums","question__push_answer_id","question__topics_array",
            "id","content","like_nums","comment_nums","pub_date",
            "author__id","author__first_name","author__userprofile__avatar","author__userprofile__mood","author__userprofile__sexual","author__userprofile__question_nums","author__userprofile__article_nums",
            "author__userprofile__answer_nums","author__userprofile__followto_nums","author__userprofile__follower_nums","author__userprofile__followtopic_nums","author__userprofile__followquestion_nums")
            
        for answer in answers:
            if answer[0] not in questions_id_list:
                answer=list(answer)
                answer.append('question')
                questions_id_list.append(answer[0])
                questions_list.append(answer)
                
        cache.set(cache_key,questions_list,configure.CACHE_EXPIRED)
        return questions_list
    else:
        return cache_value
    
def get_articles_inner(topic_id,type,start,end):
    cache_key='push_method'
    cache_value=cache.get(cache_key,'expired')
    if 'TIME'==cache_value:
        order_type='-pub_date'
    else:
        order_type='-like_nums'
    articles=None
    articles_list=[]
    if ''==topic_id:
        cache_key='article'+type+str(start)
    else:
        cache_key='topic'+topic_id+'article'+type+str(start)
    cache_value=cache.get(cache_key,'expired')
    if cache_value=='expired':
        if ''==topic_id:
            articles=Article.objects.order_by(order_type)[int(start):int(end)].values_list(
            "id","title","click_nums","id","topics_array","id","content","like_nums","comment_nums","pub_date",
            "author__id","author__first_name","author__userprofile__avatar","author__userprofile__mood","author__userprofile__sexual","author__userprofile__question_nums","author__userprofile__article_nums",
            "author__userprofile__answer_nums","author__userprofile__followto_nums","author__userprofile__follower_nums","author__userprofile__followtopic_nums","author__userprofile__followquestion_nums")
        else:
            articles=Article.objects.order_by(order_type).filter(topics__id=topic_id)[int(start):int(end)].values_list(
            "id","title","click_nums","id","topics_array","id","content","like_nums","comment_nums","pub_date",
            "author__id","author__first_name","author__userprofile__avatar","author__userprofile__mood","author__userprofile__sexual","author__userprofile__question_nums","author__userprofile__article_nums",
            "author__userprofile__answer_nums","author__userprofile__followto_nums","author__userprofile__follower_nums","author__userprofile__followtopic_nums","author__userprofile__followquestion_nums")
        for article in articles:
            article=list(article)
            article.append('article')
            articles_list.append(list(article))
        cache.set(cache_key,articles_list,configure.CACHE_EXPIRED)
        return articles_list
    else:
        return cache_value

'''
def get_questions_inner(topic_id,type,start,end):
    cache_key='push_method'
    cache_value=cache.get(cache_key,'expired')
    if 'TIME'==cache_value:
        order_type='-pub_date'
    else:
        order_type='-like_nums'
    answers=None
    questions_id_list=[]
    questions_list=[]
    if ''==topic_id:
        cache_key='question'+'hot'+str(start)
    else:
        cache_key='topic'+topic_id+'question'+type+str(start)
    cache_value=cache.get(cache_key,'expired')
    if cache_value=='expired':
        answers=Answer.objects.order_by(order_type)[int(start):int(end)].values_list("question__id","question__title","question__click_nums","question__push_answer_id","question__topics_array",
                "id","content","like_nums","comment_nums","pub_date",
                "author__id","author__first_name","author__userprofile__avatar","author__userprofile__mood","author__userprofile__sexual","author__userprofile__question_nums","author__userprofile__article_nums",
                "author__userprofile__answer_nums","author__userprofile__followto_nums","author__userprofile__follower_nums","author__userprofile__followtopic_nums","author__userprofile__followquestion_nums")
    else:
        return cache_value              
    if ''==topic_id:
        for answer in answers:
            if answer[0] not in questions_id_list:
                answer=list(answer)
                answer.append('question')
                questions_id_list.append(answer[0])
                questions_list.append(answer)
    else:
        for answer in answers:
            topics_str=answer[4]
            topic_id_str="\'"+topic_id+":";
            index=topics_str.find(topic_id_str)
            if index>=0:
                if answer[0] not in questions_id_list:
                    answer=list(answer)
                    answer.append('question')
                    questions_id_list.append(answer[0])
                    questions_list.append(answer)
    cache.set(cache_key,questions_list,configure.CACHE_EXPIRED)
    #print(questions_list)
    return questions_list
'''
'''
    else:
        questions=None
        questions_list=[]
        if ''==topic_id:
            cache_key='question'+'hot'+str(start)
            cache_value=cache.get(cache_key,'expired')
            if cache_value=='expired':
                questions=Question.objects.order_by('-pub_date').exclude(push_answer_id=-1)[int(start):int(end)].values_list("id","title","click_nums","push_answer_id","topics_array")
            else:
                return cache_value
        else:
            cache_key='topic'+topic_id+'question'+type+str(start)
            cache_value=cache.get(cache_key,'expired')
            if cache_value=='expired':
                questions=Question.objects.order_by('-pub_date').filter(topics__id=topic_id,answer_nums__gte=1)[int(start):int(end)].values_list("id","title","click_nums","push_answer_id","topics_array")
            else:
                return cache_value
        if questions:
            push_answers_id_list=[]
            for i,question in enumerate(questions):
                questions_list.append(list(question))
                push_answers_id_list.append(question[3])
                #print(str(question[0])+':'+str(question[3]))
            
            push_answers=Answer.objects.filter(id__in=push_answers_id_list).extra(
            select={'manual': 'FIELD(question_answer.id,%s)' % ','.join(map(str, push_answers_id_list))},order_by=['manual']).values_list(
            "id","content","like_nums","comment_nums","pub_date",
            "author__id","author__first_name","author__userprofile__avatar","author__userprofile__mood","author__userprofile__sexual","author__userprofile__question_nums","author__userprofile__article_nums",
            "author__userprofile__answer_nums","author__userprofile__followto_nums","author__userprofile__follower_nums","author__userprofile__followtopic_nums","author__userprofile__followquestion_nums")

            for i,answer in enumerate(push_answers):
                questions_list[i].extend(answer)
                questions_list[i].append('question')
        cache.set(cache_key,questions_list,configure.CACHE_EXPIRED)
        return questions_list#questions_answers_list
'''
    

  
'''  
def get_articles_inner(topic_id,type,start,end):
    cache_key='push_method'
    cache_value=cache.get(cache_key,'expired')
    if 'TIME'==cache_value:
        order_type='-pub_date'
    else:
        order_type='-like_nums'
    articles=None
    articles_list=[]
    if ''==topic_id:
        cache_key='article'+type+str(start)
    else:
        cache_key='topic'+topic_id+'article'+type+str(start)
    cache_value=cache.get(cache_key,'expired')
    
    articles=Article.objects.order_by(order_type)[int(start):int(end)].values_list(
    "id","title","click_nums","id","topics_array","id","content","like_nums","comment_nums","pub_date",
    "author__id","author__first_name","author__userprofile__avatar","author__userprofile__mood","author__userprofile__sexual","author__userprofile__question_nums","author__userprofile__article_nums",
    "author__userprofile__answer_nums","author__userprofile__followto_nums","author__userprofile__follower_nums","author__userprofile__followtopic_nums","author__userprofile__followquestion_nums")
    for item in articles:
        print(item[1])
        
    if cache_value=='expired':
        articles=Article.objects.order_by(order_type)[int(start):int(end)].values_list(
        "id","title","click_nums","id","topics_array","id","content","like_nums","comment_nums","pub_date",
        "author__id","author__first_name","author__userprofile__avatar","author__userprofile__mood","author__userprofile__sexual","author__userprofile__question_nums","author__userprofile__article_nums",
        "author__userprofile__answer_nums","author__userprofile__followto_nums","author__userprofile__follower_nums","author__userprofile__followtopic_nums","author__userprofile__followquestion_nums")
    else:
        return cache_value
    if ''==topic_id:
        for article in articles:
            article=list(article)
            article.append('article')
            articles_list.append(list(article))
    else:
        for article in articles:
            topics_str=article[4]
            topic_id_str="\'"+topic_id+":";
            index=topics_str.find(topic_id_str)
            if index>=0:
                article=list(article)
                article.append('article')
                articles_list.append(list(article))
    cache.set(cache_key,articles_list,configure.CACHE_EXPIRED)
    #print(articles_list)
    return articles_list
'''  
