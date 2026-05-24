import { NextResponse } from 'next/server';
import { getClient, initDb } from '@/lib/db';
import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    const data = await request.json();

    // 0. Ensure DB is initialized
    await initDb().catch(e => console.error("DB init failed. It might already exist.", e));

    // 1. Insert into Database
    const firstAid = JSON.stringify(data.firstAidCareGiven || []);
    const equip = JSON.stringify(data.equipmentUsed || []);
    const client = await getClient();
    
    let insertedId;
    try {
      const result = await client.sql`
        INSERT INTO submissions (
          patientName, date, address, city, state, zip, teamAndPlayerNumber, sport,
          location, timeOfInjury, typeOfInjury, areaOfBodyInjured, howInjuryOccurred,
          lostConsciousness, howLongConscious, firstAidCareGiven, comment, equipmentUsed,
          returnToPlay, advisedFurtherEvaluation, called911, handedOffToEMS, emsAgency,
          transported, transportMethod, patientParentCoachSignature, patientParentOtherName,
          phoneNumber, emtSignature, emtName
        ) VALUES (
          ${data.patientName}, ${data.date}, ${data.address}, ${data.city}, ${data.state}, ${data.zip}, ${data.teamAndPlayerNumber}, ${data.sport},
          ${data.location}, ${data.timeOfInjury}, ${data.typeOfInjury}, ${data.areaOfBodyInjured}, ${data.howInjuryOccurred},
          ${data.lostConsciousness}, ${data.howLongConscious}, ${firstAid}, ${data.comment}, ${equip},
          ${data.returnToPlay}, ${data.advisedFurtherEvaluation}, ${data.called911}, ${data.handedOffToEMS}, ${data.emsAgency},
          ${data.transported}, ${data.transportMethod}, ${data.patientParentCoachSignature}, ${data.patientParentOtherName},
          ${data.phoneNumber}, ${data.emtSignature}, ${data.emtName}
        )
        RETURNING id
      `;
      insertedId = result.rows[0]?.id;
    } finally {
      await client.end();
    }

    // 2. Send Email
    // Configure transporter based on env variables.
    // Recommended: Use Gmail app password or a service like Resend/SendGrid SMTP.
    const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
    const smtpPort = process.env.SMTP_PORT || 465;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    if (smtpUser && smtpPass) {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: Number(smtpPort),
        secure: Number(smtpPort) === 465, // true for 465, false for other ports
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      // Format email body
      const emailHtml = `
        <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
          <div style="background-color: #1e3a8a; color: white; padding: 20px;">
            <h2 style="margin: 0;">New Incident Report</h2>
            <p style="margin: 5px 0 0 0; opacity: 0.8;">Patient: ${data.patientName}</p>
          </div>
          
          <div style="padding: 20px;">
            <h3 style="border-bottom: 1px solid #eee; padding-bottom: 5px;">Patient Info</h3>
            <ul style="list-style: none; padding: 0;">
              <li><strong>Name:</strong> ${data.patientName}</li>
              <li><strong>Date:</strong> ${data.date}</li>
              <li><strong>Team/Player #:</strong> ${data.teamAndPlayerNumber}</li>
              <li><strong>Sport:</strong> ${data.sport}</li>
            </ul>

            <h3 style="border-bottom: 1px solid #eee; padding-bottom: 5px; margin-top: 20px;">Injury Details</h3>
            <ul style="list-style: none; padding: 0;">
              <li><strong>Type:</strong> ${data.typeOfInjury}</li>
              <li><strong>Area:</strong> ${data.areaOfBodyInjured}</li>
              <li><strong>How it occurred:</strong> ${data.howInjuryOccurred}</li>
              <li><strong>Lost Consciousness?:</strong> ${data.lostConsciousness} (${data.howLongConscious})</li>
            </ul>

            <h3 style="border-bottom: 1px solid #eee; padding-bottom: 5px; margin-top: 20px;">Treatment</h3>
            <ul style="list-style: none; padding: 0;">
              <li><strong>First Aid:</strong> ${(data.firstAidCareGiven || []).join(', ')}</li>
              <li><strong>Comment:</strong> ${data.comment}</li>
              <li><strong>Equipment Used:</strong> ${(data.equipmentUsed || []).join(', ')}</li>
              <li><strong>Returned to Play?:</strong> ${data.returnToPlay}</li>
              <li><strong>Advised Evaluation?:</strong> ${data.advisedFurtherEvaluation}</li>
              <li><strong>Transported?:</strong> ${data.transported} (${data.transportMethod})</li>
            </ul>

            <h3 style="border-bottom: 1px solid #eee; padding-bottom: 5px; margin-top: 20px;">Signatures</h3>
            <ul style="list-style: none; padding: 0;">
              <li><strong>Parent/Patient Name:</strong> ${data.patientParentOtherName}</li>
              <li><strong>Phone Number:</strong> ${data.phoneNumber}</li>
              <li><strong>EMT Name:</strong> ${data.emtName}</li>
            </ul>
            
            <div style="margin-top: 15px;">
              <strong>EMT Signature:</strong><br/>
              ${data.emtSignature?.startsWith('data:image') 
                ? `<img src="${data.emtSignature}" style="max-height: 100px; border: 1px solid #ccc; margin-top: 10px; padding: 5px; background: white;" alt="EMT Signature" />` 
                : data.emtSignature}
            </div>
          </div>
          
          <div style="background-color: #f8fafc; padding: 15px; text-align: center; font-size: 12px; color: #64748b;">
            View full details in the digital form app submissions dashboard.
          </div>
        </div>
      `;

      await transporter.sendMail({
        from: `"Blue Line Medical Services" <${smtpUser}>`,
        to: 'Josephkoegel16@gmail.com',
        subject: `New Incident Report: ${data.patientName}`,
        html: emailHtml,
      });
      console.log("Email sent successfully to Josephkoegel16@gmail.com");
    } else {
      console.warn("Email not sent: SMTP credentials (SMTP_USER, SMTP_PASS) are missing in environment variables.");
    }

    return NextResponse.json({ success: true, id: insertedId });
  } catch (error) {
    console.error("Error processing submission:", error);
    return NextResponse.json({ error: error.message || "Failed to process submission" }, { status: 500 });
  }
}
