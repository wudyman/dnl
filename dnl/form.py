from django import forms

class NameForm(forms.Form):
	your_name=forms.CharField(label='name',max_length=100)
	password=forms.CharField(max_length=50)
