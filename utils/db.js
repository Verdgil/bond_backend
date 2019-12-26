const mongoose = require('mongoose'); // Библиотека для баз данных (NoSQL база Mongodb)
const db_string = 'mongodb://localhost/bond';
const db_param = {}; // Строки настроек

mongoose.connect(db_string, db_param, function (err) { // Подключаеся к базе
    if (err) {
        console.error(err); // В случае ошибки
    }
});

const user_schema = mongoose.Schema({  // Схема (аналог таблиц в SQL базах) для пользователей
    login: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    lang: String // NOTE: Не используется
});

const token_schema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    token: {
        type: String,
        required: true,
        unique: true
    },
    end_time: Date
});

const comment_schema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    publication: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'publication',
        required: true
    },
    text: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    }
});

const publication_schema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    likes: {
        type: Number,
        required: true
    },
    dis_likes: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    url: {
        type: String,
        required: true,
        unique: true
    }
});

const user = mongoose.model('user', user_schema); // Создаём модель по схеме (какие внутряки Mongoose)
const token = mongoose.model('token', token_schema);
const comment = mongoose.model('comment', comment_schema);
const publication = mongoose.model('publication', publication_schema);

const salt = "f447b370ecef01cbcabb11f4129422bd3ddd619191e779f67520d64c0b4de5e" +
    "27e3c5254b97acd1d64dbbd436d803ae756f80330dbd9819279f6dadb8d0c841a"; // Соль для хеширования паролей

module.exports.user = user; // Даём доступ из вне
module.exports.token = token;
module.exports.comment = comment;
module.exports.publication = publication;
module.exports.salt = salt;




// TODO: Говнокод для добавления тестовых записей в базу
function add_test_db_name(inplogin) {
    let t = new user({
        login: inplogin,
        password: '0000',
        lang: 'ru_RU.UTF-8'
    });
    t.save(function (err) {
        if(err) {
            console.error(err);
        }

        user.find({login: inplogin}).exec(function (err, user) {
            t = new token({
                user: user[0],
                token: '0'
            });
            t.save(function (err) {
                if(err) {
                    console.error(err);
                }
            });

            t = new publication({
                user: user[0],
                likes: 2,
                dis_likes: 1,
                date: new Date(),
                url: '0'
            });
            t.save(function (err) {
                if (err) {
                    console.error(err);
                }

                let x = new comment({
                    user: user[0],
                    text: '11',
                    publication: t,
                    date: new Date()
                });
                x.save(function (err) {
                    if (err) {
                        console.error(err);
                    }
                });
                x = new comment({
                    user: user[0],
                    text: '22',
                    publication: t,
                    date: new Date()
                });
                x.save(function (err) {
                    if (err) {
                        console.error(err);
                    }
                });
            });
        });
    });
}

let need_add_test = false;

if(need_add_test) {
    add_test_db_name('tmp');
}
