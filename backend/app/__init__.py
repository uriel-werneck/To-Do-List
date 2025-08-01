from flask import Flask, current_app
from flask_restful import Api
from config import DevConfig
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
import os

db = SQLAlchemy()
migrate = Migrate()

def create_app(config_class=DevConfig):
    instance_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'instance'))
    app = Flask(__name__, instance_path=instance_path)
    app.config.from_object(config_class)

    CORS(app)

    api = Api(app)
    db.init_app(app)
    migrate.init_app(app, db)

    from .routes import register_routes
    register_routes(api)

    return app