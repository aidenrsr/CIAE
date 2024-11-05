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
    return jsonify(books)

if __name__ == "__main__":
    app.run(debug=True)

