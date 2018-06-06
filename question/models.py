from django.db import models
from django.contrib.auth.models import User
import django.utils.timezone as timezone

# Create your models here.
class Question(models.Model):
    push_index=models.IntegerField(default=0)
    title=models.CharField(max_length=100)
    detail=models.CharField(max_length=500,null=True,blank=True)
    quizzer=models.ForeignKey(User,related_name='selfquestions',on_delete=models.CASCADE)
    answer_nums=models.IntegerField(default=0)
    follower=models.ManyToManyField(User,related_name='followquestions',blank=True)
    follower_nums=models.IntegerField(default=0)
    click_nums=models.IntegerField(default=0)
    prima_topic_id=models.IntegerField(default=-1)
    prima_topic_name=models.CharField(max_length=100,default='null')
    push_answer_id=models.IntegerField(default=-1)
    pub_date=models.DateTimeField('date published',default=timezone.now)
    def __str__(self):
        return self.title
        
class Article(models.Model):
    push_index=models.IntegerField(default=0)
    title=models.CharField(max_length=100)
    content=models.CharField(default='',max_length=10000)
    author=models.ForeignKey(User,related_name='selfarticles',on_delete=models.CASCADE)
    click_nums=models.IntegerField(default=0)
    prima_topic_id=models.IntegerField(default=-1)
    prima_topic_name=models.CharField(max_length=100,default='null')
    like_nums=models.IntegerField(default=0)
    comment_nums=models.IntegerField(default=0)
    pub_date=models.DateTimeField('date published',default=timezone.now)
    def __str__(self):
        return self.title

class Topic(models.Model):
    name=models.CharField(max_length=100)
    avatar=models.CharField(max_length=100,default='/media/avatar/default.jpg',verbose_name='peoplehead')
    detail=models.CharField(max_length=500,null=True,blank=True)
    question=models.ManyToManyField(Question,related_name='topics',blank=True)
    question_nums=models.IntegerField(default=0)
    article=models.ManyToManyField(Article,related_name='topics',blank=True)
    article_nums=models.IntegerField(default=0)
    follower=models.ManyToManyField(User,related_name='followtopics',blank=True)
    follower_nums=models.IntegerField(default=0)
    adept=models.ManyToManyField(User,related_name='adepttopics',blank=True)
    pub_date=models.DateTimeField('date published',default=timezone.now)
    def __str__(self):
        return self.name

class Answer(models.Model):
    #id=models.BigAutoField(primary_key=True)
    push_index=models.IntegerField(default=0)
    question=models.ForeignKey(Question,related_name='be_answers',on_delete=models.CASCADE)
    author=models.ForeignKey(User,related_name='answers',on_delete=models.CASCADE)
    content=models.CharField(default='',max_length=10000)
    like_nums=models.IntegerField(default=0)
    comment_nums=models.IntegerField(default=0)
    pub_date=models.DateTimeField('date published',default=timezone.now)
    def __str__(self):
        return self.author.username

class AnswerComment(models.Model):
    #id=models.BigAutoField(primary_key=True)
    author=models.ForeignKey(User,related_name='answercomments',on_delete=models.CASCADE)
    content=models.CharField(max_length=500)
    answer=models.ForeignKey(Answer,related_name='comments',on_delete=models.CASCADE)
    like_nums=models.IntegerField(default=0)
    #parent_id=models.BigIntegerField(default=0)
    parent_id=models.IntegerField(default=0)
    pub_date=models.DateTimeField('date published',default=timezone.now)
    def __str__(self):
        return self.author.username
        
class ArticleComment(models.Model):
    #id=models.BigAutoField(primary_key=True)
    author=models.ForeignKey(User,related_name='articlecomments',on_delete=models.CASCADE)
    content=models.CharField(max_length=500)
    article=models.ForeignKey(Article,related_name='comments',on_delete=models.CASCADE)
    like_nums=models.IntegerField(default=0)
    #parent_id=models.BigIntegerField(default=0)
    parent_id=models.IntegerField(default=0)
    pub_date=models.DateTimeField('date published',default=timezone.now)
    def __str__(self):
        return self.author.username

class UserProfile(models.Model):
    user=models.OneToOneField(User,related_name='userprofile',on_delete=models.CASCADE)
    avatar=models.CharField(max_length=100,default='/media/avatar/default.jpg',verbose_name='peoplehead')
    mood=models.CharField(default='no do no die',max_length=100)
    phone=models.CharField(default='0',max_length=11)
    intro=models.CharField(default='brief introduce myself',max_length=500)
    follower=models.ManyToManyField(User,related_name='followto',blank=True)
    follower_nums=models.IntegerField(default=0)
    sexual=models.CharField(default='f',max_length=1)
    residence=models.CharField(default='',max_length=100)
    job=models.CharField(default='',max_length=100)
    def __str__(self):
        return self.user.username

class Invite(models.Model):
    #id=models.BigAutoField(primary_key=True)
    inviter=models.ForeignKey(User,related_name='sendinvite',on_delete=models.CASCADE)
    invitee=models.ForeignKey(User,related_name='receiveinvite',on_delete=models.CASCADE)
    question_id=models.IntegerField(default=-1)
    status=models.IntegerField(default=0)
    pub_date=models.DateTimeField('date published',default=timezone.now)
    def __str__(self):
        return str(self.question_id)

class Notification(models.Model):
    #id=models.BigAutoField(primary_key=True)
    type=models.CharField(default='invite',max_length=11)
    sender=models.ForeignKey(User,related_name='sends',null=True,blank=True,on_delete=models.CASCADE)
    receiver=models.ForeignKey(User,related_name='receives',null=True,blank=True,on_delete=models.CASCADE)
    active_id=models.IntegerField(default=-1,null=True,blank=True)# question_id,answer_id,comment_id,user_id
    status=models.IntegerField(default=0)
    pub_date=models.DateTimeField('date published',default=timezone.now)
    def __str__(self):
        return str(self.type)
class Conversation(models.Model):
    #id=models.BigAutoField(primary_key=True)
    initator=models.ForeignKey(User,related_name='init_conversations',on_delete=models.CASCADE)
    parter=models.ForeignKey(User,related_name='join_conversations',on_delete=models.CASCADE)
    delete_id=models.IntegerField(default=-1)
    update_date=models.DateTimeField('date published',default=timezone.now)
    def __str__(self):
        return str(self.id)
class Message(models.Model):
    #id=models.BigAutoField(primary_key=True)
    conversation=models.ForeignKey(Conversation,related_name='messages',on_delete=models.CASCADE)
    content=models.CharField(max_length=500)
    sender=models.ForeignKey(User,related_name='message_sends',on_delete=models.CASCADE)
    receiver=models.ForeignKey(User,related_name='message_receives',on_delete=models.CASCADE)
    delete_id=models.IntegerField(default=-1)
    status=models.IntegerField(default=0)
    pub_date=models.DateTimeField('date published',default=timezone.now)
    def __str__(self):
        return str(self.id)