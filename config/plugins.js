module.exports = ({ env }) => ({
  email: {
    config: {
      provider: 'nodemailer',
      providerOptions: {
        host: env('SMTP_HOST', 'smtp.gmail.com'),
        port: env('SMTP_PORT', 587),
        auth: {
          user: env('SMTP_USERNAME'),
          pass: env('SMTP_PASSWORD'),
        },
        settings: {
          defaultFrom: env('SENDGRID_EMAIL_FROM'),
          defaultTo: env('SENDGRID_EMAIL_FROM'),
        }
      }
    },
  },
});
