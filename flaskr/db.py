import psycopg2
from flask import Flask, current_app, g, jsonify, g
from flask_cors import CORS
import click

#DC edited
app = Flask(__name__)
CORS(app)  # CORS 허용

def get_db():
    if "db" not in g:
        g.db = psycopg2.connect("dbname=ciae user=sungrohryu password=1234")
    return g.db


def close_db(e=None):
    db = g.pop("db", None)

    if db is not None:
        db.close()


def init_db():
    db = get_db()
    with current_app.open_resource("schema.sql") as f:
        db.cursor().execute(f.read().decode("utf8"))


@click.command("init-db")
def init_db_command():
    """Clear the existing data and create new tables."""
    init_db()
    click.echo("Initialized the database.")


def init_app(app):
    app.teardown_appcontext(close_db)
    app.cli.add_command(init_db_command)


#DC edited
@app.route("/api/books", methods=["GET"])
def get_books():
    db = get_db()
    cursor = db.cursor()
    cursor.execute("SELECT book_name, book_page_num FROM book")
    books = cursor.fetchall()
    result = [{"book_name": book[0], "book_page_num": book[1]} for book in books]
    return jsonify(result)

@app.route("/api/bookpage", methods=["GET"])
def get_bookpage():
    db = get_db()
    cursor = db.cursor()
    cursor.execute("SELECT book_id, page_num, page_text, page_pdf FROM book_page ")
    pages = cursor.fetchall()
    result = [
        {
            "book_id": page[0],
            "page_num": page[1],
            "page_text": page[2],
            "page_pdf": page[3]
            }
            for page in pages
    ]
    return jsonify(result)

@app.route("/api/chapNum", methods=["GET"])
def get_chapnum():
    db = get_db()
    cursor = db.cursor()
    cursor.execute("SELECT chapter_id, book_id, start_page, end_page FROM chapter_page")
    chapters = cursor.fetchall()
    result = [
            {
                "chapter_id": chapter[0],
                "book_id": chapter[1],
                "start_page": chapter[2],
                "end_page": chapter[3]
            }
            for chapter in chapters
        ]
    return jsonify(result)

@app.route("/api/getScores", methods=["GET"])
def get_scores():
    db = get_db()
    cursor = db.cursor()
    cursor.execute("SELECT identification_score, catharsis_score, insight_score, score_total FROM score")
    scores = cursor.fetchall()
    result = [
            {
                "identification_score": type[0],
                "catharsis_score": type[1],
                "insight_score": type[2],
                "score_total": type[3]
            }
            for type in scores
        ]
    return jsonify(result)

if __name__ == "__main__":
    app.run(debug=True)

