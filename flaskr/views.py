from flask import Blueprint

views = Blueprint('views', __name__)

@views.route('/')
def home():
    return "<h1>정대철 이 시발</h1>"
# 뭐야 이건 ㅆㅂ
# ㄲ ㅈ 
#안민용바보
