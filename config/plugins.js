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
          defaultFrom: "no-reply@strapiapp.com",
          defaultReplyTo: "gautamroshan4004@gmail.com",
        }
      }
    },
  },
});
