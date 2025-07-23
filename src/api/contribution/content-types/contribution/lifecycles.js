module.exports = {
  async afterCreate(event) {
    const { result } = event;
    strapi.log.info('📥 Contribution afterCreate hook triggered');
    try {
      const emailService = strapi.plugin('email').service('email');

      const truncate = (text, words = 40) => {
      const parts = text.split(/\s+/);
      return parts.length > words ? parts.slice(0, words).join(' ') + '...' : text;
    };

      const fullName = result.firstNameOnly
        ? result.firstName
        : `${result.firstName} ${result.lastName || ''}`;

      const html = `
        <div style="font-family: 'Segoe UI', sans-serif; background-color: #f5f7fa; padding: 30px;">
          <div style="max-width: 600px; margin: auto; background-color: #fff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.08);">
            
            <div style="background-color: #000000ff; padding: 20px; text-align: center; color: white;">
              <h2 style="margin: 0;">📨 New Fabgen Contribution Submitted</h2>
            </div>

            <div style="padding: 24px;">
              <p><strong>Name:</strong> ${fullName}</p>
              <p><strong>Email:</strong> <a href="mailto:${result.email}">${result.email}</a></p>
              <p><strong>Country:</strong> ${result.country || 'N/A'}</p>
              <p><strong>Birth Year:</strong> ${result.birthYear || 'N/A'}</p>
              <p><strong>Title:</strong> ${result.title || 'N/A'}</p>
              <p><strong>Heard about thefabgen from:</strong> ${result.source || 'N/A'}</p>
              <p><strong>Social Handle:</strong> ${result.social || 'N/A'}</p>

              <p><strong>Video Available:</strong> ${result.video_url ? '✅ Yes' : '❌ No'}</p>
              ${result.video_url ? `<p><strong>Video Link:</strong> <a href="${result.video_url}" target="_blank">${result.video_url}</a></p>` : ''}

              <hr style="margin: 24px 0;" />

              <p style="font-size: 15px;"><strong>Written Reflection:</strong></p>
              <p style="background-color: #f0f0f0; padding: 16px; border-radius: 5px; color: #333; font-style: italic;">
                ${truncate(result.text || 'N/A')}
              </p>

              <hr style="margin: 24px 0;" />

              <p style="font-size: 14px;">
                🔗 <strong>View in Admin:</strong><br />
                <a href="https://growing-egg-699bc403ad.strapiapp.com/admin/content-manager/collection-types/api::contribution.contribution/${result.documentId}?status=published" style="color: #007BFF;">
                  Open Contribution in Dashboard →
                </a>
              </p>
            </div>
          </div>

          <p style="text-align: center; font-size: 12px; color: #999; margin-top: 16px;">
            This is an automated notification from your Strapi app.
          </p>
        </div>
      `;


      await emailService.send({
        to: 'thefabulousgen@gmail.com',
        from: 'thefabulousgen@gmail.com',
        subject: `📝 New Contribution Submitted: ${result.title || 'Untitled'}`,
        html: html,
      });

      strapi.log.info('✅ Contribution notification email sent to client.');

    } catch (err) {
      strapi.log.error('❌ Failed to send contribution email', err);
    }
  },
};
