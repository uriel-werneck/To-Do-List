from flask_restful import Resource, Api
from flask import request, current_app
from .schemas import task_schema, tasks_schema
from .models import User, Task
from .schemas import user_schema, users_schema
from .auth import token_required, get_task_or_404, generateJWT
from werkzeug.security import generate_password_hash, check_password_hash
from marshmallow import ValidationError
from app import db

class TodoList(Resource):
    @token_required
    def get(self, current_user):
        tasks = Task.query.filter_by(user_id=current_user.id).all()
        return tasks_schema.dump(tasks), 200

    @token_required
    def post(self, current_user):
        try:
            data = task_schema.load(request.get_json())
            data['user_id'] = current_user.id

        except ValidationError as error:
            return error.messages, 400
        
        new_task = Task(**data)
        db.session.add(new_task)
        db.session.commit()

        return task_schema.dump(new_task), 201

class TodoItem(Resource):
    @token_required
    def get(self, current_user, task_id):
        task = get_task_or_404(task_id)
        if task.user_id == current_user.id:
            return task_schema.dump(task), 200
        return {'message': 'Cannot access this task'}, 403
    
    @token_required
    def put(self, current_user, task_id):
        task = get_task_or_404(task_id)

        if task.user_id != current_user.id:
            return {'message': 'Cannot update this task'}, 403
        
        try:
            data = task_schema.load(request.get_json(), partial=True)
        except ValidationError as error:
            return error.messages, 400
        
        for key, value in data.items():
            setattr(task, key, value)
        
        db.session.commit()
        return task_schema.dump(task), 200

    @token_required
    def delete(self, current_user, task_id):
        task = get_task_or_404(task_id)

        if task.user_id == current_user.id:
            db.session.delete(task)
            db.session.commit()
            return '', 204
        return {'message': 'Cannot delete this task'}, 403

class UsersResource(Resource):
    @token_required
    def get(self, current_user):
        users = User.query.all()
        user = User.query.filter_by(id=current_user.id).first()
        return users_schema.dump(users), 200

class UserResource(Resource):
    @token_required
    def get(self, current_user, user_id):
        if current_user.id != user_id:
            return {'message': 'Cannot access this user info'}, 403
        
        user = User.query.filter_by(id=user_id).first()
        if user:
            return user_schema.dump(user), 200
        else:
            return {'message': 'User not found!'}, 400
    
    @token_required
    def delete(self, current_user, user_id):
        if current_user.id != user_id:
            return {'message': 'Cannot delete this user'}, 403
        user = User.query.filter_by(id=user_id).first()
        if user:
            tasks_to_delete = Task.query.filter_by(user_id=user_id).all()
            for task in tasks_to_delete:
                db.session.delete(task)
            db.session.delete(user)
            db.session.commit()
            return {'message': 'User deleted!'}
        else:
            return {'message': 'User not found!'}, 400

class LoginUser(Resource):
    def post(self):
        try:
            data = user_schema.load(request.get_json())
            username = data['username'].strip()
            password = data['password']
            user = User.query.filter_by(username=username).first()

            if user and check_password_hash(user.password, password):
                token = generateJWT(user)
                return {'message': f'{username} logged in successfully', 'token': token}, 200
            else:
                return {'message': 'Invalid username or password'}, 401
            
        except ValidationError as error:
            return error.messages, 400

class RegisterUser(Resource):
    def post(self):
        try:
            data = request.get_json()
            username = data['username']
            password = data['password']
            user_schema.load({'username': username, 'password': password})
            repeated_password = data['repeatedPassword']
            if password == repeated_password:
                user = User.query.filter_by(username=username).first()

                if user:
                    return {'message': 'User already registered'}, 400
                
                hashed_password = generate_password_hash(password)
                new_user = User(username=username, password=hashed_password)
                db.session.add(new_user)
                db.session.commit()

                return {'message': f'{username} registered to the database'}, 201

            else:
                return {'message': 'Passwords not matching'}, 400
        except ValidationError as error:
            return error.messages, 400

def register_routes(api: Api):
    api.add_resource(TodoItem, '/api/tasks/<int:task_id>')
    api.add_resource(TodoList, '/api/tasks')
    api.add_resource(UserResource, '/api/users/<int:user_id>')
    api.add_resource(UsersResource, '/api/users')
    api.add_resource(LoginUser, '/api/login')
    api.add_resource(RegisterUser, '/api/register')