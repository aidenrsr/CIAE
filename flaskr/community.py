from flask import Flask,request
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager, jwt_required, get_jwt_identity
from flask_restx import Api, Resource
from datetime import datetime, timezone

app = Flask(__name__)

app.config['JWT_SECRET_KEY'] = 'aidenryu'
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://username:password@127.0.0.1:5001/chatting'
jwt = JWTManager(app)
db = SQLAlchemy(app)
api = Api(app)


# Database Models
class User(db.Model):
    __tablename__ = 'users'
    user_id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.Text, unique=True)
    email = db.Column(db.Text, unique=True, nullable=False)
    password = db.Column(db.Text)
    oauth_provider = db.Column(db.Text)
    oauth_user_id = db.Column(db.Text, unique=True)
    created_at = db.Column(db.DateTime, default=datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=datetime.now(timezone.utc))


class Message(db.Model):
    __tablename__ = 'messages'
    message_id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.Text, nullable=False)
    text = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.now(timezone.utc))



@api.route('/messages')
class MessageResource(Resource):
    @jwt_required()
    def post(self):
        # get the user id from JWT
        user_id = get_jwt_identity()
        # fetch the user from the database
        user = User.query.get(user_id)
        # get the message text from the request body
        data = request.json
        text = data.get('text', '').strip()
        if not text:
            return {'Message cannot be empty'}, 400
        # create and save the message
        message = Message(username = user.username, text = text)
        db.session.add(message)
        db.session.commit()

        return {'Message sent'}, 201
    
    # 다끌고와서 시간순으로 나열 그다음 형식대로 정리.
    def get(self):
        chat = Message.query.order_by(Message.timestamp.asc()).all()
        response = [
            {
                'username': message.username,
                'text': message.text,
                'timestamp': message.timestamp.strftime('%Y-%m-%d %H:%M:%S')
            }
            for message in chat
        ]
        return response, 200
