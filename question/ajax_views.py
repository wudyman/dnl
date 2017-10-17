import json
from django.http import HttpResponse
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
