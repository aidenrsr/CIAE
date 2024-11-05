from flask import Flask, request, jsonify
import openai
from flask_cors import CORS
import os
import traceback

app = Flask(__name__)
CORS(app, resources={r"/chat": {"origins": "http://localhost:3000"}})

# OpenAI API 키 설정 (환경 변수 사용)
openai.api_key = os.environ.get(
    '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')

# 초기 시스템 메시지
history = [
    {"role": "system", "content": "You are a helpful assistant."}
]

# Flask 라우트: JavaScript에서 요청을 받음


@app.route('/chat', methods=['POST'])
def chat():
    global history
    try:
        data = request.json  # JSON 형식으로 받은 데이터를 처리
        user_message = data.get('message')  # 'message' 필드에서 사용자의 요청 추출

        if not user_message:
            return jsonify({"error": "메시지가 비어있습니다."}), 400

        # 요청 메시지를 히스토리에 추가
        history.append({"role": "user", "content": user_message})

        # OpenAI API에 요청을 보내고 응답을 받음
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=history
        )

        # 응답 메시지 추출
        assistant_message = response['choices'][0]['message']['content']

        # 히스토리에 응답 메시지를 추가
        history.append({"role": "assistant", "content": assistant_message})

        # 응답을 JSON 형식으로 반환
        return jsonify({"response": assistant_message})
    except Exception as e:
        # 상세한 오류 정보를 로그에 기록
        app.logger.error(f"An error occurred: {str(e)}")
        app.logger.error(traceback.format_exc())
        return jsonify({"error": f"서버 오류가 발생했습니다: {str(e)}"}), 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)
