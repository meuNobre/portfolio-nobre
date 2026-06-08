from flask import Flask, jsonify
import requests
import os
from dotenv import load_dotenv
from flask_cors import CORS

load_dotenv() 

app = Flask(__name__)
CORS(app, resources={
    r"/api/*": {
        "origins": [
            "https://portfolio-nobre.discloud.app",
            "https://portfolio-nobre-five.vercel.app",
            "http://127.0.0.1:5501"
        ]
    }
})


GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")
USERNAME = "meuNobre"

@app.route("/api/repos")
def get_repos():
    url = f"https://api.github.com/users/{USERNAME}/repos"
    headers = {"Authorization": f"token {GITHUB_TOKEN}"}
    response = requests.get(url, headers=headers)
    return jsonify(response.json())

@app.route("/api/user/<username>")
def get_user(username):

    url = f"https://api.github.com/users/{username}"
    headers = {"Authorization": f"token {GITHUB_TOKEN}"}
    response = requests.get(url, headers=headers)

    if response.status_code != 200:
        return jsonify({"error": "Usuário não encontrado"}), 404

    return jsonify(response.json())
@app.route("/api/repos/<repo_name>")
def get_repo(repo_name):
    url = f"https://api.github.com/repos/{USERNAME}/{repo_name}"
    headers = {"Authorization": f"token {GITHUB_TOKEN}"} if GITHUB_TOKEN else {}
    response = requests.get(url, headers=headers)

    print("STATUS =", response.status_code)
    print("BODY =", response.text)

    return jsonify(response.json()), response.status_code

@app.route("/api/repos/<repo_name>/commits")
def get_repo_commits(repo_name):
    url = f"https://api.github.com/repos/{USERNAME}/{repo_name}/commits"
    headers = {"Authorization": f"token {GITHUB_TOKEN}"}
    response = requests.get(url, headers=headers)

    if response.status_code != 200:
        return jsonify({"error": "Commits não encontrados"}), 404

    return jsonify(response.json())

@app.route("/api/user/<username>/events")
def get_user_events(username):
    url = f"https://api.github.com/users/{username}/events"
    headers = {"Authorization": f"token {GITHUB_TOKEN}"}
    response = requests.get(url, headers=headers)

    if response.status_code != 200:
        return jsonify({"error": "Eventos não encontrados"}), 404

    return jsonify(response.json())

if __name__ == '__main__':

    app.run(host="0.0.0.0", port=8080, debug=True)
