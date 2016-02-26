var nodemailer = require('../node_modules/nodemailer');
var smtpTransport = require('../node_modules/nodemailer-smtp-transport');
var emailService = require('../utils/emailService.js');

var EmailSericeAPI = {

  enviar: function (dados) {
    var dados = JSON.parse(dados) || '';

    var transporter = nodemailer.createTransport(smtpTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: 'diegohiguchi@gmail.com',
        pass: 'gladiador*30'
      }
    }));

    transporter.sendMail({
      to: 'diegohiguchi@gmail.com',
      subject: dados.subject,
      text: dados.text
    });
  },

  resetPassword: function (req, res) {

  },
}

module.exports = EmailSericeAPI;
