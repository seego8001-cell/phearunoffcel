const TELEGRAM_BOT_TOKEN = 'ដាក់_BOT_TOKEN_របស់អ្នកនៅទីនេះ';
const TELEGRAM_CHAT_ID = 'ដាក់_CHAT_ID_របស់អ្នកនៅទីនេះ';

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // ១. បញ្ចូលទិន្នន័យទៅក្នុង Google Sheet
    sheet.appendRow([
      new Date(),
      data.name,
      data.phone,
      data.course,
      data.status || 'កំពុងរៀន'
    ]);
    
    // ២. ផ្ញើការជូនដំណឹងទៅ Telegram Bot
    const message = `🔔 *មានសិស្សចុះឈ្មោះថ្មី!*\n\n` +
                    `👤 ឈ្មោះ: ${data.name}\n` +
                    `📞 លេខទូរស័ព្ទ: ${data.phone}\n` +
                    `📚 វគ្គសិក្សា: ${data.course}`;
                    
    const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    UrlFetchApp.fetch(telegramUrl, {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'Markdown'
      })
    });
    
    return ContentService.createTextOutput(JSON.stringify({result: 'success'}))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({result: 'error', error: error.message}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
