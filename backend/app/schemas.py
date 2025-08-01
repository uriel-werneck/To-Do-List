from marshmallow import Schema, fields, ValidationError
from marshmallow.validate import Length

class TaskSchema(Schema):
    id = fields.Int(dump_only=True)
    user_id = fields.Int(load_only=True)
    description = fields.Str(required=True, validate=Length(min=1))
    completed = fields.Bool(load_default=False)

class UserSchema(Schema):
    id = fields.Int(dump_only=True)
    username = fields.Str(required=True, validate=Length(min=5, max=25))
    password = fields.Str(required=True, load_only=True, validate=Length(min=5, max=128))

task_schema = TaskSchema()
tasks_schema = TaskSchema(many=True)
user_schema = UserSchema()
users_schema = UserSchema(many=True)