from flask import Flask, request
from flask_restful import Api, Resource, abort
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
    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String(200), nullable=False)
    completed = db.Column(db.Boolean, default=False)

class TaskSchema(Schema):
    id = fields.Int(dump_only=True)
    description = fields.Str(required=True, validate=Length(min=1))
    completed = fields.Bool(load_default=False)

task_schema = TaskSchema()
tasks_schema = TaskSchema(many=True)

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
    
api.add_resource(TodoItem, '/api/tasks/<int:task_id>')
api.add_resource(TodoList, '/api/tasks')

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        app.run(debug=True)