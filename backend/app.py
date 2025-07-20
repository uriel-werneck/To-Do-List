from flask import Flask, request
from flask_restful import Api, Resource, abort
from sqlalchemy import Column, String, Integer, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from flask_sqlalchemy import SQLAlchemy
from marshmallow import Schema, fields, ValidationError
from marshmallow.validate import Length
from flask_cors import CORS

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
CORS(app)
api = Api(app)
db = SQLAlchemy(app)

class Task(db.Model):
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('user.id'))
    description = Column(String(200), nullable=False)
    completed = Column(Boolean, default=False)

class User(db.Model):
    id = Column(Integer, primary_key=True)
    username = Column(String(20), nullable=False)
    password = Column(String(20), nullable=False)
    tasks = relationship('Task', backref='user')

class TaskSchema(Schema):
    id = fields.Int(dump_only=True)
    # user_id = fields.Int(load_only=True)
    description = fields.Str(required=True, validate=Length(min=1))
    completed = fields.Bool(load_default=False)

class UserSchema(Schema):
    id = fields.Int(dump_only=True)
    username = fields.Str(required=True, validate=Length(min=5, max=25))
    password = fields.Str(required=True, validate=Length(min=5, max=25))

task_schema = TaskSchema()
tasks_schema = TaskSchema(many=True)
user_schema = UserSchema()
users_schema = UserSchema(many=True)

def get_task_or_404(task_id):
    task = Task.query.get(task_id)
    if not task:
        abort(404, message=f'Task {task_id} not found')
    return task

class TodoList(Resource):
    def get(self):
        tasks = Task.query.all()
        return tasks_schema.dump(tasks), 200

    def post(self):
        try:
            data = task_schema.load(request.get_json())
        except ValidationError as error:
            return error.messages, 400
        
        new_task = Task(**data)
        db.session.add(new_task)
        db.session.commit()

        return task_schema.dump(new_task), 201

class TodoItem(Resource):
    def get(self, task_id):
        task = get_task_or_404(task_id)
        return task_schema.dump(task), 200
    
    def put(self, task_id):
        task = get_task_or_404(task_id)
        
        try:
            data = task_schema.load(request.get_json(), partial=True)
        except ValidationError as error:
            return error.messages, 400
        
        for key, value in data.items():
            setattr(task, key, value)
        
        db.session.commit()
        return task_schema.dump(task), 200

    def delete(self, task_id):
        task = get_task_or_404(task_id)
        db.session.delete(task)
        db.session.commit()
        return '', 204

class UsersResource(Resource):
    def get(self):
        users = User.query.all()
        users_schema.dump(users), 200
    
    def post(self):
        try:
            data = user_schema.load(request.get_json())
            print(data)
        except ValidationError as error:
            return error.messages, 400
        print('registering new user')

class UserResource(Resource):
    def get(self, user_id):
        print(f'getting user {user_id}')
    
    def delete(self, user_id):
        print(f'deleting user with id: {user_id}')

class LoginUser(Resource):
    def post(self):
        return {'message': 'user logged'}

class RegisterUser(Resource):
    def post(self):
        return {'message': 'user registered'}

api.add_resource(TodoItem, '/api/tasks/<int:task_id>')
api.add_resource(TodoList, '/api/tasks')
api.add_resource(UserResource, '/api/users/<int:user_id>')
api.add_resource(UsersResource, '/api/users')
api.add_resource(LoginUser, '/api/login')
api.add_resource(RegisterUser, '/api/register')

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        app.run(debug=True)