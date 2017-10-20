from django.db import models
from django.contrib.auth.models import User
import django.utils.timezone as timezone

# Create your models here.
class Question(models.Model):
    title=models.CharField(max_length=50)
    detail=models.CharField(max_length=200,blank=True)
    quizzer=models.ForeignKey(User,related_name='selfquestions',on_delete=models.CASCADE)
    answers=models.ManyToManyField(User,related_name='answerquestions')
    follower=models.ManyToManyField(User,related_name='followquestions')
    follower_nums=models.IntegerField(default=0)
    hot=models.IntegerField(default=0)
    prima_topic_id=models.IntegerField(default=3)
    prima_topic_name=models.CharField(max_length=50,default='ddd')
    push_answer_id=models.IntegerField(default=0)
    pub_date=models.DateTimeField('date published',default=timezone.now)
    def __str__(self):
        return self.title

class Topic(models.Model):
    name=models.CharField(max_length=50)
    detail=models.CharField(max_length=200,blank=True)
    question=models.ManyToManyField(Question,related_name='topics',blank=True)
    question_nums=models.IntegerField(default=0)
    follower=models.ManyToManyField(User,related_name='followtopics',blank=True)
    follower_nums=models.IntegerField(default=0)
    pub_date=models.DateTimeField('date published',default=timezone.now)
    def __str__(self):
        return self.name

class Answer(models.Model):
    question=models.ForeignKey(Question,related_name='be_answers',on_delete=models.CASCADE)
    author=models.ForeignKey(User,related_name='answers',on_delete=models.CASCADE)
    content=models.CharField(max_length=5000)
    like_nums=models.IntegerField(default=0)
    comment_nums=models.IntegerField(default=0)
    pub_date=models.DateTimeField('date published',default=timezone.now)
    def __str__(self):
        return self.author.username

class Comment(models.Model):
    author=models.ForeignKey(User,related_name='comments',on_delete=models.CASCADE)
    content=models.CharField(max_length=200)
    answer=models.ForeignKey(Answer,related_name='comments',on_delete=models.CASCADE)
    like_nums=models.IntegerField(default=0)
    pub_date=models.DateTimeField('date published',default=timezone.now)
    def __str__(self):
        return self.author.username

class UserProfile(models.Model):
    user=models.OneToOneField(User)
    phone=models.CharField(default='0',max_length=11)
    intro=models.CharField(default='brief introduce myself',max_length=200)
    follower=models.ManyToManyField(User,related_name='followto',blank=True)
    def __str__(self):
        return self.user.username
