# Variables
VENV = .venv
FLASK_APP = app.py

# Default target
.PHONY: help
help:
	@echo "Available commands:"
	@echo "  make install    - Install dependencies and create virtual environment"
	@echo "  make run        - Run the Flask application"
	@echo "  make test       - Run tests"
	@echo "  make lint       - Lint the code"
	@echo "  make clean      - Clean up generated files"

# Create a virtual environment and install dependencies
install:
	python3 -m venv $(VENV)
	$(VENV)/bin/pip install -r requirements.txt

# Run the Flask application
run:
	$(VENV)/bin/flask --app main run

# Run tests
test:
	$(VENV)/bin/python -m unittest discover -s tests

# Lint the code with flake8
lint:
	$(VENV)/bin/flake8 .

# Clean up
clean:
	rm -rf $(VENV)
	find . -name '__pycache__' -exec rm -rf {} +
