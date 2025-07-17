from flask import Flask, request
from flask_restful import Api, Resource
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
api = Api(app)
db = SQLAlchemy(app)

class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String(200), nullable=False)
    completed = db.Column(db.Boolean, default=False)

    def to_dict(self):
        return {
            'id': self.id,
            'description': self.description,
            'completed': self.completed
        }

class TodoList(Resource):
    def get(self):
        tasks = Task.query.all()
        return [task.to_dict() for task in tasks], 200

    def post(self):
        data = request.get_json()
        description = data.get('description')
        new_task = Task(description=description)
        db.session.add(new_task)
        db.session.commit()
        return new_task.to_dict(), 201

class TodoItem(Resource):
    def get(self, task_id):
        task = Task.query.get(task_id)
        if not task:
            return {'message': f'Task {task_id} not found'}, 404
        return task.to_dict(), 200
    
    def put(self, task_id):
        data = request.get_json()
        task = Task.query.get(task_id)
        if not task:
            return {'message': f'Task {task_id} not found'}, 404
        task.description = data.get('description', task.description)
        task.completed = data.get('completed', task.completed)
        db.session.commit()
        return task.to_dict(), 200

    def delete(self, task_id):
        task = Task.query.get(task_id)
        if not task:
            return {'message': f'Task {task_id} not found'}, 404
        db.session.delete(task)
        db.session.commit()
        return {"message": f"Task {task_id} deleted"}, 200
    
api.add_resource(TodoItem, '/api/tasks/<int:task_id>')
api.add_resource(TodoList, '/api/tasks')

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        app.run(debug=True)
