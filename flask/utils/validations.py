import re
import filetype

def validar_nombre(name):
    return name and len(name) < 255 and len(name) > 4

def validar_email(email):
    if not email:
        return False
    regex = r'^[^\s@]+@([a-zA-Z0-9-]+\.)*uchile\.cl$'
    return re.match(regex, email.strip()) is not None and len(email) < 80

def validar_telefono(telefono):
    if not telefono:
        return True
    return re.match(r'^9[0-9]{8}$', telefono.strip()) is not None

def validar_actividad(nombre, tipo, dia, inicio, duracion, desc):
    # Validaciones básicas para los campos de la lista
    if len(nombre.strip()) < 3:
        return False
    if tipo not in ["arte", "deporte", "tecnología", "social", "recreación", "otra"]:
        return False
    if not inicio:
        return False
    if len(desc.strip()) < 5:
        return False
    if dia not in ["lunes", "martes", "miércoles", "jueves", "viernes", "sabado", "domingo"]:
        return False
    if not bool(re.match(r"^([0-9]{1,2}):([0-5][0-9])$", duracion)):
        return False
    return True

def validar_img(conf_img): #Esto lo saque de del aux
    ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif"}
    ALLOWED_MIMETYPES = {"image/jpeg", "image/png", "image/gif"}

    # check if a file was submitted
    if conf_img is None:
        return False

    # check if the browser submitted an empty file
    if conf_img.filename == "":
        return False
    
    # check file extension
    ftype_guess = filetype.guess(conf_img)
    if ftype_guess.extension not in ALLOWED_EXTENSIONS:
        return False
    # check mimetype
    if ftype_guess.mime not in ALLOWED_MIMETYPES:
        return False
    return True

def validar_seleccion(valor):
    if valor is None:
        return False
    
    if str(valor).strip() == "":
        return False
    
    return True
