const kb = require('./keyboard-buttons')

module.exports = {
    home:[
        [kb.home.delivery, kb.home.payments],
        [kb.home.website]
    ],
    delivery:[
        [
            {
                text: 'NOVA',
                callback_data: '3'
            },
            {
                text: 'Idostavka',
                callback_data: '4'
            }
        ],
        [
            {
                text: 'Назад',
                callback_data: 'from_dostavka'
            }
        ]
    ],
    payment:[
        [
            {
            text: 'faq',
            callback_data: '1'
            },
            {
                text: 'Оператор',
                callback_data: '2'
            }
        ],
        [
            {
                text: 'Назад',
                callback_data: 'back'
            }
        ]
    ]
}