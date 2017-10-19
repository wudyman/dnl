
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

@csrf_exempt
def get_topics(request):
    topics=Topic.objects.all()
    temp=[]
    for topic in topics:
        temp.append(topic.name)
    print(temp)
    to_json=json.dumps(temp)
    return HttpResponse(to_json,content_type='application/json')

@csrf_exempt
def get_questions(request,order,start,end):
    print(int(start))
    print(int(end))
    questions=Question.objects.order_by('-pub_date')[int(start):int(end)]
    print(questions)
    question_list=[]
    
    for question in questions:
        temp=[]
        temp.append(question.id)
        temp.append(question.title)
        question_list.append(temp)
    to_json=json.dumps(question_list)
    print(to_json)
    return HttpResponse(to_json,content_type='application/json')

@csrf_exempt
def follow_topic(request,follow,topic_id):
    topic=get_object_or_404(Topic,pk=topic_id)
    follower=get_object_or_404(User,username=request.user)
    print(follow)
    print(type(follow))
    #if '1'==follow:
    if int(follow):
        print('true')
        topic.follower.add(follower)
    else:
        print('false')
        topic.follower.remove(follower)
    topic.save()
    temp='success'
    to_json=json.dumps(temp)
    return HttpResponse(to_json,content_type='application/json')
