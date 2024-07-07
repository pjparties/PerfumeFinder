from dotenv import load_dotenv
from pprint import pprint
import os
from flask import Flask, jsonify, request, make_response
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS  # Add this line

load_dotenv()

filepath = os.path.abspath(os.path.dirname(__file__)) + "/data/perfumes.db"
# print(filepath)

flask_app = Flask(__name__)
CORS(flask_app, resources={r"/api/*": {"origins": "*"}})

flask_app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///'+filepath

flask_app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(flask_app)

# "CREATE TABLE \"perfumes\" (\n\"key\" INTEGER,\n  \"brand\" TEXT,\n  \"perfume\" TEXT,\n
# \"image_url\" TEXT,\n  \"main_accords\" TEXT,\n  \"notes\" TEXT,\n  \"longevity\" REAL,\n
# \"sillage\" REAL,\n  \"reviews\" INTEGER,\n  \"recommended_perfumes\" TEXT\n)"

# Perfume model


class Perfumes(db.Model):
    key = db.Column(db.Integer, primary_key=True)
    brand = db.Column(db.String(100))
    perfume = db.Column(db.String(100))
    image_url = db.Column(db.String(100))
    main_accords = db.Column(db.String(100))
    notes = db.Column(db.String(200))
    longevity = db.Column(db.Float)
    sillage = db.Column(db.Float)
    reviews = db.Column(db.Integer)
    recommended_perfumes = db.Column(db.String(100))

    def __repr__(self):
        return f"<Perfume key={self.key}, brand={self.brand}, perfume={self.perfume}>"


@flask_app.route("/api", methods=["GET"])
def home():
    return make_response("Welcome to the perfume recommendation API", 200)


@flask_app.route("/api/get_all_perfumes", methods=["GET"])
def get_all_perfumes():
    perfume_object = Perfumes.query.all()
    all_perfumes = []
    for perfume in perfume_object:
        perfume_dict = {
            "key": perfume.key,
            "brand": perfume.brand,
            "perfume": perfume.perfume,
            "image_url": perfume.image_url,
            "main_accords": perfume.main_accords,
            "notes": perfume.notes,
            "longevity": perfume.longevity,
            "sillage": perfume.sillage,
            "reviews": perfume.reviews,
            "recommended_perfumes": perfume.recommended_perfumes
        }
        all_perfumes.append(perfume_dict)

    return make_response(jsonify(all_perfumes), 200)


@flask_app.route("/api/get_perfume_by_key", methods=["GET"])
def get_perfume_by_key():
    if not request.args.get("key"):
        return make_response("Please enter a key", 400)
    key = int(request.args.get("key"))
    perfume_obj = Perfumes.query.filter_by(key=key).first()
    if perfume_obj is None:
        return make_response("No results found", 400)
    perfume = {
        "key": perfume_obj.key,
        "brand": perfume_obj.brand,
        "perfume": perfume_obj.perfume,
        "image_url": perfume_obj.image_url,
        "main_accords": perfume_obj.main_accords,
        "notes": perfume_obj.notes,
        "longevity": perfume_obj.longevity,
        "sillage": perfume_obj.sillage,
        "reviews": perfume_obj.reviews,
        "recommended_perfumes": perfume_obj.recommended_perfumes
    }
    return make_response(jsonify(perfume), 200)


@flask_app.route("/api/get_recommendations_by_key", methods=["GET"])
def get_recommendations_by_key():
    if not request.args.get("key"):
        return make_response("Please enter a key", 400)
    key = int(request.args.get("key"))
    no_of_recs = int(request.args.get("no_of_recs")
                     ) if request.args.get("no_of_recs") else 6
    if no_of_recs > 40 or no_of_recs < 1:
        return make_response("Please enter a number between 1 and 40", 400)
    perfume_obj = Perfumes.query.filter_by(key=key).first()
    if perfume_obj is None:
        return make_response("No results found", 400)
    recommended_perfume_keys = eval(perfume_obj.recommended_perfumes)
    perfume_list = []

    for i in range(no_of_recs):
        recommended_perfume = Perfumes.query.filter_by(
            key=recommended_perfume_keys[i]).first()
        if recommended_perfume:
            perfume_list.append({
                "key": recommended_perfume.key,
                "brand": recommended_perfume.brand,
                "perfume": recommended_perfume.perfume,
                "image_url": recommended_perfume.image_url,
                "main_accords": recommended_perfume.main_accords,
                "notes": recommended_perfume.notes,
                "longevity": recommended_perfume.longevity,
                "sillage": recommended_perfume.sillage,
                "reviews": recommended_perfume.reviews,
                "recommended_perfumes": recommended_perfume.recommended_perfumes
            })

    return make_response(jsonify(perfume_list), 200)


if __name__ == "__main__":
    flask_app.run(host="0.0.0.0", port=5000)
