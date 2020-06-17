const kb = require('./keyboard-buttons')

module.exports = {
    home:[
        [
            {
                text: 'Інформація',
                callback_data: 'info'
            },
            {
                text: 'Оператор',
                callback_data: '2'
            }
        ],
        [
            {
                text: 'ua-tao.com',
                url: 'https://ua-tao.com'
            }
        ]
    ],
    info:[
        [
            {
                text: 'Доставка',
                callback_data: 'delivery'
            },
            {
                text: 'Оплата',
                callback_data: 'payment'
            }
        ],
        [
            {
                text: 'Назад',
                callback_data: 'home'
            }
        ]
    ],
    delivery:[
        [
            {
                text: 'NOVA',
                callback_data: 'delivery_nova'
            },
            {
                text: 'Idostavka',
                callback_data: '4'
            }
        ],
        [
            {
                text: 'Назад',
                callback_data: 'home'
            }
        ]
    ],
    delivery_nova:[
        [
            {
                text: 'Назад',
                callback_data: 'delivery'
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
                callback_data: 'home'
            }
        ]
    ]
}