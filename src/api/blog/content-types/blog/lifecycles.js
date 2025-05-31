const axios = require('axios');

module.exports = {
  async afterCreate(event) {
    const { result } = event;

    const title = result.title;
    const slug = result.slug;
    const publishedAt = result.publishedAt;

    // Only send to Mailchimp if blog is published and not already synced
    if (!publishedAt || result.mailchimpSynced) {
      strapi.log.info('⏩ Skipping Mailchimp sync: either not published or already synced.');
      return;
    }

    try {
      const apiKey = process.env.MAILCHIMP_API_KEY;
      const serverPrefix = process.env.MAILCHIMP_SERVER_PREFIX;
      const listId = process.env.MAILCHIMP_LIST_ID;

      // 1. Create campaign
      const campaignRes = await axios.post(
        `https://${serverPrefix}.api.mailchimp.com/3.0/campaigns`,
        {
          type: 'regular',
          recipients: {
            list_id: listId
          },
          settings: {
            subject_line: `New Blog: ${title}`,
            title: `New Blog Added: ${title}`,
            from_name: 'thefabgen',
            reply_to: 'thefabulousgen@gmail.com',
          }
        },
        {
          auth: {
            username: 'anystring',
            password: apiKey,
          }
        }
      );


      const campaignId = campaignRes.data.id;

      // 2. Set content
      const htmlContent = `
            <div style="background-color: #f5f5f5; padding: 30px; font-family: Arial, sans-serif;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
                
                <img src="${ result.image.url }" alt="Blog Image" style="width: 100%; height: auto; display: block;" />

                <div style="padding: 24px;">
                <p style="font-size: 12px; color: #999; text-align: right; margin: 0 0 10px;" >${ new Date(result.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' }).replace(',', '') }</p>

                <h1 style="font-size: 22px; margin: 0 0 16px; color: #333;">${ result.title }</h1>

                <p style="font-size: 16px; color: #555; line-height: 1.6; margin-bottom: 24px;">
                    ${ result.description }
                </p>

                <a href="https://test-fab.netlify.app/blog/${ result.documentId }" style="display: inline-block; padding: 12px 20px; background-color: #007BFF; color: #fff; text-decoration: none; border-radius: 5px; font-size: 15px; font-weight: bold;">
                    Read More →
                </a>

                <p style="font-size: 14px; color: #999; margin-top: 24px;">
                    Category: <strong style="color: #444;">${ result.category }</strong>
                </p>
                </div>
            </div>

            <p style="text-align: center; font-size: 13px; color: #888; margin-top: 24px;">
                You’re receiving this because you subscribed to our newsletter.<br/>
            </p>
            </div>
      `;

      await axios.put(
        `https://${serverPrefix}.api.mailchimp.com/3.0/campaigns/${campaignId}/content`,
        {
          html: htmlContent
        },
        {
          auth: {
            username: 'anystring',
            password: apiKey,
          }
        }
      );

      // 3. Mark blog as synced
      await strapi.entityService.update('api::blog.blog', result.id, {
        data: { mailchimpSynced: true },
      });

      strapi.log.info(` Mailchimp campaign created for blog: ${title}`);
    } catch (err) {
      strapi.log.error(' Mailchimp API error', err.response?.data || err.message);
    }
  },
};
