from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Question(models.Model):
	question_title=models.CharField(max_length=50)
	question_detail=models.CharField(max_length=200)
	pub_date=models.DateTimeField('date published')
	quizzer=models.ForeignKey(User,on_delete=models.CASCADE)
	def __str__(self):
		return self.question_title
