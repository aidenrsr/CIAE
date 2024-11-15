from flask import Flask, redirect, url_for, session, jsonify
from flask_restx import Api, Resource
from flask_sqlalchemy import SQLAlchemy
from authlib.integrations.flask_client import OAuth
import os
from datetime import timedelta
from auth_decorator import login_required
from dotenv import load_dotenv
from flaskr.db import get_db

load_dotenv()

app = Flask(__name__)
api = Api(app)

app.secret_key = os.getenv("APP_SECRET_KEY")
app.config["SESSION_COOKIE_NAME"] = "google-login-session"
app.config["PERMANENT_SESSION_LIFETIME"] = timedelta(minutes=5)

db = SQLAlchemy(app)
oauth = OAuth(app)
google = oauth.register(
    name="google",
    client_id=os.getenv("GOOGLE_CLIENT_ID"),
    client_secret=os.getenv("GOOGLE_CLIENT_SECRET"),
    access_token_url="https://accounts.google.com/o/oauth2/token",
    access_token_params=None,
    authorize_url="https://accounts.google.com/o/oauth2/auth",
    authorize_params=None,
    api_base_url="https://www.googleapis.com/oauth2/v1/",
    userinfo_endpoint="https://openidconnect.googleapis.com/v1/userinfo",  # This is only needed if using openId to fetch user info
    client_kwargs={"scope": "email profile"},
    server_metadata_url="https://accounts.google.com/.well-known/openid-configuration",
)


@api.route("/")
@login_required
def hello_world():
    email = dict(session)["profile"]["email"]
    return f"logged in as {email}!"


@api.route("/login")
class LoginResource(Resource):
    def get(self):
        google = oauth.create_client("google")
        redirect_uri = url_for("authorize", _external=True)
        return google.authorize_redirect(redirect_uri)


@api.route("/authorize")
class AuthorizeResource(Resource):
    def get(self):
        google = oauth.create_client("google")
        token = google.authorize_access_token()  # not really necessary to assign to "token"
        resp = google.get("userinfo")
        user_info = resp.json()
        # extract user info
        email = user_info.get("email")
        name = user_info.get("name")
        user = User.query.filter_by(email=email).first()
        if not user:
            user = User(email=email, name=name, profile_picture=profile_picture)
            db.session.add(user)
            db.session.commit()
        
        session["profile"] = user_info
        session.permanent = True
        
        return redirect("/")


@app.route("/logout")
def logout():
    for key in list(session.keys()):
        session.pop(key)
    return redirect("/")
