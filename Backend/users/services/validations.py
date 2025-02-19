import re

def field_is_safe(value, regex):
    return bool(re.fullmatch(regex, value))

def username_is_valid(email):
    validEmailStructure = r'^(?!.*\.\.)[^\s@]+@ticktick\.com$' # username@domain.extension
    invalidCharacters = r"[\s,;&=_'\-\[\]+<>≤≥]"
    starts = r'^[@.]' # Starts with @ or .
    ends = r'[@.]$' # Ends with @ or .
    
    if not(re.fullmatch(validEmailStructure, email)) or re.findall(invalidCharacters, email):
        return False
    elif re.match(starts, email) or re.fullmatch(ends, email):
        return False
    
    return True

# Verify that the content of a request complies with a pre-established structure to avoid XSS attacks
def validate_field_data(request):
    data = request.POST.copy()
    username = data.get('username')
    password = data.get('password')
    first_name = data.get('first_name')
    last_name = data.get('last_name')
    gender = data.get('gender')
    errors = {}
    
    if username and not(username_is_valid(username)):
        errors['username'] = ['Enter a valid email address (username@ticktick.com).']
        
    if password and (len(password) < 8):
        errors['password'] = ['Ensure this field is more than 8 characters.']
    elif password and (re.fullmatch(r'^\s.*|.*\s$', password)):
        errors['password'] = ['This field cannot start or end with spaces.']
        
    if first_name and not(field_is_safe(first_name, r'^[a-zA-Z\s]+$')):
        errors['first_name'] = ['This field can only contain uppercase and lowercase letters.']
    
    if last_name and not(field_is_safe(last_name, r'^[a-zA-Z\s]+$')):
        errors['last_name'] = ['This field can only contain uppercase and lowercase letters.']
    
    if gender and not(field_is_safe(gender, r'^[a-zA-Z\s-]+$')):
        errors['gender'] = ['This field can only contain uppercase, lowercase letters and hyphens.']
        
    return errors