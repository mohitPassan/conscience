# Importing flask module in the project is mandatory
# An object of Flask class is our WSGI application.
from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
import random
  
# Flask constructor takes the name of 
# current module (__name__) as argument.
app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

def predict(data):
    predictionList = ['Bad', 'Very bad', 'Fucked up', 'Delhi level', 'Worse than Delhi']
    prediction = random.choice(predictionList)
    return prediction
  
# The route() function of the Flask class is a decorator, 
# which tells the application which URL should call 
# the associated function.
@app.route('/')
@cross_origin()
# ‘/’ URL is bound with hello_world() function.
def hello_world():
    data = request.args.get('data')
    prediction = predict(data)
    return jsonify({
        "prediction": prediction
    })
  
# main driver function
if __name__ == '__main__':
  
    # run() method of Flask class runs the application 
    # on the local development server.
    app.run()