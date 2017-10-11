from django.db import models
from django.contrib.auth.models import User
import django.utils.timezone as timezone

# Create your models here.
class Question(models.Model):
    title=models.CharField(max_length=50)
    detail=models.CharField(max_length=200)
    pub_date=models.DateTimeField('date published',default=timezone.now)
    quizzer=models.ForeignKey(User,on_delete=models.CASCADE)
    def __str__(self):
        return self.title

class Topic(models.Model):
    name=models.CharField(max_length=50)
    detail=models.CharField(max_length=200)
    question=models.ManyToManyField(Question)
    pub_date=models.DateTimeField('date published',default=timezone.now)
    def __str__(self):
        return self.name

class Answer(models.Model):
    question=models.ForeignKey(Question,on_delete=models.CASCADE)
    author=models.ForeignKey(User,on_delete=models.CASCADE)
    content=models.CharField(max_length=2000)
    pub_date=models.DateTimeField('date published',default=timezone.now)

class Comment(models.Model):
    author=models.ForeignKey(User,on_delete=models.CASCADE)
    content=models.CharField(max_length=200)
    pub_date=models.DateTimeField('date published',default=timezone.now)
