# -*- coding: utf-8 -*-
from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
import uuid
from models.models import db, Form, FormField, FormSubmission

from utils.validation import validate_field, ValidationError

app = Flask(__name__)
CORS(app)

# Configure SQLite database
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///forms.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# Initialize database
db.init_app(app)

# Create database tables
with app.app_context():
    db.create_all()

@app.route("/api/forms", methods=["GET"])
def get_forms():
    forms = Form.query.all()
    return jsonify([form.to_dict() for form in forms])

@app.route("/api/forms", methods=["POST"])
def create_form():
    data = request.json
    form_id = str(uuid.uuid4())
    
    # Create form
    form = Form(
        id=form_id,
        title=data.get("title", "Untitled Form")
    )
    db.session.add(form)
    
    # Create form fields
    for index, field_data in enumerate(data.get("fields", [])):
        field = FormField(
            id=str(uuid.uuid4()),
            form_id=form_id,
            type=field_data["type"],
            label=field_data["label"],
            placeholder=field_data.get("placeholder"),
            required=field_data.get("required", False),
            options=field_data.get("options"),
            validation=field_data.get("validation"),
            position=index
        )
        db.session.add(field)
    
    db.session.commit()
    return jsonify(form.to_dict()), 201

@app.route("/api/forms/<form_id>", methods=["GET"])
def get_form(form_id):
    form = Form.query.get_or_404(form_id)
    return jsonify(form.to_dict())

@app.route("/api/forms/<form_id>", methods=["PUT"])
def update_form(form_id):
    form = Form.query.get_or_404(form_id)
    data = request.json
    
    # Update form
    form.title = data.get("title", form.title)
    
    # Update fields
    # First, delete existing fields
    FormField.query.filter_by(form_id=form_id).delete()
    
    # Then, create new fields
    for index, field_data in enumerate(data.get("fields", [])):
        field = FormField(
            id=str(uuid.uuid4()),
            form_id=form_id,
            type=field_data["type"],
            label=field_data["label"],
            placeholder=field_data.get("placeholder"),
            required=field_data.get("required", False),
            options=field_data.get("options"),
            validation=field_data.get("validation"),
            position=index
        )
        db.session.add(field)
    
    db.session.commit()
    return jsonify(form.to_dict())

@app.route("/api/forms/<form_id>", methods=["DELETE"])
def delete_form(form_id):
    form = Form.query.get_or_404(form_id)
    db.session.delete(form)
    db.session.commit()
    return "", 204

@app.route("/api/forms/<form_id>/submit", methods=["POST"])
def submit_form(form_id):
    form = Form.query.get_or_404(form_id)
    data = request.json
    
    # Validate all fields
    errors = {}
    for field in form.fields:
        try:
            value = data.get(field.id)
            validate_field(field, value)
        except ValidationError as e:
            errors[field.id] = str(e)
    
    if errors:
        return jsonify({"errors": errors}), 400
    
    # Create submission
    submission = FormSubmission(
        id=str(uuid.uuid4()),
        form_id=form_id,
        data=data,
        ip_address=request.remote_addr,
        user_agent=request.user_agent.string
    )
    db.session.add(submission)
    db.session.commit()
    
    return jsonify(submission.to_dict()), 201

@app.route("/api/forms/<form_id>/submissions", methods=["GET"])
def get_form_submissions(form_id):
    form = Form.query.get_or_404(form_id)
    submissions = FormSubmission.query.filter_by(form_id=form_id).all()
    return jsonify([submission.to_dict() for submission in submissions])

if __name__ == "__main__":
    app.run(debug=True)
