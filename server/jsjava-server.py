from bottle import route, run, debug, template

@route('/', method='GET')
def index():
    # Serve index.tpl
    return template('index')

@route('/chat', method='GET')
def chat():
    # Serve chat.tpl
    return template('chat')

from bottle import static_file
@route('/<filename:re:.*\.json>')
def send_json(filename):
    return static_file(filename, root='.', mimetype='application/json')


# Cache is disabled in debug mode
debug(True)
# Listen connection from anywhere and reload the server on code change.
run(host='0.0.0.0', port='8080', reloader=True)
