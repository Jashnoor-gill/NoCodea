class ValidationError(Exception):
    pass

def validate_field(field, value):
    if field.required and (value is None or value == ''):
        raise ValidationError('This field is required')
    
    if value is None or value == '':
        return
    
    validation = field.validation or {}
    
    if field.type == 'text':
        if 'min_length' in validation and len(value) < validation['min_length']:
            raise ValidationError(f'Minimum length is {validation["min_length"]} characters')
        if 'max_length' in validation and len(value) > validation['max_length']:
            raise ValidationError(f'Maximum length is {validation["max_length"]} characters')
        if 'pattern' in validation:
            import re
            if not re.match(validation['pattern'], value):
                raise ValidationError('Invalid format')
    
    elif field.type == 'number':
        try:
            num_value = float(value)
            if 'min' in validation and num_value < validation['min']:
                raise ValidationError(f'Minimum value is {validation["min"]}')
            if 'max' in validation and num_value > validation['max']:
                raise ValidationError(f'Maximum value is {validation["max"]}')
        except ValueError:
            raise ValidationError('Must be a number')
    
    elif field.type == 'email':
        import re
        email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        if not re.match(email_pattern, value):
            raise ValidationError('Invalid email format')
    
    elif field.type == 'select':
        if field.options and value not in field.options:
            raise ValidationError('Invalid option selected') 