
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
        temp.append(question.id)
        temp.append(question.title)
        question_list.append(temp)
    to_json=json.dumps(question_list)
    return HttpResponse(to_json,content_type='application/json')

@csrf_exempt
def follow_topic(request,follow,topic_id):
    topic=get_object_or_404(Topic,pk=topic_id)
    follower=request.user #get_object_or_404(User,username=request.user)
    #if '1'==follow:
    if int(follow):
        topic.follower.add(follower)
        topic.follower_nums+=1
    else:
        topic.follower.remove(follower)
        if topic.follower_nums > 0:
            topic.follower_nums-=1
    topic.save()
    temp='success'
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
