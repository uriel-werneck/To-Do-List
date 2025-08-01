from sqlalchemy import Column, Integer, ForeignKey, String, Boolean
from sqlalchemy.orm import relationship
from . import db

class Task(db.Model):
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('user.id'))
    description = Column(String(200), nullable=False)
    completed = Column(Boolean, default=False)

class User(db.Model):
    id = Column(Integer, primary_key=True)
    username = Column(String(20), nullable=False, unique=True)
    password = Column(String(128), nullable=False)
    tasks = relationship('Task', backref='user')