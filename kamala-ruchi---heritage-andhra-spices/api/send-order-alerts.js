import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  // CORS configuration
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { 
      orderNumber, 
      customerName, 
      customerPhone, 
      shippingAddress, 
      city, 
      pincode, 
      items, 
      finalTotal, 
      paymentMethod 
    } = req.body;

    const web3formsKey = process.env.WEB3FORMS_ACCESS_KEY; // Must be set in Vercel
    const whatsappApiKey1 = process.env.WHATSAPP_API_KEY_1; // For 7396311063
    const whatsappApiKey2 = process.env.WHATSAPP_API_KEY_2; // For 9704738361

    const results = { email: false, whatsapp1: false, whatsapp2: false };

    // 1. Send Email Notification via Web3Forms
    if (web3formsKey) {
      try {
        const emailData = {
          access_key: web3formsKey,
          subject: `🌶️ NEW ORDER: ${orderNumber} - ₹${finalTotal}`,
          from_name: "Kamala Ruchi Orders",
          name: customerName,
          email: "kruchimade@gmail.com",
          message: `NEW ORDER ALERT!
          
Order Number: ${orderNumber}
Customer: ${customerName} (${customerPhone})
Payment Method: ${paymentMethod.toUpperCase()}
Total Amount: ₹${finalTotal}

Shipping Address: 
${shippingAddress}, ${city}, ${pincode}

Items:
${items.map(i => `- ${i.quantity}x ${i.name} (₹${i.price})`).join('\n')}
`
        };

        const response = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(emailData)
        });

        const result = await response.json();
        if (result.success) {
          results.email = true;
        } else {
          console.error("Web3Forms error:", result);
        }
      } catch (emailError) {
        console.error("Email failed:", emailError);
      }
    }

    // 2. Send WhatsApp Notifications via CallMeBot
    // CallMeBot API format: https://api.callmebot.com/whatsapp.php?phone=YOUR_PHONE&text=This+is+a+test&apikey=YOUR_API_KEY
    const sendWhatsApp = async (phone, apiKey) => {
      if (!apiKey) return false;
      try {
        let textMessage = `🌶️ *NEW ORDER ALERT: ${orderNumber}* 🌶️\n\n`;
        textMessage += `*Customer:* ${customerName}\n`;
        textMessage += `*Phone:* ${customerPhone}\n`;
        textMessage += `*Amount:* Rs ${finalTotal} (${paymentMethod.toUpperCase()})\n\n`;
        textMessage += `*Address:* ${shippingAddress}, ${city} - ${pincode}\n\n`;
        textMessage += `*Items:*\n`;
        items.forEach(item => {
          textMessage += `- ${item.quantity}x ${item.name}\n`;
        });

        const encodedText = encodeURIComponent(textMessage);
        const url = \`https://api.callmebot.com/whatsapp.php?phone=+91\${phone}&text=\${encodedText}&apikey=\${apiKey}\`;
        
        const response = await fetch(url);
        return response.ok;
      } catch (waError) {
        console.error(\`WhatsApp failed for \${phone}:\`, waError);
        return false;
      }
    };

    results.whatsapp1 = await sendWhatsApp('7396311063', whatsappApiKey1);
    results.whatsapp2 = await sendWhatsApp('9704738361', whatsappApiKey2);

    return res.status(200).json({ success: true, results });

  } catch (error) {
    console.error("Alert error:", error);
    return res.status(500).json({ error: 'Internal server error while sending alerts' });
  }
}
