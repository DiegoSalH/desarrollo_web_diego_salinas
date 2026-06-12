from flask import Flask, request, render_template, redirect, url_for, session, flash, jsonify
from database import db
from markupsafe import escape
from werkzeug.utils import secure_filename
from utils import validations
import hashlib
import filetype
import os

UPLOAD_FOLDER = 'static/uploads'
app = Flask(__name__)
app.secret_key = "s3cr3t_k3y"
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

@app.route("/", methods=["GET"]) #este seria el menu portada con 3 botones
def index():
    ultimos = db.get_ultimos_5_miembros()
    return render_template("index.html", ultimos=ultimos) #y la ruta carga este template de la portada

@app.route("/registrar-miembro", methods=["GET", "POST"])
def registrar():
    regiones = db.get_regiones()
    if request.method == "POST": 
        nombre = request.form.get("nombre")
        email = request.form.get("email")
        telefono = request.form.get("telefono")
        region_id = request.form.get("region")
        comuna_id = request.form.get("comuna")

        nombres_act = request.form.getlist("nombre_actividad[]")
        tipos_act = request.form.getlist("tipo-actividad[]")
        dias_act = request.form.getlist("dia_actividad[]")
        inicios_act = request.form.getlist("hora_inicio[]")
        duraciones_act = request.form.getlist("duracion[]")
        descripciones_act = request.form.getlist("desc[]")

        errores = []
        if not validations.validar_nombre(nombre):
            errores.append("Nombre invalido en servidor")
        if not validations.validar_email(email):
            errores.append("Email invalido en servidor")
        if not validations.validar_telefono(telefono):
            errores.append("Telefono invalido en servidor")
        if not validations.validar_seleccion(region_id):
            errores.append("Region invalida en servidor")
        if not validations.validar_seleccion(comuna_id):
            errores.append("Comuna invalida en servidor")

        for i in range(len(nombres_act)):
            if nombres_act[i].strip():
                if not validations.validar_actividad(nombres_act[i], tipos_act[i], dias_act[i], inicios_act[i], duraciones_act[i], descripciones_act[i]):
                    errores.append(f"Datos de actividad {i+1} no pasaron la validación.")
        if errores:
            return render_template("registrar_miembro.html", error=" | ".join(errores), regiones=regiones)
        
        id_miembro = db.create_miembro(nombre, email, telefono, comuna_id)
        
        for i in range(len(nombres_act)):
            if nombres_act[i].strip():
                id_act = db.create_actividad(
                    id_miembro,
                    dias_act[i],
                    inicios_act[i],
                    duraciones_act[i],
                    tipos_act[i],
                    nombres_act[i],
                    descripciones_act[i]
                )
                fotos_de_actividad = request.files.getlist(f"fotos_{i+1}[]")
                for foto in fotos_de_actividad:
                    if foto.filename != "":
                        if validations.validar_img(foto):
                            nombre_seguro = secure_filename(foto.filename)
                            nombre_final = f"{id_act}_{nombre_seguro}"
                            
                            ruta_destino = os.path.join(app.config["UPLOAD_FOLDER"], nombre_final)
                            foto.save(ruta_destino)
                            db.create_foto(ruta_destino, nombre_final, id_act)
                            
        flash("registro_exitoso")
        return redirect(url_for("index"))

    return render_template("registrar_miembro.html", regiones=regiones)

@app.route("/ver-miembros", methods=["GET"])
def ver_miembros():
    page = request.args.get("page", 1, type=int) #Esto es como el parametro con el que viene ?page=, el 1 es el default 
    miembros, total_paginas = db.get_miembros_paginados(page)
    return render_template("listado_miembros.html", lista = miembros, actual = page, total = total_paginas)

@app.route("/stats", methods=["GET"])
def stats():
    return render_template("stats.html")

@app.route("/miembro/<int:id_miembro>", methods = ["GET"]) #Esto es para cuando clickeamos a una persona de la lista para que nos despliegue toda la informacion
def detalle_miembro(id_miembro):
    miembro = db.get_miembro_completo(id_miembro)
    if not miembro:
        return "Miembro no encontrado"
    return render_template("detalle_miembro.html", m=miembro)

@app.route("/actividad/<int:actividad_id>")
def detalle_actividad(actividad_id):
    actividad = db.get_actividad(actividad_id)
    if not actividad:
        return "Actividad no encontrada"
    return render_template("detalle_actividad.html", actividad = actividad)

@app.route("/api/stats-data")
def stats_data():
    try:
        data_lineas = db.get_registros_semanales()
        data_torta = db.get_stats_actividades()
        data_barras = db.get_stats_actividades_por_comuna()

        json = {
            "miembros_por_dia": {
                "labels": data_lineas["labels"],
                "valores": data_lineas["valores"]
            },
            "actividades_por_tipo": {
                "labels": data_torta["labels"],
                "valores": data_torta["valores"]
            },
            "actividades_por_comuna": {
                "labels": data_barras["labels"],
                "valores": data_barras["valores"]
            }
        }
        return jsonify(json), 200
    except Exception as e:
        print(f"Error en el servidor: {e}")
        return jsonify({"error": "No se pudo calcular las estadisticas"}), 500

@app.route("/api/comentarios/<int:actividad_id>", methods = ["GET"])
def obtener_comentarios(actividad_id):
    try:
        comentarios = db.get_comentarios_por_actividad(actividad_id)
        return jsonify(comentarios), 200
    except Exception as e:
        print(f"Error al obtener comentarios: {e}")
        return jsonify({"error": "Nose pudieron cargar los datos"}), 500

@app.route("/api/comentarios", methods=["POST"])
def guardar_comentario():
    try:
        datos_recibidos = request.get_json()
        nombre = datos_recibidos.get("nombre")
        texto = datos_recibidos.get("texto")
        actividad_id = datos_recibidos.get("actividad_id")

        if not nombre or not texto or not actividad_id:
            return jsonify({"error": "Todos los campos son obligatorios"}), 400
        if len(nombre) > 80 or len(nombre) < 3 or len(texto) > 300 or len(texto) < 5:
            return jsonify({"error": "Los datos exceden el limite de caracteres permitidos o en su defecto no alcanza el minimo"}), 400

        id_nuevo = db.create_comentario(nombre, texto, actividad_id)
        if id_nuevo:
            return jsonify({
                "status": "success",
                "comentario_id": id_nuevo
            }), 201
        else:
            return jsonify({"error": "No se pudo guardar el comentario en la base de datos"}), 500
    except Exception as e:
        print(f"Error en el servidor al procesar POST de comentarios: {e}")
        return jsonify({"error": "Error interno del servidor"}), 500
    
if __name__ == "__main__":
    app.run(debug=True)