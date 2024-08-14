from web import create_web

app = create_web()

if __name__ == '__main__':
    app.run(debug=True)
    