
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

@csrf_exempt
def get_topics(request):
    topics=Topic.objects.all()
    topic_list=[]
    for topic in topics:
        temp=[]
        temp.append(topic.id)
        temp.append(topic.name)
        topic_list.append(temp)
    to_json=json.dumps(topic_list)
    return HttpResponse(to_json,content_type='application/json')

@csrf_exempt
def get_questions(request,order,start,end):
    questions=Question.objects.order_by('-pub_date')[int(start):int(end)]
    question_list=[]
    
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
def follow_question(request,follow,question_id):
    question=get_object_or_404(Question,pk=question_id)
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
def like_answer(request,answer_id):
    answer=get_object_or_404(Answer,pk=answer_id)
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
def follow_topic(request,follow,topic_id):
    topic=get_object_or_404(Topic,pk=topic_id)
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
def follow_er(request,follow,er_id):
    er=get_object_or_404(User,pk=er_id)
    user=request.user #get_object_or_404(User,username=request.user)
    #if '1'==follow:
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
def upload_img(request):
    imgfile=request.FILES.get('imgfile')
    if imgfile: 
        print(str(time.time()))
        posttime=request.user.username+str(time.time()).split('.')[0]
        postfix=str(imgfile).split('.')[-1]
        name='img/%s.%s'%(posttime,postfix)
        img=Image.open(imgfile)
        img.save('media/'+name)
        #print(img.items)
        request.user.userprofile.avatar=name
        request.user.userprofile.save()
    
    temp='success'
    to_json=json.dumps(temp)
    return HttpResponse(to_json,content_type='application/json')
    
@csrf_exempt
def get_erinfo(request,erid):
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
def get_topic_adept(request):
        topics=request.POST.get('topics').split(';')
        topics.pop()
        print(topics)
        adepts=User.objects.all()
        adept_list=[]
        for adept in adepts:
            temp=[]
            temp.append(adept.id)
            temp.append(adept.first_name)
            temp.append(adept.userprofile.avatar)
            temp.append(adept.userprofile.mood)
            adept_list.append(temp)
        to_json=json.dumps(adept_list)
        return HttpResponse(to_json,content_type='application/json')