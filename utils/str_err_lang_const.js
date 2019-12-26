const err_string = {
    'ru_RU.UTF-8': {
        '0': {'0': 'Пустые входные данные'},
        '1': {'1': 'Пользователь не существует'},
        '500': {'500': 'Внутренняя ошибка попробуйте повторить запрос'},
    }};

function generate_json_error(code, text) {
    // TODO: мб переделать логику?
    if(text !== undefined)
    {
        return {
            "info": {
                "code": code
            },
            "payload": {
                "text": text
            },
            "status": "error"
        };
    }
    else {
        return {
            "info": {
                "code": code
            },
            "payload": {
                "text": err_string['ru_RU.UTF-8'][code][code]
            },
            "status": "error"
        };
    }
}

module.exports.err_string = err_string;
module.exports.gen_err = generate_json_error;