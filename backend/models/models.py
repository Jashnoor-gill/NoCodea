# -*- coding: utf-8 -*-
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class Form(db.Model):
    id = db.Column(db.String(36), primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    fields = db.relationship('FormField', backref='form', lazy=True, cascade='all, delete-orphan')
    submissions = db.relationship('FormSubmission', backref='form', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
            'fields': [field.to_dict() for field in sorted(self.fields, key=lambda x: x.position)]
        }

class FormField(db.Model):
    id = db.Column(db.String(36), primary_key=True)
    form_id = db.Column(db.String(36), db.ForeignKey('form.id'), nullable=False)
    type = db.Column(db.String(50), nullable=False)
    label = db.Column(db.String(200), nullable=False)
    placeholder = db.Column(db.String(200))
    required = db.Column(db.Boolean, default=False)
    options = db.Column(db.JSON)
    validation = db.Column(db.JSON)
    position = db.Column(db.Integer, nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'type': self.type,
            'label': self.label,
            'placeholder': self.placeholder,
            'required': self.required,
            'options': self.options,
            'validation': self.validation,
            'position': self.position
        }

class FormSubmission(db.Model):
    id = db.Column(db.String(36), primary_key=True)
    form_id = db.Column(db.String(36), db.ForeignKey('form.id'), nullable=False)
    data = db.Column(db.JSON, nullable=False)
    ip_address = db.Column(db.String(45))
    user_agent = db.Column(db.String(200))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'form_id': self.form_id,
            'data': self.data,
            'ip_address': self.ip_address,
            'user_agent': self.user_agent,
            'created_at': self.created_at.isoformat()
        }