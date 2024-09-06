module.exports = {
  otpVerificationHtml: (otp) => {
    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title>OTP Verification</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            text-align: center; /* Center-align the text inside the container */
          }
          h1 {
            color: #333333;
          }
          p {
            color: #666666;
            line-height: 1.6;
          }
          .otp {
            display: inline-block;
            background-color: #000000;
            color: #ffffff;
            padding: 10px 20px;
            font-size: 24px;
            letter-spacing: 5px;
            border-radius: 5px;
            margin: 20px auto;
          }
          .footer {
            text-align: center;
            color: #999999;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>OTP Verification</h1>
          <p>Use the following OTP to verify your email address:</p>
          <div class="otp">${otp}</div>
          <p>This OTP is valid for only 5 minutes. Please do not share this OTP with anyone.</p>
          <div class="footer">
            <p>If you did not request this, please ignore this email.</p>
          </div>
        </div>
      </body>
      </html>
      `;
    return html;
  },
};
