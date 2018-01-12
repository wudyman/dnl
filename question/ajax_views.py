
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
import time
from PIL import Image
from django.db import connection

@csrf_exempt
def get_questions(request,order,start,end):
    to_json=json.dumps('fail')
    questions=Question.objects.order_by('-pub_date')[int(start):int(end)]
    if questions:
        question_list=[]
        for question in questions:
            temp=[]
            temp.append(question.id) #0
            temp.append(question.title) #1
            temp.append(question.prima_topic_id) #2
            temp.append(question.prima_topic_name) #3
            if question.push_answer_id!=-1:
                temp.append(question.push_answer_id) #4
                answer=get_object_or_404(Answer,pk=question.push_answer_id)
                if answer:
                    temp.append(answer.author.id) #5
                    temp.append(answer.author.first_name) #6
                    temp.append(answer.author.userprofile.avatar) #7
                    temp.append(answer.author.userprofile.mood) #8
                    temp.append(answer.content) #9
                    temp.append(answer.like_nums) #10
                    temp.append(answer.comment_nums) #11
                    temp.append(str(answer.pub_date)) #12
                    question_list.append(temp)
        to_json=json.dumps(question_list)
    #print(connection.queries)
    return HttpResponse(to_json,content_type='application/json')

@csrf_exempt
def follow_question(request,follow,question_id):
    to_json=json.dumps('fail')
    question=get_object_or_404(Question,pk=question_id)
    if question:
        follower=request.user #get_object_or_404(User,username=request.user)
        #if '1'==follow:
        if int(follow):
            question.follower.add(follower)
        else:
            question.follower.remove(follower)
        question.follower_nums=question.follower.count()
        question.save()
        temp=question.follower_nums
        to_json=json.dumps(temp)
    return HttpResponse(to_json,content_type='application/json')

@csrf_exempt
def answer_question(request,question_id):
    to_json=json.dumps('fail')
    author=request.user #get_object_or_404(User,username=request.user)
    question=get_object_or_404(Question,pk=question_id)
    if question:
        answer=Answer()
        answer.content=request.POST.get('content')
        answer.author=author
        answer.question=question
        answer.save()
        answer_list=[]
        temp=[]
        temp.append(answer.id) #0
        temp.append(answer.content) #1
        temp.append(answer.like_nums) #2
        temp.append(answer.comment_nums) #3
        temp.append(str(answer.pub_date)) #4
        temp.append(answer.author.id) #5
        temp.append(answer.author.first_name) #6
        temp.append(answer.author.userprofile.avatar) #7
        temp.append(answer.author.userprofile.mood) #8
        answer_list.append(temp)
        to_json=json.dumps(answer_list)
        
        question.answer_nums=question.be_answers.count();
        question.push_answer_id=answer.id
        question.save()
    return HttpResponse(to_json,content_type='application/json')
    
@csrf_exempt
def get_topics(request):
    to_json=json.dumps('fail')
    topics=Topic.objects.all()
    topic_list=[]
    if topics:
        for topic in topics:
            temp=[]
            temp.append(topic.id)
            temp.append(topic.name)
            topic_list.append(temp)
        to_json=json.dumps(topic_list)
    return HttpResponse(to_json,content_type='application/json')
    
@csrf_exempt
def get_topicinfo(request,topic_id):
    to_json=json.dumps('fail')
    topic=get_object_or_404(Topic,pk=topic_id)
    if topic:
        temp=[]
        temp.append(topic.id)#0
        temp.append(topic.name)#1
        temp.append(topic.avatar)#2
        temp.append(topic.question_nums)#3
        temp.append(topic.follower_nums)#4
        user=request.user
        if user:
            if user.followtopics.filter(pk=topic.pk).exists():
                temp.append(1)#5
            else:
                temp.append(0)#5
        else:
            temp.append(0)#5
        to_json=json.dumps(temp)
    return HttpResponse(to_json,content_type='application/json')
    
@csrf_exempt
def get_topic_questions(request,topic_id,order,start,end):
    to_json=json.dumps('fail')
    topic=get_object_or_404(Topic,pk=topic_id)
    question_list=[]
    questions=topic.question.order_by('-pub_date')[int(start):int(end)]
    if questions:
        for question in questions:
            temp=[]
            temp.append(question.id) #0
            temp.append(question.title) #1
            temp.append(question.prima_topic_id) #2
            temp.append(question.prima_topic_name) #3
            if question.push_answer_id!=0:
                temp.append(question.push_answer_id) #4
                answer=get_object_or_404(Answer,pk=question.push_answer_id)
                if answer:
                    temp.append(answer.author.id) #5
                    temp.append(answer.author.first_name) #6
                    temp.append(answer.author.userprofile.avatar) #7
                    temp.append(answer.author.userprofile.mood) #8
                    temp.append(answer.content) #9
                    temp.append(answer.like_nums) #10
                    temp.append(answer.comment_nums) #11
                    temp.append(str(answer.pub_date)) #12
                    question_list.append(temp)
        to_json=json.dumps(question_list)
    return HttpResponse(to_json,content_type='application/json')
    
@csrf_exempt
def follow_topic(request,follow,topic_id):
    to_json=json.dumps('fail')
    topic=get_object_or_404(Topic,pk=topic_id)
    if topic:
        follower=request.user #get_object_or_404(User,username=request.user)
        #if '1'==follow:
        if int(follow):
            topic.follower.add(follower)
        else:
            topic.follower.remove(follower)
        topic.follower_nums=topic.follower.count()
        topic.save()
        temp=topic.follower_nums
        to_json=json.dumps(temp)
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
    question=get_object_or_404(Question,pk=question_id)
    answer_list=[]
    answers=question.be_answers.order_by('-pub_date')[int(start):int(end)]
    if answers:
        for answer in answers:
            temp=[]
            temp.append(answer.id) #0
            temp.append(answer.content) #1
            temp.append(answer.like_nums) #2
            temp.append(answer.comment_nums) #3
            temp.append(str(answer.pub_date)) #4
            temp.append(answer.author.id) #5
            temp.append(answer.author.first_name) #6
            temp.append(answer.author.userprofile.avatar) #7
            temp.append(answer.author.userprofile.mood) #8
            answer_list.append(temp)
        to_json=json.dumps(answer_list)
    return HttpResponse(to_json,content_type='application/json')
    
@csrf_exempt
def like_answer(request,answer_id):
    to_json=json.dumps('fail')
    answer=get_object_or_404(Answer,pk=answer_id)
    if answer:
        user=request.user #get_object_or_404(User,username=request.user)
        temp=answer.like_nums
        anwer_like_id='al'+str(answer.id)
        if anwer_like_id in request.COOKIES:
            if time.time()-float(request.COOKIES[anwer_like_id])>864000: #24*60*60=864000
                answer.like_nums+=1
        else:
            answer.like_nums+=1   
        to_json=json.dumps(answer.like_nums)
    response=HttpResponse(to_json,content_type='application/json')

    if temp!=answer.like_nums:
        response.set_cookie(anwer_like_id,time.time(),max_age=864000) #24*60*60=864000
        answer.save()
    return response

@csrf_exempt
def get_erinfo(request,erid):
    to_json=json.dumps('fail')
    er=get_object_or_404(User,pk=erid)
    user=request.user
    if er:
        temp=[]
        temp.append(er.id) #0
        temp.append(er.first_name) #1
        temp.append(er.userprofile.avatar) #2
        temp.append(er.userprofile.mood) #3
        temp.append(er.answers.count()) #4
        temp.append(er.userprofile.follower_nums) #5
        if user:
            if user.followto.filter(pk=er.userprofile.pk).exists():
                temp.append(1)#6
            else:
                temp.append(0)#6
        else:
            temp.append(0)#6
        to_json=json.dumps(temp)
    return HttpResponse(to_json,content_type='application/json')
        
@csrf_exempt
def get_er_all(request,erid,command):
    to_json=json.dumps('fail')
    er=get_object_or_404(User,pk=erid)
    user=request.user
    if 'answers'==command:
        answers=er.answers.all()
        if answers:
            temp_list=[]
            for answer in answers:
                temp=[]
                temp.append(answer.id)#0
                temp.append(answer.question.id)#1
                temp.append(answer.question.title)#2
                temp.append(answer.content)#3
                temp.append(answer.like_nums)#4                
                temp_list.append(temp)
            to_json=json.dumps(temp_list)
    elif 'asks'==command:
        questions=er.selfquestions.all()
        if questions:
            temp_list=[]
            for question in questions:
                temp=[]
                temp.append(question.id)#0
                temp.append(question.title)#1
                temp.append(str(question.pub_date))#2
                temp.append(question.be_answers.count())#2
                temp.append(question.follower_nums)#2
                temp_list.append(temp)
            to_json=json.dumps(temp_list)
    return HttpResponse(to_json,content_type='application/json')
    
@csrf_exempt
def get_er_following_all(request,erid,subcmd):
    to_json=json.dumps('fail')
    er=get_object_or_404(User,pk=erid)
    user=request.user
    if 'followtos'==subcmd:
        followtos=er.followto.all()
        if followtos:
            temp_list=[]
            for followto in followtos:
                temp=[]
                temp.append(followto.user.id)#0
                temp.append(followto.user.first_name)#1
                temp.append(followto.user.answers.count())#2
                temp.append(followto.avatar)#3
                temp.append(followto.mood)#4
                temp.append(followto.follower.count())#5
                if user.followto.filter(id=followto.id).exists():
                    temp.append(1)#6
                    if user.userprofile.follower.filter(id=followto.user.id).exists():
                        temp.append(1)#7
                    else:
                        temp.append(0)#7
                else:
                    temp.append(0)#6
                    temp.append(0)#7
                temp_list.append(temp)
            to_json=json.dumps(temp_list)
    elif 'followers'==subcmd:
        followers=er.userprofile.follower.all()
        if followers:
            temp_list=[]
            for follower in followers:
                temp=[]
                temp.append(follower.id)#0
                temp.append(follower.first_name)#1
                temp.append(follower.answers.count())#2
                temp.append(follower.userprofile.avatar)#3
                temp.append(follower.userprofile.mood)#4
                temp.append(follower.userprofile.follower.count())#5
                if user.followto.filter(id=follower.userprofile.id).exists():
                    temp.append(1)#6
                    if user.userprofile.follower.filter(id=follower.id).exists():
                        temp.append(1)#7
                    else:
                        temp.append(0)#7
                else:
                    temp.append(0)#6
                    temp.append(0)#7
                temp_list.append(temp)
            to_json=json.dumps(temp_list)
    #elif 'topics'==subcmd:
    #elif 'questions'==subcmd:
    return HttpResponse(to_json,content_type='application/json')
        
@csrf_exempt
def follow_er(request,follow,er_id):
    to_json=json.dumps('fail')
    er=get_object_or_404(User,pk=er_id)
    user=request.user #get_object_or_404(User,username=request.user)
    #if '1'==follow:
    if er:
        if int(follow):
            er.userprofile.follower.add(user)
            er.userprofile.follower_nums=er.userprofile.follower.count()
            user.followto.add(er.userprofile)
        else:
            er.userprofile.follower.remove(user)
            er.userprofile.follower_nums=er.userprofile.follower.count()
            user.followto.remove(er.userprofile)
        er.userprofile.save()
        user.save()
        temp=er.userprofile.follower_nums
        to_json=json.dumps(temp)
    return HttpResponse(to_json,content_type='application/json')
    
@csrf_exempt
def upload_avatar(request):
    to_json=json.dumps('fail')
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
def upload_img(request):
    to_json=json.dumps('fail')
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
    q=request.GET.get('question')
    #f=request.GET.get('from')
    t=request.GET.get('to')

    inviter=request.user
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
def get_notifications(request):
    to_json=json.dumps('fail')
    user=request.user
    notifications=user.receives.all()
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
    sender=request.user
    receiver=get_object_or_404(User,pk=receiver_id)
    conversations=Conversation.objects.filter(initator__id=sender.id,parter__id=receiver_id)
    if conversations:
        conversation=conversations[0]
    else:
        conversations=Conversation.objects.filter(initator__id=receiver_id,parter__id=sender.id)
        if conversations:
            conversation=conversations[0]
        else:
            conversation=Conversation(initator=sender,parter=receiver)
            conversation.save()
    content=request.POST.get('content')
    if content:
        message=Message(conversation=conversation,content=content,sender=sender,receiver=receiver,delete_id=-1)
        message.save()
        conversation.update_date=message.pub_date
        conversation.save()
        to_json=json.dumps(message.id) 
    return HttpResponse(to_json,content_type='application/json')
    
@csrf_exempt
def get_conversations(request,order,start,end):
    to_json=json.dumps('fail')
    user=request.user
    conversations=Conversation.objects.filter(initator__id=user.id) | Conversation.objects.filter(parter__id=user.id)
    conversations=conversations.order_by('-update_date')[int(start):int(end)]
    if conversations:
        conversation_list=[]
        for conversation in conversations:
            temp=[]
            temp.append(conversation.id)#0
            temp.append(conversation.delete_id)#1
            temp.append(str(conversation.update_date))#2
            er=conversation.initator
            if user.id==er.id:
                er=conversation.parter
            temp.append(er.id)#3
            temp.append(er.first_name)#4
            temp.append(er.userprofile.avatar)#5
            latest_message=conversation.messages.order_by('-pub_date')[0]
            if latest_message:
                temp.append(latest_message.content)#6
                conversation_list.append(temp)
        to_json=json.dumps(conversation_list)
    return HttpResponse(to_json,content_type='application/json')
    
@csrf_exempt
def get_conversation_messages(request,conversation_id,order,start,end):
    to_json=json.dumps('fail')
    #user=request.user
    conversation=get_object_or_404(Conversation,pk=conversation_id)
    if conversation:
        messages=conversation.messages.order_by('-pub_date')[int(start):int(end)]
        if messages:
            message_list=[]
            for message in messages:
                temp=[]
                temp.append(message.id)#0
                temp.append(message.content)#1
                temp.append(message.status)#2
                temp.append(message.delete_id)#3
                temp.append(str(message.pub_date))#4
                temp.append(message.sender.id)#5
                temp.append(message.sender.first_name)#6
                temp.append(message.sender.userprofile.avatar)#7
                message_list.append(temp)
            to_json=json.dumps(message_list)
    return HttpResponse(to_json,content_type='application/json')
 
@csrf_exempt
def delete_conversation_message(request,message_id):
    to_json=json.dumps('fail')
    message=get_object_or_404(Message,pk=message_id)
    if message:
        user=request.user
        if user.id==message.sender.id or user.id==message.receiver.id:
            #Message.objects.filter(id=message_id).delete()
            if message.delete_id==-1: #delete one side
                message.delete_id=user.id
                message.save()
            else:# delete both side,real delete.
                message.delete()
            to_json=json.dumps('success')
    return HttpResponse(to_json,content_type='application/json')
    
@csrf_exempt
def delete_conversation(request,conversation_id):
    to_json=json.dumps('fail')
    conversation=get_object_or_404(Conversation,pk=conversation_id)
    if conversation:
        user=request.user
        if user.id==conversation.initator.id or user.id==conversation.parter.id:
            #Conversation.objects.filter(id=message_id).delete()
            if conversation.delete_id==-1: #delete one side
                conversation.delete_id=user.id
                conversation.save()
            else:# delete both side,real delete.
                conversation.delete()
            to_json=json.dumps('success')
    return HttpResponse(to_json,content_type='application/json')