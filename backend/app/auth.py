from flask_restful import abort
from flask import request, current_app
from .models import User, Task
from datetime import datetime, timedelta
from functools import wraps
import jwt

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            # will be in the format "Bearer <token>"
            auth_header = request.headers['Authorization']
            if auth_header.startswith('Bearer '):
                token = auth_header.split(' ')[1]

        if not token:
            return {'message': 'Token is missing'}, 401
                
        try:
            data = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=['HS256'])
            current_user = User.query.filter_by(id=data['user_id']).first()
            if not current_user:
                return {'message': 'Token is invalid or user not found'}, 401
        except jwt.ExpiredSignatureError:
            return {'message': 'Token has expired'}, 401
        except jwt.InvalidTokenError:
            return {'message': 'Token is invalid'}, 401
        
        return f(*args, current_user, **kwargs)
    
    return decorated

def get_task_or_404(task_id):
    task = Task.query.filter_by(id=task_id).first()
    if not task:
        abort(404, message=f'Task {task_id} not found')
    return task

def generateJWT(user: User):
    payload = {
        'user_id': user.id,
        'username': user.username,
        'exp': datetime.now() + timedelta(hours=5)
    }
    token = jwt.encode(payload, current_app.config['SECRET_KEY'], 'HS256')
    return token