from flask import Flask, request
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager, jwt_required, get_jwt_identity
from flask_restx import Api, Namespace, Resource, fields
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


# namespace
messages_ns = Namespace("messages")

message_model = messages_ns.model(
    "Message",
    {
        "message_id": fields.Integer(),
        "username": fields.String(),
        "text": fields.String(),
        "timestamp": fields.DateTime(),
    },
)

@messages_ns.route("/messages")
class MessagesResource(Resource):
    @messages_ns.marshal_list_with(message_model)
    def get(self):
        chat = Message.query.order_by(Message.timestamp.asc()).all()
        return chat
    
    @messages_ns.expect(message_model)
    @messages_ns.marshal_with(message_model)
    @jwt_required()
    def post(self):
        # get the user id from JWT
        user_id = get_jwt_identity()
        # fetch the user from the database
        user = User.query.get_or_404(user_id)
        # get the message text from the request body
        data = request.get_json()
        text = data.get('text', '').strip()
        if not text:
            return {'Message cannot be empty'}, 400
        # create and save the message
        message = Message(username = user.username, text = text)
        db.session.add(message)
        db.session.commit()

        return {'Message sent'}, 201

@messages_ns.route("/messages/<int:message_id>")
class MessageResource(Resource):
    @messages_ns.marshal_with(message_model)
    def get(self, message_id):
        # find message using id
        message = Message.query.get_or_404(message_id)
        return message

    @jwt_required()
    def delete(self, message_id):
        user_id = get_jwt_identity()
        user = User.query.get_or_404(user_id)
        message_to_delete = Message.query.get_or_404(message_id)
        # check if user and message writer match
        if user.username != message_to_delete.username:
            return {"error"}, 403
        
        db.session.delete(message_to_delete)
        db.session.commit()
        return {"Message deleted"}, 200


# api.add_namespace(messages_ns, path="/chat")


# with app.app_context():
#     db.create_all()

# if __name__ == "__main__":
#     app.run(debug=True)
