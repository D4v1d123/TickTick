import re

from PIL import Image


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

# Verify that the content of a request complies with a pre-established structure
# to avoid XSS attacks
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

# Check if the file is an image, does not exceed the established size, and is 
# within the supported formats
def validate_img(file):
    MAX_IMG_SIZE = 10 # Size in MB
    TYPE_IMAGES = [
        'image/jpeg', 
        'image/png', 
        'image/webp', 
        'image/svg+xml', 
        'image/heic', 
        'image/heif'
    ]
    
    file_type = getattr(file, 'content_type', None)
    file_size = (len(file) / 1024) / 1024 # Size in MB
    
    if (file == 'Null'):
        return None
    
    if not(file_type in TYPE_IMAGES):
        return {'error': 'Unsupported image format, use \'jpeg\', \'png\', \'webp\', \'svg\', \'heic\' or \'heif\'.'}

    # Verify that a file is not a malicious file disguised as an image
    try:
        Image.open(file).verify()
        file.seek(0) 
    except Exception as error:
        print(error)
        return {'error': 'Invalid image, please upload another image.'}
    
    if file_size > MAX_IMG_SIZE:
        return {'error': f'The image cannot weigh more than {MAX_IMG_SIZE} MB.'}