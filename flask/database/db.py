from sqlalchemy import create_engine, Column, Integer, BigInteger, String, ForeignKey, DateTime, Enum, Text, desc, func
from sqlalchemy.orm import sessionmaker, declarative_base, relationship, joinedload
from datetime import datetime, timedelta
"""
DB_NAME = "tarea2"
DB_USERNAME = "cc5002"
DB_PASSWORD = "programacionweb"
DB_HOST = "localhost"
DB_PORT = 3306
"""
DB_NAME = "tarea2"
DB_USERNAME = "root"
DB_PASSWORD = "Dspass240."
DB_HOST = "localhost"
DB_PORT = 3306

DB_URL = f"mysql+pymysql://{DB_USERNAME}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
engine = create_engine(DB_URL, echo=True, future=True)
SessionLocal = sessionmaker(bind=engine)

Base = declarative_base()

class Region(Base):
    __tablename__ = "region"
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    nombre = Column(String(200), nullable=False)

    comunas = relationship("Comuna", back_populates="region")

class Comuna(Base):
    __tablename__ = "comuna"
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    nombre = Column(String(200), nullable=False)
    region_id = Column(BigInteger, ForeignKey("region.id"), nullable=False)

    region = relationship("Region", back_populates="comunas")
    miembros = relationship("Miembro", back_populates="comuna")

class Miembro(Base):
    __tablename__ = "miembro"
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    nombre = Column(String(255),nullable=False)
    email = Column(String(80), nullable=False)
    telefono = Column(String(15), nullable=False)
    fecha_registro = Column(DateTime, nullable=False)
    comuna_id = Column(BigInteger, ForeignKey("comuna.id"), nullable=False)

    comuna = relationship("Comuna", back_populates="miembros")
    actividades = relationship("Actividad", back_populates="miembro")


class Actividad(Base):
    __tablename__ = "actividad"
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    miembro_id = Column(BigInteger, ForeignKey("miembro.id"), nullable=False)
    dia = Column(Enum("lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"), nullable=False)
    hora_inicio = Column(String(5), nullable=False)
    duracion = Column(String(5), nullable=False)
    tipo = Column(Enum("arte", "deporte", "tecnología", "social", "recreación", "otra"), nullable=False)
    nombre = Column(String(45), nullable=False)
    descripcion = Column(Text, nullable=False)

    miembro = relationship("Miembro", back_populates="actividades")
    fotos = relationship("Foto", back_populates="actividad")
    comentarios = relationship("Comentario", back_populates="actividad")

class Foto(Base):
    __tablename__ = "foto"
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    ruta_archivo = Column(String(300), nullable=False)
    nombre_archivo = Column(String(300), nullable=False)
    actividad_id = Column(BigInteger, ForeignKey("actividad.id"), nullable=False)

    actividad = relationship("Actividad", back_populates="fotos")

class Comentario(Base):
    __tablename__ = "comentario"
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    nombre = Column(String(80), nullable=False)
    texto = Column(String(300), nullable=False)
    fecha = Column(DateTime, default=datetime.now, nullable=False)
    actividad_id = Column(BigInteger, ForeignKey("actividad.id"), nullable=False)

    actividad = relationship("Actividad", back_populates="comentarios")

#Funciones con las que recibimos cosas

def get_actividad(actividad_id):
    session = SessionLocal()
    actividad = session.query(Actividad).options(joinedload(Actividad.fotos))\
                           .filter(Actividad.id == actividad_id)\
                           .first()
    session.close()
    return actividad

def get_regiones():
    session = SessionLocal()
    regiones = session.query(Region).all()
    session.close()
    return regiones

def get_miembros_paginados(pagina_actual):
    session = SessionLocal()
    por_pagina = 5
    salto = (pagina_actual-1)*por_pagina #esto es para saltarse una cantidad de personas, osea si estoy en la pagina 2 entonces me salto los de la 1
    miembros = session.query(Miembro).limit(por_pagina).offset(salto).all()
    total_registros = session.query(Miembro).count()
    total_paginas = (total_registros + por_pagina - 1) // por_pagina
    session.close()
    return miembros, total_paginas

def get_stats_actividades(): #grafico de torta, con actividad segun tipo
    session = SessionLocal()
    todas = session.query(Actividad).all()
    session.close()
 
    conteo = {"arte": 0, "deporte": 0, "tecnología": 0, "social": 0, "recreación": 0, "otra": 0} 
    for act in todas:
        if act.tipo in conteo:
            conteo[act.tipo] += 1 
    labels = list(conteo.keys())
    valores = list(conteo.values())
    return {"labels": labels, "valores": valores}

def get_registros_semanales(): #esto es lo del grafico de lineas
    session = SessionLocal()
    hace_una_semana = datetime.now() - timedelta(days=7)
    resultados = session.query(
        func.date(Miembro.fecha_registro).label("fecha"),
        func.count(Miembro.id).label("total"))\
     .filter(Miembro.fecha_registro >= hace_una_semana)\
     .group_by(func.date(Miembro.fecha_registro))\
     .order_by(func.date(Miembro.fecha_registro))\
     .all()
    session.close() #Hasta aqui resultado es una lista de tuplas, de (fecha, cantidad)
    labels = []
    valores = []
    for s in resultados:
        if hasattr(s[0], "strftime"):
            fecha = s[0].strftime("%d/%m")
        else:
            fecha = str(s[0])
        labels.append(fecha)
        valores.append(s[1])
    return {"labels": labels, "valores": valores}  #Diccionario de dias y cantidad

def get_stats_actividades_por_comuna(): #esto es lo del grafico de barras
    session = SessionLocal()
    resultados = session.query(
        Comuna.nombre.label("comuna"),
        func.count(Actividad.id).label("total_actividades")
    ).join(Miembro, Actividad.miembro_id == Miembro.id).join(Comuna, Miembro.comuna_id == Comuna.id)\
    .group_by(Comuna.id, Comuna.nombre).order_by(func.count(Actividad.id).desc()).all()
    session.close()
    labels = [row.comuna for row in resultados]
    valores = [row.total_actividades for row in resultados]
    return {"labels": labels, "valores": valores}

def get_miembro_completo(m_id):
    session = SessionLocal()
    miembro = miembro = session.query(Miembro)\
            .options(joinedload(Miembro.comuna), 
                     joinedload(Miembro.actividades).joinedload(Actividad.fotos))\
            .filter(Miembro.id == m_id)\
            .first()
    session.close()
    return miembro

def get_comunas_by_region(reg_id):
    session = SessionLocal()
    comunas = session.query(Comuna).filter(Comuna.region_id == reg_id).all()
    session.close()
    return comunas

def get_ultimos_5_miembros():
    session = SessionLocal()
    miembros = session.query(Miembro)\
        .options(joinedload(Miembro.comuna))\
        .order_by(desc(Miembro.fecha_registro))\
        .limit(5)\
        .all()
    session.close()
    return miembros

def get_comentarios_por_actividad(act_id):
    session = SessionLocal()
    comentarios = session.query(Comentario).filter(Comentario.actividad_id == act_id)\
                    .order_by(Comentario.fecha.asc()).all()
    comentarios_lista = []
    for c in comentarios:
        comentarios_lista.append({
            "id": c.id,
            "nombre": c.nombre,
            "texto": c.texto,
            "fecha": c.fecha.strftime("%d/%m/%Y %H:%M")
        })
    return comentarios_lista

#Funciones con las que creamos cosas
def create_miembro(nombre, email, telefono, comuna_id):
    session = SessionLocal()
    nuevo_miembro = Miembro(nombre=nombre, email=email, telefono=telefono, comuna_id=comuna_id, fecha_registro=datetime.now())
    session.add(nuevo_miembro)
    session.commit()
    id_generado = nuevo_miembro.id
    session.close()
    return id_generado

def create_actividad(miembro_id, dia, inicio, duracion, tipo, nombre, desc):
    session = SessionLocal()
    nueva_actividad = Actividad(miembro_id=miembro_id, dia=dia, hora_inicio=inicio, duracion=duracion, tipo=tipo, nombre=nombre, descripcion=desc)
    session.add(nueva_actividad)
    session.commit()
    id_actividad = nueva_actividad.id
    session.close()
    return id_actividad

def create_foto(ruta, nombre, actividad_id):
    session = SessionLocal()
    nueva_foto = Foto(ruta_archivo=ruta, nombre_archivo=nombre, actividad_id=actividad_id)
    session.add(nueva_foto)
    session.commit()
    session.close()

def create_comentario(nombre, texto, actividad_id):
    session = SessionLocal()
    nuevo_comentario = Comentario(nombre = nombre, texto = texto, actividad_id=actividad_id, fecha=datetime.now())
    session.add(nuevo_comentario)
    session.commit()
    id_comentario = nuevo_comentario.id
    session.close()
    return id_comentario