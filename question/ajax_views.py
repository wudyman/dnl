
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
from datetime import datetime
#from itertools import chain

class CJsonEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, datetime):
            return obj.strftime('%Y-%m-%d %H:%M:%S')
        elif isinstance(obj, date):
            return obj.strftime("%Y-%m-%d")
        else:
            return json.JSONEncoder.default(self, obj)

@csrf_exempt
def get_questions(request,order,start,end):
    to_json=json.dumps('fail')
    questions=Question.objects.order_by('pub_date').exclude(push_answer_id=-1)[int(start):int(end)].values("id","title","push_answer_id","topics__id","topics__name")
    if questions:
        questions_list=[]
        last_question_id=0
        push_answers_id_list=[]
        length=len(questions)
        for i,question in enumerate(questions):
            if last_question_id!=question['id']:
                if i!=0:
                    item.append(topic_list)
                    questions_list.append(item)                
                item=[]
                topic_list=[]
                topic=[]
                item.append(question['id'])
                item.append(question['title'])
                item.append(question['push_answer_id'])
                push_answers_id_list.append(question['push_answer_id'])
                topic.append(question['topics__id'])
                topic.append(question['topics__name'])
                topic_list.append(topic)
                
                if i==length-1:
                    item.append(topic_list)
                    questions_list.append(item)  
                    
                last_question_id=question['id']
            else:
                topic=[]
                topic.append(question['topics__id'])
                topic.append(question['topics__name'])
                topic_list.append(topic)
                if i==length-1:
                    item.append(topic_list)
                    questions_list.append(item)                
                        
        push_answers=Answer.objects.filter(pk__in=push_answers_id_list).values_list("id","push_index","content","like_nums","comment_nums"
        ,"author__id","author__first_name","author__userprofile__avatar","author__userprofile__mood","author__userprofile__sexual","author__userprofile__question_nums","author__userprofile__article_nums"
        ,"author__userprofile__answer_nums","author__userprofile__followto_nums","author__userprofile__follower_nums","author__userprofile__followtopic_nums","author__userprofile__followquestion_nums")
           
        if push_answers:
            questions_answers_list=[]
            for question in questions_list:
                for answer in push_answers:
                    if answer[0]==question[2]:
                        question.extend(answer)
                        questions_answers_list.append(question)
            to_json=json.dumps(questions_answers_list)
    return HttpResponse(to_json,content_type='application/json')            
    
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
                else:
                    question.follower.remove(user)
                    if question.follower_nums>0:
                        question.follower_nums-=1
                    else:
                        question.follower_nums=question.follower.count()
                question.save()
                ret_data=[]
                ret_data.append(question.follower_nums)
                follow_questions=user.followquestions.values_list("id",flat=True)
                temp=[]
                temp.extend(follow_questions)
                ret_data.append(temp)
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
                user.save()
                ret_data=[]
                ret_data.append(er.userprofile.follower_nums)
                follow_peoples=user.followto.all().values_list("id",flat=True)
                temp=[]
                temp.extend(follow_peoples)
                ret_data.append(temp)
                to_json=json.dumps(ret_data)
        elif 'topic'==follow_type:
            topic=get_object_or_404(Topic,pk=follow_id)
            if topic:
                if int(follow_action):
                    topic.follower.add(user)
                    topic.follower_nums+=1
                else:
                    topic.follower.remove(user)
                    if topic.follower_nums>0:
                        topic.follower_nums-=1
                    else:
                        topic.follower_nums=topic.follower.count()
                topic.save()
                ret_data=[]
                ret_data.append(topic.follower_nums)
                follow_topics=user.followtopics.values_list("id",flat=True)
                temp=[]
                temp.extend(follow_topics)
                ret_data.append(temp)
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
            answer_list=[]
            temp=[answer.id,answer.content,answer.like_nums,answer.comment_nums,str(answer.pub_date),answer.author.id,answer.author.first_name,answer.author.userprofile.avatar,
            answer.author.userprofile.mood,answer.author.userprofile.sexual,answer.author.userprofile.question_nums,answer.author.userprofile.article_nums,answer.author.userprofile.answer_nums,
            answer.author.userprofile.followto_nums,answer.author.userprofile.follower_nums,answer.author.userprofile.followtopic_nums,answer.author.userprofile.followquestion_nums]
            answer_list.append(temp)
    
            to_json=json.dumps(answer_list)
            
            question.answer_nums+=1#question.be_answers.count();
            question.push_answer_id=answer.id
            question.save()
    return HttpResponse(to_json,content_type='application/json')
    
@csrf_exempt
def get_topics(request,bIsGetAll,start,end):
    to_json=json.dumps('fail')
    if '1'==bIsGetAll:
        topics=Topic.objects.all()
    else:
        topics=Topic.objects.order_by('pub_date')[int(start):int(end)]
    if topics:
        topic_list=[]
        for topic in topics:
            temp=[topic.id,topic.name,topic.avatar,topic.detail,topic.question_nums,topic.follower_nums,str(topic.pub_date)]
            topic_list.append(temp)
        to_json=json.dumps(topic_list)
    return HttpResponse(to_json,content_type='application/json')    
    
@csrf_exempt
def get_topic_questions(request,topic_id,order,start,end):
    to_json=json.dumps('fail')
    type=request.POST.get('type')
    if 'hot'==type:
        questions=Question.objects.filter(topics__id=topic_id,answer_nums__gte=1)[int(start):int(end)].values("id","title","push_answer_id","topics__id","topics__name")
        if questions:
            questions_list=[]
            last_question_id=0
            push_answers_id_list=[]
            length=len(questions)
            for i,question in enumerate(questions):
                if last_question_id!=question['id']:
                    if i!=0:
                        item.append(topic_list)
                        questions_list.append(item)                
                    item=[]
                    topic_list=[]
                    topic=[]
                    item.append(question['id'])
                    item.append(question['title'])
                    item.append(question['push_answer_id'])
                    push_answers_id_list.append(question['push_answer_id'])
                    topic.append(question['topics__id'])
                    topic.append(question['topics__name'])
                    topic_list.append(topic)
                    
                    if i==length-1:
                        item.append(topic_list)
                        questions_list.append(item)  
                        
                    last_question_id=question['id']
                else:
                    topic=[]
                    topic.append(question['topics__id'])
                    topic.append(question['topics__name'])
                    topic_list.append(topic)
                    if i==length-1:
                        item.append(topic_list)
                        questions_list.append(item)                
                            
            push_answers=Answer.objects.filter(pk__in=push_answers_id_list).values_list("id","push_index","content","like_nums","comment_nums"
            ,"author__id","author__first_name","author__userprofile__avatar","author__userprofile__mood","author__userprofile__sexual","author__userprofile__question_nums","author__userprofile__article_nums"
            ,"author__userprofile__answer_nums","author__userprofile__followto_nums","author__userprofile__follower_nums","author__userprofile__followtopic_nums","author__userprofile__followquestion_nums")
            
            if push_answers:
                questions_answers_list=[]
                for question in questions_list:
                    for answer in push_answers:
                        if answer[0]==question[2]:
                            question.extend(answer)
                            questions_answers_list.append(question)
                to_json=json.dumps(questions_answers_list)
    elif 'unanswered'==type:
        questions=Question.objects.filter(topics__id=topic_id,answer_nums__lte=0)[int(start):int(end)].values("id","title","answer_nums","follower_nums","pub_date")
        if questions:
            questions_list=list(questions)
            to_json=json.dumps(questions_list,cls=CJsonEncoder)
    return HttpResponse(to_json,content_type='application/json')
       
@csrf_exempt
def get_topic_adept(request):
    to_json=json.dumps('fail')
    #inviter=request.user
    topics=request.POST.get('topics').split(';')
    print(topics)
    topics.pop()
    print(topics)
    adepts=User.objects.all()
    adept_list=[]
    if adepts:
        for adept in adepts:
            temp=[]
            temp.append(adept.id)#0
            temp.append(adept.first_name)#1
            temp.append(adept.userprofile.avatar)#2
            temp.append(adept.userprofile.mood)#3
            #temp.append(inviter.id)
            adept_list.append(temp)
        to_json=json.dumps(adept_list)
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
    if answers:
        if answers[0][0]!=None:
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
        answers=User.objects.filter(id=erid).values_list("answers__id","answers__question__id","answers__question__title","answers__content","answers__like_nums","answers__comment_nums","id","first_name","userprofile__avatar","userprofile__mood")[int(start):int(end)]
        #answers=er.answers.all()
        #answers=er.answers.values_list("id","question__id","question__title","content","like_nums","comment_nums")
        if answers:
            answers_list=list(answers)
            to_json=json.dumps(answers_list)
    elif 'asks'==command:
        #questions=er.selfquestions.all()
        questions=User.objects.filter(id=erid).values_list("selfquestions__id","selfquestions__title","selfquestions__answer_nums","selfquestions__follower_nums","selfquestions__pub_date")[int(start):int(end)]
        if questions:
            questions_list=list(questions)
            to_json=json.dumps(questions_list,cls=CJsonEncoder)
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
            print(str(time.time()))
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
        #invitee.receiveinvite.add(invitation)
        if invitee:
            notification=Notification(type='invite',sender=inviter,receiver=invitee,active_id=q)
            notification.save()
            temp='success'
            to_json=json.dumps(temp)
    return HttpResponse(to_json,content_type='application/json')
    
@csrf_exempt
def get_notifications(request,order,start,end):
    to_json=json.dumps('fail')
    user=request.user
    if user.is_authenticated:
        notifications=user.receives.order_by('-pub_date')[int(start):int(end)]
        if notifications:
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
                if conversation.delete_id==-1: #delete one side
                    messages=conversation.messages.all()
                    if messages:
                        for message in messages: #delete all messages
                            if message.delete_id==-1: #delete one side
                                message.delete_id=user.id
                                message.save()
                            elif message.delete_id!=user.id: #delete both side
                                message.delete()
                    conversation.delete_id=user.id
                    conversation.save()
                elif conversation.delete_id!=user.id:# delete both side,real delete.
                    conversation.delete()
                to_json=json.dumps('success')
    return HttpResponse(to_json,content_type='application/json')
    
@csrf_exempt
def search(request,type,order,start,end):
    to_json=json.dumps('fail')
    keyword=request.POST.get('keyword')
    if keyword:
        if type=='all' or type=='question':
            questions=Question.objects.filter(title__contains=keyword)[int(start):int(end)]
            if questions:
                question_list=[]
                for question in questions:
                    temp=[]
                    temp.append(question.id) #0
                    temp.append(question.title) #1
                    temp.append(question.answer_nums) #2 
                    question_list.append(temp)
                to_json=json.dumps(question_list)
        elif type=='people':
            print(type)
        elif type=='topic':
            print(type)
    return HttpResponse(to_json,content_type='application/json')
    
@csrf_exempt
def answer_page(request,type,order,start,end):
    to_json=json.dumps('fail')
    user=request.user
    if user.is_authenticated:
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
            notifications=user.receives.filter(type='invite').order_by('-pub_date')[int(start):int(end)]
            if notifications:
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
                    question=get_object_or_404(Question,pk=notification.active_id)
                    temp.append(question.title)#7
                    temp.append(question.be_answers.count())#8
                    temp.append(question.follower_nums)#9
                    notification_list.append(temp)
                to_json=json.dumps(notification_list)
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
                to_json=json.dumps(verification_code)
    elif type=='password_reset':
        print('aaa')
        if not User.objects.filter(username=phone_no):
            print('bbb')
            to_json=json.dumps('unregistered')
        else:
            print('ccc')
            verification_code=str(random.randint(100000,999999))
            __business_id = uuid.uuid1()
            params = {'code':verification_code}
            smsResponse=dysms.send_sms(__business_id, phone_no, "大农令", "SMS_133972103", params)
            print(smsResponse)
            status_code=eval(str(smsResponse,encoding = "utf8"))['Code']
            if 'OK'==status_code:
                request.session[phone_no]=verification_code
                to_json=json.dumps(verification_code)
    return HttpResponse(to_json,content_type='application/json')
    
@csrf_exempt
def check_sms(request):
    to_json=json.dumps('fail')
    phone_no=request.POST.get('phone_no')
    type=request.POST.get('type')
    veri_code=request.POST.get('veri_code')
    if type=='password_reset':
        print('aaa')
        if not User.objects.filter(username=phone_no):
            print('bbb')
            to_json=json.dumps('unregistered')
        else:
            print('ccc')
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
def user_data(request,userid):
    to_json=json.dumps('fail')
    user=request.user
    if user.is_authenticated:
        type=request.POST.get('type')
        if 'all'==type:
            ret_list=[]

            follow_peoples=user.followto.all().values_list("id",flat=True)
            follow_topics=user.followtopics.values_list("id",flat=True)
            follow_questions=user.followquestions.values_list("id",flat=True)
            user_profile=[user.id,user.first_name,user.userprofile.avatar,user.userprofile.mood]

            ret_list.append(list(follow_peoples))
            ret_list.append(list(follow_topics))
            ret_list.append(list(follow_questions))
            ret_list.append(user_profile)
            to_json=json.dumps(ret_list)
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