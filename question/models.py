from django.db import models
from django.contrib.auth.models import User
import django.utils.timezone as timezone

# Create your models here.
class Question(models.Model):
    title=models.CharField(max_length=50)
    detail=models.CharField(max_length=200,blank=True)
    quizzer=models.ForeignKey(User,related_name='selfquestions',on_delete=models.CASCADE)
    answer_nums=models.IntegerField(default=0)
    #answers=models.ManyToManyField(User,related_name='answerquestions')
    follower=models.ManyToManyField(User,related_name='followquestions',blank=True)
    follower_nums=models.IntegerField(default=0)
    hot=models.IntegerField(default=0)
    prima_topic_id=models.IntegerField(default=-1)
    prima_topic_name=models.CharField(max_length=50,default='null')
    push_answer_id=models.IntegerField(default=-1)
    pub_date=models.DateTimeField('date published',default=timezone.now)
    def __str__(self):
        return self.title
        
class Article(models.Model):
    title=models.CharField(max_length=50)
    content=models.CharField(max_length=1000,blank=True)
    author=models.ForeignKey(User,related_name='selfarticles',on_delete=models.CASCADE)
    hot=models.IntegerField(default=0)
    prima_topic_id=models.IntegerField(default=-1)
    prima_topic_name=models.CharField(max_length=50,default='null')
    pub_date=models.DateTimeField('date published',default=timezone.now)
    def __str__(self):
        return self.title

class Topic(models.Model):
    name=models.CharField(max_length=50)
    avatar=models.CharField(max_length=100,default='/media/avatar/default.jpg',verbose_name='peoplehead')
    detail=models.CharField(max_length=200,blank=True)
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
    question=models.ForeignKey(Question,related_name='be_answers',on_delete=models.CASCADE)
    author=models.ForeignKey(User,related_name='answers',on_delete=models.CASCADE)
    content=models.CharField(max_length=5000)
    like_nums=models.IntegerField(default=0)
    comment_nums=models.IntegerField(default=0)
    pub_date=models.DateTimeField('date published',default=timezone.now)
    def __str__(self):
        return self.author.username

class AnswerComment(models.Model):
    author=models.ForeignKey(User,related_name='answercomments',on_delete=models.CASCADE)
    content=models.CharField(max_length=200)
    answer=models.ForeignKey(Answer,related_name='comments',on_delete=models.CASCADE)
    like_nums=models.IntegerField(default=0)
    parent_id=models.IntegerField(default=0)
    pub_date=models.DateTimeField('date published',default=timezone.now)
    def __str__(self):
        return self.author.username
        
class ArticleComment(models.Model):
    author=models.ForeignKey(User,related_name='articlecomments',on_delete=models.CASCADE)
    content=models.CharField(max_length=200)
    article=models.ForeignKey(Article,related_name='comments',on_delete=models.CASCADE)
    like_nums=models.IntegerField(default=0)
    parent_id=models.IntegerField(default=0)
    pub_date=models.DateTimeField('date published',default=timezone.now)
    def __str__(self):
        return self.author.username

class UserProfile(models.Model):
    user=models.OneToOneField(User,related_name='userprofile')
    avatar=models.CharField(max_length=100,default='/media/avatar/default.jpg',verbose_name='peoplehead')
    mood=models.CharField(default='no do no die',max_length=100)
    phone=models.CharField(default='0',max_length=11)
    intro=models.CharField(default='brief introduce myself',max_length=200)
    follower=models.ManyToManyField(User,related_name='followto',blank=True)
    follower_nums=models.IntegerField(default=0)
    sexual=models.CharField(default='f',max_length=1)
    residence=models.CharField(default='',max_length=100)
    job=models.CharField(default='',max_length=50)
    def __str__(self):
        return self.user.username

class Invite(models.Model):
    inviter=models.ForeignKey(User,related_name='sendinvite')
    invitee=models.ForeignKey(User,related_name='receiveinvite')
    question_id=models.IntegerField(default=-1)
    status=models.IntegerField(default=0)
    pub_date=models.DateTimeField('date published',default=timezone.now)
    def __str__(self):
        return str(self.question_id)

class Notification(models.Model):
    type=models.CharField(default='invite',max_length=11)
    sender=models.ForeignKey(User,related_name='sends')
    receiver=models.ForeignKey(User,related_name='receives')
    active_id=models.IntegerField(default=-1)# question_id,answer_id,comment_id,user_id
    status=models.IntegerField(default=0)
    pub_date=models.DateTimeField('date published',default=timezone.now)
    def __str__(self):
        return str(self.type)
class Conversation(models.Model):
    initator=models.ForeignKey(User,related_name='init_conversations')
    parter=models.ForeignKey(User,related_name='join_conversations')
    delete_id=models.IntegerField(default=-1)
    update_date=models.DateTimeField('date published',default=timezone.now)
    def __str__(self):
        return str(self.id)
class Message(models.Model):
    #type=models.CharField(default='letter',max_length=11)
    conversation=models.ForeignKey(Conversation,related_name='messages',on_delete=models.CASCADE)
    content=models.CharField(max_length=1000)
    sender=models.ForeignKey(User,related_name='message_sends')
    receiver=models.ForeignKey(User,related_name='message_receives')
    delete_id=models.IntegerField(default=-1)
    #active_id=models.PositiveIntegerField(default=0)# question_id,answer_id,comment_id,user_id
    status=models.IntegerField(default=0)
    pub_date=models.DateTimeField('date published',default=timezone.now)
    def __str__(self):
        return str(self.id)