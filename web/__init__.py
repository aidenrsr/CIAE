from flask import Flask


def create_web():
    app = Flask(__name__)
    app.config['KEY'] = "minyong926"

    from .views import views
    from .auth import auth

    app.register_blueprint(views, url_prefix='/')
    app.register_blueprint(auth, url_prefix='/')

    return app
